"use client";

import React, { useState, useEffect, useCallback } from "react";
import { type SDSDocument } from "./UploadSDSModal";

interface BinderBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SDSDocument[];
  locationName: string;
}

type ModalState = "confirm" | "loading" | "success";

export default function BinderBuilderModal({ isOpen, onClose, documents, locationName }: BinderBuilderModalProps) {
  const [state, setState] = useState<ModalState>("confirm");
  const [progress, setProgress] = useState(0);

  // Reset state when modal opens - this is an intentional reset pattern for modals
  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/purity */
  useEffect(() => {
    if (isOpen) {
      setState("confirm");
      setProgress(0);
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/purity */

  // Simulate loading progress
  const startCompiling = useCallback(() => {
    setState("loading");
    setProgress(0);

    // Simulate progress over 2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    // Transition to success after 2.5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setState("success");
    }, 2500);
  }, []);

  // Generate and download the simulated PDF
  const handleDownload = () => {
    // Create a text-based representation of the binder
    const binderContent = generateBinderContent(documents, locationName);
    
    // Create a Blob
    const blob = new Blob([binderContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `${locationName.replace(/\s+/g, "_")}_SDS_Binder_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Close modal after download
    setTimeout(onClose, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={state !== "loading" ? onClose : undefined} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Generate Site Binder</h2>
                <p className="text-sm text-gray-600">Right-to-Know Compliance Package</p>
              </div>
            </div>
            {state !== "loading" && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Confirm State */}
          {state === "confirm" && (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-indigo-900">Location: {locationName}</span>
                </div>
                <p className="text-sm text-indigo-700">
                  This will generate a comprehensive SDS binder containing all Safety Data Sheets assigned to this location, 
                  complete with a Table of Contents for easy reference.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Binder Contents</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cover Page</span>
                    <span className="text-gray-400">1 page</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Table of Contents</span>
                    <span className="text-gray-400">1 page</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Safety Data Sheets</span>
                    <span className="font-medium text-gray-900">{documents.length} documents</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-indigo-600">{documents.length + 2} pages</span>
                    </div>
                  </div>
                </div>
              </div>

              {documents.length === 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-medium">No SDS documents found for this location.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {state === "loading" && (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center">
                {/* Animated Binder Icon */}
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-indigo-100 rounded-lg animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compiling Binder</h3>
                <p className="text-sm text-gray-600 text-center max-w-sm animate-pulse">
                  Compiling Location Binder and Generating Table of Contents...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Processing {documents.length} documents...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === "success" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Binder Ready!</h3>
                <p className="text-sm text-gray-600">Your SDS binder has been compiled successfully.</p>
              </div>

              {/* Table of Contents Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">Table of Contents</h4>
                <ol className="space-y-1.5 text-sm">
                  {documents.map((doc, index) => (
                    <li key={doc.id} className="flex items-center gap-2 text-gray-700">
                      <span className="w-6 h-6 bg-white rounded border border-gray-300 flex items-center justify-center text-xs font-mono">
                        {index + 1}
                      </span>
                      <span className="truncate flex-1">{doc.product}</span>
                      <span className="text-gray-400 text-xs">{doc.manufacturer}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Filename: {locationName.replace(/\s+/g, "_")}_SDS_Binder_{new Date().toISOString().split("T")[0]}.pdf
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          {state === "confirm" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startCompiling}
                disabled={documents.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Generate Binder
              </button>
            </>
          )}

          {state === "loading" && (
            <button
              disabled
              className="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </button>
          )}

          {state === "success" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate binder content
function generateBinderContent(documents: SDSDocument[], locationName: string): string {
  const date = new Date().toLocaleDateString();
  const separator = "=".repeat(60);
  
  let content = `
${separator}
                    SAFETY DATA SHEET BINDER
${separator}

Location: ${locationName}
Generated: ${date}
Total Documents: ${documents.length}

${separator}
                    TABLE OF CONTENTS
${separator}

`;

  documents.forEach((doc, index) => {
    content += `${(index + 1).toString().padStart(3, " ")}. ${doc.product}\n`;
    content += `      Manufacturer: ${doc.manufacturer}\n`;
    content += `      CAS Number: ${doc.casNumber || "N/A"}\n\n`;
  });

  content += `\n${separator}\n                    SAFETY DATA SHEETS\n${separator}\n\n`;

  documents.forEach((doc, index) => {
    content += `
${"─".repeat(60)}
SECTION ${index + 1}: ${doc.product.toUpperCase()}
${"─".repeat(60)}

PRODUCT IDENTIFICATION
----------------------
Product Name: ${doc.product}
Manufacturer: ${doc.manufacturer}
CAS Number: ${doc.casNumber || "N/A"}
Product Code: ${doc.productCode || "N/A"}
Revision Date: ${doc.revisionDate || "N/A"}

HAZARD IDENTIFICATION
---------------------
Signal Word: ${doc.signalWord}
GHS Pictograms: ${doc.pictograms.join(", ")}

Hazard Statements:
${doc.hazardStatements.map((s) => `  • ${s}`).join("\n")}

SAFETY MEASURES
---------------
Required PPE:
${doc.ppe.map((p) => `  • ${p}`).join("\n")}

FIRST AID MEASURES
------------------
Eye Contact: ${doc.firstAid.eyes}

Skin Contact: ${doc.firstAid.skin}

Inhalation: ${doc.firstAid.inhalation}

PHYSICAL PROPERTIES
-------------------
Flash Point: ${doc.flashPoint || "N/A"}
pH Value: ${doc.phValue || "N/A"}
Appearance: ${doc.appearance || "N/A"}

STORAGE LOCATION
----------------
${doc.locationPath.join(" > ")}

`;
  });

  content += `\n${separator}\n                    END OF BINDER\n${separator}\n`;
  
  return content;
}
