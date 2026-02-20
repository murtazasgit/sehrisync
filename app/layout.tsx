import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Ramadan Sehri Food Registration",
  description: "Register for Sehri food - Organized PG food coordination for Ramadan",
  keywords: ["Ramadan", "Sehri", "Food Registration", "PG", "Islamic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
