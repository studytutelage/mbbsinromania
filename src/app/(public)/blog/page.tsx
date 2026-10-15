import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "MBBS Romania Blog — Medical Education Tips, University Reviews & More",
    description: "Read our expert blog on MBBS in Romania. University reviews, student experiences, admission tips, and medical education guides.",
    path: "/blog",
    entitySeo: { metaKeyword: "MBBS Romania blog, medical education Romania, study abroad blog" },
    pageKey: "blog",
});

export const revalidate = 1800;

export default async function BlogPage() {
    const [categories, recentBlogs] = await Promise.all([
        prisma.blogCategory.findMany({
            where: { status: true },
            include: { _count: { select: { blogs: { where: { status: true } } } } },
            orderBy: { id: "asc" },
        }).catch(() => []),
        prisma.blog.findMany({
            where: { status: true },
            include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 12,
        }).catch(() => []),
    ]);

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Blog &amp; News</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Expert insights on MBBS in Romania, admission tips, university reviews, and student success stories.
                    </p>
                </div>
            </div>

            {/* Content Type Tabs */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex gap-1">
                        {[
                            { label: "✍️ Blog", href: "/blog" },
                            { label: "📰 News", href: "/news" },
                            { label: "📄 Articles", href: "/articles" },
                        ].map((tab) => (
                            <a
                                key={tab.href}
                                href={tab.href}
                                className="px-6 py-4 text-sm font-semibold text-gray-600 hover:text-[#002B7F] border-b-2 border-transparent hover:border-[#FCD116] transition-colors"
                            >
                                {tab.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main posts */}
                    <div className="lg:col-span-3">
                        {recentBlogs.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <p>No blog posts available yet. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-8">
                                {recentBlogs.map((blog) => (
                                    <article key={blog.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group relative flex flex-col">
                                        <Link href={`/blog/${blog.category.slug}/${blog.slug}`} className="absolute inset-0 z-10">
                                            <span className="sr-only">Read {blog.title}</span>
                                        </Link>
                                        <div className="relative aspect-[1023/614] overflow-hidden">
                                            <Image
                                                src={cdn(blog.thumbnailPath || blog.imagePath) || "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600"}
                                                alt={blog.title || "Blog post"}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3 z-20">
                                                <Link
                                                    href={`/blog/${blog.category.slug}`}
                                                    className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-700 relative z-20"
                                                >
                                                    {blog.category.name}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h2 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors relative z-0">
                                                {blog.title}
                                            </h2>
                                            {blog.shortnote && (
                                                <div className="text-gray-600 text-sm mb-4 line-clamp-2 prose prose-sm max-w-none prose-p:my-0 relative z-0" dangerouslySetInnerHTML={{ __html: blog.shortnote }} />
                                            )}
                                            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto relative z-0">
                                                <div className="flex items-center space-x-3">
                                                    {blog.author && (
                                                        <span className="flex items-center space-x-1">
                                                            <User className="w-3 h-3" />
                                                            <span>{blog.author.name}</span>
                                                        </span>
                                                    )}
                                                    <span className="flex items-center space-x-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    </span>
                                                </div>
                                                <span className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                                                    <span>Read</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar — categories */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/blog/${cat.slug}`}
                                            className="flex items-center justify-between text-gray-600 hover:text-blue-600 py-2 border-b border-gray-50 last:border-0 transition-colors"
                                        >
                                            <span className="text-sm">{cat.name}</span>
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                {cat._count.blogs}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
