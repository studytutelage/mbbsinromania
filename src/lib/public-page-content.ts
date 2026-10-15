import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { homepageFaqs } from "./homepage-faqs";

// ─────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────

/**
 * Fetches dynamic FAQs for the homepage from the 'faq' table.
 * Filters by 'homepage' category if available, otherwise returns all active FAQs.
 * Fallbacks to the static 'homepage-faqs.ts' data if the DB provides no records.
 */
export async function getHomepageFaqs() {
    try {
        const faqs = await prisma.faq.findMany({
            where: {
                status: true,
                category: {
                    slug: "homepage"
                }
            },
            orderBy: {
                position: "asc"
            },
            select: {
                question: true,
                answer: true,
            }
        });

        if (faqs.length > 0) {
            return faqs;
        }
    } catch (error) {
        console.error("Error fetching dynamic homepage FAQs:", error);
    }
    
    // Final fallback to static data
    return homepageFaqs;
}

export interface HomePageStats {
    universities: string;
    students: string;
    scholarships: string;
    annualAid: string;
    admissionSupport: string;
    meritAwards: string;
    verifiedPrograms: string;
    experienceYears: string;
    visaSuccess: string;
}

/**
 * Fetches dynamic statistics for the homepage, combining DB counts
 * with optional setting-based overrides.
 */
export async function getHomepageStats(): Promise<HomePageStats> {
    try {
        const [uniCount, scholarshipCount] = await Promise.all([
            prisma.university.count({ where: { status: true } }).catch(() => 0),
            prisma.scholarship.count({ where: { isActive: true } }).catch(() => 0),
        ]);

        // Key-value settings to allow manual overrides for marketing numbers
        const settings = await prisma.websiteSetting
            .findMany({
                where: {
                    key: {
                        in: [
                            "stats_total_students",
                            "stats_total_universities",
                            "stats_total_scholarships",
                            "stats_annual_aid",
                            "stats_admission_support",
                            "stats_merit_label",
                            "stats_verified_label",
                            "stats_experience_years",
                            "stats_visa_success",
                        ],
                    },
                },
            })
            .catch(() => []);

        const getVal = (key: string, fallback: string) =>
            settings.find((s) => s.key === key)?.value ?? fallback;

        // Dynamic calculation for annual aid when setting is missing
        const calcAnnualAid = async () => {
            const scholarships = await prisma.scholarship.findMany({
                where: { isActive: true },
                select: { amountMin: true, amountMax: true, availableSeats: true }
            }).catch(() => []);
            
            const total = scholarships.reduce((sum, s) => {
                const amount = s.amountMax ? Number(s.amountMax) : (s.amountMin ? Number(s.amountMin) : 0);
                const seats = s.availableSeats || 1;
                return sum + (amount * seats);
            }, 0);

            if (total >= 1000000) return `$${(total / 1000000).toFixed(1)}M+`;
            if (total > 0) return `$${(total / 1000).toFixed(0)}k+`;
            return "$500k+";
        };

        const annualAidFallback = await calcAnnualAid();

        return {
            universities: uniCount > 0 ? `${uniCount}+` : getVal("stats_total_universities","2+"),
            scholarships: getVal("stats_total_scholarships", scholarshipCount > 0 ? `${scholarshipCount}+` : "2+"),
            students: getVal("stats_total_students", "100+"),
            annualAid: getVal("stats_annual_aid", annualAidFallback),
            admissionSupport: getVal("stats_admission_support", "100%"),
            meritAwards: getVal("stats_merit_label", "Active"),
            verifiedPrograms: getVal("stats_verified_label", "NMC"),
            experienceYears: getVal("stats_experience_years", "11+"),
            visaSuccess: getVal("stats_visa_success", "100%"),
        };
    } catch (error) {
        console.error("Error fetching homepage stats:", error);
        return {
            universities: "2+",
            scholarships: "2+",
            students: "100+",
            annualAid: "$500k+",
            admissionSupport: "100%",
            meritAwards: "Active",
            verifiedPrograms: "NMC",
            experienceYears: "11+",
            visaSuccess: "100%",
        };
    }
}


type Theme = "red" | "blue" | "green" | "amber" | "purple";

type ValueCard = {
    label: string;
    value: string;
    detail?: string;
};

type FeatureCard = {
    title: string;
    description: string;
    theme: Theme;
};

type ImageCard = {
    title: string;
    description: string;
    image?: string;
    meta?: string;
    points?: string[];
    theme: Theme;
};

type UniversityCityCard = {
    city: string;
    description: string;
    universityCount: number;
    universityNames: string[];
    avgTuition?: string;
};

type EducationTimelineCard = {
    label: string;
    title: string;
    description: string;
    points: string[];
    duration?: string;
    meta?: string;
    theme: Theme;
};

type EducationExamCard = {
    title: string;
    description: string;
    gradeLevel?: string;
    type?: string;
    subjects: string[];
};

export type AboutCountryContent = {
    countryName: string;
    heroTitle: string;
    heroDescription: string;
    bannerImage?: string;
    summaryStats: ValueCard[];
    highlights: FeatureCard[];
    overviewCards: FeatureCard[];
    supportPoints: string[];
    cities: ImageCard[];
    universityCities: UniversityCityCard[];
    attractions: ImageCard[];
    cuisines: ImageCard[];
    location: string;
    timezone: string;
    independenceDay: string;
    highestPeak: string;
    highestPeakHeight: string;
};

export type EducationSystemContent = {
    title: string;
    description: string;
    introductionTitle: string;
    introductionDescription: string;
    supportingNarrative: string[];
    summaryStats: ValueCard[];
    focusAreas: FeatureCard[];
    timeline: EducationTimelineCard[];
    degreeCards: FeatureCard[];
    languageCards: ValueCard[];
    institutionCards: ValueCard[];
    examinations: EducationExamCard[];
};

const themes: Theme[] = ["red", "blue", "green", "amber", "purple"];

function pickTheme(index: number): Theme {
    return themes[index % themes.length];
}

function splitContent(value?: string | null): string[] {
    if (!value) return [];

    return value
        .split(/\r?\n|[;,]/)
        .map((item) => item.replace(/^[\s\-\u2022]+/, "").trim())
        .filter(Boolean);
}

function compact<T>(items: Array<T | null | undefined | false | "" | 0>): T[] {
    return items.filter(Boolean) as T[];
}

function formatPercent(value?: number | null) {
    if (value === null || value === undefined) return undefined;
    return `${Number(value)}%`;
}

function withDefaultDescription(value: string | null | undefined, fallback: string) {
    return value?.trim() || fallback;
}

export const getAboutCountryContent = cache(async (): Promise<AboutCountryContent> => {
    const page = await prisma.aboutCountryPage
        .findFirst({
            include: {
                cuisines: { orderBy: { id: "asc" } },
                lifestyles: { orderBy: { id: "asc" } },
                majorCities: { orderBy: { id: "asc" } },
                touristAttractions: {
                    where: { isActive: true },
                    orderBy: [{ ordering: "asc" }, { id: "asc" }],
                },
            },
        })
        .catch((error: Error) => {
            console.error("Failed to fetch about country content, using fallback content.", error);
            return null;
        });

    const countryName = page?.name || "Romania";
    const heroTitle = page?.tagline || `Life and study in ${countryName}`;
    const heroDescription =
        page?.studentLife ||
        page?.mbbsAffordableEducation ||
        page?.academicExcellence ||
        page?.nomadicHeritage ||
        `Explore why ${countryName} continues to attract international medical students looking for affordable, structured, and globally aligned education.`;

    const summaryStats = compact<ValueCard>([
        { label: "Capital", value: page?.capital || "Bucharest" },
        { label: "Population", value: page?.population || "About 19 million" },
        { label: "Languages", value: page?.languages || "Romanian (English medium)" },
        { label: "Currency", value: page?.currency || "Romanian Leu (RON)" },
    ]);

    const highlights =
        page?.lifestyles.length
            ? page.lifestyles.slice(0, 6).map((item: any, index: number) => ({
                  title: item.title,
                  description: withDefaultDescription(item.description, `Learn more about ${item.title.toLowerCase()} in ${countryName}.`),
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "Student-friendly lifestyle",
                      description: `${countryName} offers a balanced mix of affordability, city access, and practical support for international students.`,
                      theme: "red" as const,
                  },
                  {
                      title: "Strong academic environment",
                      description: "Medical universities combine classroom learning with clinical exposure and international student services.",
                      theme: "blue" as const,
                  },
                  {
                      title: "Affordable day-to-day living",
                      description: "Accommodation, local transport, and food are generally manageable compared with many study-abroad destinations.",
                      theme: "green" as const,
                  },
              ];

    const overviewCards = compact<FeatureCard>([
        page?.mbbsAffordableEducation && {
            title: "Affordable MBBS pathway",
            description: page.mbbsAffordableEducation,
            theme: "red",
        },
        page?.academicExcellence && {
            title: "Academic standards",
            description: page.academicExcellence,
            theme: "blue",
        },
        page?.studentLife && {
            title: "Student life",
            description: page.studentLife,
            theme: "amber",
        },
        page?.visaConnectivity && {
            title: "Travel and connectivity",
            description: page.visaConnectivity,
            theme: "green",
        },
        page?.publicHealthcare && {
            title: "Healthcare access",
            description: page.publicHealthcare,
            theme: "purple",
        },
        page?.tourismGrowth && {
            title: "Growing destination",
            description: page.tourismGrowth,
            theme: "blue",
        },
    ]);

    const supportPoints = compact<string>([
        page?.studentHealthcare || undefined,
        page?.privateHealthcare || undefined,
        page?.religionDiversity || undefined,
        page?.ancientSilkRoad || undefined,
        page?.culturalHighlights || undefined,
    ]).slice(0, 5);

    const cities =
        page?.majorCities.length
            ? page.majorCities.map((city: any, index: number) => ({
                  title: city.cityName,
                  description: withDefaultDescription(city.description, `${city.cityName} is one of the important hubs for international students.`),
                  image: city.cityImage ? cdn(city.cityImage) : undefined,
                  meta: city.population || undefined,
                  points: splitContent(city.highlights).slice(0, 4),
                  theme: pickTheme(index),
              }))
            : [];

    const universityCities = await prisma.university
        .findMany({
            where: { status: true },
            select: {
                name: true,
                city: true,
                state: true,
                tuitionFee: true,
                shortnote: true,
                isFeatured: true,
                cityRelation: { select: { name: true } },
            },
            orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        })
        .then((universities: any[]) => {
            const buckets = new Map<
                string,
                {
                    city: string;
                    universityCount: number;
                    universityNames: string[];
                    notes: string[];
                    tuitions: string[];
                }
            >();

            universities.forEach((uni) => {
                const cityName = uni.city?.trim() || uni.cityRelation?.name?.trim() || uni.state?.trim();
                if (!cityName) return;

                const key = cityName.toLowerCase();
                if (!buckets.has(key)) {
                    buckets.set(key, {
                        city: cityName,
                        universityCount: 0,
                        universityNames: [],
                        notes: [],
                        tuitions: [],
                    });
                }

                const bucket = buckets.get(key)!;
                bucket.universityCount += 1;
                bucket.universityNames.push(uni.name);
                if (uni.shortnote?.trim()) bucket.notes.push(uni.shortnote.trim());
                if (uni.tuitionFee?.trim()) bucket.tuitions.push(uni.tuitionFee.trim());
            });

            const fromDb = Array.from(buckets.values())
                .sort((a, b) => b.universityCount - a.universityCount || a.city.localeCompare(b.city))
                .slice(0, 3)
                .map((bucket) => ({
                    city: bucket.city,
                    description: withDefaultDescription(
                        bucket.notes[0],
                        `${bucket.city} offers access to medical universities, practical training, and student housing options.`,
                    ),
                    universityCount: bucket.universityCount,
                    universityNames: bucket.universityNames.slice(0, 3),
                    avgTuition: bucket.tuitions[0] || undefined,
                }));

            const fallback: UniversityCityCard[] = [
                {
                    city: "Minsk",
                    description: "The capital. Confirm current medical programs and admissions directly with each institution.",
                    universityCount: 0,
                    universityNames: [],
                },
                {
                    city: "Cluj-Napoca",
                    description: "Major university city in Transylvania. Check current medical programs and admissions directly.",
                    universityCount: 0,
                    universityNames: [],
                },
                {
                    city: "Iași",
                    description: "Historic medical university center. Check current medical programs and admissions directly.",
                    universityCount: 0,
                    universityNames: [],
                },
            ];

            if (fromDb.length >= 3) {
                return fromDb;
            }

            const used = new Set(fromDb.map((item) => item.city.toLowerCase()));
            const filled = fallback.filter((item) => !used.has(item.city.toLowerCase()));
            return [...fromDb, ...filled].slice(0, 3);
        })
        .catch((error: Error) => {
            console.error("Failed to fetch university city details, using fallback city cards.", error);
            return [
                {
                    city: "Bucharest",
                    description: "The capital. Confirm current medical programs and admissions directly with each institution.",
                    universityCount: 0,
                    universityNames: [],
                },
                {
                    city: "Cluj-Napoca",
                    description: "Major university city in Transylvania. Check current medical programs and admissions directly.",
                    universityCount: 0,
                    universityNames: [],
                },
                {
                    city: "Iași",
                    description: "Historic medical university center. Check current medical programs and admissions directly.",
                    universityCount: 0,
                    universityNames: [],
                },
            ] satisfies UniversityCityCard[];
        });

    const attractions =
        page?.touristAttractions.length
            ? page.touristAttractions.map((spot: any, index: number) => ({
                  title: spot.attractionName,
                  description: withDefaultDescription(spot.description, `${spot.attractionName} is one of the standout attractions in ${countryName}.`),
                  image: spot.image ? cdn(spot.image) : undefined,
                  theme: pickTheme(index),
              }))
            : [];

    const cuisines =
        page?.cuisines.length
            ? page.cuisines.map((item: any, index: number) => ({
                  title: item.dishName || `Cuisine ${index + 1}`,
                  description: withDefaultDescription(item.dishDescription, "Part of the local food culture students commonly explore."),
                  image: item.dishImage ? cdn(item.dishImage) : undefined,
                  theme: pickTheme(index),
              }))
            : [];

    const location = page?.location || "Southeastern Europe (EU & Schengen Member)";
    const timezone = page?.timezone || "UTC+2 (EET)";
    const independenceDay = page?.independenceDay ? new Date(page.independenceDay).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "1 December 1918";
    const highestPeak = page?.highestPeak || "Moldoveanu Peak";
    const highestPeakHeight = page?.highestPeakHeight || "2,544 m";

    return {
        countryName,
        heroTitle,
        heroDescription,
        bannerImage: page?.bannerImage ? cdn(page.bannerImage) : undefined,
        summaryStats,
        highlights,
        overviewCards:
            overviewCards.length > 0
                ? overviewCards
                : [
                      {
                          title: "Practical living costs",
                          description: `Students typically choose ${countryName} for its balance of tuition value and manageable monthly expenses.`,
                          theme: "red",
                      },
                      {
                          title: "Supportive student communities",
                          description: "International student groups, hostels, and onboarding support help new arrivals settle in quickly.",
                          theme: "blue",
                      },
                      {
                          title: "Strong lifestyle fit",
                          description: "City infrastructure, public transport, and campus access make the transition smoother for first-time international students.",
                          theme: "green",
                      },
                  ],
        supportPoints:
            supportPoints.length > 0
                ? supportPoints
                : [
                      `${countryName} continues to attract students looking for structured medical education and better cost predictability.`,
                      "International students typically receive onboarding support around housing, travel, and essential local setup.",
                      "Major cities offer access to hospitals, public services, and day-to-day amenities near university clusters.",
                  ],
        cities,
        universityCities,
        attractions,
        cuisines,
        location,
        timezone,
        independenceDay,
        highestPeak,
        highestPeakHeight,
    };
});

export const getEducationSystemContent = cache(async (): Promise<EducationSystemContent> => {
    const system = await prisma.educationSystem
        .findFirst({
            include: {
                degrees: { orderBy: { id: "asc" } },
                examinations: { orderBy: { id: "asc" } },
                popularFields: { orderBy: { id: "asc" } },
                schoolLevels: { orderBy: { id: "asc" } },
            },
        })
        .catch((error: Error) => {
            console.error("Failed to fetch education system content, using fallback content.", error);
            return null;
        });

    const title = system?.title || "Education System in Romania";
    const description =
        system?.description ||
        "Understand the academic structure, European ECTS credit framework, and progression pathways that shape medical education in Romania.";

    const primaryDegree = system?.degrees[0];
    const summaryStats = [
        {
            label: "School Education",
            value: "Primary and secondary",
            detail: "For current structure and enrollment rules, consult Romania's Ministry of Education.",
        },
        {
            label: "Languages",
            value: "Romanian and English",
            detail: "Language of instruction varies by institution and program.",
        },
        {
            label: "Higher Education",
            value: "Universities and institutes",
            detail: "Check each institution's current accreditation and program information.",
        },
        {
            label: "Medical Study",
            value: "Program-specific (6 Years / 360 ECTS)",
            detail: "Duration, language, admission criteria, and clinical training vary by university.",
        },
    ];

    const supportingNarrative = compact<string>([
        system?.governmentRegulation || undefined,
        system?.culturalImportance || undefined,
        system?.continuousDevelopment || undefined,
        system?.higherEducationDescription || undefined,
        system?.bolognProcessAlignment || undefined,
    ]);

    const finalNarrative = supportingNarrative.length > 0 
        ? supportingNarrative.slice(0, 5)
        : [
            "Romania has a comprehensive higher education system aligned with the European Higher Education Area (Bologna Process).",
            "Medical programs span 6 years (360 ECTS) and provide diplomas recognized across the European Union.",
            "Indian medical applicants must ensure NMC regulations and NEET eligibility criteria are satisfied.",
            "Confirm current tuition, visa, and residency requirements with official Romanian sources before applying.",
            "Review each medical university's official program curriculum for clinical hospital rotation details.",
        ];

    const focusAreas =
        system?.popularFields.length
            ? system.popularFields.map((field: any, index: number) => ({
                  title: field.field,
                  description:
                      field.description ||
                      compact([
                          field.numberOfInstitutions ? `${field.numberOfInstitutions} institutions` : undefined,
                          field.durationYears ? `${field.durationYears} duration` : undefined,
                      ]).join(" | ") ||
                      `Explore how ${field.field.toLowerCase()} fits into the education landscape.`,
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "British-based academic framework",
                      description: "The curriculum and assessments are closely aligned with UK standards, ensuring global recognition.",
                      theme: "red" as const,
                  },
                  {
                      title: "Recognition and licensing",
                      description: "Check recognition and licensing requirements with the regulators in the country where you plan to practise.",
                      theme: "blue" as const,
                  },
                  {
                      title: "Clinical Exposure",
                      description: "Ask each university about clinical placements, teaching hospitals, and language requirements.",
                      theme: "green" as const,
                  },
              ];

    const timeline =
        system?.schoolLevels.length
            ? system.schoolLevels.map((level: any, index: number) => {
                  const points = splitContent(level.description).slice(0, 5);
                  const meta = compact([
                      level.ageRange ? `Age ${level.ageRange}` : undefined,
                      level.numberOfSchools || undefined,
                  ]).join(" | ");

                  return {
                      label: level.level,
                      title: level.title || level.level,
                      description:
                          withDefaultDescription(
                              level.description,
                              `${level.level} builds the next stage of academic preparation within the national education system.`,
                          ),
                      points: points.length ? points : compact([level.ageRange, level.numberOfSchools]),
                      duration: level.durationYears ? `${level.durationYears} years` : undefined,
                      meta: meta || (level.isCompulsory ? "Compulsory stage" : undefined),
                      theme: pickTheme(index),
                  };
              })
            : [
                  {
                    label: "Pre-Primary",
                    title: "Early Childhood Education",
                    description: "Early childhood provision precedes general school education.",
                    points: ["Provision varies by institution", "Check local admissions information"],
                    duration: undefined,
                    theme: "red" as const,
                  },
                  {
                    label: "Primary",
                    title: "General School Education",
                    description: "School structure, admissions, and progression should be checked with official education authorities.",
                    points: ["National curriculum", "Institution-specific admissions"],
                    duration: undefined,
                    theme: "blue" as const,
                  },
                  {
                    label: "Secondary",
                    title: "Secondary Education",
                    description: "Curriculum and qualifications are set within the Romanian education system and EU standards.",
                    points: ["Confirm current qualifications", "Check progression requirements"],
                    duration: undefined,
                    theme: "green" as const,
                  },
                  {
                    label: "Tertiary",
                    title: "University and Professional Training",
                    description: "Higher education includes university and specialist programs; details vary by institution.",
                    points: ["Universities", "Specialist institutes", "Program-specific requirements"],
                    duration: undefined,
                    theme: "purple" as const,
                  },
              ];

    const degreeCards =
        system?.degrees.length
            ? system.degrees.map((degree: any, index: number) => ({
                  title: degree.degree,
                  description:
                      compact([
                          degree.duration ? `Duration: ${degree.duration}` : undefined,
                          degree.ectsCredits ? `ECTS: ${degree.ectsCredits}` : undefined,
                          degree.recognition || undefined,
                      ]).join(" | ") || "Recognized higher education pathway.",
                  theme: pickTheme(index),
              }))
            : [
                  {
                      title: "Medical programs",
                      description: "Degree title, duration, instruction language, and clinical training vary by university and program.",
                      theme: "green" as const,
                  },
              ];

    const languageCards = compact<ValueCard>([
        system?.officialStateLanguage && {
            label: system.officialStateLanguage,
            value: formatPercent(system.officialStateLanguagePercentage ? Number(system.officialStateLanguagePercentage) : undefined) || "Widely used",
            detail: system.officialStateLanguageNote || "State language",
        },
        system?.officialLanguage && {
            label: system.officialLanguage,
            value: formatPercent(system.officialLanguagePercentage ? Number(system.officialLanguagePercentage) : undefined) || "Widely used",
            detail: system.officialLanguageNote || "Official language",
        },
        system?.foreignLanguage && {
            label: system.foreignLanguage,
            value: formatPercent(system.foreignLanguagePercentage ? Number(system.foreignLanguagePercentage) : undefined) || "International support",
            detail: system.foreignLanguageNote || "Foreign language support",
        },
    ]);

    const institutionCards = [
        {
            label: "Higher institutions",
            value: "Check official data",
            detail: "Consult current national education and accreditation information.",
        },
        {
            label: "Universities",
            value: "Program-specific",
            detail: "Verify each institution's current registration and program listing.",
        },
        {
            label: "Secondary Schools",
            value: "National system",
            detail: "See the Ministry of Education for current school information.",
        },
        {
            label: "Primary Schools",
            value: "National system",
            detail: "See the Ministry of Education for current school information.",
        },
    ];

    const examinations =
        system?.examinations.length
            ? system.examinations.map((exam: any) => ({
                  title: exam.examName,
                  description:
                      exam.subjects ||
                      exam.type ||
                      exam.gradeLevel ||
                      `Learn how ${exam.examName.toLowerCase()} fits into the education pathway.`,
                  gradeLevel: exam.gradeLevel || undefined,
                  type: exam.type || undefined,
                  subjects: splitContent(exam.subjects),
              }))
            : [];

    return {
        title,
        description,
        introductionTitle: system?.introductionTitle || "Academic Framework in Romania",
        introductionDescription:
            system?.introductionDescription ||
            "Romanian education and medical training requirements are aligned with European Union directives and national quality standards. Verify current qualification and recognition rules before applying.",
        supportingNarrative: finalNarrative,
        summaryStats,
        focusAreas,
        timeline,
        degreeCards,
        languageCards:
            languageCards.length > 0
                ? languageCards
                : [
                      {
                          label: "Romanian / English",
                          value: "Instruction languages",
                          detail: "The language used for teaching is English, with basic Romanian learned for clinical patient interactions.",
                      },
                  ],
        institutionCards:
            institutionCards.length > 0
                ? institutionCards
                : [
                      {
                          label: "Academic Network",
                          value: "HEC Regulated",
                          detail: "Public and private universities operate under strict quality assurance from the Higher Education Commission.",
                      },
                  ],
        examinations,
    };
});
