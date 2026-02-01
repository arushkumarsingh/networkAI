"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ContactCard from "@/components/ContactCard";
import type { Contact } from "@/lib/types";
import { searchContacts } from "@/lib/storage";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Contact[]>([]);

  useEffect(() => {
    setResults(searchContacts(query));
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">
          Semantic search
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Find the right memory</h1>
      </div>
      <SearchBar value={query} onChange={setQuery} />
      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-10 text-center text-sm text-black/60">
          No matches yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}
