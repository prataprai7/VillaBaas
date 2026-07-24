import { Villa } from "./villas-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface AssistantChatResult {
  reply: string;
  villas: Villa[];
}

export async function sendAssistantMessage(message: string): Promise<AssistantChatResult> {
  const res = await fetch(`${API_URL}/api/v1/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const body: ApiEnvelope<AssistantChatResult> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Assistant request failed");
  }
  return body.data;
}