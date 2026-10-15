import { auth } from "@/lib/auth";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
    const session = await auth();
    const name = session?.user?.name || "Student";

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-blue-600" /> Notifications
                </h1>
                <p className="text-gray-500 mt-1">Stay updated on your application status and important messages.</p>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                    <Bell className="w-10 h-10 text-amber-300" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">No Notifications Yet</h2>
                <p className="text-gray-500 text-sm text-center max-w-sm">
                    Hi {name}! You&apos;ll be notified here when there are updates on your applications, messages from counsellors, or important announcements.
                </p>
            </div>
        </div>
    );
}
