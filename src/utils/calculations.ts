import { Location, LifeStats } from '../types';

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total distance following the path
export function calculateTotalDistance(locations: Location[]): number {
  if (locations.length < 2) return 0;
  
  const sortedLocations = [...locations].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  let totalDistance = 0;
  for (let i = 0; i < sortedLocations.length - 1; i++) {
    const current = sortedLocations[i];
    const next = sortedLocations[i + 1];
    totalDistance += calculateDistance(
      current.latitude,
      current.longitude,
      next.latitude,
      next.longitude
    );
  }
  
  return totalDistance;
}

// Find the farthest two points
export function findFarthestPair(locations: Location[]): [Location, Location] | null {
  if (locations.length < 2) return null;
  
  let maxDistance = 0;
  let farthestPair: [Location, Location] | null = null;
  
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const distance = calculateDistance(
        locations[i].latitude,
        locations[i].longitude,
        locations[j].latitude,
        locations[j].longitude
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        farthestPair = [locations[i], locations[j]];
      }
    }
  }
  
  return farthestPair;
}

// Get unique countries from locations (simplified - using rough geographic regions)
export function getCountries(locations: Location[]): string[] {
  const countries = new Set<string>();
  
  locations.forEach(location => {
    // This is a simplified country detection based on coordinates
    // In a real app, you'd use reverse geocoding API
    const country = getCountryFromCoords(location.latitude, location.longitude);
    if (country) countries.add(country);
  });
  
  return Array.from(countries);
}

// Simplified country detection (for demo purposes)
function getCountryFromCoords(lat: number, lon: number): string {
  // This is a very simplified mapping - in production, use a proper geocoding service
  if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) return 'United States';
  if (lat >= 41 && lat <= 83 && lon >= -10 && lon <= 40) return 'Europe';
  if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return 'India';
  if (lat >= 18 && lat <= 54 && lon >= 73 && lon <= 135) return 'China';
  if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) return 'Australia';
  if (lat >= 45 && lat <= 83 && lon >= -141 && lon <= -52) return 'Canada';
  if (lat >= -35 && lat <= 37 && lon >= -74 && lon <= -34) return 'South America';
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) return 'Africa';
  return 'Unknown Region';
}

// Calculate comprehensive life stats
export function calculateLifeStats(locations: Location[]): LifeStats {
  const totalDistance = calculateTotalDistance(locations);
  const farthestPair = findFarthestPair(locations);
  const farthestDistance = farthestPair ? calculateDistance(
    farthestPair[0].latitude,
    farthestPair[0].longitude,
    farthestPair[1].latitude,
    farthestPair[1].longitude
  ) : 0;
  
  // Find longest stay (location with "lived" category and earliest date)
  const livedLocations = locations.filter(loc => loc.category === 'lived');
  const longestStay = livedLocations.length > 0 ? livedLocations[0] : null;
  
  return {
    totalLocations: locations.length,
    totalDistance: Math.round(totalDistance),
    countries: getCountries(locations),
    farthestDistance: Math.round(farthestDistance),
    farthestPair,
    longestStay,
  };
}