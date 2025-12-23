import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pahadi Pizza - Authentic Taste from the Hills",
  description: "Hand-stretched, wood-fired pizza served with love in the heart of Uttarakhand. Order now for the best pizza experience in Kaladhungi.",
  icons: {
    icon: '/app-logo.png',
    shortcut: '/app-logo.png',
    apple: '/app-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

