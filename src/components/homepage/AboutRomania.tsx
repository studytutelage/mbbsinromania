import Link from "next/link";
import { Building, CheckCircle, Clock, Globe, Languages, Users, Landmark, TrendingUp, Map, Factory } from "lucide-react";
import { getAboutCountryContent } from "@/lib/public-page-content";

export default async function AboutRomania() {
    const content = await getAboutCountryContent();

    const quickFacts = [
        { icon: Building, label: "Capital", value: content.summaryStats.find((item) => item.label === "Capital")?.value || "Bucharest" },
        { icon: Users, label: "Population", value: content.summaryStats.find((item) => item.label === "Population")?.value || "About 19 million" },
        { icon: Languages, label: "Languages", value: content.summaryStats.find((item) => item.label === "Languages")?.value || "Romanian" },
        { icon: Clock, label: "Currency", value: content.summaryStats.find((item) => item.label === "Currency")?.value || "Romanian Leu (RON)" },
        { icon: Landmark, label: "Government", value: content.summaryStats.find((item) => item.label === "Government")?.value || "Semi-presidential republic (EU Member)" },
        { icon: TrendingUp, label: "GDP per head", value: content.summaryStats.find((item) => item.label === "GDP per head")?.value || "US$18,500" },
        { icon: Map, label: "Area", value: content.summaryStats.find((item) => item.label === "Area")?.value || "238,397 sq km" },
        { icon: Factory, label: "Major Industries", value: content.summaryStats.find((item) => item.label === "Major Industries")?.value || "IT, automotive, pharmaceuticals, tourism" },
    ];

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#F0F5FF] border border-[#002B7F]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#002B7F]">
                            <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                            Why Romania for MBBS?
                        </span>

                        <h2 className="mt-4 text-3xl lg:text-4xl font-extrabold text-[#101B35] leading-tight">
                            {content.heroTitle || "European Standard Medical Education in Romania"}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                            {content.heroDescription || "Romania offers world-class medical universities recognized by WHO, NMC, and EU directives. Benefit from rich clinical exposure and globally recognized degrees."}
                        </p>

                        <div className="mt-8 grid sm:grid-cols-2 gap-3.5">
                            {[
                                { title: "Compare Medical Programs", description: "Review European curriculum, 360 ECTS credits, and direct English-medium pathways." },
                                { title: "Verify Recognition", description: "Degrees recognized across EU, GMC (UK), USMLE (USA), and NMC (India)." },
                                { title: "Review Clinical Training", description: "Extensive bed-side clinical rotations starting from 3rd year in university hospitals." },
                                { title: "Request Current Fees", description: "Transparent European tuition starting from €6,000 to €8,500 per academic year." },
                                { title: "Confirm Teaching Language", description: "100% English medium programs with basic Romanian taught for patient interaction." },
                                { title: "Check Visa Requirements", description: "Long-stay student visa (Type D/SD) assistance and residency guidance." },
                                { title: "Plan Student Support", description: "On-campus hostels, Indian student mess facilities, and local support teams." },
                                { title: "Understand Licensing Steps", description: "Direct eligibility to practice in Romania, the EU, or appear for FMGE/NEXT and USMLE." },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="group flex gap-3 rounded-xl border border-slate-100 bg-[#F5F7FA]/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#002B7F]/30 hover:bg-[#F0F5FF]"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#002B7F]/10 transition-all duration-300 group-hover:bg-[#002B7F]">
                                        <CheckCircle className="h-4 w-4 text-[#002B7F] transition-colors duration-300 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#101B35] text-xs sm:text-sm transition-colors duration-300 group-hover:text-[#002B7F]">{item.title}</h3>
                                        <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/about-romania"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#002B7F] px-8 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#001F5C] hover:shadow-lg"
                            >
                                <span>Learn More About Romania</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FCD116]" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 border-t-4 border-t-[#FCD116] bg-[#F5F7FA] p-8 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#002B7F] flex items-center justify-center text-white shadow-sm">
                                    <Globe className="h-5 w-5 text-[#FCD116]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-[#101B35]">Romania at a Glance</h3>
                                    <p className="text-xs text-slate-500">Key facts for international medical aspirants</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {quickFacts.map((fact) => {
                                    const Icon = fact.icon;
                                    return (
                                        <div key={fact.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                            <div className="flex items-center gap-2 text-[#002B7F]">
                                                <Icon className="h-4 w-4 text-[#002B7F]" />
                                                <span className="text-xs font-semibold text-slate-500">{fact.label}</span>
                                            </div>
                                            <p className="mt-2 text-sm font-bold text-[#101B35]">{fact.value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#002B7F]">Top Medical Hubs</p>
                                <p className="mt-1 text-sm font-bold text-[#101B35]">Cluj-Napoca, Bucharest, Iași, Timișoara, Târgu Mureș</p>
                                <p className="mt-1 text-xs text-slate-600">English-medium medical faculties with state-of-the-art simulation labs & EU hospital training</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
