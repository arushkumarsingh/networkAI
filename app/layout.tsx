import "./globals.css";
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import ClearContactsOnSignOut from "@/components/ClearContactsOnSignOut";

export const metadata: Metadata = {
  title: "NetworkAI",
  description: "Remember people you meet with AI-powered context."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          <div className="bg-grid min-h-screen">
            <header className="border-b border-black/10 bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="text-lg font-semibold tracking-tight">NetworkAI</div>
                <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
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
                  <SignedOut>
                    <SignInButton>
                      <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5">
                        Sign in
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
              {children}
            </main>
            <ClearContactsOnSignOut />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
