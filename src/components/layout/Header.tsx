"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, GraduationCap, User } from "lucide-react";

const resourcesMenu = [
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "About Romania", path: "/about-romania" },
    { name: "Education System", path: "/education-system" },
    { name: "View Our Partners", path: "/our-partners" },
    { name: "Blog & News", path: "/blog" },
];

function getInitials(name: string): string {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
}

export default function Header({ showScholarship = true }: { showScholarship?: boolean }) {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    const isLoggedIn = !!session?.user && (session.user as { role?: string }).role === "student";
    const userInitials = session?.user?.name ? getInitials(session.user.name) : "";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <header
            className={`bg-white sticky top-0 z-50 transition-shadow duration-200 border-b border-gray-100 ${scrolled ? "shadow-md" : "shadow-sm"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-2.5">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 cursor-pointer group transition-opacity"
                    >
                        <div className="w-11 h-11 bg-[#002B7F] ring-2 ring-[#FCD116] rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-[#101B35] tracking-tight">MBBS in Romania</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-7">
                        <Link href="/" className="text-[#101B35] hover:text-[#002B7F] font-medium transition-colors relative py-1 group">
                            <span>Home</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCD116] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link
                            href="/universities"
                            className="text-[#101B35] hover:text-[#002B7F] font-medium transition-colors relative py-1 group"
                        >
                            <span>Universities</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCD116] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link
                            href="/compare"
                            className="text-[#101B35] hover:text-[#002B7F] font-medium transition-colors relative py-1 group"
                        >
                            <span>Compare</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCD116] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        {showScholarship && (
                            <Link
                                href="/scholarships"
                                className="text-[#101B35] hover:text-[#002B7F] font-medium transition-colors relative py-1 group"
                            >
                                <span>Scholarships</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FCD116] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        )}

                        {/* Resources Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown("resources")}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center space-x-1 text-[#101B35] hover:text-[#002B7F] font-medium transition-colors py-1 group" suppressHydrationWarning={true}>
                                <span>Resources</span>
                                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-[#002B7F] transition-colors" />
                            </button>
                            {activeDropdown === "resources" && (
                                <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-xl mt-1 p-3 border border-gray-100 border-t-2 border-t-[#FCD116]">
                                    <ul className="space-y-1">
                                        {resourcesMenu.map((item) => (
                                            <li key={item.path}>
                                                <Link
                                                    href={item.path}
                                                    className="block text-[#101B35]/80 hover:text-[#002B7F] hover:bg-[#F0F5FF] px-3 py-2 rounded-lg text-sm transition-colors font-medium"
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {isLoggedIn ? (
                            <div className="relative group">
                                <Link
                                    href="/student"
                                    className="w-10 h-10 bg-[#002B7F] text-white rounded-full flex items-center justify-center font-semibold hover:bg-[#001F5C] ring-2 ring-[#FCD116]/60 transition-colors shadow-sm"
                                    aria-label="Go to dashboard"
                                >
                                    {userInitials || <User className="w-5 h-5" />}
                                </Link>
                                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                                    <div className="bg-white border shadow-xl rounded-xl p-3 min-w-[150px] border-t-2 border-t-[#FCD116]">
                                        <Link
                                            href="/student"
                                            className="block py-1.5 px-2 text-sm text-[#101B35] hover:text-[#002B7F] hover:bg-[#F0F5FF] rounded-lg font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="w-full text-left py-1.5 px-2 text-sm text-[#101B35] hover:text-[#CE1126] hover:bg-red-50 rounded-lg font-medium"
                                            suppressHydrationWarning={true}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/apply"
                                    className="bg-[#002B7F] text-white px-5 py-2.5 rounded-lg hover:bg-[#001F5C] shadow-sm hover:shadow transition-all text-sm font-semibold flex items-center gap-1.5"
                                >
                                    <span>Apply Now</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FCD116]" />
                                </Link>
                                <Link
                                    href="/register"
                                    className="border-2 border-[#002B7F] text-[#002B7F] px-4 py-2 rounded-lg hover:bg-[#F0F5FF] transition-colors text-sm font-semibold"
                                >
                                    Sign-Up
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden p-2 text-[#101B35] hover:text-[#002B7F]" onClick={() => setIsMenuOpen(!isMenuOpen)} suppressHydrationWarning={true} aria-label="Toggle mobile menu" aria-expanded={isMenuOpen}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-100">
                        <nav className="space-y-3">
                            <Link href="/" onClick={closeMenu} className="block text-[#101B35] hover:text-[#002B7F] font-medium py-1">
                                Home
                            </Link>
                            <Link href="/universities" onClick={closeMenu} className="block text-[#101B35] hover:text-[#002B7F] font-medium py-1">
                                Universities
                            </Link>
                            <Link href="/compare" onClick={closeMenu} className="block text-[#101B35] hover:text-[#002B7F] font-medium py-1">
                                Compare Universities
                            </Link>
                            {showScholarship && (
                                <Link href="/scholarships" onClick={closeMenu} className="block text-[#101B35] hover:text-[#002B7F] font-medium py-1">
                                    Scholarships
                                </Link>
                            )}

                            {/* Mobile Resources */}
                            <div className="border-t border-gray-100 pt-2">
                                <button
                                    className="flex items-center justify-between w-full text-[#101B35] hover:text-[#002B7F] font-medium py-1"
                                    onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                                    suppressHydrationWarning={true}
                                >
                                    <span>Resources</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
                                </button>
                                {activeDropdown === "resources" && (
                                    <div className="mt-2 pl-3 space-y-1.5 border-l-2 border-[#FCD116]">
                                        {resourcesMenu.map((item) => (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={closeMenu}
                                                className="block text-gray-600 hover:text-[#002B7F] text-sm py-1 font-medium transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isLoggedIn ? (
                                <div className="pt-2 space-y-2">
                                    <Link
                                        href="/student"
                                        onClick={closeMenu}
                                        className="block bg-[#F0F5FF] text-[#002B7F] px-4 py-2.5 rounded-lg text-center font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { closeMenu(); signOut({ callbackUrl: "/" }); }}
                                        className="w-full block bg-red-50 text-[#CE1126] px-4 py-2.5 rounded-lg text-center font-medium"
                                        suppressHydrationWarning={true}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                    <Link
                                        href="/apply"
                                        onClick={closeMenu}
                                        className="block bg-[#002B7F] text-white px-4 py-2.5 rounded-lg text-center font-semibold shadow-sm"
                                    >
                                        Apply Now
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={closeMenu}
                                        className="block border-2 border-[#002B7F] text-[#002B7F] px-4 py-2.5 rounded-lg text-center font-semibold"
                                    >
                                        Sign-Up
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
