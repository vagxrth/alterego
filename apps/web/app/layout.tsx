import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { LayoutHeader } from "./_home/LayoutHeader";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlterEgo - AI Photography Platform",
  description: "Create stunning AI photos with the world's first AI photographer. Train your own AI model and generate photos in any style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={geist.className}>
          <LayoutHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
