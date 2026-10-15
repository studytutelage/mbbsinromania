"use client";

export default function CookieResetButton() {
    const handleReset = () => {
        localStorage.removeItem("cookie-consent");
        window.location.reload();
    };

    return (
        <button 
            onClick={handleReset}
            className="whitespace-nowrap px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
            Reset Cookie Settings
        </button>
    );
}
