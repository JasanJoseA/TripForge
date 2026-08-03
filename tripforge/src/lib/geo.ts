export interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Open-Meteo's geocoding + forecast APIs are free and require no API key,
 * which is why they're used here instead of a keyed provider — no secret
 * to manage or accidentally ship to the client.
 */
export async function geocodeDestination(query: string): Promise<GeoResult | null> {
  const place = query.split(",")[0].trim();
  if (!place) return null;
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.results?.[0];
    if (!first) return null;
    return {
      name: first.name,
      country: first.country ?? "",
      latitude: first.latitude,
      longitude: first.longitude,
    };
  } catch {
    return null;
  }
}

export interface WeatherNow {
  temperatureC: number;
  windKph: number;
  weatherCode: number;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Icy fog", 51: "Light drizzle", 61: "Light rain",
  63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Rain showers", 95: "Thunderstorm",
};

export function describeWeatherCode(code: number): string {
  return WEATHER_CODES[code] ?? "Weather data unavailable";
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherNow | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.current;
    if (!c) return null;
    return {
      temperatureC: c.temperature_2m,
      windKph: c.wind_speed_10m,
      weatherCode: c.weather_code,
    };
  } catch {
    return null;
  }
}
