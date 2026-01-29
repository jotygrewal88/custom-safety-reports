"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccess } from "../contexts/AccessContext";
import type { LocationContextValue } from "../types/access";

export default function LocationSwitcher() {
  const {
    isOrgAdmin,
    allowedLocations,
    allowedLocationIds,
    locationContext,
    setLocationContext,
    locations,
    getLocationById,
  } = useAccess();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current display label
  const getCurrentLabel = (): string => {
    if (locationContext === "ALL_LOCATIONS") {
      return "All locations";
    }
    if (locationContext === "ALL_ASSIGNED") {
      return "All assigned locations";
    }
    if (locationContext.startsWith("LOCATION:")) {
      const locId = locationContext.replace("LOCATION:", "");
      const loc = getLocationById(locId);
      return loc?.name || "Unknown location";
    }
    return "Select location";
  };

  // Handle selection
  const handleSelect = (value: LocationContextValue) => {
    setLocationContext(value);
    setIsOpen(false);
  };

  // State: No location assigned
  if (allowedLocationIds.length === 0 && !isOrgAdmin) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm cursor-default">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">No location assigned</span>
        </div>
        {/* Tooltip */}
        <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <p>You don&apos;t have access to any locations.</p>
          <p className="mt-1 text-gray-300">Contact an Org Admin to request access.</p>
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-900 rotate-45"></div>
        </div>
      </div>
    );
  }

  // State: Single location (locked)
  if (allowedLocationIds.length === 1 && !isOrgAdmin) {
    const location = allowedLocations[0];
    return (
      <div className="relative group">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm cursor-default">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{location?.name}</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Tooltip */}
        <div className="absolute top-full left-0 mt-2 w-56 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <p>Your access is limited to <strong>{location?.name}</strong>.</p>
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-900 rotate-45"></div>
        </div>
      </div>
    );
  }

  // State: Org Admin or Multi-location (dropdown)
  const activeLocations = isOrgAdmin 
    ? locations.filter(l => l.status === "active")
    : allowedLocations.filter(l => l.status === "active");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{getCurrentLabel()}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          {/* All locations option */}
          <button
            onClick={() => handleSelect(isOrgAdmin ? "ALL_LOCATIONS" : "ALL_ASSIGNED")}
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
              (isOrgAdmin && locationContext === "ALL_LOCATIONS") || 
              (!isOrgAdmin && locationContext === "ALL_ASSIGNED")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700"
            }`}
          >
            <span className="font-medium">
              {isOrgAdmin ? "All locations" : "All assigned locations"}
            </span>
            {((isOrgAdmin && locationContext === "ALL_LOCATIONS") || 
              (!isOrgAdmin && locationContext === "ALL_ASSIGNED")) && (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-gray-200"></div>

          {/* Location options */}
          <div className="max-h-48 overflow-y-auto">
            {activeLocations.map((location) => {
              const isSelected = locationContext === `LOCATION:${location.id}`;
              return (
                <button
                  key={location.id}
                  onClick={() => handleSelect(`LOCATION:${location.id}`)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <span>{location.name}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Helper text */}
          <div className="mt-1 border-t border-gray-200 pt-2 px-4 pb-2">
            <p className="text-xs text-gray-500">
              This changes what you&apos;re viewing — not your permissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



