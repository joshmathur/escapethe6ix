"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { initialCommunities } from "@/lib/data";
import type { Community } from "@/lib/types";

interface CommunityContextValue {
  communities: Community[];
  pledgeCommunity: (id: string) => void;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);

  const pledgeCommunity = useCallback((id: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, currentPledges: c.currentPledges + 1 } : c
      )
    );
  }, []);

  const value = useMemo(
    () => ({ communities, pledgeCommunity }),
    [communities, pledgeCommunity]
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunities() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunities must be used within CommunityProvider");
  }
  return context;
}
