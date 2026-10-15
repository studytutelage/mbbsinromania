import { GraduationCap } from "lucide-react";

interface FmgeRate {
    id: number; year: number; appeared: number | null; passed: number | null;
    acceptance_rate: string | null; passPercentage: unknown; yoy_change: string | null;
}
interface Props {
    fmgeRates: FmgeRate[];
    fmgePassRate: any;
}

export default function UniversityFMGE({ fmgeRates, fmgePassRate }: Props) {
    return (
        <section className="py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-7">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">FMGE Success Rate</h2>
                    <p className="text-base text-gray-500">Year-on-year performance of graduates in the Foreign Medical Graduates Examination</p>
                </div>
                {fmgeRates.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="text-left p-5 font-semibold">Year</th>
                                    <th className="text-right p-5 font-semibold">Appeared</th>
                                    <th className="text-right p-5 font-semibold">Passed</th>
                                    <th className="text-right p-5 font-semibold">Pass Rate</th>
                                    <th className="text-right p-5 font-semibold">YoY Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {fmgeRates.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="p-5 font-bold text-base">{r.year}</td>
                                        <td className="p-5 text-right text-gray-600">{r.appeared ?? "—"}</td>
                                        <td className="p-5 text-right text-gray-600">{r.passed ?? "—"}</td>
                                        <td className="p-5 text-right">
                                            {r.acceptance_rate
                                                ? <span className="text-green-600 font-bold text-lg">{r.acceptance_rate}%</span>
                                                : r.passPercentage != null
                                                    ? <span className="text-green-600 font-bold text-lg">{String(Number(r.passPercentage))}%</span>
                                                    : "—"}
                                        </td>
                                        <td className="p-5 text-right">
                                            {r.yoy_change
                                                ? <span className={`font-semibold text-base ${r.yoy_change.startsWith('-') ? 'text-blue-500' : 'text-green-500'}`}>{r.yoy_change.startsWith('-') ? '' : '+'}{r.yoy_change}%</span>
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {fmgePassRate != null && (
                    <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                        <p className="text-5xl font-black text-green-600 mb-2">{Number(fmgePassRate)}%</p>
                        <p className="text-lg font-semibold text-gray-900">Average FMGE Success Rate</p>
                        <p className="text-gray-600 text-sm mt-1">Based on historical data from our graduates</p>
                    </div>
                )}
            </div>
        </section>
    );
}
