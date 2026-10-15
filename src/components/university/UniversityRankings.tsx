import { Globe, CheckCircle, Shield, Star, Trophy } from "lucide-react";

interface Ranking {
    id: number; rankingBody: string; rank: string | null;
    category: string | null; year: string | null;
}
interface Props { rankings: Ranking[]; }

export default function UniversityRankings({ rankings }: Props) {
    if (rankings.length === 0) return null;
    const accreditations = [
        { icon: Globe, title: "WHO Listed", href: "https://www.who.int/", desc: "Listed in World Health Organization Directory", status: "Verified" },
        { icon: CheckCircle, title: "Internationally Accredited", desc: "Approved by international medical councils for global practice", status: "Approved" },
        { icon: Shield, title: "Institutional Status", desc: "Verify current registration and program status with official authorities", status: "Check current status" },
        { icon: Star, title: "International Standards", desc: "Meets global medical education standards (FAIMER, WFME)", status: "Certified" },
    ];

    return (
        <section id="rankings" className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Rankings &amp; Accreditation</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our commitment to excellence is reflected in our international rankings and comprehensive accreditations.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-8">Official Accreditations</h3>
                        <div className="space-y-6">
                            {accreditations.map((accred) => (
                                <div key={accred.title} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-green-100 p-3 rounded-lg shrink-0">
                                            <accred.icon className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {accred.href ? (
                                                        <a href={accred.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline transition-colors">{accred.title}</a>
                                                    ) : accred.title}
                                                </h4>
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{accred.status}</span>
                                            </div>
                                            <p className="text-gray-600">{accred.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {rankings.length > 0 && (
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Global Rankings</h3>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl min-h-[200px]">
                                <div className="space-y-4">
                                    {rankings.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{r.rankingBody}</h4>
                                                {r.category && <p className="text-sm text-gray-600">{r.category}</p>}
                                                {r.year && <p className="text-xs text-gray-400 mt-0.5">{r.year}</p>}
                                            </div>
                                            {r.rank && <span className="text-2xl font-bold text-blue-600">#{r.rank}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
