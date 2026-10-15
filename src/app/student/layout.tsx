import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, FileText, Bell, Settings, LogOut, LayoutDashboard, BookOpen, UserCog } from "lucide-react";
import ChatWidget from "@/components/student/ChatWidget";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

    if (!session || user?.role !== "student") {
        redirect("/login?redirect=/student");
    }

    const navItems = [
        { href: "/student", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
        { href: "/student/applications", icon: <FileText className="w-5 h-5" />, label: "My Applications" },
        { href: "/student/applied-colleges", icon: <BookOpen className="w-5 h-5" />, label: "Applied Colleges" },
        { href: "/student/notifications", icon: <Bell className="w-5 h-5" />, label: "Notifications" },
        { href: "/student/settings", icon: <Settings className="w-5 h-5" />, label: "Profile Settings" },
        { href: "/student/account-settings", icon: <UserCog className="w-5 h-5" />, label: "Account Settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-800">MBBS Romania</div>
                            <div className="text-xs text-gray-500">Student Portal</div>
                        </div>
                    </Link>
                </div>

                {/* User info */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                                {user?.name?.substring(0, 2).toUpperCase() || "ST"}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-gray-800 text-sm truncate">{user?.name || "Student"}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 flex-1">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="group-hover:text-blue-600">{item.icon}</span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <form action="/api/auth/signout" method="POST">
                        <button
                            type="submit"
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
                {children}
                <ChatWidget />
            </main>
        </div>
    );
}
