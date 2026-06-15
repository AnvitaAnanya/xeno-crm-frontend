import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
});

// Add trailing slash to every request automatically
api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith("/")) {
    config.url = config.url + "/";
  }
  return config;
});

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ToolCall {
  tool: string;
  result: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  tool_calls: ToolCall[];
}

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_failed: number;
  created_at: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  filters: Record<string, unknown>;
  customer_count: number;
}

export const sendChat = async (messages: Message[]): Promise<ChatResponse> => {
  const res = await api.post("/chat/", { messages });
  return res.data;
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const res = await api.get("/campaigns/");
  return res.data;
};

export const getSegments = async (): Promise<Segment[]> => {
  const res = await api.get("/segments/");
  return res.data;
};