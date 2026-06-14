"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sendChat, Message } from "../lib/api";
import { Send, Loader2, Bot, User } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "How many customers do I have and what's the breakdown?",
  "Re-engage my lapsed customers with a win-back offer",
  "Show me my VIP customers and suggest a campaign",
  "How did my recent campaigns perform?",
];

export default function ChatWindow({ onCampaignLaunched }: { onCampaignLaunched: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChat(newMessages);
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.response }
      ]);

      // If a campaign was launched, refresh the campaigns tab
      const launchedCampaign = res.tool_calls.find(
        t => t.tool === "create_and_launch_campaign"
      );
      if (launchedCampaign) onCampaignLaunched();

    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot size={24} />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                What would you like to do today?
              </h2>
              <p className="text-gray-500 text-sm">
                Ask me anything about your customers or let me run a campaign for you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="text-left text-sm bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-sm"
                  : "bg-gray-900 text-gray-100 rounded-tl-sm border border-gray-800"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    code: ({ children }) => <code className="bg-gray-800 px-1.5 py-0.5 rounded text-violet-300 text-xs">{children}</code>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={16} className="animate-spin text-violet-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-4 py-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about your customers or launch a campaign..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-3 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}