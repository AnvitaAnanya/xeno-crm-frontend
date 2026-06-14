"use client";

import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import CampaignList from "./components/CampaignList";
import SegmentList from "./components/SegmentList";
import { getCampaigns, getSegments, Campaign, Segment } from "./lib/api";
import { MessageSquare, BarChart2, Users } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "campaigns" | "segments">("chat");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  const fetchData = async () => {
    try {
      const [c, s] = await Promise.all([getCampaigns(), getSegments()]);
      setCampaigns(c);
      setSegments(s);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 10 seconds to catch campaign stat updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm font-bold">
            X
          </div>
          <span className="font-semibold text-lg">Xeno CRM</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            AI-native
          </span>
        </div>
        <div className="text-xs text-gray-500">Fashion Brand Dashboard</div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6 flex gap-1">
        {[
          { id: "chat", label: "AI Assistant", icon: MessageSquare },
          { id: "campaigns", label: "Campaigns", icon: BarChart2 },
          { id: "segments", label: "Segments", icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id as typeof activeTab); fetchData(); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
              activeTab === id
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "chat" && (
          <ChatWindow onCampaignLaunched={fetchData} />
        )}
        {activeTab === "campaigns" && (
          <CampaignList campaigns={campaigns} />
        )}
        {activeTab === "segments" && (
          <SegmentList segments={segments} />
        )}
      </main>
    </div>
  );
}