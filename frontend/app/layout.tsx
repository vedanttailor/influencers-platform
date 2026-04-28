/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: CSS module types are not declared in this project setup yet
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Influencer Platform",
  description: "Marketplace for brands and influencers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} text-slate-900 antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 8000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
