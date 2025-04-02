
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Copy, Locate } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationPickerProps {
  mapboxToken: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 2
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(), 'top-right'
    );

    // Create a draggable marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: '#3b82f6'
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Update coordinates when marker is dragged
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
      }
    });

    // Update marker position when clicking on map
    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        setCoordinates({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    });

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
          marker.current.setLngLat([longitude, latitude]);
          setCoordinates({ lat: latitude, lng: longitude });
        }
        setLoading(false);
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

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, toast]);

  // Function to get current location
  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map.current && marker.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
          marker.current.setLngLat([longitude, latitude]);
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

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Control Panel */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg w-[90%] max-w-md">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div className="text-sm font-medium overflow-hidden">
              {loading ? "Finding location..." : `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`}
            </div>
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

export default LocationPicker;
