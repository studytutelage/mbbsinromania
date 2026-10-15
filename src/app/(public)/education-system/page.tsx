import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    Building2,
    CheckCircle,
    Clock,
    ExternalLink,
    Globe2,
    GraduationCap,
    Languages,
    Layers3,
    LibraryBig,
    Link2 as LinkIcon,
    School,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getEducationSystemContent } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "Education System in Romania | Medical Study and Program Details",
    description:
        "Understand education in Romania and what to verify when comparing medical programs, including language, admissions, qualification, and recognition.",
    entitySeo: {
        metaKeyword:
            "Romania education system, medical education Romania, study medicine Romania, Romania university admissions",
    },
    path: "/education-system",
    pageKey: "education-system",
});

const themeStyles = {
    red: {
        softPanel: "border-blue-100 bg-blue-50/80",
        iconWrap: "bg-blue-100 text-blue-600",
        iconHover: "group-hover:bg-blue-600 group-hover:text-white",
        titleHover: "group-hover:text-blue-700",
        wash: "from-blue-500/15 via-white/0 to-amber-400/10",
        ringHover: "hover:border-blue-200 hover:shadow-blue-100/80",
        pill: "bg-blue-100 text-blue-700",
    },
    blue: {
        softPanel: "border-blue-100 bg-blue-50/80",
        iconWrap: "bg-blue-100 text-blue-600",
        iconHover: "group-hover:bg-blue-600 group-hover:text-white",
        titleHover: "group-hover:text-blue-700",
        wash: "from-blue-500/15 via-white/0 to-cyan-400/10",
        ringHover: "hover:border-blue-200 hover:shadow-blue-100/80",
        pill: "bg-blue-100 text-blue-700",
    },
    green: {
        softPanel: "border-green-100 bg-green-50/80",
        iconWrap: "bg-green-100 text-green-600",
        iconHover: "group-hover:bg-green-600 group-hover:text-white",
        titleHover: "group-hover:text-green-700",
        wash: "from-green-500/15 via-white/0 to-emerald-400/10",
        ringHover: "hover:border-green-200 hover:shadow-green-100/80",
        pill: "bg-green-100 text-green-700",
    },
    amber: {
        softPanel: "border-amber-100 bg-amber-50/80",
        iconWrap: "bg-amber-100 text-amber-600",
        iconHover: "group-hover:bg-amber-500 group-hover:text-white",
        titleHover: "group-hover:text-amber-700",
        wash: "from-amber-400/15 via-white/0 to-orange-400/10",
        ringHover: "hover:border-amber-200 hover:shadow-amber-100/80",
        pill: "bg-amber-100 text-amber-700",
    },
    purple: {
        softPanel: "border-purple-100 bg-purple-50/80",
        iconWrap: "bg-purple-100 text-purple-600",
        iconHover: "group-hover:bg-purple-600 group-hover:text-white",
        titleHover: "group-hover:text-purple-700",
        wash: "from-purple-500/15 via-white/0 to-fuchsia-400/10",
        ringHover: "hover:border-purple-200 hover:shadow-purple-100/80",
        pill: "bg-purple-100 text-purple-700",
    },
} as const;

const summaryIcons = [School, LibraryBig, BookOpen, GraduationCap];
const focusIcons = [BookOpen, School, Globe2, GraduationCap];
const timelineIcons = [Layers3, BookOpen, GraduationCap, LibraryBig];
const detailIcons = [Languages, LibraryBig, GraduationCap, School];

function getLanguageCardIcon(label: string, value: string, detail?: string) {
    const text = `${label} ${value} ${detail ?? ""}`.toLowerCase();

    if (/(english|instruction|school|medium)/.test(text)) return BookOpen;
    if (/(russian|international|global|media|commerce)/.test(text)) return Globe2;
    if (/(romanian|native|local|bilingual|multilingual|language)/.test(text)) return Languages;

    return School;
}

export default async function EducationSystemPage() {
    const content = await getEducationSystemContent();

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative overflow-hidden bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] py-16 text-white lg:py-20 border-b-4 border-b-[#FCD116]">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-blue-950/20 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_32%)]" />
                <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#FCD116] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-sm">
                            <Globe2 className="h-4 w-4 text-[#FCD116]" />
                            Education System
                        </span>
                    </div>
                    <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-extrabold leading-tight lg:text-6xl">Education System in Romania</h1>
                    <p className="mx-auto max-w-3xl text-base leading-8 text-blue-100 lg:text-xl">{content.description}</p>
                </div>
            </section>

            <section className="-mt-8 relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                        {content.summaryStats.map((stat, index) => {
                            const Icon = summaryIcons[index % summaryIcons.length];

                            return (
                                <article
                                    key={stat.label}
                                    className="group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/70"
                                >
                                    <div className="mb-3 flex justify-center">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">{stat.label}</div>
                                    <div className="text-xl font-bold text-slate-900 lg:text-2xl">{stat.value}</div>
                                    {stat.detail ? (
                                        <div className="mt-2 text-sm leading-relaxed text-slate-500">{stat.detail}</div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="space-y-7">
                        <div className="mx-auto max-w-4xl text-center">
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Introduction</span>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Education and Medical Study</h2>
                            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700">Program structure, language of instruction, and admission requirements vary by institution.</p>
                        </div>

                        <div className="rounded-[2rem] border border-blue-100/70 bg-gradient-to-br from-blue-50 via-white to-amber-50 p-7 shadow-sm">
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Supporting Context</span>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">What shapes the system today</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Key policy, institutional, and academic influences that define how medical education is delivered across the country.
                            </p>
                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                                {content.supportingNarrative.map((item) => (
                                    <div
                                        key={item}
                                        className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                                    >
                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                                        <p className="text-sm leading-7 text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Accreditation</span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Education and Recognition Resources</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-sm leading-7">
                        Explore the regulatory bodies, ministries, and quality assurance frameworks that govern both school and higher medical education.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            title: "Ministry of Education of Romania",
                            description: "Consult official Romanian ministry sources for education policy and study acceptance letters.",
                            role: "National education information",
                            portal: "https://edu.ro/",
                            icon: Building2,
                            theme: "red"
                        },
                        {
                            title: "Ministry of Health of Romania",
                            description: "Consult official Romanian ministry sources for health policy and medical notices.",
                            role: "Health policy information",
                            portal: "https://ms.ro/",
                            icon: GraduationCap,
                            theme: "blue"
                        },
                        {
                            title: "World Directory of Medical Schools",
                            description: "Use directory information as a starting point; a listing is not an accreditation or licensing guarantee.",
                            role: "Medical school directory",
                            portal: "https://www.wdoms.org/",
                            subLink: { label: "Directory", url: "https://www.wdoms.org/" },
                            icon: ShieldCheck,
                            theme: "green"
                        },
                        {
                            title: "National Medical Commission of India",
                            description: "Check the current Indian eligibility and licensing rules that apply after studying medicine abroad.",
                            role: "Indian medical education and licensing guidance",
                            portal: "https://www.nmc.org.in/",
                            subLink: { label: "Official website", url: "https://www.nmc.org.in/" },
                            icon: Award,
                            theme: "amber"
                        },
                        {
                            title: "Program Recognition Checks",
                            description: "Confirm the awarding institution and qualification with the relevant education authority.",
                            role: "Verify current institution and program status",
                            icon: Layers3,
                            theme: "purple"
                        },
                        {
                            title: "University Program Details",
                            description: "Ask the university about curriculum, language of instruction, clinical placements, and admission requirements.",
                            role: "Check program-specific information directly",
                            icon: Briefcase,
                            theme: "blue"
                        },
                        {
                            title: "Licensing in Your Destination Country",
                            description: "Graduates must meet the current licensing requirements of the country where they intend to practise.",
                            role: "Rules vary by destination and can change",
                            icon: Stethoscope,
                            theme: "red"
                        },
                        {
                            title: "Recognition Is Jurisdiction-Specific",
                            description: "A directory listing or university statement does not guarantee recognition or a license to practise.",
                            role: "Verify with the relevant regulator before enrolment",
                            icon: Globe2,
                            theme: "green"
                        }
                    ].map((item, index) => {
                        const Icon = item.icon;
                        const styles = themeStyles[item.theme as keyof typeof themeStyles];

                        return (
                            <article
                                key={item.title}
                                className={`group relative flex flex-col h-full overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.softPanel} ${styles.ringHover}`}
                            >
                                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`} />
                                <div className="relative flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className={`text-base font-bold text-slate-900 leading-snug transition-colors duration-300 ${styles.titleHover}`}>{item.title}</h3>
                                    </div>
                                    <p className="mt-1 text-sm leading-7 text-slate-600">{item.description}</p>
                                    
                                    <div className="mt-4 space-y-2.5">
                                        <div className="rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/50">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                <div className="h-1 w-1 rounded-full bg-slate-400" />
                                                Key Role
                                            </div>
                                            <p className="mt-1.5 text-sm font-medium text-slate-700 leading-relaxed">{item.role}</p>
                                        </div>

                                        {item.portal ? (
                                            <div className="pt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    Official Website
                                                </div>
                                                <a 
                                                    href={item.portal} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group/link flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                >
                                                    <span className="truncate group-hover/link:underline">{item.portal.replace(/^https?:\/\//, '')}</span>
                                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-40 group-hover/link:opacity-100" />
                                                </a>
                                            </div>
                                        ) : null}

                                        {(item as any).subLink ? (
                                            <div className="pt-2 border-t border-slate-100/50 mt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    {(item as any).subLink.label}
                                                </div>
                                                <a 
                                                    href={(item as any).subLink.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group/link flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <span className="truncate group-hover/link:underline">{(item as any).subLink.url.replace(/^https?:\/\//, '')}</span>
                                                    <LinkIcon className="h-2.5 w-2.5 shrink-0 opacity-40 group-hover/link:opacity-100" />
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
                </div>
            </section>

            <section className="py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-8 text-center">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Academic Progression</span>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">How the MBBS journey progresses in Romania</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                            Follow each stage from foundational learning to advanced clinical training, with key outcomes at every step.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {content.timeline.map((item, index) => {
                            const Icon = timelineIcons[index % timelineIcons.length];
                            const styles = themeStyles[item.theme];

                            return (
                                <article
                                    key={`${item.label}-${item.title}`}
                                    className={`group relative overflow-hidden rounded-[2rem] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.ringHover}`}
                                >
                                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`} />
                                    <div className="relative flex flex-col gap-4 lg:flex-row">
                                        <div
                                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                                        >
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles.pill}`}>{item.label}</span>
                                                {item.duration ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                                                        {item.duration}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <h3 className={`mt-3 text-xl font-bold text-slate-900 transition-colors duration-300 ${styles.titleHover}`}>{item.title}</h3>
                                            <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>

                                            {item.points.length > 0 ? (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {item.points.map((point) => (
                                                        <span key={point} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                                                            {point}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>

                                        {item.meta ? (
                                            <div className="min-w-40 rounded-2xl bg-slate-50 p-3.5 text-sm leading-6 text-slate-600 ring-1 ring-slate-100">
                                                {item.meta}
                                            </div>
                                        ) : null}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Degree Pathways</span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Programs aligned with Romania medical pathways</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                        Compare available degree options, course duration, and recognition highlights for each academic route.
                    </p>
                </div>

                <div className="rounded-[2rem] border border-blue-100/70 bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6 shadow-sm lg:p-7">
                    <div className="grid gap-3.5 lg:grid-cols-2">
                        {content.degreeCards.map((card, index) => {
                            const styles = themeStyles[(card.theme ?? "red") as keyof typeof themeStyles];
                            const isMbbsCard = /mbbs|mbchb|medicine/i.test(card.title);
                            const Icon = isMbbsCard ? GraduationCap : detailIcons[index % detailIcons.length];

                            return (
                                <article
                                    key={card.title}
                                    className={`group relative h-full overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm ring-1 ring-slate-100/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.ringHover}`}
                                >
                                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`} />
                                    <div className="relative flex gap-4">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-bold text-slate-900 transition-colors duration-300 ${styles.titleHover}`}>{card.title}</h4>
                                            <p className="mt-2 text-sm leading-7 text-slate-700">{card.description}</p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
                </div>
            </section>

            <section className="py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-8 text-center">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Instruction</span>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Languages of instruction</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                            Understand the primary teaching languages and communication support students can expect during training.
                        </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {content.languageCards.map((card, index) => {
                            const styles = [themeStyles.red, themeStyles.blue, themeStyles.green, themeStyles.purple][index % 4];
                            const Icon = getLanguageCardIcon(card.label, card.value, card.detail);

                            return (
                                <article
                                    key={`${card.label}-${index}`}
                                    className={`group relative overflow-hidden rounded-[2rem] border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.softPanel} ${styles.ringHover}`}
                                >
                                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.wash}`} />
                                    <div className="relative flex h-full flex-col">
                                        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${styles.iconWrap} ${styles.iconHover}`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{card.label}</div>
                                        <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-900">{card.value}</h3>
                                        {card.detail ? <p className="mt-4 text-base leading-8 text-slate-700">{card.detail}</p> : null}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Network</span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Institution mix</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                        Snapshot of the university and institution ecosystem that supports MBBS education in Romania.
                    </p>
                </div>
                <div className="space-y-3.5">
                    {content.institutionCards.map((card, index) => (
                        <article
                            key={`${card.label}-${index}`}
                            className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/70"
                        >
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/0 to-amber-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex h-full flex-col">
                                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 group-hover:text-blue-600">{card.label}</div>
                                <div className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{card.value}</div>
                                {card.detail ? <p className="mt-2 text-sm leading-7 text-slate-600">{card.detail}</p> : null}
                            </div>
                        </article>
                    ))}
                </div>
                </div>
            </section>

            <section className="py-12 lg:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-8 text-center">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Assessments</span>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Examinations and key academic checkpoints</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                            Overview of exam stages, subject focus, and milestone checkpoints used to track academic progression.
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {content.examinations.map((exam) => (
                            <article
                                key={exam.title}
                                className="group relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/0 to-orange-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">{exam.title}</h3>
                                        {exam.gradeLevel ? (
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                                                {exam.gradeLevel}
                                            </span>
                                        ) : null}
                                        {exam.type ? (
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                                                {exam.type}
                                            </span>
                                        ) : null}
                                    </div>

                                    <p className="mt-4 text-sm leading-7 text-slate-700">{exam.description}</p>

                                    {exam.subjects.length > 0 ? (
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {exam.subjects.map((subject) => (
                                                <span key={subject} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] py-12 text-white border-t-4 border-t-[#FCD116]">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                    <h2 className="text-3xl font-bold lg:text-4xl">Ready to compare universities against this education structure?</h2>
                    <p className="mt-4 text-lg leading-8 text-blue-100">
                        Move from general education-system research into live university options, fees, and counselling support.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/universities"
                            className="inline-flex items-center gap-2 rounded-full bg-[#FCD116] px-7 py-3 font-bold text-[#101B35] transition-colors hover:bg-[#ffe359] shadow"
                        >
                            Browse Universities
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/contact-us"
                            className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            Speak with a Counsellor
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
