import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpKeep EHS - Safety Events",
  description: "Custom Safety Event Forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
