import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/blocks/Hero";
import "./globals.css";
import { LayoutProvider } from "@/context/LayoutContext";
import { ScrollToTop } from '@/components/ScrollToTop';
import { CVDownloadButton } from '@/components/CVDownloadButton';
import { StatusBar } from "@/components/StatusBar";

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
          <StatusBar />
          <Hero />
          {children}
          <ScrollToTop />
          <CVDownloadButton />
        </LayoutProvider>
        <Footer />
      </body>
    </html>
  );
}
