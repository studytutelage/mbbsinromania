"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { homepageFaqs } from "@/lib/homepage-faqs";

interface HomepageFAQProps {
    dynamicFaqs?: Array<{ question: string; answer: string }>;
}

export default function HomepageFAQ({ dynamicFaqs }: HomepageFAQProps) {
    const displayFaqs = (dynamicFaqs && dynamicFaqs.length > 0) ? dynamicFaqs : homepageFaqs;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-16 bg-white border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#F0F5FF] border border-[#002B7F]/20 p-3.5 rounded-2xl shadow-sm">
                            <HelpCircle className="w-8 h-8 text-[#002B7F]" />
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#F0F5FF] text-[#002B7F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#002B7F]/15">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        Got Questions? We Have Answers
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#101B35] mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-base lg:text-lg text-slate-600">
                        Everything you need to know about studying MBBS in Romania as an Indian student.
                    </p>
                </div>

                <div className="space-y-3.5">
                    {displayFaqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#002B7F] shadow-md bg-white border-t-4 border-t-[#FCD116]' : 'border-slate-200 bg-[#F5F7FA] hover:border-slate-300'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`font-bold text-base sm:text-lg pr-4 ${isOpen ? 'text-[#002B7F]' : 'text-[#101B35]'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#002B7F]' : 'text-slate-400'}`} />
                                </button>
                                
                                <div 
                                    className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-sm sm:text-base">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
