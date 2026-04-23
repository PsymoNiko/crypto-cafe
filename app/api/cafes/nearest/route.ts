import { NextRequest, NextResponse } from "next/server"

// Simple haversine distance
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Demo cafes (replace with DB + PostGIS)
const CAFES = [
  { id: 1, name: "Cafe Aurora", address: "123 Main St", lat: 37.7749, lng: -122.4194, wallet_address: "EQxyz..." },
  { id: 2, name: "Brew Haven", address: "456 Pine Ave", lat: 37.784, lng: -122.409, wallet_address: "EQabc..." },
  { id: 3, name: "Roast & Toast", address: "789 Market Rd", lat: 37.764, lng: -122.429, wallet_address: "EQdef..." },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get("lat"))
  const lng = Number(searchParams.get("lng"))
  const limit = Number(searchParams.get("limit") || "5")

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 })
  }

  const enriched = CAFES.map((c) => ({
    ...c,
    distance_m: distanceMeters(lat, lng, c.lat, c.lng),
  }))
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, limit)

  return NextResponse.json(enriched)
}
