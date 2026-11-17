import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pahadi Pizza - Authentic Taste from the Hills",
  description: "Hand-stretched, wood-fired pizza served with love in the heart of Uttarakhand. Order now for the best pizza experience in Kaladhungi.",
  // Small copies resized from /app-logo.png (unchanged): the 540 KB original was
  // being downloaded as the favicon on every first visit, slowing phones down.
  icons: {
    icon: '/icon-48.png',
    shortcut: '/icon-48.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#160e0a",
  width: "device-width",
  initialScale: 1,
  // Lets env(safe-area-inset-*) report real values on notched phones.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
