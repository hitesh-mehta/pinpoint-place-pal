
import React, { useState, useEffect } from 'react';
import LocationPicker from '../components/LocationPicker';
import GoogleMapsInput from '../components/GoogleMapsInput';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('googleMapsApiKey');
    if (savedKey) {
      setGoogleMapsApiKey(savedKey);
    }
  }, []);

  const handleKeySubmit = (key: string) => {
    // Save key to localStorage
    localStorage.setItem('googleMapsApiKey', key);
    setGoogleMapsApiKey(key);
  };

  const clearKey = () => {
    localStorage.removeItem('googleMapsApiKey');
    setGoogleMapsApiKey('');
  };

  return (
    <div className="h-screen w-full">
      {googleMapsApiKey ? (
        <LocationPicker googleMapsApiKey={googleMapsApiKey} onClearKey={clearKey} />
      ) : (
        <GoogleMapsInput 
          onKeySubmit={handleKeySubmit} 
          defaultKey="AIzaSyBUVmHMM29WpdUuioba_LlO6bu5lAWRE2Y"
        />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
