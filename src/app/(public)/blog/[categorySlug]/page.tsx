import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 1800;

interface Props { params: Promise<{ categorySlug: string }> }

export async function generateStaticParams() {
    const cats = await prisma.blogCategory.findMany({
        where: { status: true },
        select: { slug: true },
    }).catch(() => []);
    return cats.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categorySlug } = await params;
    const cat = await prisma.blogCategory.findUnique({
        where: { slug: categorySlug },
        select: { name: true, description: true, metaTitle: true, metaDescription: true },
    }).catch(() => null);
    if (!cat) return { title: "Blog Category Not Found" };
    return buildMetadata({
        title: cat.metaTitle || `${cat.name} — MBBS Romania Blog`,
        description: cat.metaDescription || cat.description || `Read articles about ${cat.name} — MBBS in Romania. Tips, guides, and student experiences.`,
        path: `/blog/${categorySlug}`,
    });
}

export default async function BlogCategoryPage({ params }: Props) {
    const { categorySlug } = await params;

    const [category, categories] = await Promise.all([
        prisma.blogCategory.findUnique({
            where: { slug: categorySlug },
            include: {
                blogs: {
                    where: { status: true },
                    orderBy: { createdAt: "desc" },
                    select: { id: true, title: true, slug: true, shortnote: true, thumbnailPath: true, createdAt: true, author: { select: { name: true } }, category: { select: { slug: true } } },
                },
            },
        }).catch(() => null),
        prisma.blogCategory.findMany({ where: { status: true }, select: { name: true, slug: true, _count: { select: { blogs: { where: { status: true } } } } } }).catch(() => []),
    ]);

    if (!category) notFound();

    const jsonLd = breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: category.name, url: `/blog/${category.slug}` },
    ]);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Breadcrumb */}
            <nav className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-800 font-medium">{category.name}</span>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-14 border-b-4 border-b-[#FCD116]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-4 text-[#FCD116] border border-white/20">
                        <Tag className="w-4 h-4 text-[#FCD116]" />{category.name}
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4">{category.name}</h1>
                    {category.description && <p className="text-blue-100 max-w-2xl mx-auto text-lg">{category.description}</p>}
                    <p className="text-[#FCD116] font-semibold mt-4">{category.blogs.length} article{category.blogs.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Article List */}
                    <div className="lg:col-span-3">
                        {category.blogs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <p className="text-gray-500 text-lg">No articles in this category yet.</p>
                                <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">← All Articles</Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {category.blogs.map((blog) => (
                                    <Link key={blog.id} href={`/blog/${category.slug}/${blog.slug ?? ""}`}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative aspect-[1023/614] bg-gray-100">
                                            {blog.thumbnailPath ? (
                                                <Image
                                                    src={cdn(blog.thumbnailPath) || ""}
                                                    alt={blog.title ?? "Blog post"}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                                                    <span className="text-amber-300 text-4xl font-bold">{(blog.title ?? "B")[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h2 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#002B7F] transition-colors">{blog.title}</h2>
                                            {blog.shortnote && <div className="text-sm text-gray-500 line-clamp-2 mb-3 prose prose-sm max-w-none prose-p:my-0" dangerouslySetInnerHTML={{ __html: blog.shortnote }} />}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1 text-[#002B7F] font-medium"><Calendar className="w-3 h-3 text-[#002B7F]" />{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                {blog.author?.name && <span className="flex items-center gap-1 text-[#002B7F]"><User className="w-3 h-3 text-[#002B7F]" />{blog.author.name}</span>}
                                            </div>
                                        </div>
                                    </Link>

                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4">All Categories</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <Link key={cat.slug} href={`/blog/${cat.slug}`}
                                        className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${cat.slug === categorySlug ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50 text-gray-700"}`}>
                                        <span>{cat.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{cat._count.blogs}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                            <h3 className="font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                            <p className="text-sm text-gray-600 mb-4">Talk to our counsellors for free guidance.</p>
                            <Link href="/contact-us" className="block bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                Contact Us <ArrowRight className="w-4 h-4 inline ml-1" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
