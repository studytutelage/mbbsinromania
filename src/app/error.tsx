"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GraduationCap, RefreshCw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-5xl font-black text-gray-900 mb-3">Oops!</h1>
                <h2 className="text-xl font-bold text-gray-700 mb-3">Something went wrong</h2>
                <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                    An unexpected error occurred. Our team has been notified.
                    Please try again or go back to the homepage.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-gray-400">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    );
}
