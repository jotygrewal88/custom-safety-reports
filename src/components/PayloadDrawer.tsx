"use client";

import React from "react";

type PayloadDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export default function PayloadDrawer({ isOpen, onClose, payload }: PayloadDrawerProps) {
  if (!isOpen) return null;

  const jsonString = JSON.stringify(payload, null, 2);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Submission Payload Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
              <code>{jsonString}</code>
            </pre>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex gap-2 justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(jsonString);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Copy JSON
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}









