import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type?: string;
  importance?: number;
}

interface SearchBarProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function SearchBar({ onLocationSelect, isVisible, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isVisible && searchRef.current) {
      searchRef.current.focus();
      setQuery('');
      setResults([]);
      setShowResults(false);
    }
  }, [isVisible]);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=8&addressdetails=1&extratags=1&namedetails=1`,
        {
          headers: {
            'User-Agent': 'MapOfYourLife/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data = await response.json();
      
      // Sort results by importance and filter out less relevant ones
      const sortedResults = data
        .filter((result: SearchResult) => result.importance && result.importance > 0.3)
        .sort((a: SearchResult, b: SearchResult) => (b.importance || 0) - (a.importance || 0))
        .slice(0, 6);
      
      setResults(sortedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Extract a clean location name
    const nameParts = result.display_name.split(',');
    const name = nameParts[0].trim();
    
    onLocationSelect(lat, lng, name);
    handleClose();
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        className="relative w-full max-w-2xl z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center p-3 sm:p-4 border-b border-gray-100">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for cities, countries, landmarks..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-base sm:text-lg"
            />
            {isLoading && (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 animate-spin mr-2" />
            )}
            <button
              onClick={handleClose}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-h-60 sm:max-h-80 overflow-y-auto"
              >
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.place_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-2 sm:gap-3 group"
                      >
                        <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {result.display_name.split(',')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {result.display_name.split(',').slice(1).join(',').trim()}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : query.trim() && !isLoading ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No locations found</p>
                    <p className="text-xs mt-1">Try searching for a city, country, or landmark</p>
                  </div>
                ) : null}
              </AnimatePresence>
            )}
          </AnimatePresence>
          
          {!showResults && !isLoading && query.length === 0 && (
            <div className="p-4 sm:p-6 text-center text-gray-400">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start typing to search for locations</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}