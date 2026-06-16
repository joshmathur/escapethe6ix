export interface Parcel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  acres: number;
  zoning: string;
  permitRequired: boolean;
  nearestCity: string;
  distanceToCity: number;
  readinessScore: number;
  legalStatus: "verified" | "unverified";
  roadAccessKm: number;
  status: "available" | "forming" | "triggered";
  landCostTotal: number;
}

export interface DiscussionMessage {
  user: string;
  message: string;
  timestamp: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
}

export interface Community {
  id: string;
  parcelId: string;
  name: string;
  threshold: number;
  currentPledges: number;
  estimatedMonthlyCost: number;
  housingType: string;
  municipalPartner: string;
  services: string[];
  infrastructureScore: number;
  discussion: DiscussionMessage[];
  polls: Poll[];
}

export interface Municipality {
  id: string;
  name: string;
  lat: number;
  lng: number;
  partnershipStatus: "interested" | "confirmed";
  incentivesOffered: string[];
  populationGrowthGoal: number;
}

export interface CommunityWithParcel extends Community {
  parcel: Parcel;
}

export type Status = "available" | "forming" | "triggered";

export type BudgetRange =
  | "Under $500/mo"
  | "$500-$800/mo"
  | "$800-$1200/mo"
  | "Over $1200/mo";

export type HousingPreference = "Tiny Home" | "Prefab" | "Standard";
