import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: {
    default: "SmartCOMM GenAI Platform",
    template: "%s · SmartCOMM GenAI",
  },
  description:
    "Enterprise AI Operations, Agent Marketplace, Workflow Orchestration, and Human Review platform.",
  applicationName: "SmartCOMM GenAI Platform",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080d1a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <SmoothScroll />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
