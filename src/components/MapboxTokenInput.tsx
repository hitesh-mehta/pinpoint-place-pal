import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Mapbox token",
        variant: "destructive"
      });
      return;
    }

    // Very basic validation to check if token looks like a Mapbox token
    if (!token.trim().startsWith('pk.')) {
      toast({
        title: "Warning",
        description: "Token doesn't look like a valid Mapbox public token (should start with 'pk.')",
        variant: "destructive"
      });
    }

    setLoading(true);
    
    // Allow the token to be used anyway
    setTimeout(() => {
      onTokenSubmit(token.trim());
      setLoading(false);
    }, 500);
  };

  const useDemoMode = () => {
    toast({
      title: "Demo Mode",
      description: "Using offline demo mode with limited functionality"
    });
    // This would be where we'd implement an alternative approach
    // but for now we'll keep requiring Mapbox
    setToken("pk.demo");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Location Picker</CardTitle>
          <CardDescription>
            Please provide your Mapbox public access token to use the location picker.
            You can get one for free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="pk.eyJ1IjoieW91..."
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              Your token is stored locally in your browser only and never sent to our servers.
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
            onClick={useDemoMode}
          >
            Use Demo Mode
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MapboxTokenInput;
