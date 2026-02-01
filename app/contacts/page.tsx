"use client";

import { useEffect, useState } from "react";
import { LayoutTemplate, Palette } from "lucide-react";
import { FreelancerProfileCard } from "@/components/ui/freelancer-profile-card";
import { loadContacts } from "@/lib/storage";
import type { Contact } from "@/lib/types";

const ToolIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
    <Icon className="h-4 w-4" />
  </div>
);

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setContacts(loadContacts());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">
            Contacts
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Your network memory</h1>
        </div>
        <a
          href="/capture"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          New capture
        </a>
      </div>
      {contacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-10 text-center text-sm text-black/60">
          No contacts saved yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {contacts.map((contact) => {
            const tools = [
              <ToolIcon key="tool-1" icon={LayoutTemplate} />,
              <ToolIcon key="tool-2" icon={Palette} />
            ];

            return (
              <FreelancerProfileCard
                key={contact.id}
                name={contact.name ?? "New contact"}
                title={[contact.title, contact.company].filter(Boolean).join(" · ") || "—"}
                avatarSrc={contact.imageUrl}
                bannerSrc="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60"
                rating={4.2}
                duration={contact.followUpDate ? "Follow-up set" : "No follow-up"}
                rate={contact.priority}
                tools={tools}
                onGetInTouch={() => window.location.assign(`/contacts/${contact.id}`)}
                onBookmark={() => console.log("Bookmark clicked!", contact.id)}
                className="mx-auto w-full max-w-sm"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
