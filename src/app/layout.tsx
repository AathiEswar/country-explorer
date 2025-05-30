import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/ui/Navigation'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Country Explorer | Discover the World",
  description: "Explore countries around the world, their flags, populations, and detailed information about different regions and cultures.",
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      }
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180"
      }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black">
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
