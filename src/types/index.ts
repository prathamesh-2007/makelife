export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  date?: string;
  note?: string;
  image?: string;
  createdAt: string;
}

export type LocationCategory = 'born' | 'lived' | 'traveled' | 'studied' | 'other';

export interface LifeStats {
  totalLocations: number;
  totalDistance: number;
  countries: string[];
  farthestDistance: number;
  farthestPair: [Location, Location] | null;
  longestStay: Location | null;
}

export interface AppState {
  locations: Location[];
  selectedLocation: Location | null;
  isAddingLocation: boolean;
  showExportView: boolean;
  mapCenter: [number, number];
  mapZoom: number;
}