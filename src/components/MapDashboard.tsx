import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, ArrowLeft, Search, Menu, X } from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { LifeTimeline } from './LifeTimeline';
import { StatsPanel } from './StatsPanel';
import { AddLocationModal } from './AddLocationModal';
import { SearchBar } from './SearchBar';
import { useApp } from '../context/AppContext';
import html2canvas from 'html2canvas';

interface MapDashboardProps {
  onBack: () => void;
}

export function MapDashboard({ onBack }: MapDashboardProps) {
  const { state, setAddingLocation, setMapView } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats'>('timeline');

  const handleMapClick = (lat: number, lng: number) => {
    if (state.isAddingLocation) {
      setPendingLocation({ lat, lng });
      setShowAddModal(true);
      setAddingLocation(false);
    }
  };

  const handleSearchLocationSelect = (lat: number, lng: number, name: string) => {
    // Center map on selected location
    setMapView([lat, lng], 12);
    
    // Open add location modal with pre-filled data
    setPendingLocation({ lat, lng, name });
    setShowAddModal(true);
    setShowSearchBar(false);
  };

  const handleAddLocation = () => {
    if (state.isAddingLocation) {
      setAddingLocation(false);
    } else {
      setAddingLocation(true);
      // Close search if open
      setShowSearchBar(false);
    }
  };

  const handleSearchClick = () => {
    setShowSearchBar(true);
    // Cancel any active adding mode
    if (state.isAddingLocation) {
      setAddingLocation(false);
    }
  };

  const handleExport = async () => {
    try {
      const element = document.getElementById('map-dashboard');
      if (!element) return;

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'my-life-map.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting map:', error);
    }
  };

  return (
    <div id="map-dashboard" className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Map of Your Life
            </h1>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Search className="w-4 h-4" />
              Search Location
            </button>
            
            <button
              onClick={handleAddLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                state.isAddingLocation
                  ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              {state.isAddingLocation ? 'Cancel' : 'Add Location'}
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={handleSearchClick}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleAddLocation}
              className={`p-2 rounded-lg transition-colors ${
                state.isAddingLocation
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Map Area */}
        <div className="flex-1 p-2 sm:p-4 relative">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <InteractiveMap onLocationClick={handleMapClick} />
            
            {/* Pin Board Mode Indicator */}
            {state.isAddingLocation && !showSearchBar && (
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-center max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <p className="text-xs sm:text-sm font-semibold">Pin Board Mode Active</p>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs opacity-90 hidden sm:block">Click anywhere on the map to add a location</p>
                  <p className="text-xs opacity-90 sm:hidden">Tap to add location</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-l border-gray-200 relative z-10">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100%-49px)]"
          >
            {activeTab === 'timeline' ? <LifeTimeline /> : <StatsPanel />}
          </motion.div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Journey Details</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="p-4 border-b border-gray-200 space-y-2">
              <button
                onClick={() => {
                  handleExport();
                  setShowSidebar(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Map
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'timeline'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Statistics
              </button>
            </div>

            {/* Tab Content */}
            <div className="h-[calc(100%-180px)] overflow-hidden">
              {activeTab === 'timeline' ? <LifeTimeline /> : <StatsPanel />}
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Bar Overlay */}
      <SearchBar
        isVisible={showSearchBar}
        onClose={() => setShowSearchBar(false)}
        onLocationSelect={handleSearchLocationSelect}
      />

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setPendingLocation(null);
        }}
        latitude={pendingLocation?.lat}
        longitude={pendingLocation?.lng}
        defaultName={pendingLocation?.name}
      />
    </div>
  );
}