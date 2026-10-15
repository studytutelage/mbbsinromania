import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    Users,
    GraduationCap,
    Award,
    MessageSquare,
    FileText,
    TrendingUp,
    Eye,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
    const [
        universities,
        scholarships,
        leads,
        blogs,
        users,
        verifiedLeads,
        recentVerifiedLeads,
        recentLeads,
        recentBlogs,
    ] = await Promise.all([
        prisma.university.count({ where: { status: true } }),
        prisma.scholarship.count({ where: { isActive: true } }),
        prisma.lead.count({ where: { deletedAt: null } }),
        prisma.blog.count({ where: { status: true } }),
        prisma.user.count(),
        prisma.lead.count({ where: { emailVerified: true, deletedAt: null } }),
        prisma.lead.findMany({
            take: 8,
            orderBy: { emailVerifiedAt: "desc" },
            where: { emailVerified: true, deletedAt: null },
            select: { id: true, name: true, email: true, phone: true, emailVerifiedAt: true, createdAt: true },
        }),
        prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            where: { deletedAt: null },
            select: { id: true, name: true, email: true, phone: true, createdAt: true },
        }),
        prisma.blog.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, slug: true, createdAt: true },
        }),
    ]);

    return { universities, scholarships, leads, blogs, users, verifiedLeads, recentVerifiedLeads, recentLeads, recentBlogs };
}

export default async function AdminDashboardPage() {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session || (role !== "admin" && role !== "employee")) {
        redirect("/admin/login");
    }
    const stats = await getDashboardStats();

    const cards = [
        { label: "Universities", value: stats.universities, icon: GraduationCap, color: "bg-blue-500", href: "/admin/universities" },
        { label: "Scholarships", value: stats.scholarships, icon: Award, color: "bg-yellow-500", href: "/admin/scholarships" },
        { label: "Leads (CRM)", value: stats.leads, icon: MessageSquare, color: "bg-green-500", href: "/admin/leads" },
        { label: "Registered Users", value: stats.verifiedLeads, icon: TrendingUp, color: "bg-indigo-500", href: "/admin/registered-users" },
        { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "bg-purple-500", href: "/admin/blogs" },
        { label: "Admin Users", value: stats.users, icon: Users, color: "bg-red-500", href: "/admin/users" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, {session?.user?.name}. Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
                    >
                        <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                            <card.icon size={20} className="text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-0.5 group-hover:text-gray-700">{card.label}</p>
                    </Link>
                ))}
            </div>

            {/* Registered Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-500" /> Registered Users
                        <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{stats.verifiedLeads}</span>
                    </h2>
                    <Link href="/admin/registered-users" className="text-xs text-red-600 hover:underline">View all →</Link>
                </div>
                {stats.recentVerifiedLeads.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No registered users yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Name</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Email</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Phone</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 pb-2">Verified On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentVerifiedLeads.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 pr-4 font-medium text-gray-800">{u.name}</td>
                                        <td className="py-2.5 pr-4 text-gray-500">{u.email}</td>
                                        <td className="py-2.5 pr-4 text-gray-500">{u.phone || "—"}</td>
                                        <td className="py-2.5 text-gray-400 text-xs">
                                            {u.emailVerifiedAt
                                                ? new Date(u.emailVerifiedAt).toLocaleDateString("en-IN")
                                                : new Date(u.createdAt).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MessageSquare size={16} className="text-green-500" /> Recent Leads
                        </h2>
                        <Link href="/admin/leads" className="text-xs text-red-600 hover:underline">View all →</Link>
                    </div>
                    {stats.recentLeads.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No leads yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                                        <p className="text-xs text-gray-400">{lead.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Blogs */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText size={16} className="text-purple-500" /> Recent Blog Posts
                        </h2>
                        <Link href="/admin/blogs" className="text-xs text-red-600 hover:underline">View all →</Link>
                    </div>
                    {stats.recentBlogs.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No posts yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentBlogs.map((blog) => (
                                <div key={blog.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div className="min-w-0 flex-1 pr-3">
                                        <p className="text-sm font-medium text-gray-800 truncate">{blog.title}</p>
                                        <p className="text-xs text-gray-400">/{blog.slug}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Add University", href: "/admin/universities/create" },
                        { label: "Add Blog Post", href: "/admin/blogs/create" },
                        { label: "Add Scholarship", href: "/admin/scholarships/create" },
                        { label: "View Leads", href: "/admin/leads" },
                        { label: "Website Settings", href: "/admin/settings" },
                        { label: "Manage FAQs", href: "/admin/faqs" },
                    ].map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-700 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
