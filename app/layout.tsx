import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetworkAI",
  description: "Remember people you meet with AI-powered context."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="bg-grid min-h-screen">
          <header className="border-b border-black/10 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="text-lg font-semibold tracking-tight">NetworkAI</div>
              <nav className="flex gap-4 text-sm font-medium">
                <a className="hover:text-accent" href="/">
                  Dashboard
                </a>
                <a className="hover:text-accent" href="/capture">
                  Capture
                </a>
                <a className="hover:text-accent" href="/contacts">
                  Contacts
                </a>
                <a className="hover:text-accent" href="/search">
                  Search
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
