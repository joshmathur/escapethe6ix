import type { Metadata } from "next";
import { CommunityProvider } from "@/context/CommunityContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platform — Northern Ontario Housing Matchmaking",
  description:
    "Connecting people priced out of Southern Ontario with affordable land communities forming in Northern Ontario.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
        <CommunityProvider>
          <Navbar />
          {children}
        </CommunityProvider>
      </body>
    </html>
  );
}
