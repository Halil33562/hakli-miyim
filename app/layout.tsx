import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haklı mıyım?",
  description: "Haklı mıyım? - Anonim oylama ve yorum platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
       <body className="min-h-full flex flex-col">
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
        </body>
    </html>
  );
}