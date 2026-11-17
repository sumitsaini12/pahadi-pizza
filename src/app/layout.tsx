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
  icons: {
    icon: '/app-logo.png',
    shortcut: '/app-logo.png',
    apple: '/app-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#160e0a",
  width: "device-width",
  initialScale: 1,
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
