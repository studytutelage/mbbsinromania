"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cdn } from "@/lib/cdn";

interface Uni {
    id: number;
    name: string;
    slug: string;
    thumbnailPath: string | null;
    rating: unknown;
    city: string | null;
    students: string | null;
    tuitionFee: unknown;
    establishedYear: number | null;
    courseDuration: string | null;
    mediumOfInstruction: string | null;
    whoListed: boolean | null;
    nmcApproved: boolean | null;
    ministryLicensed: boolean | null;
    faimerListed: boolean | null;
    mciRecognition: boolean | null;
    ecfmgEligible: boolean | null;
    fmgePassRate: unknown;
    neetRequirement: string | null;
    eligibility: string | null;
    globalRanking: string | null;
    campusArea: string | null;
    labs: number | null;
    lectureHall: number | null;
    hostelBuilding: number | null;
    countriesRepresented: number | null;
    instituteType: { name: string } | null;
    cityRelation: { name: string } | null;
}

const FEATURES = [
    { key: "location", label: "Location" },
    { key: "established", label: "Established" },
    { key: "rating", label: "Rating" },
    { key: "students", label: "Total Students" },
    { key: "fee", label: "Annual Fees" },
    { key: "duration", label: "Course Duration" },
    { key: "type", label: "Institute Type" },
    { key: "medium", label: "Medium of Instruction" },
    { key: "recognition", label: "Recognition" },
    { key: "neet", label: "NEET Requirement" },
    { key: "eligibility", label: "Eligibility" },
    { key: "globalRanking", label: "Global Ranking" },
    { key: "campusArea", label: "Campus Area" },
    { key: "labs", label: "Labs" },
    { key: "lectureHall", label: "Lecture Halls" },
    { key: "hostelBuilding", label: "Hostel Buildings" },
    { key: "countriesRepresented", label: "Countries Represented" },
];

function getValue(u: Uni, key: string): string {
    switch (key) {
        case "location": return u.cityRelation?.name || u.city || "N/A";
        case "established": return u.establishedYear?.toString() || "N/A";
        case "rating": return u.rating ? `★ ${Number(u.rating).toFixed(1)}` : "N/A";
        case "students": return u.students ? `${u.students}` : "N/A";
        case "fee": return u.tuitionFee ? String(u.tuitionFee) : "N/A";
        case "duration": return u.courseDuration || "N/A";
        case "type": return u.instituteType?.name || "N/A";
        case "medium": return u.mediumOfInstruction || "N/A";
        case "recognition": {
            const r = [];
            if (u.whoListed) r.push("WHO");
            if (u.nmcApproved) r.push("NMC");
            if (u.ministryLicensed) r.push("Ministry");
            if (u.faimerListed) r.push("FAIMER");
            if (u.mciRecognition) r.push("MCI");
            if (u.ecfmgEligible) r.push("ECFMG");
            return r.join(", ") || "N/A";
        }
        case "fmge": return u.fmgePassRate ? `${Number(u.fmgePassRate)}%` : "N/A";
        case "neet": return u.neetRequirement || "N/A";
        case "eligibility": return u.eligibility || "N/A";
        case "globalRanking": return u.globalRanking ? `#${u.globalRanking}` : "N/A";
        case "campusArea": return u.campusArea || "N/A";
        case "labs": return u.labs?.toString() || "N/A";
        case "lectureHall": return u.lectureHall?.toString() || "N/A";
        case "hostelBuilding": return u.hostelBuilding?.toString() || "N/A";
        case "countriesRepresented": return u.countriesRepresented?.toString() || "N/A";
        default: return "N/A";
    }
}

export default function CompareUniversitiesClient({ allUniversities }: { allUniversities: Uni[] }) {
    // Default: first 3 universities
    const [selectedIds, setSelectedIds] = useState<number[]>(
        allUniversities.slice(0, 3).map((u) => u.id)
    );

    const universities = useMemo(
        () => selectedIds.map((id) => allUniversities.find((u) => u.id === id)!).filter(Boolean),
        [selectedIds, allUniversities]
    );

    const visibleFeatures = useMemo(() => {
        return FEATURES.filter(feature => {
            const values = universities.map(u => getValue(u, feature.key));
            return values.some(v => v !== "N/A");
        });
    }, [universities]);

    const handleSelect = (slot: number, id: number) => {
        setSelectedIds((prev) => {
            const next = [...prev];
            next[slot] = id;
            return next;
        });
    };

    return (
        <section id="compare" className="py-16 bg-[#F5F7FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#002B7F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#002B7F]/15">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        Side-by-Side Evaluation
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#101B35] mb-4">Compare Medical Universities</h2>
                    <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto">
                        Evaluate Romanian medical universities side-by-side on curriculum, fees, global recognition, and facilities.
                    </p>
                </div>

                {/* University Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[0, 1, 2].map((slot) => (
                        <div key={slot}>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Select University {slot + 1}
                            </label>
                            <select
                                value={selectedIds[slot] ?? ""}
                                onChange={(e) => handleSelect(slot, Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white text-[#101B35] focus:outline-none focus:border-[#002B7F] focus:ring-2 focus:ring-[#002B7F]/20 shadow-sm"
                                suppressHydrationWarning={true}
                            >
                                {allUniversities.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-200 border-t-4 border-t-[#FCD116]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="bg-[#002B7F] text-white">
                                    <th className="text-left p-4 font-bold text-sm w-44 uppercase tracking-wider">Evaluation Metrics</th>
                                    {universities.map((u, idx) => (
                                        <th key={`${u.id}-${idx}`} className="text-center p-4 font-semibold min-w-48">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-[#FCD116] shadow-sm">
                                                    {u.thumbnailPath ? (
                                                        <Image
                                                            src={cdn(u.thumbnailPath)}
                                                            alt={u.name}
                                                            width={56} height={56}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#F0F5FF] flex items-center justify-center text-[#002B7F] font-bold text-lg">
                                                            {u.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold leading-tight text-white">{u.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibleFeatures.map((feature, idx) => (
                                    <tr key={feature.key} className={idx % 2 === 0 ? "bg-white" : "bg-[#F5F7FA]/60 hover:bg-[#F0F5FF]/50 transition-colors"}>
                                        <td className="p-3.5 font-bold text-[#101B35] text-xs sm:text-sm whitespace-nowrap">
                                            {feature.label}
                                        </td>
                                        {universities.map((u, idx) => {
                                            const val = getValue(u, feature.key);
                                            const isGood = val !== "N/A";
                                            const isRecognition = feature.key === "recognition";
                                            return (
                                                <td key={`${u.id}-${idx}`} className="p-3.5 text-center text-slate-700 text-sm">
                                                    {isRecognition && isGood ? (
                                                        <div className="flex flex-wrap gap-1 justify-center">
                                                            {val.split(", ").map((r) => (
                                                                <span key={r} className="text-xs bg-[#F0F5FF] text-[#002B7F] font-semibold px-2.5 py-0.5 rounded-full border border-[#002B7F]/20">{r}</span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className={!isGood ? "text-slate-400" : feature.key === "fee" ? "text-[#002B7F] font-bold" : "font-medium"}>
                                                            {val}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {/* CTA row */}
                                <tr className="bg-[#F0F5FF]">
                                    <td className="p-4 font-bold text-[#101B35] text-sm">Action</td>
                                    {universities.map((u, idx) => (
                                        <td key={`${u.id}-${idx}`} className="p-4 text-center">
                                            <Link href={`/universities/${u.slug}`}
                                                className="inline-block bg-[#002B7F] text-white text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#001F5C] transition-all font-bold shadow-sm">
                                                View University →
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/compare"
                        className="inline-flex items-center gap-2 bg-white text-[#002B7F] border-2 border-[#002B7F] px-8 py-3.5 rounded-xl font-bold hover:bg-[#002B7F] hover:text-white transition-all shadow-sm">
                        <span>Compare All Romanian Universities →</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
