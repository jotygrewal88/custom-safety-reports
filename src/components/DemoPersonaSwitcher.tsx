"use client";

import React, { useState } from "react";
import { useAccess } from "../contexts/AccessContext";
import { ROLE_LABELS } from "../types/access";

interface PersonaOption {
  userId: string;
  label: string;
  description: string;
  color: string;
}

const PERSONAS: PersonaOption[] = [
  {
    userId: "user-org-admin",
    label: "Org Admin",
    description: "Full access to all locations",
    color: "bg-purple-500",
  },
  {
    userId: "user-loc-admin",
    label: "Location Admin",
    description: "Admin for Suite B & UpKeep HQ",
    color: "bg-blue-500",
  },
  {
    userId: "user-multi-loc",
    label: "Multi-Location User",
    description: "Access to 3 locations",
    color: "bg-green-500",
  },
  {
    userId: "user-single-loc",
    label: "Single-Location User",
    description: "Access to Suite B only",
    color: "bg-yellow-500",
  },
  {
    userId: "user-no-loc",
    label: "No Location User",
    description: "No location assignments",
    color: "bg-red-500",
  },
  {
    userId: "user-view-only",
    label: "View-Only User",
    description: "Read-only access to 2 locations",
    color: "bg-gray-500",
  },
];

export default function DemoPersonaSwitcher() {
  const { currentUserId, currentUser, setCurrentUserId, isOrgAdmin, allowedLocationIds, locationContext, resetToSeedData } = useAccess();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentPersona = PERSONAS.find(p => p.userId === currentUserId);

  const handlePersonaChange = (userId: string) => {
    setCurrentUserId(userId);
    setIsExpanded(false);
  };

  const handleReset = () => {
    resetToSeedData();
    setShowResetConfirm(false);
    setIsExpanded(false);
  };

  return (
    <div className="fixed top-16 right-4 z-30">
      {/* Collapsed State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md shadow-md border border-white/50 text-white text-xs font-medium hover:scale-105 transition-transform ${currentPersona?.color || 'bg-gray-500'}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{currentPersona?.label || 'Demo'}</span>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Demo Mode</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current User Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current User</div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${currentPersona?.color || 'bg-gray-500'}`}>
                {currentUser?.avatarInitials || 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{currentUser?.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{currentUser?.email}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${isOrgAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {isOrgAdmin ? 'Org Admin' : `${allowedLocationIds.length} location${allowedLocationIds.length !== 1 ? 's' : ''}`}
              </span>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {locationContext === 'ALL_LOCATIONS' ? 'All Locations' : 
                 locationContext === 'ALL_ASSIGNED' ? 'All Assigned' : 
                 locationContext.replace('LOCATION:', '')}
              </span>
            </div>
          </div>

          {/* Persona Options */}
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1">Switch Persona</div>
            {PERSONAS.map((persona) => (
              <button
                key={persona.userId}
                onClick={() => handlePersonaChange(persona.userId)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                  persona.userId === currentUserId
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${persona.color}`}>
                  {persona.label.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{persona.label}</div>
                  <div className="text-xs text-gray-500 truncate">{persona.description}</div>
                </div>
                {persona.userId === currentUserId && (
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 py-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Demo Data
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 text-sm text-gray-600 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 text-sm text-white py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



