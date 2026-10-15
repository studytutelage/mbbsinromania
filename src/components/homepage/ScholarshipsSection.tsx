import Link from "next/link";
import { Award, Users, DollarSign, Calendar, CheckCircle, ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HomePageStats } from "@/lib/public-page-content";
import { formatCurrencyRange } from "@/lib/currency";

interface ScholarshipsSectionProps {
    stats: HomePageStats;
}

type EligibilityItem = string;
type CoverageItem = string;

function formatAmount(min: number | null, max: number | null): string {
    if (!min && !max) return "Contact for details";
    return formatCurrencyRange(min || 0, max);
}

function formatDeadline(deadline: Date | null): string {
    if (!deadline) return "Open";
    return new Date(deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getTypeColor(type: string | null): string {
    switch ((type || "").toLowerCase()) {
        case "government": return "bg-green-100 text-green-800";
        case "embassy": return "bg-blue-100 text-blue-800";
        case "university": return "bg-purple-100 text-purple-800";
        case "merit": return "bg-yellow-100 text-yellow-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

export default async function ScholarshipsSection({ stats }: ScholarshipsSectionProps) {
    const scholarships = await prisma.scholarship.findMany({
        where: { isActive: true, universityId: null },
        select: {
            id: true, slug: true, title: true, scholarshipType: true, program: true,
            amountMin: true, amountMax: true, deadline: true, availableSeats: true,
            eligibility: true, coverage: true,
        },
        take: 4,
        orderBy: { id: "asc" },
    }).catch(() => []);

    return (
        <section id="scholarships" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#002B7F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#002B7F]/15">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        Financial Support &amp; Grants
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#101B35] mb-4">Scholarships &amp; Financial Aid</h2>
                    <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Make your European medical education affordable with merit-based grants, university fee concessions, and scholarship opportunities available for international students in Romania.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: <Award className="w-10 h-10 text-[#002B7F] mx-auto mb-3" />, val: stats.scholarships, label: "Government & University Scholarships", border: "border-t-[#FCD116]" },
                        { icon: <DollarSign className="w-10 h-10 text-[#002B7F] mx-auto mb-3" />, val: stats.annualAid, label: "Est. Total Annual Aid", border: "border-t-[#002B7F]" },
                        { icon: <Users className="w-10 h-10 text-[#002B7F] mx-auto mb-3" />, val: stats.meritAwards, label: "Merit-Based Awards", border: "border-t-[#002B7F]" },
                        { icon: <Star className="w-10 h-10 text-[#CE1126] mx-auto mb-3" />, val: stats.verifiedPrograms, label: "Verified Programs", border: "border-t-[#CE1126]" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`group rounded-2xl bg-white border border-slate-200 border-t-4 ${s.border} p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                        >
                            {s.icon}
                            <div className="mb-1 text-3xl font-extrabold text-[#101B35] transition-transform duration-300 group-hover:scale-105">{s.val}</div>
                            <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {scholarships.length > 0 && (
                    <div className="grid lg:grid-cols-2 gap-8 mb-16">
                        {scholarships.map((scholarship) => {
                            const eligibilityItems = (scholarship.eligibility as unknown as EligibilityItem[]) || [];
                            const coverageItems = (scholarship.coverage as unknown as CoverageItem[]) || [];

                            return (
                                <div
                                    key={scholarship.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#FCD116] bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Header banner */}
                                    <div className="relative flex h-32 flex-col justify-end bg-gradient-to-r from-[#002B7F] to-[#093594] p-6">
                                        <div className="absolute top-4 left-4">
                                            <span className="rounded-full bg-[#FCD116] text-[#101B35] px-3 py-1 text-xs font-bold shadow-sm">
                                                {scholarship.scholarshipType || "Merit"}
                                            </span>
                                        </div>
                                        <h3 className="relative text-xl font-bold text-white">{scholarship.title}</h3>
                                        {scholarship.program && (
                                            <p className="relative text-sm text-blue-100">{scholarship.program}</p>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="rounded-xl bg-[#F0F5FF] p-4 border border-[#002B7F]/10">
                                                <DollarSign className="mb-1.5 h-5 w-5 text-[#002B7F]" />
                                                <div className="text-xs text-slate-500 font-medium">Grant Amount</div>
                                                <div className="font-bold text-[#101B35] text-sm">
                                                    {formatAmount(scholarship.amountMin ? Number(scholarship.amountMin) : null, scholarship.amountMax ? Number(scholarship.amountMax) : null)}
                                                </div>
                                            </div>
                                            <div className="rounded-xl bg-[#F0F5FF] p-4 border border-[#002B7F]/10">
                                                <Calendar className="mb-1.5 h-5 w-5 text-[#002B7F]" />
                                                <div className="text-xs text-slate-500 font-medium">Application Deadline</div>
                                                <div className="font-bold text-[#101B35] text-sm">{formatDeadline(scholarship.deadline)}</div>
                                            </div>
                                        </div>

                                        {eligibilityItems.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-bold text-[#101B35] text-sm mb-2">Eligibility Criteria</h4>
                                                <div className="space-y-1">
                                                    {eligibilityItems.slice(0, 3).map((item, i) => (
                                                        <p key={i} className="text-slate-600 text-xs sm:text-sm">• {item}</p>
                                                    ))}
                                                </div>
                                                {scholarship.availableSeats && (
                                                    <div className="flex items-center mt-2 text-xs text-slate-500 font-medium">
                                                        <Users className="w-3.5 h-3.5 mr-1 text-[#002B7F]" />
                                                        <span>{scholarship.availableSeats} scholarships available</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {coverageItems.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="font-bold text-[#101B35] text-sm mb-3">Coverage Includes</h4>
                                                <div className="space-y-2">
                                                    {coverageItems.slice(0, 4).map((item, i) => (
                                                        <div key={i} className="flex items-center space-x-2">
                                                            <CheckCircle className="w-4 h-4 text-[#002B7F] flex-shrink-0" />
                                                            <span className="text-slate-600 text-xs sm:text-sm">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            <Link
                                                href={`/scholarships/${scholarship.slug}`}
                                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#002B7F] py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#001F5C] shadow-sm hover:shadow"
                                            >
                                                <span>Apply for Scholarship</span>
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Need Help CTA */}
                <div className="text-center mt-16 bg-[#F5F7FA] p-10 rounded-3xl border border-slate-200">
                    <h3 className="text-2xl font-extrabold text-[#101B35] mb-3">
                        Need Help with Romanian University Scholarships?
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Our specialized Romanian medical education advisors guide you through documentation, eligibility checks, and application submissions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/scholarships"
                            className="bg-[#002B7F] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#001F5C] transition-all shadow-sm"
                        >
                            Explore Scholarships
                        </Link>
                        <Link
                            href="/contact-us?source=talk_to_counselor"
                            className="border-2 border-[#002B7F] text-[#002B7F] bg-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#002B7F] hover:text-white transition-all shadow-sm"
                        >
                            Talk to a Counselor
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
