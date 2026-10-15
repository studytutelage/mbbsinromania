import { ExternalLink, Building2, Globe, FileText, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

type OfficialGovernmentLink = {
    id: number;
    name: string;
    category: string | null;
    description: string | null;
    url: string;
};

type MinistryCard = {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    website: string;
    phone?: string;
    email?: string;
    services: string[];
};

const EMBASSY_INFO = {
    name: "Romanian diplomatic mission in India",
    address: "Check the official Ministry of Foreign Affairs (MAE) website for current mission details.",
    phone: "",
    email: "",
    website: "https://mae.ro/en",
    consular: "Confirm current Romanian student visa (D/SD) and consular requirements through official channels.",
    hours: "Check the official mission website for current consular opening hours.",
};

const DB_FALLBACK_SERVICES = [
    "Official updates",
    "Policy notices",
    "Compliance information",
    "Reference links",
];

const IMPORTANT_NOTES = [
    "Confirm university recognition from official regulators",
    "Use embassy websites for visa process updates",
    "Cross-check exam and licensing notices from NMC",
];

function normalizeCountryText(value: string): string {
    return value;
}

function normalizeWebsite(url: string): string {
    return url;
}

const FALLBACK_MINISTRIES: MinistryCard[] = [
    {
        id: 1,
        name: "Ministry of Health of Romania",
        subtitle: "Official health authority",
        description: "Official source for Romanian health policy, medical regulations, and public notices.",
        website: "https://www.ms.ro/en/",
        services: [
            "Health policy information",
            "Medical regulations",
            "Official announcements",
        ],
    },
    {
        id: 2,
        name: "National Medical Commission India",
        subtitle: "NMC India",
        description: "Indian authority for recognition, screening, and licensing pathways for foreign medical graduates.",
        website: "https://www.nmc.org.in",
        services: [
            "Current eligibility requirements",
            "Foreign medical graduate guidance",
            "Licensing information",
        ],
    },
    {
        id: 3,
        name: "World Health Organization",
        subtitle: "WHO",
        description: "Global public health authority relevant to international medical education reference standards.",
        website: "https://www.who.int",
        services: [
            "Global health standards",
            "Policy frameworks",
            "International collaboration",
            "Public health guidance",
        ],
    },
    {
        id: 4,
        name: "Ministry of Education of Romania",
        subtitle: "Official education authority",
        description: "Consult official ministry sources for university accreditation and study acceptance letters (Acceptance Letters for foreign students).",
        website: "https://www.edu.ro/en#",
        services: [
            "University accreditation",
            "Acceptance letter issuance",
            "Official education guidelines",
        ],
    },
];

function parseDbServices(value: string | null | undefined): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
        return [];
    }
}

function mapOfficialLinkToCard(link: OfficialGovernmentLink): MinistryCard {
    const rawDescription = (link.description || "").trim();
    const parsedServices = parseDbServices(rawDescription);
    const displayDescription =
        parsedServices.length > 0
            ? "Official government resource for student and institutional guidance."
            : rawDescription ||
            "Official government resource for student and institutional guidance.";

    return {
        id: link.id,
        name: normalizeCountryText(link.name),
        subtitle: normalizeCountryText(link.category || "Official Source"),
        description: normalizeCountryText(displayDescription),
        website: normalizeWebsite(link.url),
        services: (parsedServices.length > 0 ? parsedServices : DB_FALLBACK_SERVICES).map(normalizeCountryText),
    };
}

async function loadMinistryCards(): Promise<MinistryCard[]> {
    try {
        const links = await prisma.officialGovernmentLink.findMany({
            where: { status: true },
            orderBy: { position: "asc" },
        });
        const currentCountryLinks = links.filter(
            (link) => !/govmu\.org|\.mu(?:\/|$)/i.test(link.url),
        );

        if (currentCountryLinks.length === 0) {
            return FALLBACK_MINISTRIES;
        }

        return currentCountryLinks.map(mapOfficialLinkToCard);
    } catch {
        return FALLBACK_MINISTRIES;
    }
}

export default async function MinistryLinks() {
    const ministries = await loadMinistryCards();

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Official Government Links</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Direct access to official organizations that matter for MBBS admissions, compliance, and student support.
                    </p>
                </div>

                <div className="bg-gradient-to-r from-[#002B7F] via-[#093594] to-[#101B35] rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden border border-white/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#FCD116]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#FCD116] mb-3">
                                <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                                Diplomatic Mission &amp; Consular Office
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{EMBASSY_INFO.name}</h3>
                            <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                                Use official Romanian diplomatic sources for visa and consular guidance before travel.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Building2 className="w-5 h-5 mt-1 flex-shrink-0 text-[#FCD116]" />
                                    <span className="text-blue-100 text-sm">{EMBASSY_INFO.address}</span>
                                </div>
                                {EMBASSY_INFO.phone ? <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 flex-shrink-0 text-[#FCD116]" />
                                    <span className="text-blue-100 text-sm">{EMBASSY_INFO.phone}</span>
                                </div> : null}
                                {EMBASSY_INFO.email ? <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 flex-shrink-0 text-[#FCD116]" />
                                    <span className="text-blue-100 text-sm">{EMBASSY_INFO.email}</span>
                                </div> : null}
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5 flex-shrink-0 text-[#FCD116]" />
                                    <a
                                        href={EMBASSY_INFO.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FCD116] hover:underline font-semibold transition-colors text-sm"
                                    >
                                        {EMBASSY_INFO.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h4 className="text-lg font-bold mb-2 text-white">Office Hours</h4>
                            <p className="text-blue-100 mb-4 text-sm">{EMBASSY_INFO.hours}</p>
                            <h4 className="text-lg font-bold mb-1 text-white">Consular Services</h4>
                            <p className="text-blue-100 mb-5 text-sm">{EMBASSY_INFO.consular}</p>
                            <a
                                href={EMBASSY_INFO.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white text-[#002B7F] px-6 py-3 rounded-xl font-bold hover:bg-[#F0F5FF] transition-all text-center shadow-md"
                            >
                                Official Foreign Ministry
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {ministries.map((ministry) => (
                        <div
                            key={ministry.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#FCD116] bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100 p-6 transition-colors duration-300 group-hover:from-blue-50 group-hover:to-slate-100">
                                <div className="flex items-start space-x-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#002B7F] transition-all duration-300 group-hover:bg-[#002B7F] group-hover:text-white">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#002B7F]">{ministry.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{ministry.subtitle}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">{ministry.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                            <a
                                                href={ministry.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                                            >
                                                {ministry.website}
                                            </a>
                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                        </div>
                                        {ministry.phone ? (
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{ministry.phone}</span>
                                            </div>
                                        ) : null}
                                        {ministry.email ? (
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{ministry.email}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mb-6 flex-grow">
                                    <h4 className="font-semibold text-gray-800 mb-3">Key Services</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ministry.services.map((service) => (
                                            <div key={service} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <a
                                        href={ministry.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-medium text-white transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                                    >
                                        <span>Visit Official Website</span>
                                        <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                    <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-yellow-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-800 mb-3">Important Notice</h3>
                            <p className="text-yellow-700 mb-4">
                                Always verify requirements directly on official government portals before filing applications, visas, or equivalency documents.
                            </p>
                            <ul className="space-y-2 text-yellow-700">
                                {IMPORTANT_NOTES.map((item) => (
                                    <li key={item} className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
