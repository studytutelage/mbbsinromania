import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2, Globe2, Languages, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getAboutCountryContent } from "@/lib/public-page-content";
import { attractions as romaniaAttractions } from "@/data/Romania-facts";

export const metadata: Promise<Metadata> = buildMetadata({
    title: "About Romania | Study and Student Life",
    description: "Explore Romania, its university cities, languages, climate, and practical considerations for international students researching medical education.",
    entitySeo: { metaKeyword: "Romania, study in Romania, medical education Romania, MBBS in Romania" },
    path: "/about-romania",
    pageKey: "about-romania",
});

export default async function AboutRomaniaPage() {
    const content = await getAboutCountryContent();
    const factValues = new Map(content.summaryStats.map((item) => [item.label, item.value]));
    const facts = [
        { label: "Capital", value: factValues.get("Capital") || "Bucharest", icon: Building2 },
        { label: "Languages", value: factValues.get("Languages") || "Romanian (English medium)", icon: Languages },
        { label: "Currency", value: factValues.get("Currency") || "Romanian Leu (RON)", icon: BookOpen },
        { label: "Location", value: content.location, icon: MapPin },
        { label: "Timezone", value: content.timezone, icon: Globe2 },
        { label: "Highest point", value: `${content.highestPeak} (${content.highestPeakHeight})`, icon: Globe2 },
    ];
    const places = content.attractions.length > 0
        ? content.attractions
        : romaniaAttractions.map((item) => ({ title: item.name, description: item.desc, theme: "blue" as const }));

    return (
        <main className="bg-white text-[#101B35]">
            <section className="border-b border-slate-200 bg-[#F0F5FF]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
                    <p className="text-sm font-bold uppercase tracking-wider text-[#002B7F] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FCD116] inline-block"></span>
                        Country Guide
                    </p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl text-[#101B35]">About Romania</h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                        {content.heroDescription || "Romania is an EU and Schengen member state in Southeastern Europe. Explore its university cities, culture, and practical information before making study plans."}
                    </p>
                    <Link href="/universities" className="mt-7 inline-flex items-center gap-2 font-bold text-[#002B7F] hover:text-[#001F5C] transition-colors">
                        Browse medical universities <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <h2 className="text-2xl font-bold text-[#101B35]">Romania at a glance</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {facts.map(({ label, value, icon: Icon }) => (
                        <article key={label} className="border-l-4 border-l-[#FCD116] bg-[#F5F7FA] p-5 rounded-r-lg shadow-sm">
                            <div className="flex items-center gap-3 text-[#002B7F]">
                                <Icon className="h-5 w-5" />
                                <h3 className="font-bold">{label}</h3>
                            </div>
                            <p className="mt-3 text-slate-700">{value}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-y border-slate-200 bg-[#F5F7FA]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <h2 className="text-2xl font-bold text-[#101B35]">Before choosing a program</h2>
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                        {[
                            "Confirm the degree title, program length, and language of instruction directly with the university.",
                            "Check current recognition and licensing requirements with the regulator where you intend to practise.",
                            "Verify tuition, insurance, visa, and residence requirements with official sources before paying fees.",
                        ].map((item, index) => (
                            <p key={item} className="border-t-2 border-[#002B7F] pt-4 leading-7 text-slate-700 bg-white p-5 rounded-b-lg shadow-sm">
                                <span className="mr-2 font-bold text-[#002B7F]">0{index + 1}.</span>{item}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {content.cities.length > 0 ? (
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <h2 className="text-2xl font-bold text-[#101B35]">Cities</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {content.cities.slice(0, 3).map((city) => (
                            <article key={city.title} className="border-t-4 border-t-[#002B7F] bg-white p-5 rounded-b-lg shadow-sm">
                                <h3 className="text-lg font-bold text-[#101B35]">{city.title}</h3>
                                <p className="mt-2 leading-7 text-slate-600">{city.description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <h2 className="text-2xl font-bold text-[#101B35]">Places to explore</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {places.slice(0, 4).map((place) => (
                        <article key={place.title} className="border-t-4 border-t-[#FCD116] bg-white p-5 rounded-b-lg shadow-sm">
                            <h3 className="font-bold text-[#101B35]">{place.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{place.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
