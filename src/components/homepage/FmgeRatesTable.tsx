"use client";

import { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Calendar, Filter } from "lucide-react";

interface FmgeRow {
    universityName: string;
    slug: string;
    year: number;
    appeared: number | null;   // = Total Applications
    passed: number | null;     // = Accepted Students
    passPercentage: number | null; // = Acceptance Rate
}

interface Props {
    data: FmgeRow[];
}

type SortField = "universityName" | "year" | "appeared" | "passed" | "passPercentage";
type SortDir = "asc" | "desc";

function getRateColor(rate: number | null) {
    if (!rate) return "text-gray-400 bg-gray-50";
    if (rate >= 30) return "text-[#002B7F] bg-[#F0F5FF] font-bold border border-[#002B7F]/20";
    if (rate >= 15) return "text-[#101B35] bg-[#FCD116]/20 font-bold border border-[#FCD116]/40";
    if (rate > 0) return "text-[#CE1126] bg-red-50 font-bold border border-[#CE1126]/20";
    return "text-[#002B7F] bg-[#F0F5FF]";
}

export default function FmgeRatesTable({ data }: Props) {
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [universityFilter, setUniversityFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("appeared");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const years = useMemo(
        () => [...new Set(data.map((r) => r.year.toString()))].sort().reverse(),
        [data]
    );
    const availableUniversities = useMemo(
        () => [...new Set(data.map((r) => r.universityName))].sort(),
        [data]
    );

    const filtered = useMemo(() => {
        let rows = data.filter((r) => {
            const matchSearch = r.universityName.toLowerCase().includes(search.toLowerCase());
            const matchYear = yearFilter === "all" || r.year.toString() === yearFilter;
            const matchUni = universityFilter === "all" || r.universityName === universityFilter;
            return matchSearch && matchYear && matchUni;
        });
        rows = [...rows].sort((a, b) => {
            const aVal = a[sortField] ?? 0;
            const bVal = b[sortField] ?? 0;
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortDir === "asc"
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });
        return rows;
    }, [data, search, yearFilter, universityFilter, sortField, sortDir]);

    // Summary stats matching old React Newanup.tsx
    const totalApplications = filtered.reduce((s, r) => s + (r.appeared ?? 0), 0);
    const totalAccepted = filtered.reduce((s, r) => s + (r.passed ?? 0), 0);
    const overallRate = totalApplications > 0 ? (totalAccepted / totalApplications) * 100 : 0;

    const handleSort = (field: SortField) => {
        if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("desc"); }
    };

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDir === "asc"
            ? <ChevronUp className="w-4 h-4 inline ml-1" />
            : <ChevronDown className="w-4 h-4 inline ml-1" />;
    };

    // Active filters display
    const hasActiveFilters = universityFilter !== "all" || yearFilter !== "all" || search;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#FCD116] bg-white shadow-xl">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#002B7F] via-[#093594] to-[#101B35] px-8 py-7 text-white">
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-[#FCD116] mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#FCD116]" />
                        Official Licensing Exam Records
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold mb-2 text-white">Romanian Medical Universities</h3>
                    <p className="text-slate-200 text-sm mb-4">
                        FMGE / Screening Exam Performance &amp; Global Graduate Outcomes
                    </p>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        {[
                            { label: "Selected Filter", value: yearFilter === "all" ? "All Years" : yearFilter },
                            { label: "Total Candidates", value: totalApplications.toLocaleString() },
                            { label: "Graduates Cleared", value: totalAccepted.toLocaleString() },
                            { label: "Average Pass Rate", value: `${overallRate.toFixed(2)}%` },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur-md">
                                <p className="text-slate-300 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-extrabold text-[#FCD116] mt-0.5">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="border-b border-white/70 bg-white/40 p-6 backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-white/80 bg-white/70 py-3 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            suppressHydrationWarning={true}
                            aria-label="Search universities"
                        />
                    </div>

                    {/* University Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                        <select
                            value={universityFilter}
                            onChange={(e) => setUniversityFilter(e.target.value)}
                            className="min-w-[200px] rounded-xl border border-white/80 bg-white/70 py-3 pl-10 pr-8 shadow-sm backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            suppressHydrationWarning={true}
                            aria-label="Filter by University"
                        >
                            <option value="all">All Universities</option>
                            {availableUniversities.map((u) => (
                                <option key={u} value={u}>
                                    {u.length > 40 ? u.substring(0, 40) + "..." : u}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="min-w-[150px] rounded-xl border border-white/80 bg-white/70 py-3 pl-10 pr-8 shadow-sm backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            suppressHydrationWarning={true}
                            aria-label="Filter by Year"
                        >
                            <option value="all">All Years</option>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {/* Result count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Filter className="w-4 h-4" />
                        <span>Showing {filtered.length} results</span>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {universityFilter !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                University: {universityFilter.length > 30 ? universityFilter.substring(0, 30) + "..." : universityFilter}
                                <button onClick={() => setUniversityFilter("all")} className="ml-2 text-blue-600 hover:text-blue-800" suppressHydrationWarning={true}>×</button>
                            </span>
                        )}
                        {yearFilter !== "all" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Year: {yearFilter}
                                <button onClick={() => setYearFilter("all")} className="ml-2 text-green-600 hover:text-green-800" suppressHydrationWarning={true}>×</button>
                            </span>
                        )}
                        {search && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Search: &ldquo;{search}&rdquo;
                                <button onClick={() => setSearch("")} className="ml-2 text-purple-600 hover:text-purple-800" suppressHydrationWarning={true}>×</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white/35 backdrop-blur-sm">
                <table className="w-full">
                    <thead className="border-b border-white/70 bg-white/55">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                <button onClick={() => handleSort("universityName")} className="flex items-center gap-2 hover:text-blue-600 transition-colors" suppressHydrationWarning={true}>
                                    University Name {renderSortIcon("universityName")}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                Year
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                <button onClick={() => handleSort("appeared")} className="flex items-center gap-2 hover:text-blue-600 transition-colors" suppressHydrationWarning={true}>
                                    Total Applications {renderSortIcon("appeared")}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                <button onClick={() => handleSort("passed")} className="flex items-center gap-2 hover:text-blue-600 transition-colors" suppressHydrationWarning={true}>
                                    Accepted Students {renderSortIcon("passed")}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                <button onClick={() => handleSort("passPercentage")} className="flex items-center gap-2 hover:text-blue-600 transition-colors" suppressHydrationWarning={true}>
                                    Acceptance Rate {renderSortIcon("passPercentage")}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/70">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-400">No FMGE data found.</td>
                            </tr>
                        ) : filtered.map((row, i) => {
                            const rate = row.passPercentage;
                            return (
                                <tr key={`${row.universityName}-${row.year}-${i}`} className="transition-colors duration-150 hover:bg-white/55">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start">
                                            <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-100/85 shadow-sm">
                                                <span className="text-sm font-medium text-blue-800">{i + 1}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900 leading-5">{row.universityName}</h3>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {row.year}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {row.appeared?.toLocaleString() ?? "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {row.passed?.toLocaleString() ?? "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {rate != null ? (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRateColor(rate)}`}>
                                                {Number(rate).toFixed(2)}%
                                            </span>
                                        ) : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {rate == null ? <Minus className="w-4 h-4 text-gray-500" /> :
                                                rate >= 30 ? <TrendingUp className="w-4 h-4 text-green-500" /> :
                                                    rate >= 15 ? <Minus className="w-4 h-4 text-yellow-500" /> :
                                                        <TrendingDown className="w-4 h-4 text-blue-500" />}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="border-t border-white/70 bg-white/45 px-6 py-4 backdrop-blur-md">
                <p className="text-sm text-gray-600 text-center">
                    Showing {filtered.length} results
                    {yearFilter !== "all" && ` for ${yearFilter}`}
                    {universityFilter !== "all" && ` for ${universityFilter.length > 40 ? universityFilter.substring(0, 40) + "..." : universityFilter}`}
                    {search && ` matching "${search}"`}
                </p>
            </div>
        </div>
    );
}
