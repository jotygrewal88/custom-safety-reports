"use client";

import React, { useEffect } from "react";

type AIToastProps = {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Array<{ fieldId: string; fieldLabel: string; confidence: number }>;
};

export default function AIToast({ isOpen, onClose, suggestions }: AIToastProps) {
  useEffect(() => {
    if (isOpen && suggestions.length > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000); // Auto-dismiss after 6 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, suggestions.length, onClose]);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50" style={{ animation: "slideIn 0.3s ease-out" }}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="font-semibold text-gray-900">AI Suggestions Applied</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          {suggestions.map(({ fieldId, fieldLabel, confidence }) => (
            <div key={fieldId} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{fieldLabel}</span>
              <span className="text-blue-600 font-medium">
                {Math.round(confidence * 100)}% confidence
              </span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Review and edit suggestions before submitting.
        </p>
      </div>
    </div>
  );
}

