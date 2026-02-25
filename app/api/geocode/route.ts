import { NextResponse } from "next/server"

const NOMINATIM_HEADERS = {
  "Accept-Language": "nl",
  "User-Agent": "Plannify/1.0 (event planning app)",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const pc = searchParams.get("postcode")
  const nr = searchParams.get("number")

  // Postcode + huisnummer lookup
  if (pc) {
    const searchQuery = nr ? `${pc} ${nr}, Nederland` : `${pc}, Nederland`
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1&countrycodes=nl`
      const res = await fetch(url, { headers: NOMINATIM_HEADERS })
      if (!res.ok) return NextResponse.json({ address: null })

      const data = await res.json()
      if (data.length > 0) {
        const item = data[0]
        const addr = item.address || {}
        const street = addr.road || ""
        const house = addr.house_number || nr || ""
        const postcode = addr.postcode || pc
        const city = addr.city || addr.town || addr.village || addr.municipality || ""
        const fullAddress = [
          street && house ? `${street} ${house}` : street,
          [postcode, city].filter(Boolean).join(" "),
        ].filter(Boolean).join(", ")

        return NextResponse.json({
          address: fullAddress || item.display_name,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        })
      }
      return NextResponse.json({ address: null })
    } catch {
      return NextResponse.json({ address: null })
    }
  }

  // Free text address search
  if (!query || query.length < 3) {
    return NextResponse.json([])
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=nl`
    const res = await fetch(url, { headers: NOMINATIM_HEADERS })

    if (!res.ok) return NextResponse.json([])

    const data = await res.json()
    const results = data.map((item: Record<string, string>) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }))

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
