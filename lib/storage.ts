import type { Contact } from "@/lib/types";

const STORAGE_KEY = "networkai.contacts";

const isBrowser = () => typeof window !== "undefined";

export const loadContacts = (): Contact[] => {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Contact[];
  } catch {
    return [];
  }
};

export const saveContacts = (contacts: Contact[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const addContact = (contact: Contact) => {
  const contacts = loadContacts();
  saveContacts([contact, ...contacts]);
};

export const updateContact = (updated: Contact) => {
  const contacts = loadContacts();
  const next = contacts.map((contact) => (contact.id === updated.id ? updated : contact));
  saveContacts(next);
};

export const getContactById = (id: string) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.id === id);
};

export const searchContacts = (query: string) => {
  const contacts = loadContacts();
  if (!query.trim()) return contacts;
  const q = query.toLowerCase();
  return contacts.filter((contact) => {
    const haystack = [
      contact.name,
      contact.title,
      contact.company,
      contact.email,
      contact.phone,
      contact.notes,
      contact.context,
      contact.relationship,
      contact.eventName,
      contact.tags.join(" ")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
};
