"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, BarChart3 } from "lucide-react";

type Ranking = { id: number; rankingBody: string; rank: string | null; year: number | null; category: string | null; score: number | null; position: number };

export default function UniversityRankingsPage() {
    const params = useParams();
    const id = params.id as string;
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [loading, setLoading] = useState(true);
    const [universityName, setUniversityName] = useState("University");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ rankingBody: "", rank: "", year: "", category: "", score: "" });
    const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

    const load = useCallback(async () => {
        setLoading(true);
        const [rRes, uRes] = await Promise.all([
            fetch(`/api/admin/universities/${id}/rankings`),
            fetch(`/api/admin/universities/${id}`),
        ]);
        if (rRes.ok) setRankings(await rRes.json());
        if (uRes.ok) { const u = await uRes.json(); setUniversityName(u.name || "University"); }
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleSave = async () => {
        if (!form.rankingBody) { toast.error("Ranking body is required"); return; }
        setSaving(true);
        const url = editId ? `/api/admin/universities/${id}/rankings/${editId}` : `/api/admin/universities/${id}/rankings`;
        const method = editId ? "PATCH" : "POST";
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (res.ok) { toast.success(editId ? "Updated!" : "Added!"); setShowForm(false); setEditId(null); load(); }
        else toast.error("Failed");
        setSaving(false);
    };

    return (
        <div>
            <UniversitySubNav universityId={id} universityName={universityName} />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-xl font-bold text-gray-900">Rankings</h2><p className="text-sm text-gray-500">{rankings.length} ranking{rankings.length !== 1 ? "s" : ""}</p></div>
                    <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ rankingBody: "", rank: "", year: "", category: "", score: "" }); }} className="bg-red-600 hover:bg-red-700"><Plus size={16} className="mr-2" />Add Ranking</Button>
                </div>

                {showForm && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
                        <h3 className="font-semibold text-blue-900">{editId ? "Edit Ranking" : "Add Ranking"}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 space-y-1.5"><Label>Ranking Body *</Label><Input value={form.rankingBody} onChange={(e) => set("rankingBody", e.target.value)} placeholder="e.g. QS World University Rankings" /></div>
                            <div className="space-y-1.5"><Label>Rank</Label><Input value={form.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. #450" /></div>
                            <div className="space-y-1.5"><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" /></div>
                            <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Medical" /></div>
                            <div className="space-y-1.5"><Label>Score</Label><Input type="number" value={form.score} onChange={(e) => set("score", e.target.value)} placeholder="65.5" /></div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700">{saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : null}{editId ? "Save" : "Add"}</Button>
                            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="p-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-gray-400" /></div>
                ) : rankings.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl"><BarChart3 size={36} className="mx-auto mb-3 text-gray-300" /><p className="text-gray-500">No rankings added yet.</p></div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500"><th className="px-4 py-3 font-medium">Ranking Body</th><th className="px-4 py-3 font-medium">Rank</th><th className="px-4 py-3 font-medium">Year</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr></thead>
                            <tbody>
                                {rankings.map((r) => (
                                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{r.rankingBody}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.rank ?? "—"}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.year ?? "—"}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.category ?? "—"}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditId(r.id); setForm({ rankingBody: r.rankingBody, rank: r.rank || "", year: r.year?.toString() || "", category: r.category || "", score: r.score?.toString() || "" }); setShowForm(true); }}><Edit2 size={13} /></Button>
                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/admin/universities/${id}/rankings/${r.id}`, { method: "DELETE" }); load(); } }}><Trash2 size={13} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
