import Link from "next/link";
import { Shield, ChevronRight, Lock, Eye, FileText, UserCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata({
        title: "Privacy Policy — MBBS in Romania",
        description: "Our privacy policy outlines how we collect, use, and protect your information.",
        path: "/privacy-policy",
    });
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-outfit">
            {/* Premium Hero Section */}
            <div className="relative bg-gray-900 pt-32 pb-48 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <nav className="flex items-center justify-center space-x-2 text-amber-400/80 text-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white font-medium">Privacy Policy</span>
                    </nav>
                    
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-6 animate-in zoom-in duration-1000">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Privacy <span className="text-blue-500">Policy</span>
                    </h1>
                    
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Your privacy is our priority. This policy outlines how we protect and manage the information you entrust to us.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 -mt-32 pb-24 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-16">
                    <div className="flex justify-between items-center mb-12 border-b border-gray-50 pb-8 uppercase tracking-widest text-[10px] font-bold text-gray-400">
                        <span>Legal Document</span>
                        <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>

                    <div className="space-y-16">
                        <section className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <FileText className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">1. Introduction</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-blue-600 transition-colors duration-300">
                                At MBBS in Romania, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Eye className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">2. Data Collection</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 pl-2">
                                {[
                                    { title: "Identity Data", desc: "Names, usernames, and identifiers for personalized service." },
                                    { title: "Contact Data", desc: "Email addresses and phone numbers for verification." },
                                    { title: "Technical Data", desc: "IP addresses, browser types, and device information." },
                                    { title: "Usage Data", desc: "How you interact with our platform to improve experience." }
                                ].map((item) => (
                                    <div key={item.title} className="p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border border-transparent hover:border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <Lock className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">3. Security Measures</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-blue-600 transition-colors duration-300">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We use enterprise-grade encryption for all data transmissions.
                            </p>
                        </section>

                        <section className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <UserCheck className="w-6 h-6 text-blue-600 group-hover:text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">4. Your Rights</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-blue-600 transition-colors duration-300">
                                You have the right to request access, correction, or erasure of your personal data. You may also object to processing of your personal data or request a restriction of processing.
                            </p>
                        </section>

                        <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h4 className="font-bold text-blue-900 mb-1 leading-tight text-xl">Have questions about your data?</h4>
                                <p className="text-blue-700 text-sm opacity-80">Our privacy team is here to help you understand your rights.</p>
                            </div>
                            <Link href="/contact-us" className="whitespace-nowrap px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                                Contact Privacy Team
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
