import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/blocks/Hero";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "John Pino | Frontend Technical Lead",
  description: "Portfolio of John Pino. Specialized in building scalable, composable web ecosystems and redefining engineering workflows with Artificial Intelligence.",
};

import { LayoutProvider } from "@/context/LayoutContext";
import { GlobalGenerativeInput } from "@/components/GlobalGenerativeInput";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <LayoutProvider>
          <Hero />
          {children}
          <GlobalGenerativeInput />
        </LayoutProvider>
        <Footer />
      </body>
    </html>
  );
}
