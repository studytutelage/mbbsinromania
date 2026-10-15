"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UniversitySubNav } from "@/components/admin/UniversitySubNav";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Hospital as HospitalIcon, Link2 } from "lucide-react";

type LinkedHospital = { id: number; hospitalId: number; hospital: { id: number; name: string; city: string | null; beds: number | null } };
type Hospital = { id: number; name: string; city: string | null };

export default function UniversityHospitalsPage() {
    const params = useParams();
    const id = params.id as string;
    const [linked, setLinked] = useState<LinkedHospital[]>([]);
    const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [universityName, setUniversityName] = useState("University");
    const [selectedHospital, setSelectedHospital] = useState("");
    const [adding, setAdding] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const [lRes, aRes, uRes] = await Promise.all([
            fetch(`/api/admin/universities/${id}/hospitals`),
            fetch(`/api/admin/hospitals`),
            fetch(`/api/admin/universities/${id}`),
        ]);
        if (lRes.ok) setLinked(await lRes.json());
        if (aRes.ok) setAllHospitals(await aRes.json());
        if (uRes.ok) { const u = await uRes.json(); setUniversityName(u.name || "University"); }
        setLoading(false);
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const linkedIds = linked.map((l) => l.hospitalId);
    const available = allHospitals.filter((h) => !linkedIds.includes(h.id));

    const handleLink = async () => {
        if (!selectedHospital) { toast.error("Please select a hospital"); return; }
        setAdding(true);
        const res = await fetch(`/api/admin/universities/${id}/hospitals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hospitalId: parseInt(selectedHospital) }),
        });
        if (res.ok) { toast.success("Hospital linked!"); setSelectedHospital(""); load(); }
        else toast.error("Failed to link");
        setAdding(false);
    };

    const handleUnlink = async (hospitalId: number) => {
        if (!confirm("Remove this hospital from the university?")) return;
        const res = await fetch(`/api/admin/universities/${id}/hospitals/${hospitalId}`, { method: "DELETE" });
        if (res.ok) { toast.success("Unlinked!"); load(); }
        else toast.error("Failed");
    };

    return (
        <div>
            <UniversitySubNav universityId={id} universityName={universityName} />
            <div className="space-y-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Affiliated Hospitals</h2>
                    <p className="text-sm text-gray-500">{linked.length} hospital{linked.length !== 1 ? "s" : ""} affiliated</p>
                </div>

                {/* Link new hospital */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 items-end">
                    <div className="flex-1 space-y-1.5">
                        <p className="text-sm font-medium text-gray-700">Link a hospital to this university</p>
                        <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                            <SelectTrigger><SelectValue placeholder="Select hospital..." /></SelectTrigger>
                            <SelectContent>
                                {available.length === 0 ? (
                                    <SelectItem value="none" disabled>All hospitals already linked</SelectItem>
                                ) : available.map((h) => (
                                    <SelectItem key={h.id} value={h.id.toString()}>{h.name}{h.city ? ` — ${h.city}` : ""}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleLink} disabled={adding || !selectedHospital} className="bg-red-600 hover:bg-red-700 shrink-0">
                        {adding ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Link2 size={14} className="mr-2" />}
                        Link
                    </Button>
                </div>

                {loading ? (
                    <div className="p-12 text-center"><Loader2 size={20} className="animate-spin mx-auto text-gray-400" /></div>
                ) : linked.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-gray-300 rounded-xl">
                        <HospitalIcon size={36} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500">No hospitals linked yet.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
                                    <th className="px-4 py-3 font-medium">Hospital</th>
                                    <th className="px-4 py-3 font-medium">City</th>
                                    <th className="px-4 py-3 font-medium">Beds</th>
                                    <th className="px-4 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linked.map((l) => (
                                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{l.hospital.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{l.hospital.city || "—"}</td>
                                        <td className="px-4 py-3 text-gray-500">{l.hospital.beds ?? "—"}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="sm" variant="ghost" className="h-7 text-red-500 hover:bg-red-50 text-xs" onClick={() => handleUnlink(l.hospitalId)}>
                                                <Trash2 size={12} className="mr-1" /> Unlink
                                            </Button>
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
