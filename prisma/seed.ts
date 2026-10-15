import "dotenv/config";
import {
  ApplicationStatus,
  CountryDocType,
  LeadStatus,
  NeetStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";

const SHOULD_SEED_SAMPLE_LEADS =
  (process.env.SEED_SAMPLE_LEADS || "false").toLowerCase() === "true";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertByWhere(
  delegate: any,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  const existing = await delegate.findFirst({ where });
  if (existing) {
    return delegate.update({ where: { id: existing.id }, data });
  }
  return delegate.create({ data });
}

async function seedAdminUser() {
  const primaryEmail = process.env.ADMIN_EMAIL || "admin@mbbsinromania.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is missing. Please set ADMIN_PASSWORD in your .env file."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminEmails = Array.from(new Set([
    primaryEmail,
    "admin@mbbsinromania.com",
  ]));

  let primaryAdmin: any = null;

  for (const email of adminEmails) {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        name: "Super Admin",
        role: UserRole.admin,
        password: hashedPassword,
        designation: "Administrator",
        description: "Platform administrator for MBBS in Romania.",
        status: true,
      },
      create: {
        name: "Super Admin",
        email,
        role: UserRole.admin,
        password: hashedPassword,
        designation: "Administrator",
        description: "Platform administrator for MBBS in Romania.",
        status: true,
      },
    });

    if (!primaryAdmin || email === primaryEmail) {
      primaryAdmin = admin;
    }
  }

  return primaryAdmin;
}

async function seedWebsiteSettings() {
  const settings = [
    { key: "site_name", value: "MBBS in Romania", type: "text", group: "general" },
    { key: "support_email", value: "admissions@mbbsinromania.com", type: "text", group: "contact" },
    { key: "support_phone", value: "+91-9667-667-331", type: "text", group: "contact" },
    { key: "stats_total_students", value: "2,500+", type: "text", group: "stats" },
    { key: "stats_total_universities", value: "12+", type: "text", group: "stats" },
    { key: "stats_total_scholarships", value: "50+", type: "text", group: "stats" },
    { key: "stats_annual_aid", value: "€1.5M+", type: "text", group: "stats" },
    { key: "stats_admission_support", value: "100%", type: "text", group: "stats" },
    { key: "stats_merit_label", value: "Active", type: "text", group: "stats" },
    { key: "stats_verified_label", value: "NMC & EU Recognized", type: "text", group: "stats" },
    { key: "stats_experience_years", value: "12+", type: "text", group: "stats" },
    { key: "stats_visa_success", value: "100%", type: "text", group: "stats" },
    { key: "scholarship_visibility", value: "true", type: "boolean", group: "general" },
  ];

  for (const item of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }
}

async function seedReferenceData() {
  for (const name of ["Public", "Private", "State Medical University"]) {
    await upsertByWhere(prisma.instituteType, { name }, { name, status: true });
  }

  const provinceNames = [
    "Bucharest-Ilfov",
    "Cluj County",
    "Iași County",
    "Timiș County",
    "Bihor County",
    "Mureș County",
    "Constanța County",
    "Dolj County",
  ];
  const provinceIds = new Map<string, number>();
  for (const name of provinceNames) {
    const p = await upsertByWhere(prisma.province, { name }, { name, status: true });
    provinceIds.set(name, p.id);
  }

  const cities = [
    { name: "Bucharest", province: "Bucharest-Ilfov" },
    { name: "Cluj-Napoca", province: "Cluj County" },
    { name: "Iași", province: "Iași County" },
    { name: "Timișoara", province: "Timiș County" },
    { name: "Oradea", province: "Bihor County" },
    { name: "Târgu Mureș", province: "Mureș County" },
    { name: "Constanța", province: "Constanța County" },
    { name: "Craiova", province: "Dolj County" },
  ];

  for (const item of cities) {
    const provinceId = provinceIds.get(item.province);
    if (!provinceId) continue;
    await upsertByWhere(
      prisma.city,
      { name: item.name, provinceId },
      { name: item.name, provinceId, status: true },
    );
  }

  const levels = [
    {
      name: "Undergraduate (MD / MBBS)",
      slug: "undergraduate",
      description: "6-Year integrated medical program equivalent to MBBS, conferring 360 ECTS credits.",
      status: true,
    },
    {
      name: "Postgraduate & Residency",
      slug: "postgraduate",
      description: "Medical residency (Rezidențiat) and doctoral pathways across European teaching hospitals.",
      status: true,
    },
  ];
  for (const item of levels) {
    await prisma.level.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  for (const name of [
    "Campus dining",
    "Student residence",
    "24x7 Campus Security",
    "Advanced Simulation Labs",
    "On-campus Medical Library",
    "Affiliated Clinical Hospitals",
    "Anatomy Dissection Halls",
    "Sports and Recreation Complex",
  ]) {
    await upsertByWhere(prisma.facility, { name }, { name, status: true });
  }

  const hospitals = [
    { name: "Emergency University Hospital Bucharest", city: "Bucharest", beds: 1100 },
    { name: "Cluj County Emergency Clinical Hospital", city: "Cluj-Napoca", beds: 1500 },
    { name: "Saint Spiridon Emergency Hospital", city: "Iași", beds: 1200 },
    { name: "Pius Brînzeu County Emergency Hospital", city: "Timișoara", beds: 1150 },
  ];
  for (const item of hospitals) {
    const slug = slugify(item.name);
    await prisma.hospital.upsert({
      where: { slug },
      update: { ...item, slug, state: "Romania", status: true },
      create: { ...item, slug, state: "Romania", status: true },
    });
  }

  for (const studyMode of ["Full-time", "On-campus", "English-taught"]) {
    await upsertByWhere(prisma.studyMode, { studyMode }, { studyMode });
  }
}

async function seedCountryAndEducationPages() {
  const aboutCountry = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: {
      name: "Romania",
      tagline: "Study and student life in Romania",
      capital: "Bucharest",
      population: "About 19 million",
      languages: "Romanian (English medium medical courses)",
      currency: "Romanian Leu (RON)",
      location: "Southeastern Europe (EU & Schengen Member)",
      timezone: "UTC+2 (EET) / UTC+3 (EEST)",
      independenceDay: new Date("1918-12-01"),
      highestPeak: "Moldoveanu Peak",
      highestPeakHeight: "2,544 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "Tuition fees for English-medium General Medicine in Romania typically range between €6,000 to €8,500/year, offering exceptional European Union medical training value.",
      academicExcellence:
        "Medical programs comply with European Union Directive 2005/36/EC and the Bologna Process (360 ECTS), ensuring direct degree recognition across the EU and globally.",
      studentLife:
        "Romania offers safe, historic university towns (Cluj-Napoca, Bucharest, Iași, Timișoara) with vibrant cultural scenes and highly affordable living costs.",
      visaConnectivity:
        "International students receive systematic guidance for Romanian D/SD long-stay study visas and temporary residence permits (Permis de Ședere).",
      publicHealthcare:
        "Comprehensive health services accessible through regional clinical university hospitals across Romania.",
      privateHealthcare:
        "Modern private medical clinics and international healthcare coverage widely available in all major cities.",
      studentHealthcare:
        "International student medical insurance and dedicated university health centers ensure complete medical support.",
      tourismGrowth:
        "Historic landmarks include Bran Castle (Transylvania), Peleș Castle, the Danube Delta, and the Black Sea coastline.",
      bannerImage: null,
    },
    create: {
      id: 1,
      name: "Romania",
      tagline: "Study and student life in Romania",
      capital: "Bucharest",
      population: "About 19 million",
      languages: "Romanian (English medium medical courses)",
      currency: "Romanian Leu (RON)",
      location: "Southeastern Europe (EU & Schengen Member)",
      timezone: "UTC+2 (EET) / UTC+3 (EEST)",
      independenceDay: new Date("1918-12-01"),
      highestPeak: "Moldoveanu Peak",
      highestPeakHeight: "2,544 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "Tuition fees for English-medium General Medicine in Romania typically range between €6,000 to €8,500/year, offering exceptional European Union medical training value.",
      academicExcellence:
        "Medical programs comply with European Union Directive 2005/36/EC and the Bologna Process (360 ECTS), ensuring direct degree recognition across the EU and globally.",
      studentLife:
        "Romania offers safe, historic university towns (Cluj-Napoca, Bucharest, Iași, Timișoara) with vibrant cultural scenes and highly affordable living costs.",
      visaConnectivity:
        "International students receive systematic guidance for Romanian D/SD long-stay study visas and temporary residence permits (Permis de Ședere).",
      publicHealthcare:
        "Comprehensive health services accessible through regional clinical university hospitals across Romania.",
      privateHealthcare:
        "Modern private medical clinics and international healthcare coverage widely available in all major cities.",
      studentHealthcare:
        "International student medical insurance and dedicated university health centers ensure complete medical support.",
      tourismGrowth:
        "Historic landmarks include Bran Castle (Transylvania), Peleș Castle, the Danube Delta, and the Black Sea coastline.",
      bannerImage: null,
    },
  });

  const cityCards = [
    { cityName: "Bucharest", description: "The vibrant capital and major administrative, medical, and educational center.", population: "Capital city (~2.2M)" },
    { cityName: "Cluj-Napoca", description: "Renowned academic capital of Transylvania with top-ranked medical faculties.", population: "University city (~330k)" },
    { cityName: "Iași", description: "Historic cultural and medical education cradle in eastern Romania.", population: "University city (~300k)" },
    { cityName: "Timișoara", description: "Vibrant western university hub with cosmopolitan student culture and modern clinics.", population: "Regional center (~320k)" },
  ];
  for (const item of cityCards) {
    await upsertByWhere(
      prisma.countryMajorCity,
      { pageId: aboutCountry.id, cityName: item.cityName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const cuisines = [
    { dishName: "Sarmale", dishDescription: "Minced meat and rice rolled in pickled cabbage leaves, served with sour cream and polenta." },
    { dishName: "Mămăligă", dishDescription: "Traditional golden cornmeal polenta served with fresh cottage cheese and butter." },
    { dishName: "Ciorbă Rădăuțeană", dishDescription: "Velvety traditional chicken and garlic soup with sour cream and vinegar." },
    { dishName: "Papanași", dishDescription: "Crispy fried cottage cheese doughnut pastry topped with sour cream and blueberry jam." },
  ];
  for (const item of cuisines) {
    await upsertByWhere(
      prisma.countryCuisineLifestyle,
      { pageId: aboutCountry.id, dishName: item.dishName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const lifestyles = [
    { title: "European Student Experience", description: "Enjoy campus life within the European Union with access to Erasmus+ exchanges and Schengen mobility." },
    { title: "Affordable Living Standards", description: "Monthly student living expenses (housing, food, transit) range from €400 to €700 per month." },
  ];
  for (const item of lifestyles) {
    await upsertByWhere(
      prisma.countryLifestyleCulture,
      { pageId: aboutCountry.id, title: item.title },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const attractions = [
    { attractionName: "Bran Castle", description: "Iconic medieval castle in Transylvania famous worldwide for Dracula folklore.", ordering: 1, isActive: true },
    { attractionName: "Peleș Castle", description: "Stunning Neo-Renaissance royal palace nestled in the Carpathian Mountains at Sinaia.", ordering: 2, isActive: true },
    { attractionName: "Danube Delta", description: "UNESCO World Heritage wetland biosphere reserve and sanctuary.", ordering: 3, isActive: true },
    { attractionName: "Palace of the Parliament", description: "Monumental administrative palace in Bucharest, among the largest buildings in the world.", ordering: 4, isActive: true },
  ];
  for (const item of attractions) {
    await upsertByWhere(
      prisma.countryTouristAttraction,
      { pageId: aboutCountry.id, attractionName: item.attractionName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const educationSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: {
      title: "Education System in Romania",
      description:
        "Romania provides a structured higher education framework aligned with the European Higher Education Area (Bologna Process). Medical programs span 6 years (360 ECTS).",
      introductionTitle: "Education and Medical Study in Romania",
      introductionDescription:
        "Degrees are recognized across all European Union member states and aligned with NMC regulations for Indian students.",
      literacyRate: 98.8,
      officialStateLanguage: "Romanian",
      officialStateLanguagePercentage: 91.0,
      officialStateLanguageNote: "National language; basic Romanian taught for clinical hospital patient interactions.",
      officialLanguage: "English (Program Instruction)",
      officialLanguagePercentage: 100.0,
      officialLanguageNote: "Complete 6-year MBBS / MD coursework taught in English.",
      foreignLanguage: "French / German",
      foreignLanguagePercentage: 15.0,
      foreignLanguageNote: "Programs also available in French and German at select faculties.",
      universitiesCount: 12,
      universitiesNote: "Accredited state and private medical universities offering international medical degrees.",
      higherEducationDescription: "Governed by the Romanian Ministry of National Education and accredited by ARACIS (European Quality Assurance Register).",
    },
    create: {
      id: 1,
      title: "Education System in Romania",
      description:
        "Romania provides a structured higher education framework aligned with the European Higher Education Area (Bologna Process). Medical programs span 6 years (360 ECTS).",
      introductionTitle: "Education and Medical Study in Romania",
      introductionDescription:
        "Degrees are recognized across all European Union member states and aligned with NMC regulations for Indian students.",
      literacyRate: 98.8,
      officialStateLanguage: "Romanian",
      officialStateLanguagePercentage: 91.0,
      officialStateLanguageNote: "National language; basic Romanian taught for clinical hospital patient interactions.",
      officialLanguage: "English (Program Instruction)",
      officialLanguagePercentage: 100.0,
      officialLanguageNote: "Complete 6-year MBBS / MD coursework taught in English.",
      foreignLanguage: "French / German",
      foreignLanguagePercentage: 15.0,
      foreignLanguageNote: "Programs also available in French and German at select faculties.",
      universitiesCount: 12,
      universitiesNote: "Accredited state and private medical universities offering international medical degrees.",
      higherEducationDescription: "Governed by the Romanian Ministry of National Education and accredited by ARACIS (European Quality Assurance Register).",
    },
  });

  const exams = [
    { examName: "Romanian Baccalaureate / High School Leaving Certificate", gradeLevel: "Secondary", type: "National / International Equivalent", subjects: "Biology, Chemistry, and Physics / Mathematics." },
  ];
  for (const item of exams) {
    await upsertByWhere(
      prisma.educationExamination,
      { pageId: educationSystem.id, examName: item.examName },
      { ...item, pageId: educationSystem.id },
    );
  }

  const schoolLevels = [
    { level: "Primary", ageRange: "6-10", durationYears: 4, isCompulsory: true, title: "Primary Education", description: "Foundational schooling covering basic literacy, arithmetic, and sciences." },
    { level: "Secondary", ageRange: "11-18", durationYears: 8, isCompulsory: true, title: "Gymnasium & Lyceum", description: "Secondary and high school education leading to the Baccalaureate examination." },
    { level: "Higher education", ageRange: "18+", durationYears: 6, isCompulsory: false, title: "Higher Medical Education", description: "6-Year integrated General Medicine program leading to the Doctor-Medic (MD) diploma." },
  ];
  for (const item of schoolLevels) {
    await upsertByWhere(
      prisma.educationSchoolLevel,
      { pageId: educationSystem.id, level: item.level },
      { ...item, pageId: educationSystem.id },
    );
  }

  const degrees = [
    { degree: "General Medicine (MD / equivalent to MBBS)", duration: "6 Years (360 ECTS Credits)", recognition: "Direct recognition across EU, NMC India, WHO, ECFMG (USA), and GMC (UK)" },
    { degree: "Dental Medicine (DMD)", duration: "6 Years (360 ECTS Credits)", recognition: "EU and international regulatory recognition" },
    { degree: "Pharmacy", duration: "5 Years (300 ECTS Credits)", recognition: "European standard pharmaceutical curriculum" },
  ];
  for (const item of degrees) {
    await upsertByWhere(
      prisma.educationDegree,
      { pageId: educationSystem.id, degree: item.degree },
      { ...item, pageId: educationSystem.id },
    );
  }

  const fields = [
    { field: "General Medicine (MBBS)", description: "Complete pre-clinical and clinical training in university hospitals.", numberOfInstitutions: "Top State Universities", durationYears: "6 Years" },
    { field: "Dentistry", description: "Modern phantom laboratories and clinical dental chairs.", numberOfInstitutions: "Select Faculties", durationYears: "6 Years" },
  ];
  for (const item of fields) {
    await upsertByWhere(
      prisma.educationPopularField,
      { pageId: educationSystem.id, field: item.field },
      { ...item, pageId: educationSystem.id },
    );
  }

  await prisma.aboutUs.upsert({
    where: { id: 1 },
    update: {
      heroTitle: "Your Trusted MBBS in Romania Advisory Team",
      heroDescription:
        "We guide students from profile evaluation to Romanian Ministry of Education Acceptance Letters, visa documentation, and on-ground settlement.",
      partnerUniversities: 12,
      studentsPlaced: 2500,
      channelPartners: 45,
      yearsExperience: 12,
      mission: "Transparent, student-first guidance for medical studies in European Union accredited universities.",
      vision: "To be the premier admission and counseling platform for MBBS in Romania.",
      contact1: "+91-9667-667-331",
      contact2: "+40-21-318-0700",
      email1: "admissions@mbbsinromania.com",
      email2: "support@mbbsinromania.com",
      address: "B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana 122018",
    },
    create: {
      id: 1,
      heroTitle: "Your Trusted MBBS in Romania Advisory Team",
      heroDescription:
        "We guide students from profile evaluation to Romanian Ministry of Education Acceptance Letters, visa documentation, and on-ground settlement.",
      partnerUniversities: 12,
      studentsPlaced: 2500,
      channelPartners: 45,
      yearsExperience: 12,
      mission: "Transparent, student-first guidance for medical studies in European Union accredited universities.",
      vision: "To be the premier admission and counseling platform for MBBS in Romania.",
      contact1: "+91-9667-667-331",
      contact2: "+40-21-318-0700",
      email1: "admissions@mbbsinromania.com",
      email2: "support@mbbsinromania.com",
      address: "B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana 122018",
    },
  });

  await upsertByWhere(
    prisma.educationSystemPage,
    { title: "MBBS Curriculum Overview" },
    {
      title: "MBBS Curriculum Overview",
      subtitle: "Pre-clinical to internship progression",
      description: "Structured 6-year European curriculum combining biomedical sciences with hands-on hospital rotations.",
      highlights: ["Anatomy & Physiology", "Biochemistry & Pathology", "Pharmacology", "Internal Medicine & Surgery Rotations"],
      position: 1,
      status: true,
    },
  );
}

async function seedContentAndMisc(adminId: number) {
  const staticSeoPages = [
    { page: "home", metaTitle: "Study MBBS in Romania 2026", metaDescription: "Admission guidance, tuition fee comparison, and NMC-compliant university information." },
    { page: "about-us", metaTitle: "About MBBS in Romania Team", metaDescription: "Meet our counselors and overseas education specialists supporting student admissions in Romania." },
    { page: "about-romania", metaTitle: "About Romania for Students", metaDescription: "Explore life, culture, cities, safety, and living costs in Romania for international medical students." },
    { page: "education-system", metaTitle: "Education System in Romania", metaDescription: "Understand the Romanian medical curriculum, 6-year ECTS credit framework, and hospital training." },
    { page: "universities", metaTitle: "Medical Universities in Romania", metaDescription: "Compare top medical faculties, tuition fees, rankings, and clinical hospital facilities." },
    { page: "blog", metaTitle: "MBBS Romania Blog & Insights", metaDescription: "Expert articles on admissions, NEET requirements, visa procedures, and student life in Romania." },
    { page: "news", metaTitle: "MBBS Romania News & Updates", metaDescription: "Latest policy announcements, intake deadlines, and regulatory updates from Romania." },
    { page: "articles", metaTitle: "MBBS Romania Comprehensive Guides", metaDescription: "In-depth planning resources for studying medicine in the European Union." },
    { page: "contact-us", metaTitle: "Contact MBBS Romania Advisors", metaDescription: "Get free personalized counseling with our India and European admission desks." },
    { page: "scholarships", metaTitle: "MBBS Scholarships in Romania", metaDescription: "Explore university, merit, and government financial aid opportunities for medical studies in Romania." },
  ];
  for (const item of staticSeoPages) {
    await prisma.staticPageSeo.upsert({
      where: { page: item.page },
      update: { ...item, status: true, ogImagePath: "/og-default.jpg" },
      create: { ...item, status: true, ogImagePath: "/og-default.jpg" },
    });
  }

  for (const item of [
    "universities/[slug]",
    "blog/[categorySlug]/[blogSlug]",
    "news/[categorySlug]/[slug]",
    "articles/[categorySlug]/[slug]",
    "scholarships/[slug]",
  ]) {
    await prisma.dynamicPageSeo.upsert({
      where: { page: item },
      update: {
        page: item,
        metaTitle: "MBBS in Romania",
        metaDescription: "Dynamic page SEO baseline for Romania medical education.",
        status: true,
      },
      create: {
        page: item,
        metaTitle: "MBBS in Romania",
        metaDescription: "Dynamic page SEO baseline for Romania medical education.",
        status: true,
      },
    });
  }

  await upsertByWhere(prisma.defaultOgImage, { name: "Romania Default OG" }, {
    name: "Romania Default OG",
    imageName: "og-default.jpg",
    imagePath: "/og-default.jpg",
    status: true,
  });

  const faqCategory = await prisma.faqCategory.upsert({
    where: { slug: "homepage" },
    update: { name: "Homepage", slug: "homepage", status: true },
    create: { name: "Homepage", slug: "homepage", status: true },
  });

  const homeFaqs = [
    {
      question: "Is MBBS from Romania recognized in India by the NMC?",
      answer: "Yes, medical qualifications from recognized Romanian state universities comply with the National Medical Commission (NMC) Foreign Medical Graduate Licentiate (FMGL) Regulations, including 54+ months course duration, 12 months clinical internship, and English medium instruction.",
      position: 1,
    },
    {
      question: "What is the medium of instruction for MBBS in Romania?",
      answer: "The complete 6-year General Medicine (MD) curriculum is delivered in English. Basic Romanian is introduced during the first two years to help students comfortably interact with patients during hospital clinical rotations.",
      position: 2,
    },
    {
      question: "What are the tuition fees for MBBS in Romania?",
      answer: "Tuition fees at Romanian public medical universities typically range between €6,000 to €8,500 per academic year, payable in installments.",
      position: 3,
    },
    {
      question: "Is NEET qualification mandatory for Indian students applying to Romania?",
      answer: "Yes, qualifying the NEET examination in the year of admission (or within valid validity as per NMC guidelines) is mandatory for Indian nationals wanting to practice medicine in India.",
      position: 4,
    },
  ];

  for (const f of homeFaqs) {
    await upsertByWhere(prisma.faq, { question: f.question }, {
      question: f.question,
      answer: f.answer,
      categoryId: faqCategory.id,
      position: f.position,
      status: true,
    });
  }

  await upsertByWhere(prisma.office, { name: "India Head Office" }, {
    name: "India Head Office",
    address: "B-16 Ground Floor, Mayfield Garden, Sector 50",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    phone: "+91-9667-667-331",
    email: "info@mbbsinromania.com",
    mapEmbed: "https://maps.google.com/?q=Gurugram+Sector+50",
    imageName: "office-india.jpg",
    imagePath: "/uploads/offices/india-head-office.jpg",
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.expertTeam, { name: "Dr. Elena Popescu" }, {
    name: "Dr. Elena Popescu",
    designation: "European Admissions Director",
    description: "Guides international students through Romanian Ministry of Education acceptance letters and university onboarding.",
    photoName: "dr-elena.jpg",
    photoPath: "/uploads/experts/dr-elena.jpg",
    position: 1,
    status: true,
  });

  const links = [
    {
      name: "World Health Organization (WHO)",
      url: "https://www.who.int",
      category: "global-health",
      position: 1,
    },
    {
      name: "National Medical Commission (NMC) - India",
      url: "https://www.nmc.org.in",
      category: "india-regulatory",
      position: 2,
    },
    {
      name: "Ministry of Health of Romania (Ministerul Sănătății)",
      url: "https://www.ms.ro/en/",
      category: "romania-government",
      position: 3,
    },
    {
      name: "Ministry of Education of Romania (Ministerul Educației)",
      url: "https://www.edu.ro/en#",
      category: "romania-government",
      position: 4,
    },
  ];
  for (const item of links) {
    await upsertByWhere(prisma.officialGovernmentLink, { name: item.name }, {
      ...item,
      description: "Official government reference link.",
      status: true,
    });
  }

  await upsertByWhere(prisma.countryDocument, { country: "Romania", type: CountryDocType.embassy_letter }, {
    country: "Romania",
    type: CountryDocType.embassy_letter,
    title: "Romanian Acceptance Letter (Ministerul Educației)",
    fileName: "romanian-ministry-acceptance-letter.pdf",
    filePath: "/uploads/country-documents/romanian-acceptance-letter.pdf",
    isActive: true,
  });
  await upsertByWhere(prisma.countryDocument, { country: "Romania", type: CountryDocType.nmc_guidelines }, {
    country: "Romania",
    type: CountryDocType.nmc_guidelines,
    title: "NMC FMGL Regulations Reference",
    fileName: "nmc-guidelines-reference.pdf",
    filePath: "/uploads/country-documents/nmc-guidelines-reference.pdf",
    isActive: true,
  });

  await upsertByWhere(prisma.pageContent, { pageSlug: "about-us", title: "Why Romania" }, {
    pageSlug: "about-us",
    title: "Why Romania",
    content: "European Union degree, globally recognized medical faculties, English-medium coursework, and clinical rotations compliant with NMC standards.",
    position: 1,
    status: true,
  });

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "admission-guides" },
    update: { name: "Admission Guides", slug: "admission-guides", status: true },
    create: { name: "Admission Guides", slug: "admission-guides", status: true },
  });
  const blog = await upsertByWhere(prisma.blog, { slug: "mbbs-in-romania-admission-roadmap-2026" }, {
    categoryId: blogCategory.id,
    authorId: adminId,
    title: "MBBS in Romania Admission Roadmap 2026",
    slug: "mbbs-in-romania-admission-roadmap-2026",
    shortnote: "Complete checklist from NEET qualification to Ministry Acceptance Letter and visa.",
    description: "Step-by-step roadmap covering application deadlines, apostille documents, visa processing, and pre-departure preparation for Romania.",
    status: true,
    homeView: true,
    trending: true,
  });
  await upsertByWhere(prisma.blogContent, { blogId: blog.id, slug: "profile-review" }, {
    blogId: blog.id,
    title: "Profile Review & Document Legalization",
    slug: "profile-review",
    description: "Prepare 10th and 12th mark sheets, NEET scorecard, birth certificate, and MEA Apostille.",
    position: 1,
  });

  const scholarship = await prisma.scholarship.upsert({
    where: { slug: "romania-excellence-scholarship-mbbs" },
    update: {
      title: "Romania Excellence Scholarship for MBBS",
      slug: "romania-excellence-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 1500,
      amountMax: 3500,
      discountPercentage: 25,
      availableSeats: 30,
      program: "MBBS / General Medicine",
      applicationMode: "Online",
      shortnote: "Partial tuition fee assistance for academically high-achieving international students.",
      isActive: true,
    },
    create: {
      title: "Romania Excellence Scholarship for MBBS",
      slug: "romania-excellence-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 1500,
      amountMax: 3500,
      discountPercentage: 25,
      availableSeats: 30,
      program: "MBBS / General Medicine",
      applicationMode: "Online",
      shortnote: "Partial tuition fee assistance for academically high-achieving international students.",
      isActive: true,
    },
  });

  await upsertByWhere(prisma.testimonial, { name: "Rahul Deshmukh", designation: "MBBS Student, Romania" }, {
    name: "Rahul Deshmukh",
    designation: "MBBS Student, Romania",
    description: "Studying in Romania has been an incredible experience. The European curriculum is rigorous and practical hospital rotations give real clinical confidence.",
    rating: 4.9,
    position: 1,
    status: true,
  });
}

async function seedUniversities() {
  const bucharestProvince = await prisma.province.findFirst({ where: { name: "Bucharest-Ilfov" } });
  const clujProvince = await prisma.province.findFirst({ where: { name: "Cluj County" } });
  const iasiProvince = await prisma.province.findFirst({ where: { name: "Iași County" } });
  const timisProvince = await prisma.province.findFirst({ where: { name: "Timiș County" } });

  const bucharestCity = await prisma.city.findFirst({ where: { name: "Bucharest" } });
  const clujCity = await prisma.city.findFirst({ where: { name: "Cluj-Napoca" } });
  const iasiCity = await prisma.city.findFirst({ where: { name: "Iași" } });
  const timisoaraCity = await prisma.city.findFirst({ where: { name: "Timișoara" } });

  const publicType = await prisma.instituteType.findFirst({ where: { name: "Public" } });
  const ugLevel = await prisma.level.findFirst({ where: { slug: "undergraduate" } });

  const universities = [
    {
      name: "Carol Davila University of Medicine and Pharmacy",
      uniqueId: "RO-UMF-CD-01",
      slug: "carol-davila-university-of-medicine-and-pharmacy",
      city: "Bucharest",
      state: "Romania",
      cityId: bucharestCity?.id,
      provinceId: bucharestProvince?.id,
      instituteTypeId: publicType?.id,
      establishedYear: 1857,
      rating: 4.9,
      tuitionFee: "€8,500/year",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      neetRequirement: "Qualified",
      approvedBy: ["NMC", "WHO", "ARACIS", "ECFMG", "WFME"],
      shortnote: "Romania's oldest and most prestigious state medical university located in the capital city Bucharest.",
      students: "11,000+",
      fmgePassRate: 58.5,
      whoListed: true,
      nmcApproved: true,
      ministryLicensed: true,
      faimerListed: true,
      isFeatured: true,
      homeView: true,
      status: true,
      globalRanking: "Top 500 Medical",
      nationalRanking: "#1 in Romania",
    },
    {
      name: "Iuliu Hațieganu University of Medicine and Pharmacy",
      uniqueId: "RO-UMF-CLUJ-02",
      slug: "iuliu-hatieganu-university-of-medicine-and-pharmacy",
      city: "Cluj-Napoca",
      state: "Romania",
      cityId: clujCity?.id,
      provinceId: clujProvince?.id,
      instituteTypeId: publicType?.id,
      establishedYear: 1919,
      rating: 4.9,
      tuitionFee: "€8,500/year",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      neetRequirement: "Qualified",
      approvedBy: ["NMC", "WHO", "ARACIS", "ECFMG", "WFME"],
      shortnote: "Premier medical university in Transylvania with a large international community and cutting-edge simulation facilities.",
      students: "9,000+",
      fmgePassRate: 62.0,
      whoListed: true,
      nmcApproved: true,
      ministryLicensed: true,
      faimerListed: true,
      isFeatured: true,
      homeView: true,
      status: true,
      globalRanking: "Top 600",
      nationalRanking: "#2 in Romania",
    },
    {
      name: "Grigore T. Popa University of Medicine and Pharmacy",
      uniqueId: "RO-UMF-IASI-03",
      slug: "grigore-t-popa-university-of-medicine-and-pharmacy",
      city: "Iași",
      state: "Romania",
      cityId: iasiCity?.id,
      provinceId: iasiProvince?.id,
      instituteTypeId: publicType?.id,
      establishedYear: 1879,
      rating: 4.8,
      tuitionFee: "€8,000/year",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      neetRequirement: "Qualified",
      approvedBy: ["NMC", "WHO", "ARACIS", "ECFMG", "WFME"],
      shortnote: "Historic state medical university in Iași known for world-class anatomy museum, research clinics, and teaching hospital network.",
      students: "10,000+",
      fmgePassRate: 55.0,
      whoListed: true,
      nmcApproved: true,
      ministryLicensed: true,
      faimerListed: true,
      isFeatured: true,
      homeView: true,
      status: true,
      globalRanking: "Top 700",
      nationalRanking: "#3 in Romania",
    },
    {
      name: "Victor Babeș University of Medicine and Pharmacy",
      uniqueId: "RO-UMF-TIM-04",
      slug: "victor-babes-university-of-medicine-and-pharmacy",
      city: "Timișoara",
      state: "Romania",
      cityId: timisoaraCity?.id,
      provinceId: timisProvince?.id,
      instituteTypeId: publicType?.id,
      establishedYear: 1944,
      rating: 4.8,
      tuitionFee: "€7,500/year",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      neetRequirement: "Qualified",
      approvedBy: ["NMC", "WHO", "ARACIS", "ECFMG", "WFME"],
      shortnote: "Renowned medical university in western Romania with extensive multidisciplinary hospitals and high graduation success rates.",
      students: "7,500+",
      fmgePassRate: 54.0,
      whoListed: true,
      nmcApproved: true,
      ministryLicensed: true,
      faimerListed: true,
      isFeatured: true,
      homeView: true,
      status: true,
      globalRanking: "Top 800",
      nationalRanking: "#4 in Romania",
    },
  ];

  for (const uniData of universities) {
    const uni = await prisma.university.upsert({
      where: { slug: uniData.slug },
      update: uniData,
      create: uniData,
    });

    // Program
    await prisma.universityProgram.upsert({
      where: { id: uni.id * 100 },
      update: {
        programName: "Doctor-Medic / General Medicine (MBBS)",
        programSlug: "general-medicine",
        duration: "6 Years (360 ECTS)",
        levelId: ugLevel?.id,
        studyMode: "Full-time, On-campus",
        totalFee: "€45,000 - €51,000",
        annualTuitionFee: uniData.tuitionFee,
        currency: "EUR",
        mediumOfInstruction: "English",
        universityId: uni.id,
        isActive: true,
        overview: "Complete 6-year integrated European Union medical curriculum including intensive clinical hospital clerkships.",
      },
      create: {
        id: uni.id * 100,
        programName: "Doctor-Medic / General Medicine (MBBS)",
        programSlug: "general-medicine",
        duration: "6 Years (360 ECTS)",
        levelId: ugLevel?.id,
        studyMode: "Full-time, On-campus",
        totalFee: "€45,000 - €51,000",
        annualTuitionFee: uniData.tuitionFee,
        currency: "EUR",
        mediumOfInstruction: "English",
        universityId: uni.id,
        isActive: true,
        overview: "Complete 6-year integrated European Union medical curriculum including intensive clinical hospital clerkships.",
      },
    });

    // University FAQ
    await upsertByWhere(
      prisma.universityFaq,
      { universityId: uni.id, question: `Is ${uni.name} recognized by the NMC?` },
      {
        universityId: uni.id,
        question: `Is ${uni.name} recognized by the NMC?`,
        answer: `Yes, ${uni.name} is accredited by ARACIS (Romania), listed in the World Directory of Medical Schools (WDOMS), and meets all current NMC FMGL criteria.`,
        position: 1,
        status: true,
      },
    );
  }
}

async function main() {
  console.log("Starting Romania baseline database seed...");

  const admin = await seedAdminUser();
  await seedWebsiteSettings();
  await seedReferenceData();
  await seedCountryAndEducationPages();
  await seedContentAndMisc(admin.id);
  await seedUniversities();

  console.log("Romania baseline seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
