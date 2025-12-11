"use client";

import React, { useState } from "react";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  checkDuplicateName: (name: string) => boolean;
}

export default function CreateTemplateModal({
  isOpen,
  onClose,
  onSubmit,
  checkDuplicateName
}: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState("");
  const [lastOpenState, setLastOpenState] = useState(isOpen);

  // Reset state when modal opens - track previous state to detect transition
  if (isOpen && !lastOpenState) {
    setTemplateName("");
    setError("");
  }
  if (isOpen !== lastOpenState) {
    setLastOpenState(isOpen);
  }

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemplateName(value);
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = templateName.trim();
    
    // Validate empty name
    if (!trimmedName) {
      return; // Button should be disabled, but just in case
    }
    
    // Check for duplicate
    if (checkDuplicateName(trimmedName)) {
      setError("A template with this name already exists");
      return;
    }
    
    // Submit the name
    onSubmit(trimmedName);
    onClose();
  };

  const handleCancel = () => {
    setTemplateName("");
    setError("");
    onClose();
  };

  const isNameEmpty = templateName.trim().length === 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      onClick={(e) => {
        // Close if clicking outside the modal
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                id="templateName"
                type="text"
                value={templateName}
                onChange={handleNameChange}
                placeholder="e.g., Injury Report, Near Miss"
                autoFocus
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              The new template will start with the three core fields: Report Title, Date & Time of Incident, and Description.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isNameEmpty}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

