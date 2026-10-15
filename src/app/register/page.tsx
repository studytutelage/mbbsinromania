"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";

interface RegistrationForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState<RegistrationForm>({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed. Please try again.");
            } else {
                // Redirect to OTP verification
                router.push(`/otp-verification?email=${encodeURIComponent(form.email)}`);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Start your MBBS journey in Romania</p>
                </div>

                {error && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                        { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 9876543210" },
                        { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters" },
                        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat your password" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                            <input
                                required
                                type={field.type}
                                name={field.name}
                                value={form[field.name as keyof RegistrationForm]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    ))}

                    <p className="text-xs text-gray-500">
                        By registering, you agree to our{" "}
                        <Link href="#" className="text-blue-600 underline">Terms of Service</Link> and{" "}
                        <Link href="#" className="text-blue-600 underline">Privacy Policy</Link>.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
