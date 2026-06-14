import { Campaign } from "../lib/api";
import { CheckCircle, XCircle, Clock, Mail, MessageSquare, Phone, Radio } from "lucide-react";

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare size={14} />,
  sms: <Phone size={14} />,
  email: <Mail size={14} />,
  rcs: <Radio size={14} />,
};

const STATUS_COLORS: Record<string, string> = {
  completed: "text-green-400 bg-green-400/10",
  running:   "text-yellow-400 bg-yellow-400/10",
  draft:     "text-gray-400 bg-gray-400/10",
  failed:    "text-red-400 bg-red-400/10",
};

function pct(a: number, b: number) {
  if (!b) return "0%";
  return `${Math.round((a / b) * 100)}%`;
}

export default function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No campaigns yet — ask the AI to launch one!
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-112px)]">
      <h2 className="text-lg font-semibold">Campaigns</h2>
      {campaigns.map((c) => (
        <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-white">{c.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  {CHANNEL_ICONS[c.channel]} {c.channel}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                  {c.status}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-600">
              {new Date(c.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Sent",      value: c.total_sent,      color: "text-gray-300" },
              { label: "Delivered", value: c.total_delivered, color: "text-blue-400",  pct: pct(c.total_delivered, c.total_sent) },
              { label: "Opened",    value: c.total_opened,    color: "text-violet-400", pct: pct(c.total_opened, c.total_sent) },
              { label: "Clicked",   value: c.total_clicked,   color: "text-green-400",  pct: pct(c.total_clicked, c.total_sent) },
            ].map(({ label, value, color, pct: p }) => (
              <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                <div className={`text-xl font-semibold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                {p && <div className="text-xs text-gray-600 mt-0.5">{p}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}