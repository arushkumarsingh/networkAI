"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { clearContacts } from "@/lib/storage";

export default function ClearContactsOnSignOut() {
  const { isLoaded, isSignedIn } = useAuth();
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (prevSignedIn.current === null) {
      prevSignedIn.current = !!isSignedIn;
      return;
    }

    if (prevSignedIn.current && !isSignedIn) {
      clearContacts();
    }

    prevSignedIn.current = !!isSignedIn;
  }, [isLoaded, isSignedIn]);

  return null;
}
