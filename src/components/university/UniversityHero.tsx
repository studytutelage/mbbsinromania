import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Users, Star, Award, Globe, ArrowRight,
} from "lucide-react";
import { cdn } from "@/lib/cdn";
import BrochureButton from "@/components/university/BrochureButton";
import { APP_YEAR } from "@/lib/seo";

interface Props {
    university: {
        name: string; slug: string; shortnote: string | null; aboutNote: string | null;
        bannerPath: string | null; thumbnailPath: string | null; brochurePath: string | null;
        city: string | null; cityRelation: { name: string } | null; province: { name: string } | null;
        instituteType: { name: string } | null; nmcApproved: boolean | null;
        whoListed: boolean | null; students: string | null; fmgePassRate: any;
        courseDuration: string | null; mediumOfInstruction: string | null;
        tuitionFee: any; eligibility: string | null; neetRequirement: string | null;
        establishedYear: number | null; applyNowUrl: string | null;
    };
}

export default function UniversityHero({ university }: Props) {
    return (
        <section className="relative text-white py-14 lg:py-24 overflow-hidden">
            {university.bannerPath ? (
                <>
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={cdn(university.bannerPath) || ""}
                            alt={`${university.name} Banner`}
                            fill
                            sizes="100vw"
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-600/80 via-blue-700/80 to-yellow-400/80" />
                    <div className="absolute inset-0 z-0 bg-blue-900/20 mix-blend-multiply" />
                </>
            ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {university.instituteType && (
                                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    {university.instituteType.name}
                                </span>
                            )}
                            {university.nmcApproved && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">NMC Approved</span>}
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
                            {university.name}
                        </h1>
                        <p className="text-blue-100 text-lg leading-relaxed mb-8">
                            {university.shortnote || university.aboutNote || "Review this institution's program, admissions, and fee information, and verify recognition requirements with official regulators."}
                        </p>
                        <div className="grid grid-cols-2 gap-5 mb-8">
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-yellow-400 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">Location</p>
                                    <p className="text-blue-100 text-sm">{university.cityRelation?.name || university.city || "Romania"}{university.province?.name ? `, ${university.province.name}` : ""}</p>
                                </div>
                            </div>
                            {university.students && (
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-yellow-400 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Students</p>
                                        <p className="text-blue-100 text-sm">{university.students} International</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center space-x-3">
                                <Award className="h-5 w-5 text-yellow-400 shrink-0" />
                                <div>
                                    <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:underline hover:text-yellow-300 transition-colors">WHO Listed</a>
                                    <p className="text-blue-100 text-sm">{university.whoListed ? "Yes" : "No"}</p>
                                </div>
                            </div>
                            {university.fmgePassRate && (
                                <div className="flex items-center space-x-3">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">FMGE Pass Rate</p>
                                        <p className="text-blue-100 text-sm">{Number(university.fmgePassRate)}% Success</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={university.applyNowUrl || "/apply"}
                                target={university.applyNowUrl ? "_blank" : undefined}
                                rel={university.applyNowUrl ? "noopener noreferrer" : undefined}
                                className="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all duration-200 hover:scale-105"
                            >
                                <span>Apply Now</span><ArrowRight className="h-5 w-5" />
                            </Link>
                            <BrochureButton
                                universityName={university.name}
                                brochureUrl={university.brochurePath ? (cdn(university.brochurePath) ?? undefined) : undefined}
                                variant="hero"
                            />
                        </div>
                    </div>

                    {/* Right — Quick Facts */}
                    <div>
                        {(() => {
                            const facts = [
                                { label: "Course Duration", value: university.courseDuration },
                                { label: "Medium of Instruction", value: university.mediumOfInstruction },
                                { label: "Annual Tuition Fee", value: university.tuitionFee ? (/[a-zA-Z]/.test(String(university.tuitionFee)) ? String(university.tuitionFee) : `${String(university.tuitionFee)} USD`) : null },
                                { label: "Eligibility", value: university.eligibility },
                                { label: "NEET Requirement", value: university.neetRequirement },
                                { label: "Established", value: university.establishedYear?.toString() },
                            ].filter(f => f.value !== null && f.value !== undefined && f.value !== "");

                            if (facts.length === 0) return null;

                            return (
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                                    <h3 className="text-2xl font-bold mb-6">Quick Facts</h3>
                                    <div className="space-y-4">
                                        {facts.map((f) => (
                                            <div key={f.label} className="flex justify-between py-3 border-b border-white/20 last:border-0">
                                                <span className="text-blue-100 text-sm">{f.label}</span>
                                                <span className="font-semibold text-sm text-right max-w-[55%]">{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>
    );
}
