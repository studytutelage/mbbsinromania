import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ChevronRight, ArrowRight, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 1800;

interface Props { params: Promise<{ categorySlug: string }> }

export async function generateStaticParams() {
    const cats = await prisma.newsCategory.findMany({
        where: { status: true },
        select: { slug: true },
    }).catch(() => []);
    return cats.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categorySlug } = await params;
    const cat = await prisma.newsCategory.findUnique({
        where: { slug: categorySlug },
        select: { name: true, description: true, metaTitle: true, metaDescription: true },
    }).catch(() => null);
    if (!cat) return { title: "News Category Not Found" };
    return buildMetadata({
        title: cat.metaTitle || `${cat.name} — MBBS Romania News`,
        description: cat.metaDescription || cat.description || `Latest news about ${cat.name} — MBBS in Romania.`,
        path: `/news/${categorySlug}`,
    });
}

export default async function NewsCategoryPage({ params }: Props) {
    const { categorySlug } = await params;

    const [category, categories] = await Promise.all([
        prisma.newsCategory.findUnique({
            where: { slug: categorySlug },
            include: {
                news: {
                    where: { status: true },
                    orderBy: { createdAt: "desc" },
                    select: { id: true, title: true, slug: true, shortnote: true, thumbnailPath: true, createdAt: true, author: { select: { name: true } }, category: { select: { slug: true } } },
                },
            },
        }).catch(() => null),
        prisma.newsCategory.findMany({ where: { status: true }, select: { id: true, name: true, slug: true, _count: { select: { news: { where: { status: true } } } } } }).catch(() => []),
    ]);

    if (!category) notFound();

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "News", url: "/news" },
        { name: category.name, url: `/news/${category.slug}` },
    ]);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/news" className="hover:text-blue-600">News</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </div>
                </div>

                {/* Hero */}
                <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-12 border-b-4 border-b-[#FCD116]">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">{category.name}</h1>
                        {category.description && <p className="text-blue-100 max-w-2xl mx-auto">{category.description}</p>}
                        <p className="text-[#FCD116] font-semibold text-sm mt-2">{category.news.length} article{category.news.length !== 1 ? "s" : ""}</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            {category.news.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No news in this category yet.</p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {category.news.map((item) => (
                                        <Link key={item.id} href={`/news/${category.slug}/${item.slug ?? ""}`}
                                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                            <div className="relative h-48 bg-blue-50">
                                                {item.thumbnailPath ? (
                                                    <Image
                                                        src={cdn(item.thumbnailPath)}
                                                        alt={item.title ?? "News"}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                                                        <span className="text-blue-300 text-4xl font-bold">{(item.title ?? "N")[0]}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h2 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h2>
                                                {item.shortnote && <div className="text-sm text-gray-500 line-clamp-2 mb-3 prose prose-sm max-w-none prose-p:my-0" dangerouslySetInnerHTML={{ __html: item.shortnote }} />}
                                                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                                                    <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{item.author?.name ?? "Admin"}</span></div>
                                                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <h3 className="font-bold text-gray-900 mb-4">All Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link href={`/news/${cat.slug}`} className={`flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0 transition-colors ${cat.slug === categorySlug ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`}>
                                                <span>{cat.name}</span>
                                                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{cat._count.news}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center">
                                <h3 className="font-bold text-lg mb-2">Study MBBS in Romania</h3>
                                <p className="text-blue-100 text-sm mb-4">Get free expert counseling today</p>
                                <Link href="/contact-us" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                                    Contact Us <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
