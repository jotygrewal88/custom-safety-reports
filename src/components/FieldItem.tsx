"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TemplateField } from "../templates/safetyEventTemplate";

interface FieldItemProps {
  field: TemplateField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  isDraggable: boolean;
}

export default function FieldItem({ field, isSelected, onSelect, onRemove, isDraggable }: FieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id,
    disabled: !isDraggable
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getComponentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      text: "bg-blue-100 text-blue-700",
      textarea: "bg-blue-100 text-blue-700",
      dropdown: "bg-purple-100 text-purple-700",
      multiselect: "bg-purple-100 text-purple-700",
      checkbox: "bg-green-100 text-green-700",
      datetime: "bg-orange-100 text-orange-700",
      file: "bg-pink-100 text-pink-700",
      signature: "bg-indigo-100 text-indigo-700",
      number: "bg-cyan-100 text-cyan-700",
      gpsLocation: "bg-emerald-100 text-emerald-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border-2 rounded-lg p-4 transition-all ${
        isSelected 
          ? "border-blue-500 shadow-md" 
          : field.locked
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        {isDraggable && (
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
            {...attributes}
            {...listeners}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        )}

        {/* Lock Icon for core fields */}
        {field.locked && (
          <div className="text-gray-400 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>
        )}

        {/* Field Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{field.label}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getComponentTypeBadge(field.componentType)}`}>
              {field.componentType}
            </span>
            {field.required && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                Required
              </span>
            )}
          </div>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>

        {/* Remove Button */}
        {!field.locked && isDraggable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}





