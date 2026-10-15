"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck, ArrowRight } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Delay showing to ensure it's not too jarring
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-6 relative overflow-hidden group">
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-blue-500/20" />
                
                <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 shrink-0">
                            <Cookie className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Cookie Policy
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed mt-1">
                                We use cookies to enhance your journey and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                            </p>
                        </div>
                        <button 
                            onClick={handleDecline}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                            Accept All
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                        <button
                            onClick={handleDecline}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Reject All
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2 text-[10px] uppercase tracking-wider font-bold">
                        <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-600 transition-colors">
                            Privacy
                        </Link>
                        <span className="text-gray-200">•</span>
                        <Link href="/terms-of-service" className="text-gray-400 hover:text-blue-600 transition-colors">
                            Terms
                        </Link>
                        <span className="text-gray-200">•</span>
                        <Link href="/cookie-policy" className="text-gray-400 hover:text-blue-600 transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
