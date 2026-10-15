"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Handshake,
    ArrowRight,
    Search,
    MapPin,
    Phone,
    Mail,
    Users,
    Star,
    Shield,
    TrendingUp,
    LayoutGrid,
    List,
    ChevronDown,
    GraduationCap,
    Building2,
    ShieldCheck,
    Target,
    Award,
    Headphones,
    Globe,
    CheckCircle
} from "lucide-react";
import PartnerInquiryModal from "@/components/modals/PartnerInquiryModal";
import PartnerLeadModal from "@/components/modals/PartnerLeadModal";
import { indianStates, stateCitiesMap } from "@/lib/location-data";





const benefits = [
    {
        icon: TrendingUp,
        title: "High Success Rate",
        desc: "Our partners achieve 95%+ admission success rate with comprehensive support and guidance.",
        color: "blue",
    },
    {
        icon: ShieldCheck,
        title: "Trusted Network",
        desc: "Join a network of verified, experienced professionals with proven track records.",
        color: "emerald",
    },
    {
        icon: Target,
        title: "Quality Leads",
        desc: "Receive pre-qualified student leads matching your expertise and location.",
        color: "violet",
    },
    {
        icon: Award,
        title: "Recognition & Rewards",
        desc: "Get recognized for your achievements with awards and performance-based incentives.",
        color: "amber",
    },
    {
        icon: Headphones,
        title: "Complete Support",
        desc: "Access to training, marketing materials, and ongoing support from our team.",
        color: "rose",
    },
    {
        icon: Globe,
        title: "Global Opportunities",
        desc: "Connect students with top medical universities across multiple countries.",
        color: "cyan",
    },
];

/* -- page component -- */
type PartnerInquiry = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    city: string | null;
    partnerType: string | null;
    status: string;
    studentsPlaced: number | null;
    experience: number | null;
    rating: any;
    imageName: string | null;
    imagePath: string | null;
};

export default function OurPartnersContent({ dynamicPartners = [] }: { dynamicPartners?: PartnerInquiry[] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Add state for filters
    const [selectedState, setSelectedState] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");
    const [selectedCountry, setSelectedCountry] = useState("All");

    // Reveal Logic State
    const [revealedPartnerId, setRevealedPartnerId] = useState<number | null>(null);
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [selectedPartnerForLead, setSelectedPartnerForLead] = useState<{ id: number; name: string } | null>(null);

    // Masking Helpers
    const maskPhone = (phone: string | null) => {
        if (!phone || phone === "-") return "-";
        if (phone.length < 5) return "*****";
        return phone.slice(0, 5) + "*****";
    };

    const maskEmail = (email: string | null) => {
        if (!email || email === "-") return "-";
        const [user, domain] = email.split("@");
        if (!domain) return "***";
        const maskedUser = user.length > 2 ? user.slice(0, 2) + "***" : "***";
        return `${maskedUser}@${domain}`;
    };

    // Extract unique cities from dynamic data
    const uniqueCities = Array.from(new Set(dynamicPartners.map(p => p.city).filter(Boolean))) as string[];

    const availableStates = indianStates;

    const availableCities = (() => {
        if (selectedState !== "All") {
            return stateCitiesMap[selectedState] || [];
        }
        return indianStates.flatMap((s) => stateCitiesMap[s] || []);
    })().sort((a, b) => a.localeCompare(b));

    const filteredPartners = dynamicPartners.filter((p) => {
        // match search query
        const q = searchQuery.toLowerCase();
        const matchesQuery = !searchQuery || (
            p.name.toLowerCase().includes(q) ||
            p.company?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q)
        );

        if (!matchesQuery) return false;

        let matchesLocation = true;
        
        if (selectedCity !== "All") {
            matchesLocation = p.city?.toLowerCase() === selectedCity.toLowerCase();
        } else if (selectedState !== "All") {
            const stateCities = (stateCitiesMap[selectedState] || []).map(c => c.toLowerCase());
            matchesLocation = !!p.city && stateCities.includes(p.city.toLowerCase());
        } else {
            // Check if city belongs to ANY Indian state if no filter is selected (strict India logic)
            const allIndianCities = indianStates.flatMap(s => stateCitiesMap[s] || []).map(c => c.toLowerCase());
            matchesLocation = !!p.city && allIndianCities.includes(p.city.toLowerCase());
        }

        return matchesLocation;
    });

    const getPartnerState = (city: string | null) => {
        if (!city) return "Other Locations";
        const c = city.toLowerCase();
        for (const [state, cities] of Object.entries(stateCitiesMap)) {
            if (cities.map(x => x.toLowerCase()).includes(c)) return state;
        }
        return "Other Locations";
    };

    const groupedPartnersMap = new Map<string, any[]>();
    filteredPartners.forEach(p => {
        const state = getPartnerState(p.city);
        if (!groupedPartnersMap.has(state)) groupedPartnersMap.set(state, []);
        
        // Use actual database values, with deterministic mock as fallback if data is missing
        const deterministicPseudoRandom = (p.id * 13) % 100 / 100;
        
        const studentsPlaced = p.studentsPlaced ?? (Math.floor(deterministicPseudoRandom * 200) + 50);
        const experience = p.experience ?? (Math.floor(deterministicPseudoRandom * 10) + 2);
        const rating = p.rating ? Number(p.rating).toFixed(1) : (deterministicPseudoRandom * 1 + 4).toFixed(1);
        const image = p.imagePath || '/image/partners.jpg';

        groupedPartnersMap.get(state)!.push({
            id: p.id,
            name: p.name,
            designation: p.partnerType || "Certified Partner",
            company: p.company || p.name,
            city: p.city || "Global",
            phone: p.phone || "-",
            email: p.email || "-",
            studentsPlaced,
            experience,
            rating,
            image
        });
    });

    const allGroups = Array.from(groupedPartnersMap.entries()).map(([region, partners]) => ({
        region,
        partners
    })).sort((a, b) => {
        if (a.region === "Other Locations") return 1;
        if (b.region === "Other Locations") return -1;
        return a.region.localeCompare(b.region);
    });
    
    const totalPartners = allGroups.reduce((sum, g) => sum + g.partners.length, 0);
    const totalStudentsPlaced = allGroups.reduce((sum, g) => sum + g.partners.reduce((s: number, p: any) => s + p.studentsPlaced, 0), 0);
    const avgRating = totalPartners > 0 ? (allGroups.reduce((sum, g) => sum + g.partners.reduce((s: number, p: any) => s + parseFloat(p.rating), 0), 0) / totalPartners).toFixed(1) : "0.0";
    const statesCovered = allGroups.length;

    const stats = [
        { value: `${totalPartners > 0 ? totalPartners + '+' : '0'}`, label: "Trusted Partners" },
        { value: `${totalStudentsPlaced > 0 ? totalStudentsPlaced + '+' : '0'}`, label: "Students Placed" },
        { value: avgRating, label: "Average Rating" },
        { value: `${statesCovered}`, label: "States Covered" },
    ];

    return (
        <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
            {/* -- HEMD -- */}
            <section className="relative overflow-hidden text-white bg-slate-900">
                {/* Background Image Setup */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        // Using an Unsplash handshake placeholder. You can replace this URL with your local image path (e.g., '/images/handshake.jpg')
                        backgroundImage: `url('/image/partners.jpg')`,
                    }}
                />
                
                {/* Brand Overlay to ensure text readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-900/90 via-blue-800/85 to-slate-900/90" />

                {/* decorative blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl z-0" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl z-0" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 border border-white/30">
                        <MapPin className="w-4 h-4" />
                        India Network
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 mt-2">
                        Our{" "}
                        <span className="text-yellow-300">
                            Partners
                        </span>{" "}
                        in India
                    </h1>
                    <p className="text-blue-50 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed mb-6">
                        Meet our trusted network of education consultants and partners across India who help students achieve their dreams of studying medicine abroad. From counseling to admissions, they provide comprehensive support throughout your journey.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
                        >
                            <Handshake className="w-5 h-5" />
                            Become a Partner
                        </button>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Contact Our Team
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* stat counters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-2 pb-6">
                        {stats.map((s, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl lg:text-5xl font-extrabold text-yellow-300 mb-1">
                                    {s.value}
                                </p>
                                <p className="text-blue-100 text-sm md:text-base font-medium tracking-wide">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* -- SEARCH & FILTER BAR -- */}
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                    {/* Top row: Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* 1. Search */}
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Search Partners</label>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search by name, company, city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 w-full"
                                />
                            </div>
                        </div>

                        {/* 2. Country */}
                        <div className="md:col-span-3 flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-gray-700">Country</label>
                            <div className="relative">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="All">All Countries</option>
                                    <option value="India">India</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* 3. State */}
                        <div className="md:col-span-3 flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-gray-700">State</label>
                            <div className="relative">
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        setSelectedCity("All");
                                    }}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="All">All States</option>
                                    {availableStates.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* 4. City */}
                        <div className="md:col-span-3 flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-gray-700">City</label>
                            <div className="relative">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={selectedState === "All" || availableCities.length === 0}
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="All">All Cities</option>
                                    {availableCities.map((c, i) => (
                                        <option key={i} value={c}>{c}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom row: Showing text & view toggles */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-blue-600">{totalPartners}</span> partners
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* -- PARTNER CARDS -- */}
            <section className="max-w-7xl mx-auto px-4 ">

                {allGroups.map((group) => (
                    <div key={group.region} className="mb-14">
                        {/* region header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{group.region}</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                                {group.partners.length} Partners
                            </span>
                        </div>

                        {/* cards grid */}
                        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                            {group.partners.map((p, idx) => (
                                <div
                                    key={`${p.name}-${idx}`}
                                    className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all ${
                                        viewMode === "list" ? "" : "flex flex-col"
                                    }`}
                                >
                                    {viewMode === "grid" ? (
                                        <>
                                            {/* Image Container */}
                                            <div className="relative h-48">
                                                <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                                                <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
                                                    <div className="flex flex-col gap-2 pointer-events-auto">
                                                        <span className="bg-[#002B7F]/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-lg w-fit">
                                                            <CheckCircle className="w-3 h-3 text-[#FCD116]" /> Verified
                                                        </span>
                                                        <span className="bg-[#FCD116] text-[#101B35] px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-lg w-fit">
                                                            <Star className="w-3 h-3 fill-current text-[#101B35]" /> {p.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Content Area */}
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-0.5 truncate">{p.name}</h3>
                                                    <p className="text-base font-semibold text-[#002B7F] mb-0.5 truncate">{p.designation}</p>
                                                    <p className="text-sm font-medium text-gray-500 mb-6 truncate">{p.company}</p>
                                                    
                                                    {/* Contact & Stats Sections */}
                                                    <div className="space-y-4">
                                                        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-[#002B7F] shrink-0" />
                                                                <span className="truncate">{p.city}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-[#002B7F] shrink-0" />
                                                                <span className="truncate">
                                                                    {revealedPartnerId === p.id ? p.phone : maskPhone(p.phone)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-[#002B7F] shrink-0" />
                                                                <span className="truncate">
                                                                    {revealedPartnerId === p.id ? p.email : maskEmail(p.email)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {revealedPartnerId !== p.id && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedPartnerForLead({ id: p.id, name: p.name });
                                                                    setLeadModalOpen(true);
                                                                }}
                                                                className="w-full bg-[#F0F5FF] text-[#002B7F] py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                                                            >
                                                                Show Contact Details
                                                            </button>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4 pt-6">
                                                            <div className="bg-[#F0F5FF]/80 rounded-2xl p-4 text-center">
                                                                <p className="text-2xl font-bold text-[#002B7F]">{p.studentsPlaced}+</p>
                                                                <p className="text-[11px] font-medium text-gray-500">Students Placed</p>
                                                            </div>
                                                            <div className="bg-[#F0F5FF]/80 rounded-2xl p-4 text-center border-t-2 border-t-[#FCD116]">
                                                                <p className="text-2xl font-bold text-[#002B7F]">{p.experience} Years</p>
                                                                <p className="text-[11px] font-medium text-gray-500">Experience</p>
                                                            </div>
                                                        </div>

                                                        <Link href="/contact-us" className="block text-center w-full mt-6 bg-[#002B7F] text-white py-3 rounded-xl font-bold hover:bg-[#001F5C] transition-colors shadow">
                                                            University Admission Inquiry
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col md:flex-row items-start md:items-center w-full p-4 lg:p-5 gap-4 lg:gap-8 hover:bg-gray-50/50 transition-colors">
                                            {/* Image */}
                                            <div className="w-20 lg:w-24 h-20 lg:h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                                               <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Info Column */}
                                            <div className="flex-1 min-w-[200px]">
                                                <h3 className="text-lg font-bold text-gray-900 mb-0.5">{p.name}</h3>
                                                <p className="text-sm font-medium text-blue-600 mb-0.5">{p.designation}</p>
                                                <p className="text-sm text-gray-500">{p.company}</p>
                                            </div>

                                            {/* Contact Column */}
                                            <div className="flex-[1.2] min-w-[200px] flex flex-col gap-1.5 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">{p.city}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">
                                                        {revealedPartnerId === p.id ? p.phone : maskPhone(p.phone)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">
                                                        {revealedPartnerId === p.id ? p.email : maskEmail(p.email)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Stats Column */}
                                            <div className="flex-1 min-w-[120px] flex flex-col items-center md:items-center text-center">
                                                <p className="text-xl font-bold text-blue-600">{p.studentsPlaced}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 mb-1">Students Placed</p>
                                                <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" /> {p.rating}
                                                </p>
                                            </div>

                                            {/* Action Column */}
                                            <div className="shrink-0 w-full md:w-auto flex flex-col gap-2 justify-end">
                                                {revealedPartnerId !== p.id ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPartnerForLead({ id: p.id, name: p.name });
                                                            setLeadModalOpen(true);
                                                        }}
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold px-6 py-2.5 rounded-lg border border-blue-200 shadow-sm transition-colors whitespace-nowrap w-full md:w-auto text-center"
                                                    >
                                                        Show Number
                                                    </button>
                                                ) : (
                                                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap w-full md:w-auto text-center">
                                                        Admission Inquiry
                                                    </Link>
                                                )}
                                                <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap w-full md:w-auto text-center">
                                                    Contact Now
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* -- WHY PARTNER / BENEFITS -- */}
            <section className="bg-blue-50/70 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-4">
                        Core Benefits
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
                        Why Partner With Us?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-14">
                        Join our growing network of education partners and help students
                        achieve their dream of studying medicine abroad.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((b) => {
                            const colorMap: Record<string, string> = {
                                red: "from-blue-500 to-blue-600 shadow-blue-200",
                                emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200",
                                violet: "from-violet-500 to-violet-600 shadow-violet-200",
                                blue: "from-blue-500 to-blue-600 shadow-blue-200",
                                amber: "from-amber-500 to-amber-600 shadow-amber-200",
                                rose: "from-rose-500 to-rose-600 shadow-rose-200",
                                cyan: "from-cyan-500 to-cyan-600 shadow-cyan-200",
                            };
                            return (
                                <div
                                    key={b.title}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[b.color] || colorMap.red} shadow-md flex items-center justify-center mb-4`}
                                    >
                                        <b.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-left">
                                        {b.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed text-left">
                                        {b.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* -- BOTTOM CTA -- */}
            <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
                <div className="absolute -top-20 right-0 w-72 h-72 bg-red-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <Star className="w-10 h-10 text-yellow-400 mx-auto mb-5" />
                    <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                        Ready to Join Our Network?
                    </h2>
                    <p className="text-gray-300 mb-10 text-lg">
                        Partner with us and be part of a trusted ecosystem that connects
                        aspiring medical students with world-class universities in
                        Romania.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
                        >
                            <Handshake className="w-5 h-5" />
                            Become a Partner
                        </button>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Users className="w-5 h-5" />
                            Contact Our Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* -- MODAL -- */}
            <PartnerInquiryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <PartnerLeadModal
                isOpen={leadModalOpen}
                onClose={() => setLeadModalOpen(false)}
                partnerName={selectedPartnerForLead?.name || ""}
                onSuccess={() => {
                    if (selectedPartnerForLead) {
                        setRevealedPartnerId(selectedPartnerForLead.id);
                    }
                }}
            />
        </div>
    );
}


