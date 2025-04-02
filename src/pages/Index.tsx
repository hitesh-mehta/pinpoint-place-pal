
import React, { useState, useEffect } from 'react';
import LocationPicker from '../components/LocationPicker';
import MapboxTokenInput from '../components/MapboxTokenInput';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    // Save token to localStorage
    localStorage.setItem('mapboxToken', token);
    setMapboxToken(token);
  };

  const clearToken = () => {
    localStorage.removeItem('mapboxToken');
    setMapboxToken('');
  };

  return (
    <div className="h-screen w-full">
      {mapboxToken ? (
        <LocationPicker mapboxToken={mapboxToken} onClearToken={clearToken} />
      ) : (
        <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
