"use client";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

// ✅ DATA INSIDE SAME FILE (NO IMPORT ERRORS)
export const telecomPoints = [
  {
    id: 1,
    name: "Urban Core",
    position: [40.7128, -74.006],
    coverage: 92,
    gap: 8,
  },
  {
    id: 2,
    name: "Rural East",
    position: [39.9526, -75.1652],
    coverage: 48,
    gap: 52,
  },
  {
    id: 3,
    name: "Mountain Zone",
    position: [38.9072, -77.0369],
    coverage: 33,
    gap: 67,
  },
  {
    id: 4,
    name: "Coastal South",
    position: [34.0522, -118.2437],
    coverage: 78,
    gap: 22,
  },
];

interface MapViewProps {
  selectedRegion: string;
}

export default function MapView({ selectedRegion }: MapViewProps) {
  const filteredPoints =
    selectedRegion === "All Regions"
      ? telecomPoints
      : telecomPoints.filter((p) => p.name === selectedRegion);

  const getColor = (gap: number) => {
    if (gap <= 20) return "#22c55e";
    if (gap <= 50) return "#eab308";
    return "#ef4444";
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {filteredPoints.map((point) => (
          <CircleMarker
            key={point.id}
            center={point.position as [number, number]}
            radius={12}
            pathOptions={{
              color: getColor(point.gap),
              fillColor: getColor(point.gap),
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div>
                <b>{point.name}</b>
                <br />
                Coverage: {point.coverage}%
                <br />
                Gap: {point.gap}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}