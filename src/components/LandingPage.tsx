import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Route, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
}

export function LandingPage({ onStartJourney }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-16"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-white rounded-full shadow-lg">
              <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Map of Your <span className="text-indigo-600">Life</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Visualize your life's journey on an interactive world map. Mark meaningful locations, 
            create your personal timeline, and discover fascinating insights about your travels.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartJourney}
            className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Your Journey
          </motion.button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mark Your Places</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Pin locations where you were born, lived, studied, or traveled. 
                Add memories and photos to each place.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <Route className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Animated Journey</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Watch your life unfold as animated paths connect your locations 
                in chronological order.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center sm:col-span-2 lg:col-span-1"
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Life Statistics</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Discover insights about your journey - total distance traveled, 
                countries visited, and more.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 sm:p-8 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Map Your Life?</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
              Join thousands of users who have already created their personal journey maps
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="text-xl sm:text-2xl font-bold">🌍</div>
                <div>Interactive Maps</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xl sm:text-2xl font-bold">📊</div>
                <div>Life Analytics</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xl sm:text-2xl font-bold">🎨</div>
                <div>Beautiful Export</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}