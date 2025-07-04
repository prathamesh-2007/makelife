import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryStyle } from '../utils/categoryStyles';
import { format } from 'date-fns';

export function LifeTimeline() {
  const { state, selectLocation, removeLocation } = useApp();

  const sortedLocations = [...state.locations].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  if (sortedLocations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <MapPin className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
          <p className="text-base sm:text-lg font-medium">No locations yet</p>
          <p className="text-xs sm:text-sm">Click on the map to add your first location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Journey</h3>
      
      <div className="space-y-3 sm:space-y-4">
        {sortedLocations.map((location, index) => {
          const categoryStyle = getCategoryStyle(location.category);
          
          return (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                state.selectedLocation?.id === location.id
                  ? `${categoryStyle.borderColor} ${categoryStyle.lightBg}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => selectLocation(location)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`p-1.5 sm:p-2 rounded-full ${categoryStyle.bgColor} text-white flex-shrink-0`}>
                    <span className="text-xs sm:text-sm">{categoryStyle.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{location.name}</h4>
                    <p className={`text-xs sm:text-sm ${categoryStyle.textColor} font-medium`}>
                      {categoryStyle.label}
                    </p>
                    
                    {location.date && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {format(new Date(location.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    {location.note && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                        {location.note}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocation(location.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* Connection line */}
              {index < sortedLocations.length - 1 && (
                <div className="absolute -bottom-1.5 sm:-bottom-2 left-5 sm:left-7 w-0.5 h-3 sm:h-4 bg-gray-300" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}