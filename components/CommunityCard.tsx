"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import ThresholdTracker from "./ThresholdTracker";
import type { CommunityWithParcel } from "@/lib/types";

interface CommunityCardProps {
  community: CommunityWithParcel;
  isHighlighted?: boolean;
  onPledge: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}

export default function CommunityCard({
  community,
  isHighlighted = false,
  onPledge,
  cardRef,
}: CommunityCardProps) {
  const { parcel } = community;

  return (
    <div
      ref={cardRef}
      className={`border p-4 ${
        isHighlighted
          ? "border-amber-500 bg-amber-50"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-neutral-900">{community.name}</h3>
          <span className="mt-1 inline-block rounded-sm bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
            {community.housingType}
          </span>
        </div>
        <StatusBadge status={parcel.status} />
      </div>

      <p className="mb-3 text-sm text-neutral-600">
        {parcel.region} · {parcel.nearestCity} ({parcel.distanceToCity} km)
      </p>

      <div className="mb-3">
        <ThresholdTracker
          currentPledges={community.currentPledges}
          threshold={community.threshold}
        />
      </div>

      <p className="mb-4 text-sm text-neutral-700">
        Est.{" "}
        <span className="font-medium">
          ${community.estimatedMonthlyCost.toLocaleString()}/mo
        </span>{" "}
        per household
      </p>

      <div className="flex gap-2">
        <button
          onClick={onPledge}
          className="flex-1 bg-neutral-900 px-3 py-2 text-sm text-white"
        >
          Pledge Interest
        </button>
        <Link
          href={`/community/${community.id}`}
          className="flex-1 border border-neutral-300 px-3 py-2 text-center text-sm text-neutral-700"
        >
          View Community
        </Link>
      </div>
    </div>
  );
}
