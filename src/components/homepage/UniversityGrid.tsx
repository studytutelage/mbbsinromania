import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star, ArrowRight, Award, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";

function getTypeColor(type: string) {
    switch (type.toLowerCase()) {
        case "medical": return "bg-green-100 text-green-800";
        case "technical": return "bg-blue-100 text-blue-800";
        case "private": return "bg-purple-100 text-purple-800";
        case "public": return "bg-blue-100 text-blue-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

function formatStudents(students: string | null | undefined): string {
    if (!students) return "N/A";
    return students; // Show exactly what admin entered — no extra + appended
}

export default async function UniversityGrid() {
    let universities = await prisma.university.findMany({
        where: { status: true, homeView: true },
        select: {
            id: true,
            name: true,
            slug: true,
            thumbnailPath: true,
            rating: true,
            city: true,
            state: true,
            students: true,
            tuitionFee: true,
            establishedYear: true,
            approvedBy: true,
            scholarshipName: true,
            instituteType: { select: { name: true } },
            province: { select: { name: true } },
            cityRelation: { select: { name: true } },
        },
        orderBy: { id: "asc" },
        take: 6,
    }).catch(() => []);

    // Fallback un-curated universities if the admin hasn't enabled homeView yet
    if (universities.length === 0) {
        universities = await prisma.university.findMany({
            where: { status: true },
            select: {
                id: true,
                name: true,
                slug: true,
                thumbnailPath: true,
                rating: true,
                city: true,
                state: true,
                students: true,
                tuitionFee: true,
                establishedYear: true,
                approvedBy: true,
                scholarshipName: true,
                instituteType: { select: { name: true } },
                province: { select: { name: true } },
                cityRelation: { select: { name: true } },
            },
            orderBy: [{ rating: "desc" }, { id: "asc" }],
            take: 6,
        }).catch(() => []);
    }

    return (
        <section className="py-16 bg-[#F5F7FA]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#002B7F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#002B7F]/15">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        European Accredited Medical Programs
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#101B35] mb-4">
                        Medical Universities in Romania
                    </h2>
                    <p className="text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Explore leading Romanian medical universities offering globally recognised 6-year English-taught MD programs with European qualification standards.
                    </p>
                </div>

                {universities.length === 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse border-t-4 border-t-[#FCD116]">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded mb-4" />
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="h-16 bg-gray-200 rounded" />
                                        <div className="h-16 bg-gray-200 rounded" />
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${universities.length < 3 ? "flex flex-wrap justify-center" : "grid md:grid-cols-2 lg:grid-cols-3"} gap-8`}>
                        {universities.map((university, index) => {
                            const approvedBy = Array.isArray(university.approvedBy)
                                ? (university.approvedBy as string[])
                                : [];

                            return (
                                <Link
                                    key={university.id}
                                    href={`/universities/${university.slug}`}
                                    className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-x border-b border-slate-200/80 border-t-4 border-t-[#FCD116] bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#002B7F]/10 hover:border-slate-300 ${universities.length < 3 ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md" : ""}`}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <Image
                                            src={cdn(university.thumbnailPath) || "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600"}
                                            alt={`MBBS students campus at ${university.name}, Romania`}
                                            fill
                                            priority={index < 3}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#101B35]/70 via-transparent to-transparent opacity-80" />
                                        
                                        {university.instituteType && (
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-lg bg-[#002B7F]/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                                    {university.instituteType.name}
                                                </span>
                                            </div>
                                        )}
                                        {university.rating && (
                                            <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-lg bg-white/95 px-2.5 py-1 backdrop-blur-sm shadow-sm">
                                                <Star className="w-3.5 h-3.5 text-[#FCD116] fill-[#FCD116]" />
                                                <span className="text-xs font-bold text-[#101B35]">
                                                    {Number(university.rating).toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="relative flex flex-grow flex-col p-6">
                                        <div className="mb-4">
                                            <h3 className="mb-2 text-xl font-bold text-[#101B35] transition-colors duration-300 group-hover:text-[#002B7F] line-clamp-2">
                                                {university.name}
                                            </h3>
                                            <div className="mb-2 flex items-center text-xs text-slate-500">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-[#CE1126] flex-shrink-0" />
                                                <span className="font-medium">
                                                    {university.cityRelation?.name || university.city || "Romania"}
                                                    {university.province?.name
                                                        ? `, ${university.province.name}`
                                                        : ""}
                                                </span>
                                                {university.establishedYear && (
                                                    <>
                                                        <span className="mx-2 text-slate-300">•</span>
                                                        <span>Est. {university.establishedYear}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="rounded-xl bg-[#F0F5FF] p-3 text-center border border-[#002B7F]/10 transition-colors group-hover:border-[#002B7F]/25">
                                                <Users className="mx-auto mb-1 h-4 w-4 text-[#002B7F]" />
                                                <div className="text-sm font-bold text-[#101B35]">
                                                    {formatStudents(university.students)}
                                                </div>
                                                <div className="text-[11px] font-medium text-slate-500">Total Students</div>
                                            </div>
                                            <div className="rounded-xl bg-[#F0F5FF] p-3 text-center border border-[#002B7F]/10 transition-colors group-hover:border-[#002B7F]/25">
                                                <Award className="mx-auto mb-1 h-4 w-4 text-[#002B7F]" />
                                                <div className="text-sm font-bold text-[#002B7F]">
                                                    {university.tuitionFee ? (/[a-zA-Z]/.test(String(university.tuitionFee)) ? String(university.tuitionFee) : `${String(university.tuitionFee)} EUR`) : "Contact for details"}
                                                </div>
                                                <div className="text-[11px] font-medium text-slate-500">Annual Tuition</div>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="mb-4 flex flex-wrap gap-1.5">
                                            {university.scholarshipName && (
                                                <span className="rounded-md bg-[#FCD116]/20 border border-[#FCD116]/40 px-2.5 py-1 text-xs font-bold text-[#101B35]">
                                                    {university.scholarshipName}
                                                </span>
                                            )}
                                            <span className="rounded-md bg-[#F0F5FF] border border-[#002B7F]/15 px-2.5 py-1 text-xs font-semibold text-[#002B7F]">
                                                English Medium
                                            </span>
                                            <span className="rounded-md bg-red-50 border border-[#CE1126]/20 px-2.5 py-1 text-xs font-semibold text-[#CE1126]">
                                                EU Degree
                                            </span>
                                        </div>

                                        {/* Recognition */}
                                        <div className="mb-5 flex-grow">
                                            {approvedBy.length > 0 ? (
                                                <div className="flex items-center space-x-2 text-xs text-slate-600">
                                                    <Globe className="w-3.5 h-3.5 text-[#002B7F] flex-shrink-0" />
                                                    <span className="line-clamp-1">
                                                        Recognized by: {approvedBy.slice(0, 3).join(", ")}
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500">WHO, NMC &amp; ECFMG compliant curriculum</p>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className="mt-auto">
                                            <div className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#002B7F] py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 group-hover:bg-[#001F5C] group-hover:shadow-md">
                                                <span>View University Details</span>
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/universities"
                        className="inline-flex items-center gap-2 bg-white text-[#002B7F] border-2 border-[#002B7F] px-8 py-3.5 rounded-xl font-bold hover:bg-[#002B7F] hover:text-white transition-all shadow-sm hover:shadow"
                    >
                        <span>View All Romanian Universities</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
