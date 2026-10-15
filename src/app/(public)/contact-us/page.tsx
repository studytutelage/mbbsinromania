"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Send, 
    Loader2, 
    User, 
    MessageSquare, 
    CheckCircle, 
    AlertCircle, 
    Calendar, 
    Video, 
    HeadphonesIcon, 
    X, 
    ArrowRight 
} from "lucide-react";

export default function ContactPage() {
    const searchParams = useSearchParams();
    
    // Core Form State
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        phone: "", 
        subject: "",
        inquiryType: "",
        message: "" 
    });
    const [source, setSource] = useState("contact-us");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Schedule Popup State
    const [showSchedulePopup, setShowSchedulePopup] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        consultationType: "",
        message: ""
    });
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleSuccess, setScheduleSuccess] = useState(false);

    // Dynamic Data State
    const [offices, setOffices] = useState<any[]>([]);
    const [team, setTeam] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const [offres, teamres] = await Promise.all([
                    fetch("/api/public/offices"),
                    fetch("/api/public/expert-team")
                ]);
                const offData = await offres.json();
                const teamData = await teamres.json();
                setOffices(Array.isArray(offData) ? offData : []);
                setTeam(Array.isArray(teamData) ? teamData : []);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const s = searchParams.get("source");
        if (s) setSource(s);
    }, [searchParams]);

    const handleInputChange = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
    const handleScheduleChange = (f: string, v: string) => setScheduleForm(p => ({ ...p, [f]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...form, 
                    source: `${source} | ${form.inquiryType || 'General'}`,
                    sourcePath: window.location.pathname
                }),
            });
            if (!res.ok) throw new Error("Failed to submit");
            setSuccess(true);
            setForm({ name: "", email: "", phone: "", subject: "", inquiryType: "", message: "" });
        } catch {
            setError("Failed to send your message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsScheduling(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...scheduleForm, 
                    source: `video-consultation | ${scheduleForm.consultationType}`,
                    message: `Scheduled: ${scheduleForm.preferredDate} at ${scheduleForm.preferredTime}. Msg: ${scheduleForm.message}`
                }),
            });
            if (!res.ok) throw new Error("Failed");
            setScheduleSuccess(true);
            setTimeout(() => {
                setShowSchedulePopup(false);
                setScheduleSuccess(false);
                setScheduleForm({ name: "", email: "", phone: "", preferredDate: "", preferredTime: "", consultationType: "", message: "" });
            }, 3000);
        } catch {
            alert("Failed to schedule. Please try again.");
        } finally {
            setIsScheduling(false);
        }
    };

    const quickOptions = [
        { icon: Phone, title: "Call Us", desc: "Consult directly", val: "+91 9667 667 331", action: "Call Now", href: "tel:+91 9667 667 331", color: "bg-green-500" },
        { icon: Mail, title: "Email Us", desc: "Official inquiries", val: "info@mbbsinromania.com", action: "Send Email", href: "mailto:info@mbbsinromania.com", color: "bg-blue-500" },
        { icon: MessageSquare, title: "WhatsApp", desc: "Instant chat", val: "Available 24/7", action: "Start Chat", href: "https://wa.me/+919667667331", color: "bg-purple-500" },
        { icon: Video, title: "Video Call", desc: "Expert guidance", val: "By appointment", action: "Book Slot", onClick: () => setShowSchedulePopup(true), color: "bg-orange-500" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#002B7F] via-[#093594] to-[#101B35] text-white py-16 overflow-hidden border-b-4 border-b-[#FCD116]">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20 z-0"></div>
                
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#FCD116] text-sm font-semibold mb-8 backdrop-blur-md border border-white/20">
                            <HeadphonesIcon className="w-4 h-4 text-[#FCD116]" />
                            24/7 Consultation Available
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Get In Touch With <span className="text-[#FCD116]">Our Team.</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Start your journey to international medical education with the help of India's most trusted consultants for MBBS in Romania.
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
                            {[
                                { val: "24/7", lbl: "Available" },
                                { val: "11+", lbl: "Years Experience" },
                                { val: "100+", lbl: "Successful Students" },
                                { val: "100%", lbl: "Visa Success" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                    <div className="text-3xl font-bold text-[#FCD116] mb-1">{stat.val}</div>
                                    <div className="text-xs text-blue-100 uppercase tracking-wider">{stat.lbl}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact Options */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Instantly</h2>
                        <p className="text-gray-600">Choose your preferred channel to reach our advisors</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickOptions.map((opt, i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
                                <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                                    <opt.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 flex-1">{opt.desc}</p>
                                <div className="text-sm font-semibold text-gray-800 mb-6">{opt.val}</div>
                                {opt.href ? (
                                    <a href={opt.href} target="_blank" rel="noopener noreferrer" className={`w-full py-3 rounded-xl text-center text-white font-medium ${opt.color} hover:opacity-90 transition-opacity`}>
                                        {opt.action}
                                    </a>
                                ) : (
                                    <button suppressHydrationWarning onClick={opt.onClick} className={`w-full py-3 rounded-xl text-white font-medium ${opt.color} hover:opacity-90 transition-opacity`}>
                                        {opt.action}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Expert Team Section */}
            {team.length > 0 && (
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our dedicated team is here to guide you through admission, visa, and relocation for MBBS in Romania.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {team.map((member) => (
                                <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col h-full w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] min-w-[280px] max-w-[320px]">
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <img 
                                            src={member.photoPath || 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-[#002B7F] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {member.designation || "Advisor"}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-[#101B35] mb-1">{member.name}</h3>
                                        <p className="text-sm text-[#002B7F] font-bold mb-4">{member.designation}</p>
                                        <div className="flex-1">
                                            <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                                                {member.description}
                                            </p>
                                        </div>
                                        <button 
                                            suppressHydrationWarning
                                            onClick={() => {
                                                const formEl = document.getElementById('contact-form');
                                                formEl?.scrollIntoView({ behavior: 'smooth' });
                                                setForm(p => ({ ...p, subject: `Inquiry for ${member.name}` }));
                                            }}
                                            className="flex items-center justify-center gap-2 text-blue-600 font-bold text-sm group/btn"
                                        >
                                            Consult Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Form Section */}
            <section id="contact-form" className="pt-16 pb-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-6">Send Us a <span className="text-blue-600">Message</span></h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Our expert counsellors are ready to answer your questions. Get end-to-end guidance for your medical career journey.
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                {[
                                    { icon: HeadphonesIcon, title: "Career Counselling", desc: "Personalized advice based on your career goals" },
                                    { icon: CheckCircle, title: "Admission Support", desc: "Dedicated team for university documentation" },
                                    { icon: AlertCircle, title: "Pre-departure Info", desc: "Briefing sessions before you leave for Romania" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-blue-600 border border-gray-100">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                                            <div className="text-sm text-gray-500 leading-relaxed">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                                {success ? (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle className="w-12 h-12 text-green-600" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                                        <p className="text-gray-600 mb-10 text-lg">Thank you! One of our experts will contact you within 24 hours.</p>
                                        <button onClick={() => setSuccess(false)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name *</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input 
                                                        suppressHydrationWarning
                                                        required 
                                                        type="text" 
                                                        value={form.name} 
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        placeholder="e.g. John Doe"
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address *</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input 
                                                        suppressHydrationWarning
                                                        required 
                                                        type="email" 
                                                        value={form.email} 
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        placeholder="john@example.com"
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number *</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input 
                                                        suppressHydrationWarning
                                                        required 
                                                        type="tel" 
                                                        value={form.phone} 
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        placeholder="+91 98765 43210"
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Inquiry Type *</label>
                                                <select 
                                                    suppressHydrationWarning
                                                    required 
                                                    value={form.inquiryType} 
                                                    onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium appearance-none"
                                                >
                                                    <option value="">Select Option</option>
                                                    <option value="admission">Admission Guidance</option>
                                                    <option value="visa">Visa Assistance</option>
                                                    <option value="university">University Info</option>
                                                    <option value="documentation">Documentation Help</option>
                                                    <option value="other">General Query</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                                            <input 
                                                suppressHydrationWarning
                                                type="text" 
                                                value={form.subject} 
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                placeholder="Subject of your inquiry"
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Message *</label>
                                            <textarea 
                                                suppressHydrationWarning
                                                required 
                                                rows={5} 
                                                value={form.message} 
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                placeholder="Write your message here..."
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium resize-none" 
                                            />
                                        </div>

                                        {error && (
                                            <div className="bg-blue-50 border border-blue-100 text-blue-600 px-4 py-3 rounded-2xl text-sm font-medium">
                                                {error}
                                            </div>
                                        )}

                                        <button 
                                            suppressHydrationWarning
                                            type="submit" 
                                            disabled={loading} 
                                            className="w-full bg-[#002B7F] text-white py-5 rounded-2xl font-bold hover:bg-[#001F5C] disabled:opacity-70 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5 text-[#FCD116]" />}
                                            {loading ? "Sending Message..." : "Send Message Now"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offices Section */}
            {offices.length > 0 && (
                <section className="pt-10 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Offices</h2>
                            <p className="text-gray-600">Find our local offices for personalized offline consultation.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {offices.map((office) => (
                                <div key={office.id} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] min-w-[300px] max-w-[380px]">
                                    <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                                        {office.imagePath ? (
                                            <img 
                                                src={office.imagePath} 
                                                alt={office.name} 
                                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                                <MapPin className="w-12 h-12 text-blue-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-xs font-bold text-blue-600 uppercase shadow-sm">
                                                {office.city || "Regional Office"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{office.name}</h3>
                                        <div className="space-y-5 text-[15px] text-gray-500 flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                    <MapPin className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <p className="font-medium leading-relaxed">{office.address}{office.city && <>, {office.city}</>}</p>
                                            </div>
                                            {office.phone && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                        <Phone className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <a href={`tel:${office.phone}`} className="font-medium text-gray-500 hover:text-blue-600 transition-colors">{office.phone}</a>
                                                </div>
                                            )}
                                            {office.email && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                        <Mail className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <a href={`mailto:${office.email}`} className="font-medium text-gray-500 hover:text-blue-600 transition-colors">{office.email}</a>
                                                </div>
                                            )}
                                        </div>
                                        {office.mapEmbed && (
                                            <a href={office.mapEmbed} target="_blank" rel="noopener noreferrer" 
                                                className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
                                                View Complete Map <ArrowRight className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Schedule Popup Modal */}
            {showSchedulePopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSchedulePopup(false)}></div>
                    <div className="relative z-10 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
                        {scheduleSuccess ? (
                            <div className="p-16 text-center">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
                                <p className="text-gray-600 mb-8">Our expert will contact you shortly to confirm your video consultation slot.</p>
                                <button onClick={() => setShowSchedulePopup(false)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold">Close Window</button>
                            </div>
                        ) : (
                            <div className="p-10 md:p-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Video className="w-7 h-7" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900">Schedule Video Call</h2>
                                    </div>
                                    <button onClick={() => setShowSchedulePopup(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleScheduleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                            <input required type="text" value={scheduleForm.name} onChange={(e) => handleScheduleChange('name', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="Enter name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                            <input required type="email" value={scheduleForm.email} onChange={(e) => handleScheduleChange('email', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="Enter email" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                            <input required type="tel" value={scheduleForm.phone} onChange={(e) => handleScheduleChange('phone', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="+91..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Preferred Slot</label>
                                            <div className="flex gap-2">
                                                <input required type="date" value={scheduleForm.preferredDate} onChange={(e) => handleScheduleChange('preferredDate', e.target.value)} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm" />
                                                <input required type="time" value={scheduleForm.preferredTime} onChange={(e) => handleScheduleChange('preferredTime', e.target.value)} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Consultation Type</label>
                                        <select required value={scheduleForm.consultationType} onChange={(e) => handleScheduleChange('consultationType', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium appearance-none">
                                            <option value="">Choose Priority</option>
                                            <option value="admission">Direct Admission Support</option>
                                            <option value="university">University Selection Panel</option>
                                            <option value="visa">Visa Documentation Review</option>
                                            <option value="scholarship">Fee & Scholarship Guidance</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Brief Description</label>
                                        <textarea rows={3} value={scheduleForm.message} onChange={(e) => handleScheduleChange('message', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none" placeholder="What would you like to discuss?"></textarea>
                                    </div>

                                    <button suppressHydrationWarning type="submit" disabled={isScheduling} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                                        {isScheduling ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-5 h-5" />}
                                        {isScheduling ? "Booking Slot..." : "Confirm Schedule Request"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
