
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Copy, Locate, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  googleMapsApiKey: string;
  onClearKey: () => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ googleMapsApiKey, onClearKey }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Create script element for Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Define the initialization function
    window.initMap = () => {
      try {
        // Create map instance
        map.current = new google.maps.Map(mapContainer.current!, {
          center: { lat: coordinates.lat, lng: coordinates.lng },
          zoom: 2,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        });
        
        // Create marker
        marker.current = new google.maps.Marker({
          position: { lat: coordinates.lat, lng: coordinates.lng },
          map: map.current,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
        
        // Add event listener for marker drag end
        marker.current.addListener('dragend', () => {
          if (marker.current) {
            const position = marker.current.getPosition();
            if (position) {
              setCoordinates({ 
                lat: position.lat(),
                lng: position.lng()
              });
            }
          }
        });
        
        // Add event listener for map click
        map.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          const position = e.latLng;
          if (position && marker.current) {
            marker.current.setPosition(position);
            setCoordinates({ 
              lat: position.lat(),
              lng: position.lng()
            });
          }
        });
        
        // Get user's location
        getCurrentLocation();
      } catch (error) {
        console.error("Map initialization error:", error);
        setApiError(true);
        setLoading(false);
        toast({
          title: "Map Error",
          description: "Could not initialize Google Maps. Please check your API key.",
          variant: "destructive"
        });
      }
    };
    
    // Handle script load error
    script.onerror = () => {
      console.error("Google Maps script failed to load");
      setApiError(true);
      setLoading(false);
      toast({
        title: "API Error",
        description: "Failed to load Google Maps. Please check your API key or try again later.",
        variant: "destructive"
      });
    };
    
    // Add script to document
    document.head.appendChild(script);
    
    // Clean up
    return () => {
      document.head.removeChild(script);
      // Remove the global function
      delete window.initMap;
    };
  }, [googleMapsApiKey, toast]);
  
  // Function to get current location
  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map.current && marker.current) {
          map.current.setCenter({ lat: latitude, lng: longitude });
          map.current.setZoom(14);
          marker.current.setPosition({ lat: latitude, lng: longitude });
          setCoordinates({ lat: latitude, lng: longitude });
        }
        setLoading(false);
        toast({
          title: "Location Updated",
          description: "Your current location has been found",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoading(false);
        toast({
          title: "Location Error",
          description: "Could not access your location. Please enable location services.",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true }
    );
  };
  
  // Copy coordinates to clipboard
  const copyCoordinates = () => {
    const coordString = `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`;
    navigator.clipboard.writeText(coordString).then(
      () => {
        toast({
          title: "Copied!",
          description: "Coordinates copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy coordinates",
          variant: "destructive"
        });
      }
    );
  };
  
  // Handle changing the API key
  const handleChangeKey = () => {
    onClearKey();
    toast({
      title: "API Key Removed",
      description: "You can now enter a new Google Maps API key"
    });
  };
  
  if (apiError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Map Loading Error</h2>
            <p>There was a problem with your Google Maps API key. It may be invalid, expired, or restricted.</p>
            <Button onClick={handleChangeKey}>
              Try a Different API Key
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Control Panel */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg w-[90%] max-w-md">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div className="text-sm font-medium overflow-hidden">
                {loading ? "Finding location..." : `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleChangeKey} title="Change API key">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={getCurrentLocation} disabled={loading}>
              <Locate className="h-4 w-4 mr-2" />
              {loading ? "Locating..." : "My Location"}
            </Button>
            <Button variant="default" size="sm" className="flex-1" onClick={copyCoordinates}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm text-center max-w-xs">
        Drag the marker or click anywhere on the map to select location
      </div>
    </div>
  );
};

// Add this to allow using the Google Maps API
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default LocationPicker;
