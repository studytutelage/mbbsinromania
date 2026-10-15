import {
    Mountain,
    Stethoscope,
    Star,
    GraduationCap,
    TrendingUp,
    Utensils,
    Building,
    Users,
    Plane,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cdn } from "@/lib/cdn";
import {
    essentialFacts,
    geographyPoints,
    climateZones,
    attractions,
    majorCities,
    defaultCuisines,
    transportOptions,
    visaFacts,
    mbbsHighlights,
    economyStats,
    quickFacts,
    healthcare,
    mbbsWhyStats,
    studentLifeCards,
} from "@/data/Romania-facts";

export default async function QuickFactsRomania() {
    let cuisines: {
        id: number;
        dishName: string | null;
        dishDescription: string | null;
        dishImage: string | null;
        iconClass: string | null;
    }[] = defaultCuisines;

    try {
        const dbItems = await prisma.countryCuisineLifestyle.findMany({
            where: { pageId: 1 },
            orderBy: { id: "asc" },
        });

        if (dbItems.length > 0) {
            cuisines = dbItems;
        }
    } catch {
        // Use static fallback data when DB data is unavailable.
    }

    return (
        <div>
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Quick Facts About Romania</h2>
                        <p className="text-lg text-gray-600">Key information every MBBS aspirant should know</p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {essentialFacts.map((f) => (
                            <div
                                key={f.label}
                                className={`text-center p-6 bg-gradient-to-br from-${f.color}-50 to-${f.color}-100 rounded-xl hover:shadow-lg transition-shadow`}
                            >
                                <f.icon className={`h-12 w-12 text-${f.color}-600 mx-auto mb-4`} />
                                <h3 className="text-lg font-bold text-gray-800">{f.label}</h3>
                                <p className="text-gray-600 text-sm mt-1">{f.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Mountain className="h-16 w-16 text-[#002B7F] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Geography and Climate</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            An EU member state in Southeastern Europe featuring the Carpathian Mountains, Danube River, Black Sea, and a temperate continental climate.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-t-[#FCD116]">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Geography Highlights</h3>
                            <div className="space-y-4">
                                {geographyPoints.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                        <span className="text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-t-[#002B7F]">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Climate Zones</h3>
                            <div className="space-y-4">
                                {climateZones.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                        <span className="text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#002B7F] to-[#101B35] border-t-4 border-t-[#FCD116] p-8 rounded-2xl text-white shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">Top Tourist Attractions</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {attractions.map((a) => (
                                <div key={a.name} className="text-center">
                                    <a.icon className={`h-8 w-8 mx-auto mb-2 ${a.color}`} />
                                    <h4 className="font-semibold">{a.name}</h4>
                                    <p className="text-sm text-blue-100 mt-1">{a.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-br from-[#002B7F] to-[#101B35] border-t-4 border-t-[#FCD116] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <GraduationCap className="h-16 w-16 text-[#FCD116] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold mb-4">MBBS Education Hub</h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Compare program language, current fees, clinical training, and qualification recognition directly with each university and the relevant regulators.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-10">
                        {mbbsHighlights.map((item) => (
                            <div key={item.label} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                <item.icon className="h-12 w-12 text-[#FCD116] mb-4" />
                                <h3 className="text-xl font-bold mb-3">{item.label}</h3>
                                <p className="text-blue-100">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center border border-white/10">
                        <h3 className="text-2xl font-bold mb-6">Why Choose Romania for MBBS?</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mbbsWhyStats.map((s) => (
                                <div key={s.label} className="bg-white/10 rounded-xl py-4 px-3">
                                    <div className="text-2xl font-bold">{s.val}</div>
                                    <div className="text-[#FCD116] text-sm mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Major University Cities</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Urban centers offering student housing, practical training access, and a cost-effective lifestyle.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {majorCities.map((city) => (
                            <div
                                key={city.name}
                                className={`bg-gradient-to-br ${city.gradient} text-white p-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300`}
                            >
                                <h3 className="text-2xl font-bold mb-3">{city.name}</h3>
                                <p className={`${city.textMain} mb-4`}>{city.desc}</p>
                                <div className={`space-y-2 text-sm ${city.textSub}`}>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{city.pop}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        <span>{city.highlight}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#F5F7FA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <TrendingUp className="h-16 w-16 text-[#002B7F] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-[#101B35] mb-4">Growing Economy</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A developing EU economy with growing demand in healthcare and education services.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="bg-white border-l-4 border-l-[#FCD116] p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-[#101B35] mb-3">Key Sectors</h3>
                                <p className="text-gray-600">Information technology, manufacturing, energy, trade, and medical services are major economic contributors.</p>
                            </div>
                            <div className="bg-white border-l-4 border-l-[#002B7F] p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-[#101B35] mb-3">Student Budget</h3>
                                <p className="text-gray-600">Housing, food, and local travel costs are generally lower than many Western European study-abroad destinations.</p>
                            </div>
                            <div className="bg-white border-l-4 border-l-[#CE1126] p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-[#101B35] mb-3">Medical Education Demand</h3>
                                <p className="text-gray-600">International interest in Romania MBBS programs continues to grow each admission cycle.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#002B7F] to-[#101B35] border-t-4 border-t-[#FCD116] p-8 rounded-2xl text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-6">Economic Indicators</h3>
                            <div className="space-y-4">
                                {economyStats.map((s) => (
                                    <div
                                        key={s.label}
                                        className="flex justify-between items-center border-b border-white/20 pb-3 last:border-0"
                                    >
                                        <span className="text-blue-100">{s.label}</span>
                                        <span className="font-semibold">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#F0F5FF]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Utensils className="h-16 w-16 text-[#002B7F] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-[#101B35] mb-4">Cuisine and Student Life</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Local cuisine is affordable and diverse, with many options suitable for international students.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {cuisines.map((c) => (
                            <div key={c.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border-t-4 border-t-[#FCD116]">
                                {c.dishImage ? (
                                    <div className="relative w-full h-44">
                                        <Image
                                            src={cdn(c.dishImage)}
                                            alt={c.dishName ?? ""}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-20 bg-amber-50">
                                        <span className="text-5xl">{c.iconClass}</span>
                                    </div>
                                )}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[#101B35] mb-2">{c.dishName}</h3>
                                    <p className="text-gray-600 text-sm">{c.dishDescription}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#002B7F] to-[#093594] border-t-4 border-t-[#FCD116] p-8 rounded-2xl text-white shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">Student Lifestyle</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {studentLifeCards.map((item) => (
                                <div key={item.label} className="text-center">
                                    <item.icon className="h-8 w-8 mx-auto mb-2 text-[#FCD116]" />
                                    <h4 className="font-semibold">{item.label}</h4>
                                    <p className="text-sm text-blue-100 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#F5F7FA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Plane className="h-16 w-16 text-[#002B7F] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-[#101B35] mb-4">Travel and Connectivity</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            International arrivals and regional transport options make student onboarding practical and manageable.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-t-[#002B7F]">
                            <h3 className="text-2xl font-bold text-[#101B35] mb-6">Transportation</h3>
                            <div className="space-y-4">
                                {transportOptions.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                        <span className="text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-t-[#FCD116]">
                            <h3 className="text-2xl font-bold text-[#101B35] mb-6">Visa and Onboarding</h3>
                            <div className="space-y-4">
                                {visaFacts.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                        <span className="text-gray-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#F0F5FF]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Stethoscope className="h-16 w-16 text-[#002B7F] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-[#101B35] mb-4">Healthcare System</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Healthcare access for students is available through university and city networks.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {healthcare.map((h) => (
                            <div key={h.title} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-[#002B7F]">
                                <h3 className="text-xl font-bold text-[#101B35] mb-4">{h.title}</h3>
                                <p className="text-gray-600">{h.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#002B7F] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Star className="h-16 w-16 text-[#FCD116] mx-auto mb-4" />
                        <h2 className="text-4xl font-bold mb-4">Did You Know?</h2>
                        <p className="text-xl text-blue-100">Interesting facts about Romania</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickFacts.map((f) => (
                            <div key={f.label} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/10">
                                <f.icon className={`h-8 w-8 mx-auto mb-3 ${f.color}`} />
                                <h3 className="font-bold">{f.label}</h3>
                                <p className={`${f.color} text-sm mt-1`}>{f.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] border-t-4 border-t-[#FCD116] text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Start Your MBBS Journey in Romania</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Explore Romania and compare program details from medical universities across the country.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/universities" className="bg-[#FCD116] text-[#101B35] px-8 py-3 rounded-full font-bold hover:bg-[#ffe359] transition-all shadow-md">
                            Explore MBBS Programs
                        </Link>
                        <Link href="/contact-us" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#002B7F] transition-colors">
                            Contact Universities
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
