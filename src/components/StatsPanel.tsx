import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route, Globe, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLifeStats } from '../utils/calculations';

export function StatsPanel() {
  const { state } = useApp();
  const stats = calculateLifeStats(state.locations);

  const statItems = [
    {
      icon: MapPin,
      label: 'Total Locations',
      value: stats.totalLocations,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Route,
      label: 'Distance Traveled',
      value: `${stats.totalDistance.toLocaleString()} km`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Globe,
      label: 'Countries/Regions',
      value: stats.countries.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Zap,
      label: 'Farthest Distance',
      value: `${stats.farthestDistance.toLocaleString()} km`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (state.locations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
          <p className="text-base sm:text-lg font-medium">No statistics yet</p>
          <p className="text-xs sm:text-sm">Add locations to see your journey stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Life Statistics</h3>
      
      <div className="space-y-3 sm:space-y-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 sm:p-4 rounded-lg ${item.bgColor} border border-gray-200`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-full bg-white ${item.color} flex-shrink-0`}>
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">{item.label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Insights Section */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-2 sm:mb-3 text-sm sm:text-base">Journey Insights</h4>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            {stats.farthestPair && (
              <p className="text-indigo-700">
                <span className="font-medium">Farthest journey:</span> {stats.farthestPair[0].name} → {stats.farthestPair[1].name}
              </p>
            )}
            {stats.countries.length > 0 && (
              <p className="text-indigo-700">
                <span className="font-medium">Regions explored:</span> {stats.countries.join(', ')}
              </p>
            )}
            {stats.longestStay && (
              <p className="text-indigo-700">
                <span className="font-medium">Home base:</span> {stats.longestStay.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}