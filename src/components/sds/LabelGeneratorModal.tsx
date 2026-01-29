"use client";

import React, { useRef } from "react";
import { type SDSDocument } from "./UploadSDSModal";
import { GHSPictogramList } from "./GHSPictograms";

interface LabelGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SDSDocument[];
}

// Individual label component (4"x6" format for secondary containers)
function SecondaryContainerLabel({ sds }: { sds: SDSDocument }) {
  return (
    <div className="label-container border-2 border-gray-300 rounded-lg p-4 bg-white" style={{ width: "4in", height: "6in" }}>
      {/* Product Name - Large and Bold */}
      <div className="border-b-2 border-gray-800 pb-2 mb-3">
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{sds.product}</h2>
        <p className="text-xs text-gray-600 mt-1">{sds.manufacturer}</p>
      </div>

      {/* Signal Word - Large and Prominent */}
      <div className="mb-3">
        <div
          className={`inline-block px-4 py-2 rounded font-bold text-lg ${
            sds.signalWord === "Danger"
              ? "bg-red-600 text-white"
              : sds.signalWord === "Warning"
              ? "bg-amber-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {sds.signalWord.toUpperCase()}
        </div>
      </div>

      {/* GHS Pictograms */}
      <div className="mb-3 flex justify-center">
        <GHSPictogramList pictograms={sds.pictograms} size="lg" />
      </div>

      {/* Hazard Statements */}
      <div className="mb-3 border border-gray-300 rounded p-2 bg-gray-50">
        <p className="text-xs font-semibold text-gray-700 mb-1 uppercase">Hazard Statements</p>
        <ul className="text-xs text-gray-800 space-y-0.5">
          {sds.hazardStatements.slice(0, 4).map((statement, index) => (
            <li key={index} className="leading-tight">• {statement}</li>
          ))}
          {sds.hazardStatements.length > 4 && (
            <li className="text-gray-500 italic">...and {sds.hazardStatements.length - 4} more</li>
          )}
        </ul>
      </div>

      {/* PPE Summary */}
      <div className="mb-3 border border-gray-300 rounded p-2 bg-gray-50">
        <p className="text-xs font-semibold text-gray-700 mb-1 uppercase">Required PPE</p>
        <p className="text-xs text-gray-800 leading-tight">
          {sds.ppe.slice(0, 3).join(", ")}
          {sds.ppe.length > 3 && `, +${sds.ppe.length - 3} more`}
        </p>
      </div>

      {/* CAS Number */}
      <div className="mt-auto pt-2 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">CAS:</span> {sds.casNumber || "N/A"} | 
          <span className="font-semibold ml-2">Code:</span> {sds.productCode || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default function LabelGeneratorModal({ isOpen, onClose, documents }: LabelGeneratorModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .label-container {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 0.25in;
          }
          .label-grid {
            display: grid;
            grid-template-columns: repeat(2, 4in);
            gap: 0.25in;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 no-print" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 no-print">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Secondary Container Label Generator</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generating {documents.length} label{documents.length !== 1 ? "s" : ""} for Avery 4&quot;x6&quot; sheets
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div ref={printRef} className="print-area">
              {/* Info Banner */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 no-print">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">OSHA Compliant Labels</p>
                    <p className="text-sm text-blue-700 mt-1">
                      These labels meet OSHA HazCom 2012 requirements for secondary containers.
                      Each label includes the product name, signal word, pictograms, and hazard statements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Label Grid */}
              <div className="label-grid grid grid-cols-2 gap-6 justify-items-center">
                {documents.map((doc) => (
                  <SecondaryContainerLabel key={doc.id} sds={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between no-print">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{documents.length}</span> label{documents.length !== 1 ? "s" : ""} ready to print
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Labels
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
