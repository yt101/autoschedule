import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SesameTab - Your daily Open Sesame",
  description: "Schedule and launch multiple browser windows sequentially with configurable delays",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

