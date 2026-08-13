"use client";

import { usePathname } from "next/navigation";
import { NavigationBar } from "./NavigationBar";
import { Footer } from "./Footer";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const isEventWorkspace =
    pathname.includes("/mentor") ||
    pathname.includes("/events/event-") ||
    pathname.includes("/events/seal-") ||
    pathname.includes("/my-team") ||
    pathname.includes("/my-submissions") ||
    pathname.includes("/submissions/") ||
    pathname.includes("/appeals");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] relative">
      <NavigationBar />
      
      <div className={`flex-1 flex flex-col min-w-0 ${isEventWorkspace ? "md:pl-64" : ""}`}>
        <main className="flex-1 flex flex-col w-full min-h-0">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
