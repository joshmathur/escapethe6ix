import parcelsData from "@/data/parcels.json";
import communitiesData from "@/data/communities.json";
import municipalitiesData from "@/data/municipalities.json";
import type {
  Community,
  CommunityWithParcel,
  Municipality,
  Parcel,
} from "./types";

export const parcels: Parcel[] = parcelsData as Parcel[];
export const initialCommunities: Community[] = communitiesData as Community[];
export const municipalities: Municipality[] =
  municipalitiesData as Municipality[];

export function getCommunityWithParcel(
  community: Community
): CommunityWithParcel | null {
  const parcel = parcels.find((p) => p.id === community.parcelId);
  if (!parcel) return null;
  return { ...community, parcel };
}

export function getAllCommunitiesWithParcels(): CommunityWithParcel[] {
  return initialCommunities
    .map(getCommunityWithParcel)
    .filter((c): c is CommunityWithParcel => c !== null);
}

export function getCommunityById(id: string): CommunityWithParcel | null {
  const community = initialCommunities.find((c) => c.id === id);
  if (!community) return null;
  return getCommunityWithParcel(community);
}

export function getMunicipalityByName(name: string): Municipality | undefined {
  return municipalities.find((m) => m.name === name);
}

export function calculateMonthlyCost(
  landCostTotal: number,
  threshold: number
): number {
  const landLeasePerMonth = landCostTotal / threshold / 300;
  return Math.round(landLeasePerMonth + 400 + 120);
}

export function getReadinessColor(score: number): string {
  if (score <= 0) return "#000000";
  if (score >= 100) return "#16a34a";
  if (score >= 50) {
    const ratio = (score - 50) / 50;
    return interpolateColor("#f59e0b", "#16a34a", ratio);
  }
  const ratio = score / 50;
  return interpolateColor("#ef4444", "#f59e0b", ratio);
}

function interpolateColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function getRoadAccessScore(roadAccessKm: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - roadAccessKm * 12)));
}

export function getLegalScore(legalStatus: "verified" | "unverified"): number {
  return legalStatus === "verified" ? 100 : 40;
}

export function createParcelPolygon(
  lat: number,
  lng: number,
  acres: number
): { type: "Polygon"; coordinates: number[][][] } {
  const sideKm = Math.sqrt(acres * 0.004047) * 2;
  const latOffset = sideKm / 111;
  const lngOffset = sideKm / (111 * Math.cos((lat * Math.PI) / 180));

  return {
    type: "Polygon",
    coordinates: [
      [
        [lng - lngOffset, lat - latOffset],
        [lng + lngOffset, lat - latOffset],
        [lng + lngOffset, lat + latOffset],
        [lng - lngOffset, lat + latOffset],
        [lng - lngOffset, lat - latOffset],
      ],
    ],
  };
}

export function getStatusMarkerColor(status: string): string {
  switch (status) {
    case "triggered":
      return "#16a34a";
    case "forming":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}

export function getUniqueRegions(communities: CommunityWithParcel[]): string[] {
  return Array.from(new Set(communities.map((c) => c.parcel.region))).sort();
}

export function getUniqueHousingTypes(communities: Community[]): string[] {
  return Array.from(new Set(communities.map((c) => c.housingType))).sort();
}
