"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Contact, FollowUp } from "@/lib/types";
import { getContactById } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import FollowUpCard from "@/components/FollowUpCard";

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const found = getContactById(params.id);
    setContact(found ?? null);
  }, [params]);

  if (!contact) {
    return (
      <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-10 text-center text-sm text-black/60">
        Contact not found.
      </div>
    );
  }

  const followUps: FollowUp[] = [
    {
      contactId: contact.id,
      type: "email",
      subject: `Following up after ${contact.eventName || "our chat"}`,
      content:
        "Share the deck we discussed and propose two time slots for a deeper call.",
      suggestedDate: contact.followUpDate || new Date().toISOString(),
      completed: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="h-48 w-48 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contact.imageUrl}
              alt={contact.name ?? "Contact"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl font-semibold">
                {contact.name ?? "New contact"}
              </h1>
              <p className="text-sm text-black/60">
                {[contact.title, contact.company].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">Email</p>
                <p>{contact.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">Phone</p>
                <p>{contact.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Relationship
                </p>
                <p>{contact.relationship || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">Priority</p>
                <p className="capitalize">{contact.priority}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Follow-up
                </p>
                <p>{formatDate(contact.followUpDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Created
                </p>
                <p>{formatDate(contact.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">Context</p>
              <p className="text-sm text-black/70">{contact.context || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {contact.tags.length === 0
                  ? "—"
                  : contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/5 px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {followUps.map((followUp) => (
          <FollowUpCard key={followUp.subject} followUp={followUp} />
        ))}
      </div>
    </div>
  );
}
