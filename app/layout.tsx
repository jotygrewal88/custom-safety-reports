import type { Metadata } from "next";
import "./globals.css";
import { AccessProvider } from "../src/contexts/AccessContext";
import DemoPersonaSwitcher from "../src/components/DemoPersonaSwitcher";

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
        <AccessProvider>
          {children}
          <DemoPersonaSwitcher />
        </AccessProvider>
      </body>
    </html>
  );
}
