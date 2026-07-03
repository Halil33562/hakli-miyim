import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import Script from "next/script";

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Haklı mıyım?",
  description: "Olayını anlat, karar halkın olsun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${displayFont.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--bg)", color: "var(--text-primary)", fontFamily: "var(--font-inter), sans-serif" }}
      >
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        <AuthProvider>
          <SidebarProvider>
            <Sidebar />
            <Navbar />
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}