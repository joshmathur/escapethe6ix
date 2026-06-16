"use client";

import { useState, useMemo } from "react";
import { useCommunities } from "@/context/CommunityContext";
import { parcels, getUniqueRegions, getUniqueHousingTypes } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";
import PartnershipModal from "@/components/PartnershipModal";
import type { CommunityWithParcel, Status } from "@/lib/types";

export default function DevelopersPage() {
  const { communities } = useCommunities();
  const [regionFilter, setRegionFilter] = useState("all");
  const [housingFilter, setHousingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minReadiness, setMinReadiness] = useState(0);
  const [partnershipTarget, setPartnershipTarget] =
    useState<CommunityWithParcel | null>(null);

  const communitiesWithParcels = useMemo(() => {
    return communities
      .map((c) => {
        const parcel = parcels.find((p) => p.id === c.parcelId);
        if (!parcel) return null;
        return { ...c, parcel };
      })
      .filter((c): c is CommunityWithParcel => c !== null);
  }, [communities]);

  const regions = getUniqueRegions(communitiesWithParcels);
  const housingTypes = getUniqueHousingTypes(communities);

  const filtered = useMemo(() => {
    return communitiesWithParcels.filter((c) => {
      if (regionFilter !== "all" && c.parcel.region !== regionFilter)
        return false;
      if (housingFilter !== "all" && c.housingType !== housingFilter)
        return false;
      if (statusFilter !== "all" && c.parcel.status !== statusFilter)
        return false;
      if (c.parcel.readinessScore < minReadiness) return false;
      return true;
    });
  }, [
    communitiesWithParcels,
    regionFilter,
    housingFilter,
    statusFilter,
    minReadiness,
  ]);

  const totalForming = communitiesWithParcels.filter(
    (c) => c.parcel.status === "forming" || c.parcel.status === "triggered"
  ).length;
  const totalPledges = communities.reduce(
    (sum, c) => sum + c.currentPledges,
    0
  );
  const totalRegions = regions.length;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">
        Developer Portal
      </h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Communities Forming</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">
            {totalForming}
          </p>
        </div>
        <div className="border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Total Pledges</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">
            {totalPledges}
          </p>
        </div>
        <div className="border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">Regions Covered</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">
            {totalRegions}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-4 border border-neutral-200 p-4">
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Region</label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="all">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Housing Type
          </label>
          <select
            value={housingFilter}
            onChange={(e) => setHousingFilter(e.target.value)}
            className="border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="all">All Types</option>
            {housingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-neutral-300 px-3 py-1.5 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="forming">Forming</option>
            <option value="triggered">Triggered</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Min. Readiness Score
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={minReadiness}
            onChange={(e) => setMinReadiness(Number(e.target.value) || 0)}
            className="w-24 border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((community) => (
          <div
            key={community.id}
            className="border border-neutral-200 p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold text-neutral-900">
                {community.name}
              </h3>
              <StatusBadge status={community.parcel.status as Status} />
            </div>
            <p className="mb-2 text-sm text-neutral-600">
              {community.parcel.region}
            </p>
            <p className="mb-1 text-sm text-neutral-700">
              Readiness:{" "}
              <span className="font-medium">
                {community.parcel.readinessScore}/100
              </span>
            </p>
            <p className="mb-4 text-sm text-neutral-700">
              Pledges:{" "}
              <span className="font-medium">
                {community.currentPledges}/{community.threshold}
              </span>
            </p>
            <button
              onClick={() => setPartnershipTarget(community)}
              className="w-full bg-neutral-900 px-3 py-2 text-sm text-white"
            >
              Initiate Partnership
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-neutral-500">
          No communities match the current filters.
        </p>
      )}

      {partnershipTarget && (
        <PartnershipModal
          communityName={partnershipTarget.name}
          isOpen={!!partnershipTarget}
          onClose={() => setPartnershipTarget(null)}
        />
      )}
    </div>
  );
}
