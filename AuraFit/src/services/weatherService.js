// src/services/weatherService.js

const WMO_CODE_MAP = {
  0: { desc: "Clear sky", category: "Clear" },
  1: { desc: "Mainly clear", category: "Clear" },
  2: { desc: "Partly cloudy", category: "Cloudy" },
  3: { desc: "Overcast", category: "Cloudy" },
  45: { desc: "Fog", category: "Foggy" },
  48: { desc: "Depositing rime fog", category: "Foggy" },
  51: { desc: "Light drizzle", category: "Rainy" },
  53: { desc: "Moderate drizzle", category: "Rainy" },
  55: { desc: "Dense drizzle", category: "Rainy" },
  56: { desc: "Light freezing drizzle", category: "Rainy" },
  57: { desc: "Dense freezing drizzle", category: "Rainy" },
  61: { desc: "Slight rain", category: "Rainy" },
  63: { desc: "Moderate rain", category: "Rainy" },
  65: { desc: "Heavy rain", category: "Rainy" },
  66: { desc: "Light freezing rain", category: "Rainy" },
  67: { desc: "Heavy freezing rain", category: "Rainy" },
  71: { desc: "Slight snow fall", category: "Snowy" },
  73: { desc: "Moderate snow fall", category: "Snowy" },
  75: { desc: "Heavy snow fall", category: "Snowy" },
  77: { desc: "Snow grains", category: "Snowy" },
  80: { desc: "Slight rain showers", category: "Rainy" },
  81: { desc: "Moderate rain showers", category: "Rainy" },
  82: { desc: "Violent rain showers", category: "Rainy" },
  85: { desc: "Slight snow showers", category: "Snowy" },
  86: { desc: "Heavy snow showers", category: "Snowy" },
  95: { desc: "Thunderstorm", category: "Rainy" },
  96: { desc: "Thunderstorm with slight hail", category: "Rainy" },
  99: { desc: "Thunderstorm with heavy hail", category: "Rainy" }
};

/**
 * Maps WMO code and temperature to AuraFit's simplified categories: Hot, Mild, Cold, Rainy
 */
export function mapWeatherToAuraFit(temp, weatherCode) {
  const wmo = WMO_CODE_MAP[weatherCode] || { desc: "Unknown", category: "Unknown" };
  
  if (wmo.category === "Rainy") {
    return {
      category: "Rainy",
      desc: wmo.desc,
    };
  }

  if (temp > 28) {
    return {
      category: "Hot",
      desc: wmo.desc,
    };
  } else if (temp < 15) {
    return {
      category: "Cold",
      desc: wmo.desc,
    };
  } else {
    return {
      category: "Mild",
      desc: wmo.desc,
    };
  }
}

/**
 * Fetches current weather for specific coordinates using Open-Meteo free API
 */
export async function fetchWeatherByCoords(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch weather data from provider");
  }
  const data = await response.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
  };
}

/**
 * Resolves city name into coordinates, then fetches its current weather
 */
export async function fetchWeatherByCity(cityName) {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  if (!geoResponse.ok) {
    throw new Error("Geocoding service unavailable");
  }
  const geoData = await geoResponse.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City "${cityName}" not found`);
  }
  
  const { latitude, longitude, name: resolvedName } = geoData.results[0];
  const weather = await fetchWeatherByCoords(latitude, longitude);
  return {
    city: resolvedName,
    temp: weather.temp,
    code: weather.code,
  };
}

/**
 * Fetches readable city name from coordinates using OpenStreetMap reverse-geocoding (Nominatim)
 */
export async function getCityFromCoords(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    if (!response.ok) throw new Error("Reverse geocoding failed");
    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "Current Location";
  } catch {
    return "Current Location";
  }
}
