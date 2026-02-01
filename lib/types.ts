export type ContactType = "selfie" | "business-card";

export type ContactPriority = "high" | "medium" | "low";

export interface Contact {
  id: string;
  type: ContactType;
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  imageType: "selfie" | "card";
  context: string;
  tags: string[];
  notes: string;
  relationship: string;
  priority: ContactPriority;
  followUpDate?: string;
  followUpType?: "meeting" | "call" | "email" | "check-in";
  reminderSent: boolean;
  createdAt: string;
  lastInteraction?: string;
  eventName?: string;
  embedding?: number[];
  aiSummary?: string;
}

export interface FollowUp {
  contactId: string;
  type: "email" | "message" | "reminder";
  subject?: string;
  content: string;
  suggestedDate: string;
  completed: boolean;
}
