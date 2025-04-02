
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GoogleMapsInputProps {
  onKeySubmit: (key: string) => void;
  defaultKey?: string;
}

const GoogleMapsInput: React.FC<GoogleMapsInputProps> = ({ onKeySubmit, defaultKey = '' }) => {
  const [apiKey, setApiKey] = useState(defaultKey);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Maps API key",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simple validation for API key format (Google API keys are typically around 39 characters)
    if (apiKey.trim().length < 20) {
      toast({
        title: "Warning",
        description: "This doesn't look like a valid Google Maps API key",
        variant: "destructive"
      });
    }

    // We'll validate the key more thoroughly when we try to load the map
    setTimeout(() => {
      onKeySubmit(apiKey.trim());
      setLoading(false);
    }, 500);
  };

  const useDefaultKey = () => {
    setApiKey('AIzaSyBUVmHMM29WpdUuioba_LlO6bu5lAWRE2Y');
    toast({
      title: "Default Key Set",
      description: "Using the provided Google Maps API key"
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Location Picker</CardTitle>
          <CardDescription>
            Please provide your Google Maps API key to use the location picker.
            You can get one at <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyBxxxxx..."
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser only and never sent to our servers.
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Validating..." : "Start Location Picker"}
          </Button>
          <div className="flex w-full items-center justify-center">
            <div className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
            <span className="px-2 text-xs text-gray-500 bg-white dark:bg-gray-900">or</span>
            <div className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={useDefaultKey}
          >
            Use Default Key
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleMapsInput;
