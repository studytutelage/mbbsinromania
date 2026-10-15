import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const visibility = await prisma.websiteSetting.findUnique({
        where: { key: "scholarship_visibility" }
    });
    const showScholarship = visibility?.value !== "false"; // Default to true

    return (
        <>
            {/* Romanian Flag Tri-color Strip */}
            <div className="flex h-1.5 w-full flex-row" aria-hidden="true">
                <div className="w-1/3 bg-[#002B7F]" />
                <div className="w-1/3 bg-[#FCD116]" />
                <div className="w-1/3 bg-[#CE1126]" />
            </div>
            <Header showScholarship={showScholarship} />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
