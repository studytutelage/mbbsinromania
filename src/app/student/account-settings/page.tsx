"use client";

import { useState } from "react";
import { Bell, Trash2, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AccountSettingsPage() {
    const [emailOn, setEmailOn] = useState(true);
    const [smsOn, setSmsOn] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleSaveNotifications = () => {
        // In a real implementation this would persist to DB/API
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setDeleting(true);
        setDeleteError(null);
        try {
            const res = await fetch("/api/student/profile", { method: "DELETE" });
            if (res.ok) {
                await signOut({ callbackUrl: "/" });
            } else {
                const d = await res.json();
                setDeleteError(d.error || "Failed to delete account. Please contact support.");
            }
        } catch {
            setDeleteError("Network error. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your notification preferences and account.</p>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-5">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-800">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                    {/* Email toggle */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Receive updates about your inquiries and applications via email.
                            </p>
                        </div>
                        <button
                            onClick={() => { setEmailOn(v => !v); setSaved(false); }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${emailOn ? "bg-blue-600" : "bg-gray-300"}`}
                            aria-label="Toggle email notifications"
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${emailOn ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>

                    {/* SMS toggle */}
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">SMS Notifications</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Get text message alerts for important updates and counsellor contact.
                            </p>
                        </div>
                        <button
                            onClick={() => { setSmsOn(v => !v); setSaved(false); }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${smsOn ? "bg-blue-600" : "bg-gray-300"}`}
                            aria-label="Toggle SMS notifications"
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${smsOn ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>
                </div>

                {saved && (
                    <div className="flex items-center gap-2 mt-4 text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Notification preferences saved.
                    </div>
                )}

                <div className="mt-5">
                    <button
                        onClick={handleSaveNotifications}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-2xl border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-800">Delete Account</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>

                {deleteError && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm mb-4">
                        {deleteError}
                    </div>
                )}

                {confirmDelete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Are you sure?</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                All your inquiries and profile data will be permanently deleted. Click the button again to confirm.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        {confirmDelete ? "Confirm Delete" : "Delete Account"}
                    </button>
                    {confirmDelete && (
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
