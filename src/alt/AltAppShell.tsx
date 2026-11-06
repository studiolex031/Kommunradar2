import { useEffect, type ReactNode } from "react";
import "@fontsource-variable/inter";
import "./alt-theme.css";
import AltSidebar from "./AltSidebar";
import AltNavbar from "./AltNavbar";

/**
 * Ram för den alternativa designen (Kommunradar.online-varumärket).
 * Sätter .kr-brand på <html> så att temat även gäller dialoger/menyer som
 * renderas i portaler, samt varumärkets favicon och temafärg för undersidan.
 */
export default function AltAppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("kr-brand");

    const previousTitle = document.title;
    document.title = "Kommunradar.online - Upphandlingar & Affärsmöjligheter";

    const added: HTMLElement[] = [];
    const addHead = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
      added.push(el);
    };
    addHead("link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" });
    addHead("link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" });
    addHead("link", { rel: "manifest", href: "/site.webmanifest" });
    addHead("meta", { name: "theme-color", content: "#0B2348" });

    return () => {
      root.classList.remove("kr-brand");
      document.title = previousTitle;
      added.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AltSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AltNavbar />
        <main className="flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
