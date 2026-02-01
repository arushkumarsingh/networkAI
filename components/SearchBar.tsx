"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
      <input
        className="w-full bg-transparent text-sm outline-none"
        placeholder="Search by name, company, tags, or notes..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
