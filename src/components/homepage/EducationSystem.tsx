import Link from "next/link";
import { BookOpen, CheckCircle, GraduationCap, Languages, LibraryBig } from "lucide-react";
import { getEducationSystemContent } from "@/lib/public-page-content";

const themeStyles = {
    red: "border-[#CE1126]/30 bg-red-50/50 hover:border-[#CE1126] hover:shadow-red-100/70",
    blue: "border-[#002B7F]/25 bg-[#F0F5FF] hover:border-[#002B7F] hover:shadow-blue-100/70",
    green: "border-[#002B7F]/25 bg-[#F0F5FF] hover:border-[#002B7F] hover:shadow-blue-100/70",
    amber: "border-[#FCD116]/50 bg-[#FCD116]/10 hover:border-[#FCD116] hover:shadow-yellow-100/70",
    purple: "border-[#002B7F]/25 bg-[#F0F5FF] hover:border-[#002B7F] hover:shadow-blue-100/70",
} as const;

export default async function EducationSystem() {
    const content = await getEducationSystemContent();

    return (
        <section id="education-system" className="bg-[#F5F7FA] py-20">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#002B7F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#002B7F]/15">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        Academic Framework &amp; ECTS System
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#101B35] mb-3">{content.title}</h2>
                    <p className="mx-auto max-w-3xl text-base lg:text-lg text-slate-600 leading-relaxed">{content.description}</p>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 border-t-4 border-t-[#FCD116]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#002B7F] flex items-center justify-center text-white shadow-sm">
                                <GraduationCap className="h-5 w-5 text-[#FCD116]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#101B35]">{content.introductionTitle}</h3>
                        </div>
                        <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600">{content.introductionDescription}</p>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {content.summaryStats.map((stat) => (
                                <article
                                    key={stat.label}
                                    className="group relative overflow-hidden rounded-2xl bg-[#F5F7FA] p-5 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#002B7F]/30 hover:shadow-md"
                                >
                                    <div className="relative">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#002B7F] transition-colors">{stat.label}</div>
                                        <div className="mt-1.5 text-2xl font-extrabold text-[#101B35]">{stat.value}</div>
                                        {stat.detail ? <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{stat.detail}</p> : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 border-t-4 border-t-[#002B7F]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#002B7F] flex items-center justify-center text-white shadow-sm">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#101B35]">Focus areas</h3>
                        </div>
                        <div className="mt-6 space-y-3.5">
                            {content.focusAreas.slice(0, 4).map((item) => (
                                <article
                                    key={item.title}
                                    className="group relative overflow-hidden rounded-2xl bg-[#F5F7FA] p-4.5 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#002B7F]/30 hover:bg-[#F0F5FF]/50"
                                >
                                    <div className="relative">
                                        <h4 className="text-base font-bold text-[#101B35] transition-colors duration-300 group-hover:text-[#002B7F]">{item.title}</h4>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {content.timeline.slice(0, 3).map((item) => (
                        <article
                            key={`${item.label}-${item.title}`}
                            className={`group rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${themeStyles[item.theme]}`}
                        >
                            <div className="text-xs font-bold uppercase tracking-wider text-[#002B7F]">{item.label}</div>
                            <h3 className="mt-2 text-xl font-extrabold text-[#101B35]">{item.title}</h3>
                            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">{item.description}</p>
                            {item.points.length > 0 ? (
                                <ul className="mt-4 space-y-2">
                                    {item.points.slice(0, 4).map((point) => (
                                        <li key={point} className="flex gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#002B7F]" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </article>
                    ))}
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FCD116]/20 border border-[#FCD116]/40 flex items-center justify-center text-[#101B35] shadow-sm">
                                <Languages className="h-5 w-5 text-[#002B7F]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#101B35]">Language support</h3>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {content.languageCards.map((card, index) => (
                                <article
                                    key={`${card.label}-${index}`}
                                    className="group relative overflow-hidden rounded-2xl bg-[#F5F7FA] p-5 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#002B7F]/30"
                                >
                                    <div className="relative">
                                        <div className="text-xs font-bold uppercase tracking-wider text-[#002B7F]">{card.label}</div>
                                        <div className="mt-1.5 text-lg font-bold text-[#101B35]">{card.value}</div>
                                        {card.detail ? <p className="mt-1 text-xs leading-relaxed text-slate-600">{card.detail}</p> : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#002B7F] flex items-center justify-center text-white shadow-sm">
                                <LibraryBig className="h-5 w-5 text-[#FCD116]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#101B35]">Institution mix</h3>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {content.institutionCards.map((card, index) => (
                                <article
                                    key={`${card.label}-${index}`}
                                    className="group relative overflow-hidden rounded-2xl bg-[#F5F7FA] p-5 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#002B7F]/30"
                                >
                                    <div className="relative">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#002B7F] transition-colors">{card.label}</div>
                                        <div className="mt-1.5 text-lg font-bold text-[#101B35]">{card.value}</div>
                                        {card.detail ? <p className="mt-1 text-xs leading-relaxed text-slate-600">{card.detail}</p> : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/education-system"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#002B7F] px-8 py-3.5 font-bold text-[#002B7F] bg-white transition-all hover:bg-[#002B7F] hover:text-white shadow-sm"
                    >
                        <span>Learn More About the Romanian Education System</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
