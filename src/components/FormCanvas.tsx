"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import FieldItem from "./FieldItem";
import type { TemplateField } from "../templates/safetyEventTemplate";

interface FormCanvasProps {
  fields: TemplateField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
  isReadOnly?: boolean;
}

export default function FormCanvas({ fields, selectedFieldId, onSelectField, onRemoveField, isReadOnly = false }: FormCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'form-canvas'
  });

  // Separate core and non-core fields
  const coreFields = fields.filter(f => f.locked);
  const nonCoreFields = fields.filter(f => !f.locked);

  return (
    <div ref={setNodeRef} className="flex-1 bg-white overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Form Canvas</h2>
          <p className="text-sm text-gray-600">
            Drag fields from the left palette to add them, or reorder existing fields
          </p>
        </div>

        {/* Core Fields (always at top, locked) */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Core Fields (Required)
          </h3>
          {coreFields.map((field) => (
            <FieldItem
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onSelectField(field.id)}
              onRemove={() => {}}
              isDraggable={false}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Non-Core Fields (draggable, removable) */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Additional Fields
          </h3>
          {nonCoreFields.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">Drag fields from the left palette to add them here</p>
            </div>
          ) : (
            <SortableContext
              items={nonCoreFields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {nonCoreFields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onRemove={() => onRemoveField(field.id)}
                  isDraggable={true}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}

