"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import {
  createParcelPolygon,
  getReadinessColor,
  getStatusMarkerColor,
} from "@/lib/data";
import type { CommunityWithParcel } from "@/lib/types";

interface ExploreMapProps {
  communities: CommunityWithParcel[];
  selectedId: string | null;
  onSelectCommunity: (id: string) => void;
  viewMode: "markers" | "heatmap";
}

export default function ExploreMap({
  communities,
  selectedId,
  onSelectCommunity,
  viewMode,
}: ExploreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const buildGeoJSON = useCallback(() => {
    const polygonFeatures = communities.map((c) => {
      const { parcel } = c;
      const isTriggered = parcel.status === "triggered";
      const isUnverified = parcel.legalStatus === "unverified";

      let fillColor: string;
      if (isTriggered) {
        fillColor = "#16a34a";
      } else if (parcel.readinessScore === 0) {
        fillColor = "#000000";
      } else {
        fillColor = getReadinessColor(parcel.readinessScore);
      }

      return {
        type: "Feature" as const,
        properties: {
          id: c.id,
          fillColor,
          fillOpacity: isUnverified ? 0.3 : 0.6,
        },
        geometry: createParcelPolygon(parcel.lat, parcel.lng, parcel.acres),
      };
    });

    const pointFeatures = communities.map((c) => ({
      type: "Feature" as const,
      properties: {
        id: c.id,
        weight: c.currentPledges / c.threshold,
        status: c.parcel.status,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [c.parcel.lng, c.parcel.lat],
      },
    }));

    return { polygonFeatures, pointFeatures };
  }, [communities]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-82.0, 47.5],
      zoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      const { polygonFeatures, pointFeatures } = buildGeoJSON();

      map.addSource("parcels", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: polygonFeatures,
        },
      });

      map.addLayer({
        id: "parcel-fills",
        type: "fill",
        source: "parcels",
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-opacity": ["get", "fillOpacity"],
        },
      });

      map.addLayer({
        id: "parcel-outlines",
        type: "line",
        source: "parcels",
        paint: {
          "line-color": "#ffffff",
          "line-width": 1,
          "line-opacity": 0.4,
        },
      });

      map.addSource("community-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: pointFeatures,
        },
      });

      map.addLayer({
        id: "community-heatmap",
        type: "heatmap",
        source: "community-points",
        maxzoom: 12,
        paint: {
          "heatmap-weight": ["get", "weight"],
          "heatmap-intensity": 1,
          "heatmap-radius": 40,
          "heatmap-opacity": 0.7,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "#f59e0b",
            0.6,
            "#16a34a",
            1,
            "#15803d",
          ],
        },
        layout: {
          visibility: "none",
        },
      });

      communities.forEach((c) => {
        const el = document.createElement("div");
        el.className = "cursor-pointer";
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = getStatusMarkerColor(c.parcel.status);
        el.style.border = "2px solid white";

        el.addEventListener("click", () => {
          onSelectCommunity(c.id);
          map.flyTo({
            center: [c.parcel.lng, c.parcel.lat],
            zoom: 10,
            duration: 1000,
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([c.parcel.lng, c.parcel.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const { polygonFeatures, pointFeatures } = buildGeoJSON();

    const parcelSource = map.getSource("parcels") as maplibregl.GeoJSONSource;
    if (parcelSource) {
      parcelSource.setData({
        type: "FeatureCollection",
        features: polygonFeatures,
      });
    }

    const pointSource = map.getSource(
      "community-points"
    ) as maplibregl.GeoJSONSource;
    if (pointSource) {
      pointSource.setData({
        type: "FeatureCollection",
        features: pointFeatures,
      });
    }
  }, [communities, buildGeoJSON]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (viewMode === "heatmap") {
      map.setLayoutProperty("community-heatmap", "visibility", "visible");
      markersRef.current.forEach((m) => {
        m.getElement().style.display = "none";
      });
    } else {
      map.setLayoutProperty("community-heatmap", "visibility", "none");
      markersRef.current.forEach((m) => {
        m.getElement().style.display = "block";
      });
    }
  }, [viewMode]);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const community = communities.find((c) => c.id === selectedId);
    if (!community) return;

    mapRef.current.flyTo({
      center: [community.parcel.lng, community.parcel.lat],
      zoom: 10,
      duration: 1000,
    });
  }, [selectedId, communities]);

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
}
