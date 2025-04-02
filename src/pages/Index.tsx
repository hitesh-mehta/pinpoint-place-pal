
import React, { useState } from 'react';
import LocationPicker from '../components/LocationPicker';
import MapboxTokenInput from '../components/MapboxTokenInput';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');

  return (
    <div className="h-screen w-full">
      {mapboxToken ? (
        <LocationPicker mapboxToken={mapboxToken} />
      ) : (
        <MapboxTokenInput onTokenSubmit={setMapboxToken} />
      )}
    </div>
  );
};

export default Index;
