import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, TrendingUp, Filter, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "FMGE / NExT Pass Rates — Romania MBBS Universities",
    description: "Compare FMGE and NExT pass rates for Romania MBBS graduates by university and year. Real data from recognized Romanian medical universities.",
    entitySeo: { metaKeyword: "FMGE pass rate Romania, NExT exam Romania MBBS, FMGE percentage Romania, Romania medical university pass rate" },
    path: "/fmge-rates",
    pageKey: "fmge-rates",
});

export const revalidate = 3600;

export default async function FmgeRatesPage() {
    const [rates, universities] = await Promise.all([
        prisma.universityFmgeRate.findMany({
            where: { status: true },
            include: { university: { select: { id: true, name: true, slug: true } } },
            orderBy: [{ year: "desc" }, { passPercentage: "desc" }],
        }).catch(() => []),
        prisma.university.findMany({
            where: { status: true },
            select: { id: true, name: true, slug: true },
            orderBy: { name: "asc" },
        }).catch(() => []),
    ]);

    // Group by university for the summary cards
    const universityGroups = universities.map((uni) => {
        const uniRates = rates.filter((r) => r.universityId === uni.id);
        const latestRate = uniRates[0];
        const avgPass = uniRates.length
            ? uniRates.reduce((sum, r) => sum + (r.passPercentage ? parseFloat(r.passPercentage.toString()) : 0), 0) / uniRates.length
            : null;
        return { ...uni, rates: uniRates, latestRate, avgPass };
    }).filter((u) => u.rates.length > 0);

    // Compute overall summary stats
    const allPassRates = rates.filter(r => r.passPercentage).map(r => parseFloat(r.passPercentage!.toString()));
    const avgPassRate = allPassRates.length
        ? (allPassRates.reduce((a, b) => a + b, 0) / allPassRates.length).toFixed(1)
        : null;
    const topRate = allPassRates.length ? Math.max(...allPassRates).toFixed(1) : null;
    const years = [...new Set(rates.map((r) => r.year))].sort((a, b) => b - a);

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "FMGE Rates", url: "/fmge-rates" },
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BarChart3 className="w-10 h-10 text-[#FCD116]" />
                        <h1 className="text-4xl lg:text-5xl font-extrabold">FMGE / NExT Pass Rates</h1>
                    </div>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mt-3">
                        Compare pass rates for Romania MBBS graduates by university and year. Make an informed decision based on real performance data.
                    </p>
                    {/* Summary stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
                        {[
                            { label: "Universities Tracked", value: universityGroups.length.toString() },
                            { label: "Years of Data", value: years.length.toString() },
                            { label: "Avg Pass Rate", value: avgPassRate ? `${avgPassRate}%` : "—" },
                            { label: "Top Pass Rate", value: topRate ? `${topRate}%` : "—" },
                        ].map((s) => (
                            <div key={s.label} className="bg-white/10 rounded-2xl py-4 px-3 border border-white/10">
                                <div className="text-2xl font-bold text-[#FCD116]">{s.value}</div>
                                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {rates.length === 0 ? (
                    <div className="text-center py-20">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">FMGE Data Coming Soon</h2>
                        <p className="text-gray-500">We are compiling FMGE pass rate data for Romania universities. Check back soon.</p>
                    </div>
                ) : (
                    <>
                        {/* University Cards */}
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <Award className="w-5 h-5 text-[#002B7F]" />
                                <h2 className="text-2xl font-bold text-[#101B35]">By University</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {universityGroups.map((uni) => (
                                    <div key={uni.id} className="bg-white rounded-2xl border border-gray-200 border-t-4 border-t-[#FCD116] p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <Link href={`/universities/${uni.slug}`} className="font-bold text-gray-900 hover:text-[#002B7F] transition-colors leading-tight">
                                                {uni.name}
                                            </Link>
                                            {uni.avgPass !== null && (
                                                <div className="shrink-0 text-right">
                                                    <div className="text-2xl font-bold text-[#002B7F]">{uni.avgPass.toFixed(1)}%</div>
                                                    <div className="text-xs text-gray-400">avg pass rate</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-500 text-xs border-b border-gray-100">
                                                        <th className="pb-2 font-medium">Year</th>
                                                        <th className="pb-2 font-medium text-right">Appeared</th>
                                                        <th className="pb-2 font-medium text-right">Passed</th>
                                                        <th className="pb-2 font-medium text-right">Rate</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {uni.rates.map((r) => (
                                                        <tr key={r.id}>
                                                            <td className="py-2 font-medium text-gray-800">{r.year}</td>
                                                            <td className="py-2 text-right text-gray-500">{r.appeared ?? "—"}</td>
                                                            <td className="py-2 text-right text-gray-500">{r.passed ?? "—"}</td>
                                                            <td className="py-2 text-right font-bold text-[#002B7F]">
                                                                {r.passPercentage ? `${parseFloat(r.passPercentage.toString()).toFixed(1)}%` : "—"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Data Table */}
                        <div className="bg-white rounded-2xl border border-gray-200 border-t-4 border-t-[#002B7F] p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Filter className="w-5 h-5 text-[#002B7F]" />
                                <h2 className="text-xl font-bold text-[#101B35]">Complete FMGE Data</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600">
                                            <th className="text-left p-3 rounded-l-lg font-medium">University</th>
                                            <th className="text-right p-3 font-medium">Year</th>
                                            <th className="text-right p-3 font-medium">Appeared</th>
                                            <th className="text-right p-3 font-medium">Passed</th>
                                            <th className="text-right p-3 font-medium">Pass Rate</th>
                                            <th className="text-right p-3 rounded-r-lg font-medium">1st Attempt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rates.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-3">
                                                    <Link href={`/universities/${r.university.slug}`} className="font-medium text-gray-800 hover:text-[#002B7F]">
                                                        {r.university.name}
                                                    </Link>
                                                </td>
                                                <td className="p-3 text-right text-gray-600">{r.year}</td>
                                                <td className="p-3 text-right text-gray-500">{r.appeared ?? "—"}</td>
                                                <td className="p-3 text-right text-gray-500">{r.passed ?? "—"}</td>
                                                <td className="p-3 text-right">
                                                    {r.passPercentage ? (
                                                        <span className={`font-bold ${parseFloat(r.passPercentage.toString()) >= 40 ? "text-[#002B7F]" : parseFloat(r.passPercentage.toString()) >= 25 ? "text-amber-600" : "text-blue-600"}`}>
                                                            {parseFloat(r.passPercentage.toString()).toFixed(1)}%
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="p-3 text-right text-gray-500">
                                                    {r.firstAttemptPassRate ? `${parseFloat(r.firstAttemptPassRate.toString()).toFixed(1)}%` : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-10 bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] rounded-2xl p-8 text-white text-center border-t-4 border-t-[#FCD116] shadow-lg">
                            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-[#FCD116]" />
                            <h3 className="text-2xl font-bold mb-2">Ready to Study MBBS in Romania?</h3>
                            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                                Join Romanian universities with recognized medical programs. Get free counselling from our experts.
                            </p>
                            <Link href="/contact-us"
                                className="inline-block bg-[#FCD116] text-[#101B35] font-bold px-8 py-3 rounded-xl hover:bg-[#ffe359] transition-colors shadow">
                                Get Free Counselling →
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
