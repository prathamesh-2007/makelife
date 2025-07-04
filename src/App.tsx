import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { MapDashboard } from './components/MapDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <AppProvider>
      <div className="min-h-screen">
        {currentView === 'landing' ? (
          <LandingPage onStartJourney={() => setCurrentView('dashboard')} />
        ) : (
          <MapDashboard onBack={() => setCurrentView('landing')} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;