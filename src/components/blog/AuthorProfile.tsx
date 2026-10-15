import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, Award, ExternalLink } from "lucide-react";
import { ExpertProfile } from "@/data/experts";

interface AuthorProfileProps {
    profile: ExpertProfile;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ profile }) => {
    return (
        <section className="mt-16 border-t border-gray-100 pt-12 pb-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    {/* Photo Container */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-md">
                            <Image
                                src={profile.photoPath || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=ef4444&color=fff&size=200`}
                                alt={profile.name}
                                width={96}
                                height={96}
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-sm border border-white">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">{profile.name}</h4>
                                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{profile.designation}</p>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {profile.linkedinUrl && (
                                    <a
                                        href={profile.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                                        title="View LinkedIn Profile"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {profile.twitterUrl && (
                                    <a
                                        href={profile.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white border border-gray-100 rounded-xl text-sky-500 hover:bg-sky-50 transition-colors shadow-sm"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed max-w-3xl mb-6">
                            {profile.bio}
                        </p>

                        {/* Expertise Chips */}
                        <div className="flex flex-wrap gap-2">
                            {profile.expertise.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-white border border-gray-200 text-gray-500 text-xs font-medium rounded-full shadow-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Proof Panel */}
                <div className="mt-8 pt-6 border-t border-gray-100 bg-white/50 -mx-8 -mb-8 px-8 flex items-center justify-between text-xs text-gray-500">
                    <span>Verified Expert Contributor</span>
                    <span className="flex items-center gap-1">MBBS in Romania Authority Certification <Award className="w-3 h-3 text-blue-500" /></span>
                </div>
            </div>
        </section>
    );
};

export default AuthorProfile;
