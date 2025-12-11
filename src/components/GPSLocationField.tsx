"use client";

import React, { useEffect, useState } from 'react';

export interface GPSLocation {
  latitude: number;
  longitude: number;
}

interface GPSLocationFieldProps {
  value?: GPSLocation | null;
  onChange: (location: GPSLocation | null) => void;
  disabled?: boolean;
}

export default function GPSLocationField({ value, onChange, disabled }: GPSLocationFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  // Format coordinates for display
  const formatCoordinates = (location: GPSLocation): string => {
    const lat = location.latitude;
    const lng = location.longitude;
    
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  };

  // Request GPS location
  const requestLocation = () => {
    if (disabled || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0 // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: GPSLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        onChange(location);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setIsLoading(false);
        let errorMessage = "";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Unable to determine location. Please check your device settings.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "Unable to determine location. Please try again.";
            break;
        }
        
        setError(errorMessage);
        // Don't block submission - just show warning
      },
      options
    );
  };

  // Automatically request GPS on mount if no value exists
  useEffect(() => {
    if (!value && !hasRequested && !disabled) {
      setHasRequested(true);
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, hasRequested, disabled]);

  const handleRecapture = () => {
    setHasRequested(false);
    requestLocation();
  };

  return (
    <div className="space-y-2">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Requesting location...</span>
        </div>
      )}

      {value && !isLoading && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-sm font-medium text-green-900">Location captured</div>
            <div className="text-sm text-green-700 font-mono">{formatCoordinates(value)}</div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRecapture}
              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-white border border-green-300 rounded hover:bg-green-50 transition-colors"
            >
              Re-capture
            </button>
          )}
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <div className="text-sm font-medium text-yellow-900">Warning</div>
            <div className="text-sm text-yellow-700">{error}</div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRecapture}
              className="px-3 py-1.5 text-xs font-medium text-yellow-700 bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {!value && !isLoading && !error && !hasRequested && (
        <button
          type="button"
          onClick={handleRecapture}
          disabled={disabled}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Capture Location
        </button>
      )}
    </div>
  );
}



