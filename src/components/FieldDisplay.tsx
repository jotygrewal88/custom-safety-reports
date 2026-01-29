"use client";

import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldValue = any;

interface FieldDisplayProps {
  field: {
    id: string;
    label: string;
    componentType: string;
    options?: Array<{ value: string; label: string }>;
  };
  value: FieldValue;
}

export default function FieldDisplay({ field, value }: FieldDisplayProps) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-sm text-gray-400 italic">Not provided</span>;
  }

  switch (field.componentType) {
    case "text":
      return <span className="text-sm text-gray-700">{String(value)}</span>;

    case "textarea":
      return <p className="text-sm text-gray-700 whitespace-pre-line">{String(value)}</p>;

    case "number":
      return <span className="text-sm text-gray-700">{Number(value).toLocaleString()}</span>;

    case "dropdown":
      // Find the option label if available
      if (field.options) {
        const option = field.options.find(opt => opt.value === value);
        if (option) {
          return <span className="text-sm text-gray-700">{option.label}</span>;
        }
      }
      return <span className="text-sm text-gray-700">{String(value)}</span>;

    case "multiselect":
      if (Array.isArray(value)) {
        const selectedLabels = value.map(val => {
          if (field.options) {
            const option = field.options.find(opt => opt.value === val);
            return option ? option.label : val;
          }
          return val;
        });
        return <span className="text-sm text-gray-700">{selectedLabels.join(", ")}</span>;
      }
      return <span className="text-sm text-gray-700">{String(value)}</span>;

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span className="text-sm text-gray-700">Yes</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm text-gray-400">No</span>
            </>
          )}
        </div>
      );

    case "datetime":
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return <span className="text-sm text-gray-700">{String(value)}</span>;
      }
      return (
        <span className="text-sm text-gray-700">
          {dateValue.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
          })}
        </span>
      );

    case "file":
      if (Array.isArray(value)) {
        return (
          <div className="space-y-2">
            {value.map((file: { name?: string; size?: number }, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{file.name || `File ${index + 1}`}</span>
                {file.size && (
                  <span className="text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      }
      return <span className="text-sm text-gray-700">{String(value)}</span>;

    case "gpsLocation":
      if (typeof value === "object" && value.latitude && value.longitude) {
        const latDir = value.latitude >= 0 ? 'N' : 'S';
        const lonDir = value.longitude >= 0 ? 'E' : 'W';
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="text-sm text-gray-700">
              {Math.abs(value.latitude).toFixed(4)}°{latDir}, {Math.abs(value.longitude).toFixed(4)}°{lonDir}
            </span>
          </div>
        );
      }
      return <span className="text-sm text-gray-400 italic">Invalid GPS data</span>;

    case "bodyDiagram":
    case "sceneDiagram":
    case "sketch":
      return (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="flex items-center justify-center h-32 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Diagram preview</p>
        </div>
      );

    case "signature":
      if (typeof value === "object" && value.name) {
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm text-gray-700">{value.name}</span>
          </div>
        );
      }
      return <span className="text-sm text-gray-700">{String(value)}</span>;

    default:
      return <span className="text-sm text-gray-700">{String(value)}</span>;
  }
}










