"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommunities } from "@/context/CommunityContext";
import { parcels } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const { communities } = useCommunities();

  const alertCommunity = communities.find((c) => {
    const ratio = c.currentPledges / c.threshold;
    return ratio >= 0.8 && ratio < 1;
  });

  const alertParcel = alertCommunity
    ? parcels.find((p) => p.id === alertCommunity.parcelId)
    : null;

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/calculator", label: "Calculator" },
    { href: "/developers", label: "Developers" },
  ];

  return (
    <>
      <nav className="bg-neutral-900">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold text-white">
            Platform
          </Link>
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm text-white ${
                  pathname === link.href ? "font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {alertCommunity && (
        <div className="border-b border-amber-600 bg-amber-500 px-6 py-2 text-center text-sm text-white">
          Community near {alertCommunity.name}
          {alertParcel ? ` (${alertParcel.region})` : ""} is almost at threshold
          —{" "}
          <Link href="/explore" className="font-medium underline">
            Pledge Now
          </Link>
        </div>
      )}
    </>
  );
}
