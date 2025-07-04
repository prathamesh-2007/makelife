import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Location, LocationCategory } from '../types';

interface AppContextType {
  state: AppState;
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location | null) => void;
  setAddingLocation: (adding: boolean) => void;
  setMapView: (center: [number, number], zoom: number) => void;
  setShowExportView: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'SELECT_LOCATION'; payload: Location | null }
  | { type: 'SET_ADDING_LOCATION'; payload: boolean }
  | { type: 'SET_MAP_VIEW'; payload: { center: [number, number]; zoom: number } }
  | { type: 'SET_SHOW_EXPORT_VIEW'; payload: boolean };

const initialState: AppState = {
  locations: [],
  selectedLocation: null,
  isAddingLocation: false,
  showExportView: false,
  mapCenter: [20, 0],
  mapZoom: 2,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_LOCATION':
      // Auto-center map on the new location
      const newLocation = action.payload;
      return {
        ...state,
        locations: [...state.locations, newLocation],
        isAddingLocation: false,
        mapCenter: [newLocation.latitude, newLocation.longitude],
        mapZoom: 10,
        selectedLocation: newLocation,
      };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(loc => loc.id !== action.payload),
        selectedLocation: state.selectedLocation?.id === action.payload ? null : state.selectedLocation,
      };
    case 'SELECT_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload,
        mapCenter: action.payload ? [action.payload.latitude, action.payload.longitude] : state.mapCenter,
        mapZoom: action.payload ? 12 : state.mapZoom,
      };
    case 'SET_ADDING_LOCATION':
      return {
        ...state,
        isAddingLocation: action.payload,
      };
    case 'SET_MAP_VIEW':
      return {
        ...state,
        mapCenter: action.payload.center,
        mapZoom: action.payload.zoom,
      };
    case 'SET_SHOW_EXPORT_VIEW':
      return {
        ...state,
        showExportView: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addLocation = (locationData: Omit<Location, 'id' | 'createdAt'>) => {
    const location: Location = {
      ...locationData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LOCATION', payload: location });
  };

  const removeLocation = (id: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: id });
  };

  const selectLocation = (location: Location | null) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location });
  };

  const setAddingLocation = (adding: boolean) => {
    dispatch({ type: 'SET_ADDING_LOCATION', payload: adding });
  };

  const setMapView = (center: [number, number], zoom: number) => {
    dispatch({ type: 'SET_MAP_VIEW', payload: { center, zoom } });
  };

  const setShowExportView = (show: boolean) => {
    dispatch({ type: 'SET_SHOW_EXPORT_VIEW', payload: show });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addLocation,
        removeLocation,
        selectLocation,
        setAddingLocation,
        setMapView,
        setShowExportView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}