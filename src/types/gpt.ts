export interface ChatMessage {
  role: "human" | "assistant" | "system";
  content: string;
  document: Boolean;
}

