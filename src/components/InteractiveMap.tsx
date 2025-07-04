import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useApp } from '../context/AppContext';
import { getCategoryStyle } from '../utils/categoryStyles';
import { MapPin, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createCustomIcon = (category: string, color: string, isSelected = false) => {
  const size = isSelected ? 36 : 30;
  const borderWidth = isSelected ? 4 : 3;
  
  return divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '16px' : '14px'};
        cursor: pointer;
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        ${getCategoryStyle(category as any).icon}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick }: MapEventsProps) {
  const { state } = useApp();
  
  useMapEvents({
    click: (e) => {
      if (state.isAddingLocation) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

// Component to handle map view updates
function MapViewController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}

// Component to handle cursor changes
function MapCursor() {
  const { state } = useApp();
  const map = useMap();
  
  useEffect(() => {
    const container = map.getContainer();
    if (state.isAddingLocation) {
      container.style.cursor = 'crosshair';
    } else {
      container.style.cursor = '';
    }
    
    return () => {
      container.style.cursor = '';
    };
  }, [map, state.isAddingLocation]);
  
  return null;
}

interface InteractiveMapProps {
  onLocationClick: (lat: number, lng: number) => void;
  mapCenter?: [number, number];
  mapZoom?: number;
}

export function InteractiveMap({ onLocationClick, mapCenter, mapZoom }: InteractiveMapProps) {
  const { state, selectLocation } = useApp();
  const mapRef = useRef<any>(null);

  // Create animated path between locations
  const createAnimatedPath = () => {
    if (state.locations.length < 2) return null;
    
    const sortedLocations = [...state.locations].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.date ? new Date(b.date).getTime() : new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
    
    const pathPositions = sortedLocations.map(location => [
      location.latitude,
      location.longitude
    ]) as [number, number][];

    return (
      <Polyline
        positions={pathPositions}
        color="#4f46e5"
        weight={3}
        opacity={0.8}
        dashArray="5, 10"
        className="animated-path"
      />
    );
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={mapRef}
        center={mapCenter || state.mapCenter}
        zoom={mapZoom || state.mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents onMapClick={onLocationClick} />
        <MapViewController center={mapCenter} zoom={mapZoom} />
        <MapCursor />
        
        {/* Render animated path */}
        {createAnimatedPath()}
        
        {/* Render location markers */}
        {state.locations.map((location) => {
          const categoryStyle = getCategoryStyle(location.category);
          const isSelected = state.selectedLocation?.id === location.id;
          
          return (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createCustomIcon(location.category, categoryStyle.color, isSelected)}
              eventHandlers={{
                click: () => selectLocation(location),
              }}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-2 min-w-64">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{categoryStyle.icon}</span>
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className={`px-2 py-1 rounded text-xs ${categoryStyle.lightBg} ${categoryStyle.textColor}`}>
                        {categoryStyle.label}
                      </span>
                    </div>
                    
                    {location.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(location.date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    
                    {location.note && (
                      <div className="flex items-start gap-1 mt-2">
                        <FileText className="w-3 h-3 mt-0.5" />
                        <span className="text-xs leading-relaxed">{location.note}</span>
                      </div>
                    )}

                    {location.image && (
                      <div className="mt-2">
                        <img 
                          src={location.image} 
                          alt={location.name}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}