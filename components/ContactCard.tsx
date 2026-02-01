import type { Contact } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  contact: Contact;
};

export default function ContactCard({ contact }: Props) {
  return (
    <a
      href={`/contacts/${contact.id}`}
      className="group rounded-2xl border border-black/10 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-xl border border-black/10 bg-black/5">
          {contact.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={contact.imageUrl}
              alt={contact.name ?? "Contact"}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">
              {contact.name ?? "New contact"}
            </p>
            <span className="rounded-full bg-black/5 px-2 py-1 text-xs">
              {contact.priority}
            </span>
          </div>
          <p className="text-sm text-black/60">
            {[contact.title, contact.company].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-black/50">
        <span>{contact.relationship || "Relationship TBD"}</span>
        <span>Added {formatDate(contact.createdAt)}</span>
      </div>
      {contact.aiSummary ? (
        <p className="mt-3 text-sm text-black/70">{contact.aiSummary}</p>
      ) : null}
    </a>
  );
}
