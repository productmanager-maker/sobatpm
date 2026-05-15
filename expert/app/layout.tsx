import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MSWProvider } from "@/components/MSWProvider";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Expert",
  description: "Platform Expert untuk Fasilitator",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full">
        <MSWProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
