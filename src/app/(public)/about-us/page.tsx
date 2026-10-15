import type { Metadata } from "next";
import Link from "next/link";
import { Users, Globe, Target, BookOpen, Phone, ArrowRight, CheckCircle, GraduationCap, Shield, Rocket, Compass, Building2, Plane, Home, ClipboardCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import TestimonialSection from "@/app/(public)/about-us/TestimonialSection";
import { getHomepageStats } from "@/lib/public-page-content";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "About Us | Medical Education Guidance for Romania",
    description: "Learn about our team and the application guidance we provide to students researching medical education in Romania.",
    path: "/about-us",
    entitySeo: { metaKeyword: "about mbbs Romania, global medical consultancy, mbbs admission support, study mbbs Romania team" },
    pageKey: "about-us",
});



const services = [
    { 
        icon: Compass, 
        title: "Career Counseling (MBBS Focused)", 
        desc: "Personalized guidance for NEET-qualified students, budget planning, and career goals (India/US/UK practice)." 
    },
    { 
        icon: GraduationCap, 
        title: "University Selection", 
        desc: "Selection based on NMC/WHO recognition, clinical exposure, infrastructure, and campus safety." 
    },
    { 
        icon: ClipboardCheck, 
        title: "Admission Assistance", 
        desc: "Application processing, documentation verification, and official offer letter support." 
    },
    { 
        icon: Plane, 
        title: "Visa & Travel Guidance", 
        desc: "Complete visa filing support, pre-departure briefings, and travel coordination." 
    },
    { 
        icon: Home, 
        title: "On-Arrival Support", 
        desc: "Airport pickup, hostel/accommodation setup, and local student assistance in Romania." 
    },
];

export default async function AboutUsPage() {
    const [testimonials, dynamicStats] = await Promise.all([
        prisma.testimonial.findMany({
            where: { status: true },
            orderBy: { position: "asc" },
        }),
        getHomepageStats(),
    ]);

    const stats = [
        { val: dynamicStats.students, label: "Students Placed" },
        { val: dynamicStats.universities, label: "Partner Universities" },
        { val: dynamicStats.experienceYears, label: "Years Experience" },
        { val: dynamicStats.visaSuccess, label: "Visa Success Rate" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-24 overflow-hidden border-b-4 border-b-[#FCD116]">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur-md text-[#FCD116] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
                        🌎 Trusted Global MBBS Consultancy
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                        Empowering Future Doctors <br />
                        <span className="text-[#FCD116]">from Every Corner of the World</span>
                    </h1>
                    <p className="text-xl text-blue-50 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                        Dedicated to bridging the gap between aspiring medical students and world-class quality education in Romania.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/universities" className="bg-[#FCD116] text-[#101B35] hover:bg-[#ffe359] font-bold px-10 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95">
                            Explore Universities
                        </Link>
                        <Link href="/contact-us" className="border-2 border-white/80 hover:border-white text-white font-bold px-10 py-4 rounded-xl transition-all hover:bg-white/10">
                            Get Free Counseling
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white border-b py-12 relative z-10 -mt-10 mx-4 max-w-6xl lg:mx-auto rounded-2xl shadow-xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((s, idx) => (
                        <div
                            key={s.label}
                            className={`group relative overflow-hidden rounded-2xl px-4 py-3 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-blue-50/60 ${idx < stats.length - 1 ? "lg:border-r border-gray-100" : ""}`}
                        >
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/0 to-orange-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="relative">
                                <div className="mb-1 text-4xl font-extrabold text-blue-600 transition-transform duration-300 group-hover:scale-105">{s.val}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors duration-300 group-hover:text-blue-600">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision Section (Extracted from Old React) */}
            <section className="max-w-7xl mx-auto px-4 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-sm tracking-widest uppercase mb-4">
                            <span className="h-0.5 w-8 bg-blue-600"></span>
                            <span>Our Purpose</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                            Committed to Your <br />Medical Excellence
                        </h2>

                        <div className="space-y-10">
                            <div className="group rounded-[2rem] border border-transparent bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/60 hover:shadow-xl hover:shadow-blue-100/70">
                                <div className="flex items-start space-x-6">
                                    <div className="rounded-2xl bg-blue-50 p-4 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                        <Target className="h-8 w-8 text-current" />
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">Mission</h3>
                                        <div className="space-y-3 text-lg leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                                            <p className="flex items-start gap-2">
                                                <span>👉</span>
                                                <span>To provide transparent, reliable, and student-focused guidance for MBBS aspirants</span>
                                            </p>
                                            <p className="flex items-start gap-2">
                                                <span>👉</span>
                                                <span>To connect students with globally recognized medical universities in Romania</span>
                                            </p>
                                            <p className="flex items-start gap-2">
                                                <span>👉</span>
                                                <span>To ensure a smooth, stress-free admission journey</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="group rounded-[2rem] border border-transparent bg-white/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/60 hover:shadow-xl hover:shadow-blue-100/70">
                                <div className="flex items-start space-x-6">
                                    <div className="rounded-2xl bg-blue-50 p-4 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                        <Rocket className="h-8 w-8 text-current" />
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">Vision</h3>
                                        <p className="text-lg leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                                            To become the most trusted and comprehensive platform for MBBS admissions in Romania, empowering students from every country to achieve their dreams of becoming medical professionals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-green-700 p-10 text-white shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-950/30">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <GraduationCap className="w-32 h-32" />
                        </div>
                        <h3 className="relative mb-2 flex items-center gap-3 text-3xl font-bold text-white">
                            What Makes Us Different ?
                        </h3>
                        <p className="relative mb-8 text-blue-100 text-lg">
                            Unlike general study abroad consultants, we are 100% focused on Romania medical education.
                        </p>
                        
                        <div className="relative grid gap-6">
                            {[
                                {
                                    title: "Romania-Focused Expertise",
                                    points: [
                                        "Deep knowledge of medical universities, curriculum, and clinical exposure",
                                        "Updated information on NMC, WHO, ECFMG eligibility"
                                    ]
                                },
                                {
                                    title: "Verified Universities Only",
                                    points: [
                                        "We work with approved and recognized medical colleges",
                                        "Focus on institutions offering strong hospital training"
                                    ]
                                },
                                {
                                    title: "Transparent Process",
                                    points: [
                                        "No hidden charges",
                                        "Clear fee breakdown",
                                        "Honest university comparison"
                                    ]
                                }
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start space-x-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20"
                                >
                                    <CheckCircle className="h-6 w-6 shrink-0 text-green-400 mt-1" />
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                                        <ul className="space-y-2">
                                            {item.points.map((p, i) => (
                                                <li key={i} className="text-blue-50 text-[15px] leading-relaxed opacity-90 flex items-start gap-2">
                                                    <span className="text-green-400/60 mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Services */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest bg-blue-50 px-4 py-1.2 rounded-full mb-4 inline-block">Support Services</span>
                        <h2 className="text-4xl font-black text-gray-900 mt-4">We Guide You at Every Step</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
                            From initial university selection to your graduation day, our dedicated team provides continuous support across borders.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/80"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/0 to-orange-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-500 group-hover:bg-blue-600">
                                            <service.icon className="h-7 w-7 text-blue-600 transition-colors duration-500 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700 leading-tight">{service.title}</h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <TestimonialSection testimonials={testimonials} />

            {/* Why Romania - Generic */}
            <div className="bg-gray-50 py-16 border-y border-gray-100">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-8">
                        <span className="text-4xl text-[#002B7F] font-bold">{dynamicStats.experienceYears}</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#101B35] mb-6 underline decoration-[#FCD116] underline-offset-8">
                        {dynamicStats.experienceYears.replace('+', '')} Years of Excellence in Education Consulting
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-10">
                        Our team provides guidance to students researching medical education in Romania. Confirm institution details and admissions directly with each university.
                    </p>
                    <p className="text-lg text-gray-500 italic max-w-3xl mx-auto">
                        &quot;Our mission has always been to simplify the complex world of international medical admissions, making premium education accessible to students of all backgrounds globally.&quot;
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 relative overflow-hidden border-t-4 border-t-[#FCD116]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Start Your <span className="text-[#FCD116]">MBBS Journey?</span></h2>
                    <p className="text-blue-100 text-xl mb-12 font-light">Join the global community of students pursuing their medical careers in Romania. Get personalized guidance from our experts today.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/contact-us" className="bg-[#FCD116] text-[#101B35] hover:bg-[#ffe359] font-bold px-12 py-5 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5" /> Book Free Consultation
                        </Link>
                        <Link href="/universities" className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 py-5 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2">
                            Browse Programs <ArrowRight className="w-5 h-5 text-[#FCD116]" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
