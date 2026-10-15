import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { CURRENCY_SYMBOL, formatCurrencyNumber } from "@/lib/currency";

export default async function AgentCommissionPage() {
    const session = await auth();
    const agentId = Number(session?.user?.id);

    const [enrolled, total] = await Promise.all([
        prisma.leadInquiry.count({ where: { agentId, status: "enrolled" } }),
        prisma.leadInquiry.count({ where: { agentId } }),
    ]);

    // Commission calculation: currency-configured amount per enrolled student (configurable in future)
    const COMMISSION_PER_STUDENT = 500;
    const totalEarned = enrolled * COMMISSION_PER_STUDENT;

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Commission</h1>
                <p className="text-gray-500 text-sm mt-1">Track your earnings from enrolled students</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                            <DollarSign size={18} className="text-green-600" />
                        </div>
                        <p className="text-gray-500 text-sm">Total Earned</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrencyNumber(totalEarned)}</p>
                    <p className="text-xs text-gray-400 mt-1">{`${CURRENCY_SYMBOL}${COMMISSION_PER_STUDENT} per enrolled student`}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                            <TrendingUp size={18} className="text-blue-600" />
                        </div>
                        <p className="text-gray-500 text-sm">Conversion Rate</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{total ? Math.round((enrolled / total) * 100) : 0}%</p>
                    <p className="text-xs text-gray-400 mt-1">{enrolled} of {total} leads enrolled</p>
                </div>
            </div>

            {/* Status breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="font-semibold text-gray-900">Referral Breakdown</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-sm">Enrolled Students</span>
                        </div>
                        <span className="font-semibold text-green-600">{enrolled}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} className="text-yellow-500" />
                            <span className="text-sm">Total Referrals</span>
                        </div>
                        <span className="font-semibold">{total}</span>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 mt-4">
                    <strong>Note:</strong> Commission is counted when a student&apos;s status is marked as &quot;Enrolled&quot; by the admin team. Contact us at support@mbbsinromania.com for payout requests.
                </div>
            </div>
        </div>
    );
}
