import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildMetadata, APP_YEAR, ADMISSION_YEAR, breadcrumbSchema } from "@/lib/seo";
import UniversitySearch from "@/components/universities/UniversitySearch";

export const metadata: Promise<Metadata> = buildMetadata({
    title: `Medical Universities in Romania ${APP_YEAR}`,
    description:
        `Browse medical universities in Romania. Compare published programs, fees, and intake information for ${ADMISSION_YEAR}. Verify recognition and licensing with official regulators.`,
    path: "/universities",
    pageKey: "universities",
    entitySeo: {
        metaKeyword: `medical universities Romania, medical programs Romania, study medicine ${APP_YEAR}`,
    },
});

export const revalidate = 3600;

export default async function UniversitiesPage() {
    const universities = await prisma.university.findMany({
        where: { status: true },
        select: {
            id: true, name: true, slug: true, thumbnailPath: true, rating: true,
            city: true, establishedYear: true, students: true, tuitionFee: true,
            approvedBy: true, courseDuration: true, fmgePassRate: true,
            neetRequirement: true, mediumOfInstruction: true, globalRanking: true,
            whoListed: true, nmcApproved: true, ministryLicensed: true,
            faimerListed: true, mciRecognition: true,
            instituteType: { select: { name: true } },
            province: { select: { name: true } },
            cityRelation: { select: { name: true } },
            scholarships: {
                where: { isActive: true },
                select: { title: true },
                take: 1,
            },
        },
        orderBy: [{ id: "asc" }],
    }).catch(() => []);

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Universities", url: "/universities" },
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Page Header */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">MBBS Universities in Romania</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Compare published program and fee information. Confirm current recognition, teaching language, and licensing requirements with official sources.
                    </p>
                    <p className="mt-4 text-[#FCD116] font-semibold text-sm">{universities.length} universities listed</p>
                </div>
            </div>

            <UniversitySearch universities={universities.map(u => ({
                ...u,
                students: u.students !== null ? String(u.students) : null,
                globalRanking: u.globalRanking !== null ? String(u.globalRanking) : null,
                rating: u.rating ? Number(u.rating) : null,
                tuitionFee: u.tuitionFee ? String(u.tuitionFee) : null,
                fmgePassRate: u.fmgePassRate ? Number(u.fmgePassRate) : null,
            }))} />
        </div>
    );
}
