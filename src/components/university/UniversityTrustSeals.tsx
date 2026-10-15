import { Shield, Globe, Award, CheckCircle } from "lucide-react";

interface Props {
    university: {
        embassyVerified: boolean | null; whoListed: boolean | null;
        nmcApproved: boolean | null; ministryLicensed: boolean | null;
        faimerListed: boolean | null; mciRecognition: boolean | null;
        ecfmgEligible: boolean | null;
    };
}

export default function UniversityTrustSeals({ university }: Props) {
    const seals = [
        { icon: Shield, title: "Embassy Verified", subtitle: "Internationally Verified", desc: "Verified by diplomatic missions and recognized for international student admissions.", badge: "VERIFIED", grad: "from-[#002B7F] to-[#093594]", badgeCls: "bg-[#F0F5FF] text-[#002B7F] border border-[#002B7F]/20", active: university.embassyVerified },
        { icon: Globe, title: "WHO Listed", titleHref: "https://www.who.int/", subtitle: "World Health Organization", desc: "Listed in the WHO World Directory of Medical Schools.", badge: "LISTED", grad: "from-[#002B7F] to-cyan-700", badgeCls: "bg-blue-100 text-blue-800", active: university.whoListed },
        { icon: Award, title: "Globally Accredited", subtitle: "International Medical Council", desc: "Accredited for international students to practice medicine worldwide.", badge: "APPROVED", grad: "from-[#002B7F] to-indigo-700", badgeCls: "bg-purple-100 text-purple-800", active: university.nmcApproved },
        { icon: CheckCircle, title: "Ministry Licensed", subtitle: "Government of Romania", desc: "Licensed by the Ministry of Education & Health, Romania.", badge: "LICENSED", grad: "from-amber-500 to-[#002B7F]", badgeCls: "bg-amber-100 text-amber-800", active: university.ministryLicensed },
    ];
    const additional = [
        { abbr: "FAIMER", label: "FAIMER Listed", desc: "Foundation for Advancement of International Medical Education — global directory of medical schools.", grad: "from-[#002B7F] to-[#101B35]", border: "border-t-[#002B7F]", active: university.faimerListed },
        { abbr: "WFME", label: "WFME Recognized", desc: "World Federation for Medical Education — standards-compliant institution for quality assurance.", grad: "from-[#002B7F] to-[#093594]", border: "border-t-[#FCD116]", active: university.mciRecognition },
        { abbr: "ECFMG", label: "ECFMG Eligible", desc: "Educational Commission for Foreign Medical Graduates — US clinical practice pathway eligible.", grad: "from-[#002B7F] to-indigo-900", border: "border-t-[#002B7F]", active: university.ecfmgEligible },
    ];

    const activeSeals = seals.filter(s => s.active);
    const activeAdditional = additional.filter(r => r.active);

    if (activeSeals.length === 0 && activeAdditional.length === 0) return null;

    return (
        <section className="py-16 bg-[#F0F5FF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-[#101B35] mb-4">Trust &amp; Recognition</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our university holds prestigious accreditations ensuring your degree is globally accepted.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
                    {seals.filter(s => s.active).map((seal) => (
                        <div key={seal.title} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 border-t-4 border-t-[#FCD116]">
                            <div className="text-center">
                                <div className={`w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br ${seal.grad} flex items-center justify-center shadow-lg`}>
                                    <seal.icon className="h-10 w-10 text-white" />
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${seal.badgeCls}`}>{seal.badge}</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {seal.titleHref ? (
                                        <a href={seal.titleHref} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline transition-colors">{seal.title}</a>
                                    ) : seal.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{seal.subtitle}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{seal.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {additional.some(r => r.active) && (
                    <div className="mt-10">
                        <div className="text-center mb-8">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">Global Standards</span>
                            <h3 className="text-2xl font-bold text-gray-900">Additional Recognitions</h3>
                            <p className="text-gray-400 text-sm mt-1">Our university maintains high standards recognized globally</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                            {additional.filter(r => r.active).map((r) => (
                                <div key={r.label} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${r.border} shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col gap-4`}>
                                    <div className="flex items-center justify-between">
                                        <div className={`bg-gradient-to-br ${r.grad} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>
                                            <span className="text-white font-black text-xs tracking-tight text-center leading-tight px-1">{r.abbr}</span>
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                                            ✓ Recognized
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">{r.label}</h4>
                                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{r.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
