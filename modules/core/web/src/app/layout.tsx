import type { Metadata } from "next";
import localFont from "next/font/local";
import { RootProviders } from "@/providers/RootProviders";

import "./globals.css";
import { TopBar } from "@/components/navigation/TopBar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LifeOS - Core",
  description: "LifeOS Core",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <RootProviders>
          <TopBar />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
