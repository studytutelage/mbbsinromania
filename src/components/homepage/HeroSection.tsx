"use client";

import Link from "next/link";
import { ArrowRight, Users, GraduationCap, Globe, Award, Building2, Stethoscope } from "lucide-react";
import { useDownloadModal } from "@/lib/modalContext";
import { HomePageStats } from "@/lib/public-page-content";

const FALLBACK_BROCHURE = "/brochures/Romania_university.pdf";

interface HeroSectionProps {
    stats: HomePageStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
    const { openModal } = useDownloadModal();

    return (
        <section id="home" className="relative bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white overflow-hidden">
            {/* Ambient Romanian Flag Gradient Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCD116]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CE1126]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Geometric architectural grid overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#FCD116] px-4 py-1.5 rounded-full shadow-sm">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCD116] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCD116]"></span>
                                </span>
                                <Globe className="w-4 h-4 text-[#FCD116]" />
                                <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                                    Official Partner of Top Romanian Medical Universities
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md text-white">
                                Study MBBS in <span className="text-[#FCD116] underline decoration-[#CE1126] decoration-4 underline-offset-8">Romania</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-slate-100 leading-relaxed max-w-xl font-normal">
                                Compare European accredited medical programs in Romania, review current admission requirements, and verify NMC recognition and EU licensing pathways before applying.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/universities"
                                className="bg-white text-[#002B7F] px-8 py-4 rounded-xl font-bold hover:bg-[#F0F5FF] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                            >
                                <span>Explore Universities</span>
                                <ArrowRight className="w-5 h-5 text-[#002B7F] transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <button
                                onClick={() =>
                                    openModal("MBBS in Romania", FALLBACK_BROCHURE)
                                }
                                className="border-2 border-[#FCD116] bg-[#FCD116]/10 text-white hover:bg-[#FCD116] hover:text-[#101B35] px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-md backdrop-blur-sm"
                                suppressHydrationWarning={true}
                            >
                                Download Brochure
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                            {[
                                { value: stats.universities, label: "Medical Universities" },
                                { value: stats.students, label: "Indian Students" },
                                { value: stats.admissionSupport, label: "Admission Support" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-left">
                                    <div className="text-3xl lg:text-4xl font-extrabold text-[#FCD116] tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-200 text-xs sm:text-sm font-medium mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="relative">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 space-y-6 border border-white/20 shadow-2xl relative z-10">
                            <div className="border-b border-white/15 pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-white">
                                        Why Choose Romania?
                                    </h3>
                                    <span className="bg-[#CE1126] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                        EU Standard
                                    </span>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed">
                                    Degrees recognised across the European Union (EU/EEA), UK (GMC), USA (USMLE), and India (NMC compliant).
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: <Stethoscope className="w-6 h-6 text-[#002B7F]" />,
                                        title: "Clinical Training & Hospitals",
                                        desc: "Hands-on rotations at modern state-of-the-art university hospitals with English-medium instruction.",
                                    },
                                    {
                                        icon: <Globe className="w-6 h-6 text-[#002B7F]" />,
                                        title: "Globally Recognized Degrees",
                                        desc: "6-year European MD qualification valid for global licensure including NEXT / FMGE & USMLE.",
                                    },
                                    {
                                        icon: <Award className="w-6 h-6 text-[#002B7F]" />,
                                        title: "Affordable European Tuition",
                                        desc: "Standardized European credit transfer system (ECTS) with transparent, verified annual tuition fees.",
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start space-x-4 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="w-12 h-12 bg-[#FCD116] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base mb-0.5">{item.title}</h4>
                                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subtle decorative flag glows */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FCD116] rounded-full opacity-25 blur-xl pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#CE1126] rounded-full opacity-25 blur-xl pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
