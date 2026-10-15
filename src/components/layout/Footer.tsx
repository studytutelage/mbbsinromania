import Link from "next/link";
import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { prisma } from "@/lib/prisma";

const quickLinks = [
    { name: "Universities", path: "/universities" },
    { name: "About Romania", path: "/about-romania" },
    { name: "Compare Universities", path: "/compare" },
    { name: "Education System", path: "/education-system" },
    { name: "Contact Us", path: "/contact-us" },
];

const services = [
    { name: "Admission Assistance", href: "/apply" },
    { name: "Application Guide", href: "/apply" },
    { name: "Visa Support", href: "/contact-us" },
    { name: "Accommodation Help", href: "/contact-us" },
    { name: "Career Guidance", href: "/contact-us" },
];

const resources = [
    { name: "Application Guide", href: "/apply" },
    { name: "Scholarship Guide", href: "/scholarships" },
    { name: "Country Information", href: "/about-romania" },
    { name: "FMGE Pass Rates", href: "/fmge-rates" },
    { name: "Sitemap", href: "/sitemap.xml" },
];

export default async function Footer() {
    // Fetch top 5 universities
    const topUnis = await prisma.university.findMany({
        where: { status: true },
        select: { name: true, slug: true },
        take: 5,
        orderBy: { isFeatured: 'desc' },
    }).catch(() => []);

    const universities = [
        ...topUnis.map(u => ({ name: u.name, href: `/universities/${u.slug}` })),
        { name: "View All Universities", href: "/universities" },
    ];

    return (
        <footer className="bg-[#101B35] text-white relative">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-11 h-11 bg-[#002B7F] ring-2 ring-[#FCD116] rounded-xl flex items-center justify-center shadow-md">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">MBBS in Romania</h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-[#FCD116] flex-shrink-0" />
                                <span className="text-slate-300 text-sm font-medium">+91 9667 667 331</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-[#FCD116] flex-shrink-0" />
                                <span className="text-slate-300 text-sm font-medium">info@mbbsinromania.com</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-[#FCD116] flex-shrink-0 mt-0.5" />
                                <span className="text-slate-300 text-sm leading-relaxed">
                                    B-16 Ground Floor, Mayfield Garden, Sector 50, Gurugram, Haryana 122018
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-[#FCD116] mb-3">Follow Us</h4>
                            <div className="flex space-x-3">
                                {[
                                    { Icon: Facebook, href: "https://facebook.com/mbbsinRomania", label: "Facebook" },
                                    { Icon: Twitter, href: "https://twitter.com/mbbsinRomania", label: "Twitter" },
                                    { Icon: Instagram, href: "https://instagram.com/mbbsinRomania", label: "Instagram" },
                                    { Icon: Youtube, href: "https://youtube.com/@mbbsinRomania", label: "YouTube" },
                                ].map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-[#182647] border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:bg-[#002B7F] hover:text-[#FCD116] hover:border-[#FCD116]/50 transition-all shadow-sm"
                                        aria-label={label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <span>Quick Links</span>
                            <span className="w-4 h-0.5 bg-[#FCD116] inline-block" />
                        </h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link href={link.path} className="text-slate-300 hover:text-[#FCD116] transition-colors text-sm font-medium block hover:translate-x-1 duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Universities */}
                    <div>
                        <h4 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <span>Top Universities</span>
                            <span className="w-4 h-0.5 bg-[#FCD116] inline-block" />
                        </h4>
                        <ul className="space-y-2.5">
                            {universities.map((u, index) => (
                                <li key={index}>
                                    <Link href={u.href} className="text-slate-300 hover:text-[#FCD116] transition-colors text-sm font-medium block hover:translate-x-1 duration-200">
                                        {u.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <span>Our Services</span>
                            <span className="w-4 h-0.5 bg-[#FCD116] inline-block" />
                        </h4>
                        <ul className="space-y-2.5">
                            {services.map((s) => (
                                <li key={s.name}>
                                    <Link href={s.href} className="text-slate-300 hover:text-[#FCD116] transition-colors text-sm font-medium block hover:translate-x-1 duration-200">
                                        {s.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                            <span>Resources</span>
                            <span className="w-4 h-0.5 bg-[#FCD116] inline-block" />
                        </h4>
                        <ul className="space-y-2.5">
                            {resources.map((r) => (
                                <li key={r.name}>
                                    <Link href={r.href} className="text-slate-300 hover:text-[#FCD116] transition-colors text-sm font-medium block hover:translate-x-1 duration-200">
                                        {r.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-[#182647] bg-[#0c1427]">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                            <span>© {new Date().getFullYear()} MBBS in Romania</span>
                            <span className="text-[#CE1126]">•</span>
                            <span className="text-slate-300 font-medium">Trusted Partner for Medical Education in Romania</span>
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/privacy-policy" className="text-slate-400 hover:text-[#FCD116] transition-colors">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="text-slate-400 hover:text-[#FCD116] transition-colors">Terms of Service</Link>
                            <Link href="/cookie-policy" className="text-slate-400 hover:text-[#FCD116] transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
