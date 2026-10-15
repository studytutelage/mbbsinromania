/**
 * Static data for Romania Quick Facts page.
 * Kept in a separate module to keep the page component lean.
 */
import {
    Building,
    Users,
    Languages,
    DollarSign,
    MapPin,
    Clock,
    Flag,
    Mountain,
    Stethoscope,
    Plane,
    Globe,
    Sun,
    Calendar,
    TreePine,
    Heart,
    Car,
    Wifi,
    Award,
    Landmark,
    SunMedium
} from "lucide-react";

export const essentialFacts = [
    { icon: Building, color: "blue", label: "Capital", value: "Bucharest" },
    { icon: Users, color: "green", label: "Population", value: "About 19 million" },
    { icon: Languages, color: "purple", label: "Official Languages", value: "Romanian (English medium medical courses)" },
    { icon: DollarSign, color: "orange", label: "Currency", value: "Romanian Leu (RON)" },
    { icon: MapPin, color: "red", label: "Location", value: "Southeastern Europe (EU & Schengen Member)" },
    { icon: Clock, color: "teal", label: "Timezone", value: "UTC+2 (EET)" },
    { icon: Flag, color: "yellow", label: "National Day", value: "December 1" },
    { icon: Mountain, color: "indigo", label: "Highest Point", value: "Moldoveanu Peak (2,544 m)" },
];

export const geographyPoints = [
    { icon: Globe, color: "text-blue-600", text: "European Union and Schengen member state in Southeastern Europe" },
    { icon: TreePine, color: "text-green-600", text: "Carpathian Mountains, Danube Delta, Black Sea coast, and fertile plains" },
    { icon: Mountain, color: "text-purple-600", text: "Diverse terrain from coastal areas to high alpine peaks (Moldoveanu Peak 2,544 m)" },
    { icon: MapPin, color: "text-cyan-600", text: "Borders Ukraine, Moldova, Bulgaria, Serbia, Hungary, and the Black Sea" },
];

export const climateZones = [
    { icon: SunMedium, color: "text-orange-500", text: "Temperate continental climate with four distinct seasons" },
    { icon: Calendar, color: "text-blue-500", text: "Warm summers (25-30°C) and cool to cold winters with snow in mountainous areas" },
    { icon: TreePine, color: "text-green-500", text: "Pleasant spring and autumn seasons ideal for student life" },
    { icon: Sun, color: "text-yellow-500", text: "Check local weather forecasts when planning travel and academic semesters" },
];

export const attractions = [
    { icon: Landmark, color: "text-blue-200", name: "Bran Castle", desc: "World-famous historic castle in Transylvania, associated with Dracula legends" },
    { icon: Landmark, color: "text-green-200", name: "Peleș Castle", desc: "Stunning Neo-Renaissance royal palace nestled in the Carpathian Mountains" },
    { icon: TreePine, color: "text-purple-200", name: "Danube Delta", desc: "UNESCO World Heritage site and Europe's best-preserved river delta" },
    { icon: Building, color: "text-yellow-200", name: "Palace of the Parliament", desc: "Colossal administrative building in Bucharest, one of the largest in the world" },
];

export const majorCities = [
    {
        name: "Bucharest",
        gradient: "from-blue-600 to-purple-700",
        textMain: "text-blue-100",
        textSub: "text-blue-200",
        desc: "The national capital and primary hub for education, commerce, and major medical institutes.",
        pop: "Capital city",
        highlight: "National university center",
    },
    {
        name: "Cluj-Napoca",
        gradient: "from-green-600 to-emerald-700",
        textMain: "text-green-100",
        textSub: "text-green-200",
        desc: "Vibrant university city in Transylvania with renowned medical faculties and international student bodies.",
        pop: "Major university hub",
        highlight: "Renowned medical faculties",
    },
    {
        name: "Iași",
        gradient: "from-orange-600 to-blue-700",
        textMain: "text-orange-100",
        textSub: "text-orange-200",
        desc: "Historic academic capital in eastern Romania with world-class medical universities and hospital facilities.",
        pop: "Academic center",
        highlight: "Historic medical university",
    },
];

export const defaultCuisines = [
    { id: 0, iconClass: "🥬", dishName: "Sarmale", dishDescription: "Traditional minced meat rolled in fermented cabbage leaves", dishImage: null },
    { id: 1, iconClass: "🌽", dishName: "Mămăligă", dishDescription: "Classic cornmeal polenta served with cheese and sour cream", dishImage: null },
    { id: 2, iconClass: "🍲", dishName: "Ciorbă Rădăuțeană", dishDescription: "Traditional sour chicken soup seasoned with garlic and sour cream", dishImage: null },
    { id: 3, iconClass: "🍩", dishName: "Papanași", dishDescription: "Traditional fried pastry served with sweet cream and berry jam", dishImage: null },
];

export const transportOptions = [
    { icon: Plane, color: "text-blue-600", text: "Henri Coandă International Airport (OTP) in Bucharest connects Romania worldwide" },
    { icon: Car, color: "text-orange-600", text: "Extensive CFR train network connects all university hubs efficiently" },
    { icon: Globe, color: "text-purple-600", text: "Bucharest features an underground Metro network alongside trams and buses" },
    { icon: Wifi, color: "text-green-600", text: "International student transport cards offer discounted travel across Romanian cities" },
];

export const visaFacts = [
    { icon: Award, color: "text-green-600", text: "Romania is a member of the European Union and Schengen Area" },
    { icon: Calendar, color: "text-orange-600", text: "Apply for a Type D/SD long-stay study visa via the Romanian Embassy or VFS" },
    { icon: Plane, color: "text-blue-600", text: "Acceptance Letter from the Romanian Ministry of Education is required" },
    { icon: Heart, color: "text-blue-600", text: "Temporary residence permit (Permis de Ședere) is issued upon arrival for studies" },
];

export const mbbsHighlights = [
    { icon: Stethoscope, label: "Recognition Checks", desc: "Verify each qualification and licensing pathway with the relevant authorities before applying." },
    { icon: DollarSign, label: "Compare Total Costs", desc: "Request current tuition and living-cost details directly from each university." },
    { icon: Languages, label: "Confirm Study Language", desc: "Program language and clinical-language requirements vary; check the course details carefully." },
];

export const economyStats = [
    { label: "Region", value: "Southeastern Europe (EU)" },
    { label: "Main Sectors", value: "IT, automotive, agriculture, and medical research" },
    { label: "Planning", value: "Check current official guidance" },
    { label: "Student Costs", value: "Vary by city and university (€300–€500/month)" },
];

export const quickFacts = [
    { icon: Calendar, label: "National Day", value: "December 1", color: "text-indigo-200" },
    { icon: Mountain, label: "Highest Point", value: "Moldoveanu Peak (2,544 m)", color: "text-blue-200" },
    { icon: Globe, label: "Region", value: "Southeastern Europe (EU & Schengen)", color: "text-green-200" },
    { icon: Award, label: "Study", value: "EU Recognized Medical Degrees", color: "text-yellow-200" },
];

export const healthcare = [
    {
        title: "Public Healthcare",
        desc: "Public hospitals and university clinical centers provide healthcare services across the country.",
        color: "border-blue-200",
    },
    {
        title: "Private Healthcare",
        desc: "Private healthcare services and multi-specialty clinics are available in all major university cities.",
        color: "border-green-200",
    },
    {
        title: "Medical Exposure",
        desc: "High bed-to-patient ratio and modern clinical hospital rotations comply with EU Directive 2005/36/EC.",
        color: "border-purple-200",
    },
];

export const mbbsWhyStats = [
    { val: "6 Years (360 ECTS)", label: "Course Duration" },
    { val: "WHO, NMC, EU", label: "Recognition" },
    { val: "High Passing Rate", label: "Licensing Outcomes" },
    { val: "100% English Medium", label: "Teaching Language" },
];

export const studentLifeCards = [
    { icon: Heart, label: "Plan Ahead", desc: "Review travel guidance and university accommodation options before relocating." },
    { icon: Building, label: "Campus Services", desc: "Modern university campuses, well-equipped labs, libraries, and hospital attachments." },
    { icon: Users, label: "Student Community", desc: "Vibrant international student community with strong Indian and global peer support." },
];
