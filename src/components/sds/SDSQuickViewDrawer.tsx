"use client";

import React, { useState } from "react";
import { type SDSDocument } from "./UploadSDSModal";
import { GHSPictogramList } from "./GHSPictograms";

interface SDSQuickViewDrawerProps {
  sds: SDSDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onPrintLabel?: (sds: SDSDocument) => void;
  onOpenFullSDS?: (sds: SDSDocument) => void;
}

// PPE Icon mapping function - returns specific SVG icons based on PPE text
function getPPEIcon(ppeText: string): React.ReactNode {
  const text = ppeText.toLowerCase();
  
  // Safety glasses / eye protection
  if (text.includes("glasses") || text.includes("goggles") || text.includes("eye") || text.includes("face shield")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.5 12.5c0-2 1.5-4 4.5-4h10c3 0 4.5 2 4.5 4 0 2-1.5 4-4.5 4H7c-3 0-4.5-2-4.5-4z" />
        <circle cx="8" cy="12.5" r="2.5" strokeWidth={1.5} />
        <circle cx="16" cy="12.5" r="2.5" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeWidth={1.5} d="M10.5 12.5h3" />
      </svg>
    );
  }
  
  // Gloves
  if (text.includes("gloves") || text.includes("rubber") || text.includes("nitrile") || text.includes("butyl") || text.includes("neoprene")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 14v-4a2 2 0 012-2h0a2 2 0 012 2v1m0-1V8a2 2 0 012-2h0a2 2 0 012 2v3m0 0V9a2 2 0 012-2h0a2 2 0 012 2v5a6 6 0 01-6 6h-2a6 6 0 01-6-6v-2a2 2 0 012-2h0a2 2 0 012 2v1" />
      </svg>
    );
  }
  
  // Respirator / mask
  if (text.includes("respirator") || text.includes("mask") || text.includes("breathing") || text.includes("scba") || text.includes("air")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4a8 8 0 00-8 8v3a5 5 0 005 5h6a5 5 0 005-5v-3a8 8 0 00-8-8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13h8M8 16h8" />
        <circle cx="6" cy="12" r="1.5" strokeWidth={1.5} />
        <circle cx="18" cy="12" r="1.5" strokeWidth={1.5} />
      </svg>
    );
  }
  
  // Protective clothing / suit / coat / apron
  if (text.includes("clothing") || text.includes("coat") || text.includes("suit") || text.includes("apron") || text.includes("coverall")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4l-4 2v4l-4 2v8h16v-8l-4-2V6l-4-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16" />
      </svg>
    );
  }
  
  // Boots / shoes / footwear
  if (text.includes("boots") || text.includes("shoes") || text.includes("footwear")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 18h16v2H4v-2zM6 14l2-6h8l2 6v4H6v-4z" />
        <path strokeLinecap="round" strokeWidth={1.5} d="M8 8v2m8-2v2" />
      </svg>
    );
  }
  
  // Welding helmet
  if (text.includes("welding") || text.includes("helmet") || text.includes("shade")) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3a9 9 0 00-9 9v3h18v-3a9 9 0 00-9-9z" />
        <rect x="6" y="9" width="12" height="4" rx="1" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
      </svg>
    );
  }
  
  // Default shield icon for other PPE
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export default function SDSQuickViewDrawer({ sds, isOpen, onClose, onPrintLabel, onOpenFullSDS }: SDSQuickViewDrawerProps) {
  const [showPrintMessage, setShowPrintMessage] = useState(false);
  
  if (!sds) return null;

  const handleOpenPDF = () => {
    // Open the Full SDS Modal if callback provided
    if (onOpenFullSDS) {
      onOpenFullSDS(sds);
      onClose(); // Close the quick view drawer when opening full SDS
    } else {
      // Fallback - open PDF in new window
      window.open(`/sds-pdf/${sds.id}`, '_blank');
    }
  };

  const handlePrintLabel = () => {
    if (onPrintLabel) {
      onPrintLabel(sds);
    } else {
      setShowPrintMessage(true);
      setTimeout(() => setShowPrintMessage(false), 2000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[520px] bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with Pictograms */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{sds.product}</h2>
              <p className="text-sm text-gray-600">{sds.manufacturer}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Signal Word Badge and CAS */}
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
                sds.signalWord === "Danger"
                  ? "bg-red-600 text-white"
                  : sds.signalWord === "Warning"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {sds.signalWord}
            </span>
            <span className="text-sm text-gray-500 font-mono">CAS: {sds.casNumber}</span>
          </div>

          {/* GHS Pictograms in Header for High Visibility */}
          <div className="mt-4">
            <GHSPictogramList pictograms={sds.pictograms} size="md" showLabels />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Hazard Statements */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Hazard Statements
            </h3>
            <div className="space-y-2">
              {sds.hazardStatements.map((statement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800">{statement}</span>
                </div>
              ))}
            </div>
          </section>

          {/* PPE Requirements with Specific Icons */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Required PPE
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sds.ppe.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2.5 bg-green-50 text-green-700 rounded-lg border border-green-200"
                >
                  <span className="text-green-600 flex-shrink-0">
                    {getPPEIcon(item)}
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* First Aid Measures (Emergency Response) */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Emergency Response (First Aid)
            </h3>
            <div className="space-y-3">
              {/* Eyes */}
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-bold text-blue-900 uppercase">Eye Contact</span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{sds.firstAid.eyes}</p>
              </div>

              {/* Skin */}
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                  <span className="text-sm font-bold text-blue-900 uppercase">Skin Contact</span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{sds.firstAid.skin}</p>
              </div>

              {/* Inhalation */}
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  <span className="text-sm font-bold text-blue-900 uppercase">Inhalation</span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{sds.firstAid.inhalation}</p>
              </div>
            </div>
          </section>

          {/* Storage & Handling Section */}
          {sds.storageHandling && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Storage & Handling
              </h3>
              <div className="space-y-3">
                {/* Storage */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-bold text-amber-900">Storage Requirements</span>
                  </div>
                  <ul className="space-y-1.5">
                    {sds.storageHandling.storage.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                        <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Handling */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <span className="text-sm font-bold text-orange-900">Handling Precautions</span>
                  </div>
                  <ul className="space-y-1.5">
                    {sds.storageHandling.handling.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-orange-800">
                        <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Physical Properties */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Physical Properties
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
                <p className="text-xs text-purple-600 mb-1">Flash Point</p>
                <p className="text-sm font-semibold text-purple-900">{sds.flashPoint}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
                <p className="text-xs text-purple-600 mb-1">pH Value</p>
                <p className="text-sm font-semibold text-purple-900">{sds.phValue}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-100">
                <p className="text-xs text-purple-600 mb-1">Appearance</p>
                <p className="text-sm font-semibold text-purple-900">{sds.appearance}</p>
              </div>
            </div>
          </section>

          {/* Location Path */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Storage Location
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center flex-wrap gap-1 text-sm">
                {sds.locationPath.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <span
                      className={`px-2 py-1 rounded ${
                        index === sds.locationPath.length - 1
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-white text-gray-700 border border-gray-200"
                      }`}
                    >
                      {item}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">
              Last updated: {new Date(sds.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenPDF}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Open Full SDS PDF
            </button>
            <button
              onClick={handlePrintLabel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Label
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-2 text-center text-sm text-gray-500 hover:text-gray-700 py-1"
          >
            Close
          </button>
          
          {/* Print Message Toast */}
          {showPrintMessage && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
              Opening label printer dialog...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
