"use client";

import { useState, useRef, useMemo } from "react";
import { useCommunities } from "@/context/CommunityContext";
import { parcels } from "@/lib/data";
import CommunityCard from "@/components/CommunityCard";
import ExploreMap from "@/components/ExploreMap";
import PledgeModal from "@/components/PledgeModal";
import type { CommunityWithParcel } from "@/lib/types";

export default function ExplorePage() {
  const { communities, pledgeCommunity } = useCommunities();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"markers" | "heatmap">("markers");
  const [pledgeTarget, setPledgeTarget] = useState<CommunityWithParcel | null>(
    null
  );
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const communitiesWithParcels = useMemo(() => {
    return communities
      .map((c) => {
        const parcel = parcels.find((p) => p.id === c.parcelId);
        if (!parcel) return null;
        return { ...c, parcel };
      })
      .filter((c): c is CommunityWithParcel => c !== null);
  }, [communities]);

  function handleSelectCommunity(id: string) {
    setSelectedId(id);
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-[40%] overflow-y-auto border-r border-neutral-200 bg-neutral-50 p-4">
        <h1 className="mb-4 text-lg font-semibold text-neutral-900">
          Communities
        </h1>
        <div className="space-y-4">
          {communitiesWithParcels.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              isHighlighted={selectedId === community.id}
              onPledge={() => setPledgeTarget(community)}
              cardRef={(el) => {
                cardRefs.current[community.id] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative w-[60%]">
        <div className="absolute left-4 top-4 z-10">
          <button
            onClick={() =>
              setViewMode(viewMode === "markers" ? "heatmap" : "markers")
            }
            className="border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm"
          >
            {viewMode === "markers" ? "Show Heatmap" : "Show Markers"}
          </button>
        </div>
        <ExploreMap
          communities={communitiesWithParcels}
          selectedId={selectedId}
          onSelectCommunity={handleSelectCommunity}
          viewMode={viewMode}
        />
      </div>

      {pledgeTarget && (
        <PledgeModal
          communityName={pledgeTarget.name}
          isOpen={!!pledgeTarget}
          onClose={() => setPledgeTarget(null)}
          onSubmit={() => pledgeCommunity(pledgeTarget.id)}
        />
      )}
    </div>
  );
}
