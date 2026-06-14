import { Segment } from "../lib/api";
import { Users } from "lucide-react";

export default function SegmentList({ segments }: { segments: Segment[] }) {
    if (segments.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
                No segments yet — ask the AI to create one!
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-112px)]">
            <h2 className="text-lg font-semibold">Segments</h2>
            {segments.map((s) => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center">
                                <Users size={18} className="text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{s.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-semibold text-violet-400">{s.customer_count}</div>
                            <div className="text-xs text-gray-500">customers</div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(s.filters).map(([key, val]) => (
                            <span key={key} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
                                {key}: {String(val)}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}