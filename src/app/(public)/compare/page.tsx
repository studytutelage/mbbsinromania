import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, X, GraduationCap, MapPin } from "lucide-react";
import FmgeRatesTable from "@/components/homepage/FmgeRatesTable";
import CompareForm from "@/components/compare/CompareForm";


import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Compare MBBS Universities in Romania | MBBS Romania",
    description: "Compare top MBBS universities in Romania side by side — fees, duration, facilities, rankings, and more.",
    path: "/compare",
});

export const revalidate = 3600;

type ComparePageSearchParams = {
    ids?: string | string[];
};


export default async function ComparePage({
    searchParams,
}: {
    searchParams?: Promise<ComparePageSearchParams>;
}) {
    const params = (await searchParams) ?? {};
    const idsParam = Array.isArray(params.ids) ? params.ids[0] : params.ids;

    // Get all universities for the picker — use correct scalar/relation fields
    const all = await prisma.university.findMany({
        where: { status: true },
        select: {
            id: true, name: true, slug: true, thumbnailPath: true,
            city: true,  // scalar string
            cityRelation: { select: { name: true } },
            province: { select: { name: true } },
        },
        orderBy: { name: "asc" },
    }).catch(() => []);

    // Parse selected IDs (up to 3)
    const rawIds = idsParam?.split(",").map(Number).filter(Boolean).slice(0, 3) ?? [];

    // Load selected universities with rich details
    const selected = rawIds.length > 0
        ? await prisma.university.findMany({
            where: { id: { in: rawIds }, status: true },
            select: {
                id: true, name: true, slug: true, thumbnailPath: true,
                city: true, establishedYear: true, students: true,
                tuitionFee: true, courseDuration: true, mediumOfInstruction: true,
                rating: true, globalRanking: true, fmgePassRate: true,
                whoListed: true, nmcApproved: true, ministryLicensed: true,
                faimerListed: true, mciRecognition: true, ecfmgEligible: true,
                neetRequirement: true, eligibility: true,
                campusArea: true, labs: true, lectureHall: true,
                hostelBuilding: true, countriesRepresented: true,
                cityRelation: { select: { name: true } },
                province: { select: { name: true } },
                instituteType: { select: { name: true } },
                programs: {
                    where: { isActive: true },
                    take: 1,
                    select: { programName: true, duration: true, annualTuitionFee: true, currency: true },
                },
                facilities: {
                    include: { facility: true },
                    take: 6,
                },
                intakes: {
                    where: { isActive: true },
                    take: 4,
                    select: { intakeMonth: true, intakeYear: true },
                },
            },
        }).catch(() => [])
        : [];

    type SelectedUni = (typeof selected)[number];

    const allRows: { label: string; key: (u: SelectedUni) => string }[] = [
        { label: "Location", key: (u) => u.cityRelation?.name || u.city || "—" },
        { label: "Established", key: (u) => u.establishedYear?.toString() || "—" },
        { label: "Institute Type", key: (u) => u.instituteType?.name || "—" },
        { label: "Medium", key: (u) => u.mediumOfInstruction || "English" },
        { label: "Total Students", key: (u) => u.students ? u.students.toLocaleString() : "—" },
        { label: "Annual Tuition", key: (u) => u.tuitionFee ? String(u.tuitionFee) : (u.programs[0]?.annualTuitionFee ? String(u.programs[0].annualTuitionFee) : "—") },
        { label: "Course Duration", key: (u) => u.courseDuration || u.programs[0]?.duration || "6 Years" },
        { label: "Rating", key: (u) => u.rating ? `★ ${Number(u.rating).toFixed(1)}` : "—" },
        { label: "Global Ranking", key: (u) => u.globalRanking ? `#${u.globalRanking}` : "—" },
        { label: "NMC Recognised", key: (u) => u.nmcApproved ? "yes" : "no" },
        { label: "MCI Recognition", key: (u) => u.mciRecognition ? "yes" : "no" },
        { label: "WHO Listed", key: (u) => u.whoListed ? "yes" : "no" },
        { label: "FAIMER Listed", key: (u) => u.faimerListed ? "yes" : "no" },
        { label: "Ministry Licensed", key: (u) => u.ministryLicensed ? "yes" : "no" },
        { label: "NEET Requirement", key: (u) => u.neetRequirement || "—" },
        { label: "Eligibility", key: (u) => u.eligibility || "—" },
        { label: "Campus Area", key: (u) => u.campusArea || "—" },
        { label: "Labs", key: (u) => u.labs?.toString() || "—" },
        { label: "Countries Rep.", key: (u) => u.countriesRepresented?.toString() || "—" },
        { label: "Intakes", key: (u) => u.intakes?.map((i) => `${i.intakeMonth} ${i.intakeYear}`).join(", ") || "—" },
    ];

    // Hide rows where ALL selected universities have "no"
    const rows = allRows.filter(row => {
        const values = selected.map(u => row.key(u));
        const isAllNo = values.every(v => v === "no");
        return !isAllNo;
    });

    // Fetch FMGE rates for the section below
    const fmgeRows = await prisma.universityFmgeRate.findMany({
        where: { status: true },
        select: {
            year: true, appeared: true, passed: true, passPercentage: true,
            university: { select: { name: true, slug: true } },
        },
        orderBy: { year: "desc" },
    }).catch(() => []);

    const fmgeData = fmgeRows.map((r) => ({
        universityName: r.university.name,
        slug: r.university.slug,
        year: r.year,
        appeared: r.appeared,
        passed: r.passed,
        passPercentage: r.passPercentage ? Number(r.passPercentage) : null,
    }));

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Compare Universities", url: "/compare" },
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-14 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-3">Compare Universities</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Select Romanian medical universities to compare basic facts, fees, and requirements.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Picker Form — client component (uses window.location) */}
                <CompareForm all={all.map(u => ({ id: u.id, name: u.name }))} selectedIds={rawIds} />

                {/* Empty state */}
                {rawIds.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <GraduationCap className="w-14 h-14 mx-auto text-gray-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-700 mb-2">No universities selected</p>
                        <p className="text-sm">Use the form above to pick 2–3 universities and compare them.</p>
                    </div>
                )}

                {rawIds.length > 0 && selected.length < 2 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-700 text-sm">
                        Please select at least 2 universities to compare.
                    </div>
                )}

                {/* Comparison Table */}
                {selected.length >= 2 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 border-t-4 border-t-[#FCD116] overflow-hidden">
                        {/* University header row */}
                        <div
                            className="grid border-b bg-[#002B7F] text-white"
                            style={{ gridTemplateColumns: `220px repeat(${selected.length}, 1fr)` }}
                        >
                            <div className="p-5 font-semibold text-blue-100 text-sm">Features</div>
                            {selected.map((u) => (
                                <div key={u.id} className="p-5 border-l border-white/20 text-center">
                                    {u.thumbnailPath && (
                                        <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden bg-white/20 border-2 border-white/40">
                                            <Image src={cdn(u.thumbnailPath) || ""} alt="" aria-hidden="true" width={56} height={56} className="object-cover w-full h-full" />                                        </div>
                                    )}
                                    {!u.thumbnailPath && (
                                        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/40">
                                            {u.name[0]}
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-sm leading-tight">{u.name}</h3>
                                    {(u.cityRelation?.name || u.city) && (
                                        <p className="text-xs text-blue-200 mt-1 flex items-center justify-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {u.cityRelation?.name || u.city}
                                        </p>
                                    )}
                                    <Link href={`/universities/${u.slug}`}
                                        className="inline-block mt-2 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors">
                                        View Details →
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        {rows.map((row, idx) => (
                            <div
                                key={row.label}
                                className={`grid border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                style={{ gridTemplateColumns: `220px repeat(${selected.length}, 1fr)` }}
                            >
                                <div className="px-5 py-3.5 text-sm font-medium text-gray-700 flex items-center">{row.label}</div>
                                {selected.map((u) => {
                                    const val = row.key(u);
                                    const isBool = val === "yes" || val === "no";
                                    return (
                                        <div key={u.id} className="px-5 py-3.5 border-l border-gray-100 text-sm text-center text-gray-700">
                                            {isBool ? (
                                                val === "yes"
                                                    ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                                    : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : val}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Facilities Row */}
                        <div
                            className="grid border-b bg-gray-50"
                            style={{ gridTemplateColumns: `220px repeat(${selected.length}, 1fr)` }}
                        >
                            <div className="px-5 py-4 text-sm font-medium text-gray-700 flex items-center">Facilities</div>
                            {selected.map((u) => (
                                <div key={u.id} className="px-5 py-4 border-l border-gray-100">
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {u.facilities.slice(0, 5).map((f) => (
                                            <span key={f.id} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                                                {f.facility.name}
                                            </span>
                                        ))}
                                        {u.facilities.length === 0 && <span className="text-xs text-gray-400">—</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Apply CTA Row */}
                        <div
                            className="grid bg-gray-50"
                            style={{ gridTemplateColumns: `220px repeat(${selected.length}, 1fr)` }}
                        >
                            <div className="p-5 text-sm font-medium text-gray-700 flex items-center">View / Apply</div>
                            {selected.map((u) => (
                                <div key={u.id} className="p-5 border-l border-gray-100 text-center">
                                    <Link href={`/universities/${u.slug}`}
                                        className="inline-block bg-[#002B7F] hover:bg-[#001F5C] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow">
                                        View Details →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FMGE Data Section */}
                <div className="mt-4">
                    <FmgeRatesTable data={fmgeData} />
                </div>
            </div>
        </div>
    );
}
