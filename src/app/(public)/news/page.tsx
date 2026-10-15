import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata } from "@/lib/seo";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "News — MBBS Romania Medical Education Updates",
    description: "Stay updated with the latest news about MBBS in Romania, medical education policies, university announcements, and student success stories.",
    entitySeo: { metaKeyword: "MBBS Romania news, medical education news, Romania university news" },
    path: "/news",
    pageKey: "news",
});

export const revalidate = 1800;

export default async function NewsPage() {
    const [categories, recentNews] = await Promise.all([
        prisma.newsCategory.findMany({
            where: { status: true },
            include: { _count: { select: { news: { where: { status: true } } } } },
            orderBy: { id: "asc" },
        }).catch(() => []),
        prisma.news.findMany({
            where: { status: true },
            include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 12,
        }).catch(() => []),
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Newspaper className="w-10 h-10 text-[#FCD116]" />
                        <h1 className="text-4xl lg:text-5xl font-extrabold">Latest News</h1>
                    </div>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Stay informed with the latest updates on MBBS in Romania, medical education, and university announcements.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main news */}
                    <div className="lg:col-span-3">
                        {recentNews.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No news articles published yet.</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {recentNews.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.category?.slug ?? ""}/${item.slug ?? ""}`}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
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
                                                    <Newspaper className="w-12 h-12 text-blue-200" />
                                                </div>
                                            )}
                                            {item.category && (
                                                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                    {item.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h2 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.title}</h2>
                                            {item.shortnote && <div className="text-sm text-gray-500 line-clamp-2 mb-3 prose prose-sm max-w-none prose-p:my-0" dangerouslySetInnerHTML={{ __html: item.shortnote }} />}
                                            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{item.author?.name ?? "Admin"}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                </div>
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
                            <h3 className="font-bold text-gray-900 mb-4">News Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link href={`/news/${cat.slug}`} className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 transition-colors py-1 border-b border-gray-50 last:border-0">
                                            <span>{cat.name}</span>
                                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{cat._count.news}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center">
                            <h3 className="font-bold text-lg mb-2">Want to Study MBBS?</h3>
                            <p className="text-blue-100 text-sm mb-4">Get free counseling from our experts</p>
                            <Link href="/contact-us" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                                Contact Us <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
