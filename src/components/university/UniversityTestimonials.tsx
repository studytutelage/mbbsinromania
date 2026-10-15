import Image from "next/image";
import { Star, Quote, Users } from "lucide-react";
import { cdn } from "@/lib/cdn";

interface Testimonial {
    id: number; name: string | null; designation: string | null;
    course: string | null; imagePath: string | null;
    description: string | null; rating: unknown;
}
interface Props {
    testimonials: Testimonial[];
    universityName: string;
    rating: any;
    parentSatisfaction: any;
}

export default function UniversityTestimonials({ testimonials, universityName, rating, parentSatisfaction }: Props) {
    if (testimonials.length === 0 && !rating && !parentSatisfaction) return null;
    return (
        <section className="py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">What Parents Say About Us</h2>
                    <p className="text-base text-gray-500">Hear from parents of our international students about their experience.</p>
                </div>

                {testimonials.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                                <div className="flex items-center space-x-3 mb-3">
                                    {t.imagePath ? (
                                        <Image src={cdn(t.imagePath) || ""} alt={t.name || "Parent"} width={40} height={40} className="rounded-full object-cover w-10 h-10 border-2 border-white shadow" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-base border-2 border-white shadow">{(t.name || "P")[0]}</div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{t.name || "Anonymous"}</p>
                                        {t.designation && <p className="text-xs text-blue-600 font-medium">{t.designation}</p>}
                                        {t.course && <p className="text-xs text-gray-500">{t.course}</p>}
                                    </div>
                                </div>
                                <Quote className="w-5 h-5 text-blue-300 mb-2" />
                                <p className="text-gray-700 leading-relaxed italic text-sm">&ldquo;{t.description}&rdquo;</p>
                                {t.rating != null && (
                                    <div className="flex items-center gap-0.5 mt-3 pt-3 border-t border-gray-200">
                                        {[...Array(Math.round(Number(t.rating)))].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {(parentSatisfaction || rating) && (
                    <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">Join Our Family of Satisfied Parents</h3>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                            {parentSatisfaction && (
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white p-2 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div>
                                    <div className="text-left">
                                        <p className="font-semibold">Parent Satisfaction</p>
                                        <p className="text-blue-200">{Number(parentSatisfaction)}% Positive Feedback</p>
                                    </div>
                                </div>
                            )}
                            {rating && (
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white p-2 rounded-full"><Star className="h-5 w-5 text-yellow-500" /></div>
                                    <div className="text-left">
                                        <p className="font-semibold">Average Rating</p>
                                        <p className="text-blue-200">{Number(rating)}/5 Stars</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
