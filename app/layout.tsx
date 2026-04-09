import { ScheduleActivitiesProvider } from "@/components/ScheduleActivitiesProvider";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bachelor Schedule",
  description: "Weekend timeline in Prague time — Friday through Sunday.",
  icons: {
    icon: [{ url: "/favicon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/favicon.jpg", type: "image/jpeg" }],
  },
  appleWebApp: {
    capable: true,
    title: "Bachelor Schedule",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100 antialiased">
        <ScheduleActivitiesProvider>{children}</ScheduleActivitiesProvider>
      </body>
    </html>
  );
}
