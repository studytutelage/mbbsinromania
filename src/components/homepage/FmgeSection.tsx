import { prisma } from "@/lib/prisma";
import FmgeRatesTable from "./FmgeRatesTable";
import Link from "next/link";

export default async function FmgeSection() {
    const rows = await prisma.universityFmgeRate.findMany({
        where: { status: true },
        select: {
            year: true, appeared: true, passed: true, passPercentage: true,
            university: { select: { name: true, slug: true } },
        },
        orderBy: { year: "desc" },
    }).catch(() => []);

    const data = rows.map((r) => ({
        universityName: r.university.name,
        slug: r.university.slug,
        year: r.year,
        appeared: r.appeared,
        passed: r.passed,
        passPercentage: r.passPercentage ? Number(r.passPercentage) : null,
    }));

    // Build year overview cards (like old React Newanup.tsx)
    const yearMap: Record<number, { total: number; accepted: number }> = {};
    for (const r of data) {
        if (!yearMap[r.year]) yearMap[r.year] = { total: 0, accepted: 0 };
        yearMap[r.year].total += r.appeared ?? 0;
        yearMap[r.year].accepted += r.passed ?? 0;
    }
    const yearOverviews = Object.entries(yearMap)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([year, vals]) => ({
            year,
            total: vals.total,
            accepted: vals.accepted,
            rate: vals.total > 0 ? (vals.accepted / vals.total) * 100 : 0,
        }));

    return (
        <section className="bg-gradient-to-b from-[#F0F5FF] via-white to-[#F5F7FA] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FmgeRatesTable data={data} />

                {/* Year-wise Overview Cards */}
                {yearOverviews.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {yearOverviews.map(({ year, total, accepted, rate }) => (
                            <div
                                key={year}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#FCD116] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-[#101B35] transition-colors duration-300 group-hover:text-[#002B7F]">{year} Exam Overview</h3>
                                        <span className="text-xs font-bold bg-[#F0F5FF] text-[#002B7F] px-2.5 py-1 rounded-full border border-[#002B7F]/15">
                                            Year {year}
                                        </span>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between rounded-xl bg-[#F5F7FA] px-3.5 py-2.5 text-sm">
                                            <span className="text-slate-500 font-medium">Total Registered:</span>
                                            <span className="font-bold text-[#101B35]">{total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between rounded-xl bg-[#F5F7FA] px-3.5 py-2.5 text-sm">
                                            <span className="text-slate-500 font-medium">Total Qualified:</span>
                                            <span className="font-bold text-[#101B35]">{accepted.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between rounded-xl bg-[#F0F5FF] px-3.5 py-2.5 text-sm border border-[#002B7F]/10">
                                            <span className="text-[#002B7F] font-semibold">Pass Percentage:</span>
                                            <span className="font-extrabold text-[#002B7F]">{rate.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link href="/fmge-rates" className="inline-flex items-center gap-2 bg-white text-[#002B7F] border-2 border-[#002B7F] px-8 py-3.5 rounded-xl font-bold hover:bg-[#002B7F] hover:text-white transition-all shadow-sm">
                        <span>View Full Screening &amp; FMGE Data →</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
