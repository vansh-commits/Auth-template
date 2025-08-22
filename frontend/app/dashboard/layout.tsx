import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "Auth Template",
  description: "Create a new Next.js app with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="caret-amber-50">
        Hello Dev
        {children}
      </body>
    </html>
  );
}
