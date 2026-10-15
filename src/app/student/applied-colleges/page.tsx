import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle, Clock, XCircle, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppliedCollegesPage() {
    const session = await auth();
    const userEmail = session?.user?.email;

    const lead = userEmail
        ? await prisma.lead.findUnique({
            where: { email: userEmail },
            include: {
                inquiries: {
                    orderBy: { createdAt: "desc" },
                },
            },
        }).catch(() => null)
        : null;

    const inquiries = lead?.inquiries ?? [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "contacted": return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "rejected": return <XCircle className="w-4 h-4 text-blue-600" />;
            default: return <Clock className="w-4 h-4 text-yellow-600" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "contacted": return "bg-green-100 text-green-700";
            case "rejected": return "bg-blue-100 text-blue-700";
            default: return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Applied Colleges</h1>
                <p className="text-gray-500 mt-1">Track all your university inquiries and application statuses.</p>
            </div>

            {inquiries.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="w-14 h-14 text-amber-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h2>
                    <p className="text-gray-500 text-center max-w-sm mb-8">
                        {`You haven't applied to any colleges yet. Browse our universities and find your ideal MBBS program in Romania.`}
                    </p>
                    <Link
                        href="/universities"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                    >
                        Browse Universities
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { label: "Total", value: inquiries.length, color: "text-gray-800", bg: "bg-gray-50" },
                            { label: "Contacted", value: inquiries.filter(i => i.status === "contacted").length, color: "text-green-700", bg: "bg-green-50" },
                            { label: "Pending", value: inquiries.filter(i => i.status === "pending").length, color: "text-yellow-700", bg: "bg-yellow-50" },
                        ].map(s => (
                            <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Inquiry cards */}
                    {inquiries.map((inq) => (
                        <div key={inq.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {inq.universityName || "General Inquiry"}
                                        </h3>
                                        {inq.message && (
                                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{inq.message}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span>Submitted {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                            {inq.source && <span className="capitalize">via {inq.source.replace(/-/g, " ")}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${getStatusStyle(inq.status)}`}>
                                        {getStatusIcon(inq.status)}
                                        {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Browse more CTA */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Looking for more options?</h3>
                            <p className="text-sm text-gray-600">Explore all universities and programs available in Romania.</p>
                        </div>
                        <Link
                            href="/universities"
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shrink-0 ml-4"
                        >
                            Browse <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
