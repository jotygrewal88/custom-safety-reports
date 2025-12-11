"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CORE_FIELDS } from "../templates/safetyEventTemplate";
import { BASIC_FIELD_TYPES } from "../templates/fieldTypes";
import {
  INCIDENT_DETAILS_FIELDS,
  INJURY_MEDICAL_FIELDS,
  CAUSE_RISK_FIELDS,
  ENVIRONMENTAL_PROPERTY_FIELDS,
  GUEST_LEGAL_FIELDS,
  SIGNOFF_REVIEW_FIELDS,
  DIAGRAMS_SKETCHES_FIELDS
} from "../templates/paletteFields";

interface DraggablePaletteItemProps {
  id: string;
  label: string;
  disabled?: boolean;
  onAdd?: () => void;
}

function DraggablePaletteItem({ id, label, disabled, onAdd }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${id}`,
    disabled,
    data: { type: 'palette-item', fieldId: id }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onAdd) {
      onAdd();
    }
  };

  return (
    <div
      style={style}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
        disabled 
          ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
          : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      {/* Drag handle area - this is the only draggable part */}
      <div 
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`flex-1 flex items-center gap-2 ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
        <span className="flex-1">{label}</span>
      </div>
      {/* Add button or lock icon - completely separate from drag */}
      {disabled ? (
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
      ) : (
        <button
          type="button"
          onClick={handleAddClick}
          className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
          title="Click to add field"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface FieldPaletteProps {
  onAddField?: (fieldId: string) => void;
}

export default function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Core Fields */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Core Fields
          </h3>
          <div className="space-y-2">
            {CORE_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                disabled={true}
              />
            ))}
          </div>
        </div>

        {/* Basic Fields */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Basic Fields
          </h3>
          <div className="space-y-2">
            {BASIC_FIELD_TYPES.map((fieldType) => (
              <DraggablePaletteItem
                key={fieldType.id}
                id={fieldType.id}
                label={fieldType.label}
                onAdd={onAddField ? () => onAddField(fieldType.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Incident Details */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Incident Details
          </h3>
          <div className="space-y-2">
            {INCIDENT_DETAILS_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Injury & Medical */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Injury & Medical
          </h3>
          <div className="space-y-2">
            {INJURY_MEDICAL_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Cause & Risk Analysis */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Cause & Risk Analysis
          </h3>
          <div className="space-y-2">
            {CAUSE_RISK_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Environmental & Property Impact */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Environmental & Property Impact
          </h3>
          <div className="space-y-2">
            {ENVIRONMENTAL_PROPERTY_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Guest / Customer & Legal */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Guest / Customer & Legal
          </h3>
          <div className="space-y-2">
            {GUEST_LEGAL_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Sign-off & Review */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Sign-off & Review
          </h3>
          <div className="space-y-2">
            {SIGNOFF_REVIEW_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Diagrams & Sketches */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Diagrams & Sketches
          </h3>
          <div className="space-y-2">
            {DIAGRAMS_SKETCHES_FIELDS.map((field) => (
              <DraggablePaletteItem
                key={field.id}
                id={field.id}
                label={field.label}
                onAdd={onAddField ? () => onAddField(field.id) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

