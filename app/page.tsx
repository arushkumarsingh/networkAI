"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";
import { loadContacts } from "@/lib/storage";
import ContactCard from "@/components/ContactCard";

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setContacts(loadContacts().slice(0, 4));
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">
              Multimodal intelligence
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Remember every face, follow up every time.
            </h1>
            <p className="mt-4 max-w-xl text-base text-black/70">
              Capture a business card or selfie, add context, and let AI organize your
              networking momentum in minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/capture"
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white"
              >
                Start a capture
              </a>
              <a
                href="/search"
                className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold"
              >
                Search memories
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-accent/20 via-sky/30 to-mint/30 p-6">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-sm font-semibold">Next follow-ups</p>
              <ul className="mt-3 space-y-3 text-sm text-black/70">
                <li>Review investor intro from Summit 2026</li>
                <li>Send thank-you to Lydia from Drift</li>
                <li>Reconnect with Amal about design sprint</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent contacts</h2>
          <a className="text-sm font-semibold text-accent" href="/contacts">
            View all
          </a>
        </div>
        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-10 text-center text-sm text-black/60">
            No contacts yet. Capture your first connection.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
