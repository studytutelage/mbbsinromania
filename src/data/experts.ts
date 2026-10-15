export interface ExpertProfile {
    id: number;
    name: string;
    designation: string;
    bio: string;
    photoPath?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    expertise: string[];
}

export const expertProfiles: Record<number, ExpertProfile> = {
    13: {
        id: 13,
        name: "Dr. Amitabh Sharma",
        designation: "Senior Medical Education Consultant",
        bio: "Dr. Amitabh advises Indian students on international medical admissions, NMC requirements, and NEXT exam preparation.",
        linkedinUrl: "https://www.linkedin.com/in/expert-medical-consultant",
        expertise: ["NMC Regulations", "FMGE Preparation", "International Medical Admissions", "Student Visa Support"],
    },
    2: {
        id: 2,
        name: "Priyanka Verma",
        designation: "Legal & Visa Counselor",
        bio: "Priyanka supports Indian students with study-abroad documentation, including document preparation and residence-permit application guidance.",
        linkedinUrl: "https://www.linkedin.com/in/vista-counselor",
        expertise: ["Visa Processing", "Legal Documentation", "Student Accommodation", "Pre-Departure Briefing"],
    }
};

export function getExpertProfile(userId: number): ExpertProfile | undefined {
    return expertProfiles[userId];
}
