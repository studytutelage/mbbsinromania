import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AgentDashboardPage() {
    const session = await auth();
    const agentId = Number(session?.user?.id);

    const [totalLeads, pendingLeads, processedLeads, recentLeads] = await Promise.all([
        prisma.leadInquiry.count({ where: { agentId } }),
        prisma.leadInquiry.count({ where: { agentId, status: "pending" } }),
        prisma.leadInquiry.count({ where: { agentId, status: { not: "pending" } } }),
        prisma.leadInquiry.findMany({
            where: { agentId },
            include: { lead: true },
            orderBy: { createdAt: "desc" },
            take: 8,
        }),
    ]);

    const stats = [
        { label: "Total Referrals", value: totalLeads, icon: Users, color: "blue" },
        { label: "Pending", value: pendingLeads, icon: Clock, color: "orange" },
        { label: "Processed", value: processedLeads, icon: CheckCircle, color: "green" },
        { label: "Conversion", value: totalLeads ? `${Math.round((processedLeads / totalLeads) * 100)}%` : "0%", icon: TrendingUp, color: "purple" },
    ];

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700",
            contacted: "bg-blue-100 text-blue-700",
            enrolled: "bg-green-100 text-green-700",
            rejected: "bg-blue-100 text-blue-700",
        };
        return map[status] ?? "bg-gray-100 text-gray-700";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {session?.user?.name} 👋</h1>
                <p className="text-gray-500 mt-1">Here's a summary of your referral activity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-500 font-medium">{label}</p>
                            <div className={`w-9 h-9 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                                <Icon size={16} className={`text-${color}-600`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/agent/add-lead" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 flex items-center gap-4 transition-colors">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="font-semibold">Add New Lead</p>
                        <p className="text-blue-100 text-sm">Refer a new student</p>
                    </div>
                </Link>
                <Link href="/agent/leads" className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-5 flex items-center gap-4 transition-colors">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-slate-600" />
                    </div>
                    <div>
                        <p className="font-semibold">View All Leads</p>
                        <p className="text-gray-500 text-sm">{totalLeads} total referrals</p>
                    </div>
                </Link>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Recent Referrals</h3>
                </div>
                {recentLeads.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Users size={32} className="mx-auto mb-3 opacity-40" />
                        <p>No leads yet. <Link href="/agent/add-lead" className="text-blue-600 underline">Add your first lead →</Link></p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {recentLeads.map(inq => (
                            <div key={inq.id} className="px-5 py-3.5 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{inq.lead.name}</p>
                                    <p className="text-xs text-gray-400">{inq.lead.email} {inq.universityName ? `· ${inq.universityName}` : ""}</p>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(inq.status ?? "pending")}`}>
                                    {inq.status ?? "pending"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
