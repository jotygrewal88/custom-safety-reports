"use client";

import React, { useState } from "react";
import type { TemplateField } from "../templates/safetyEventTemplate";

interface FieldSettingsPanelProps {
  field: TemplateField | null;
  onUpdateField: (updates: Partial<TemplateField>) => void;
  onRemoveField: () => void;
  isReadOnly?: boolean;
}

export default function FieldSettingsPanel({ field, onUpdateField, onRemoveField, isReadOnly = false }: FieldSettingsPanelProps) {
  const [localLabel, setLocalLabel] = useState("");
  const [localHelpText, setLocalHelpText] = useState("");
  const [localPlaceholder, setLocalPlaceholder] = useState("");
  const [localRequired, setLocalRequired] = useState(false);
  const [localOptions, setLocalOptions] = useState<Array<{ value: string; label: string; description?: string }>>([]);
  const [lastFieldId, setLastFieldId] = useState<string | null>(null);

  // Update local state when field changes - track previous field ID
  const currentFieldId = field?.id ?? null;
  if (currentFieldId !== lastFieldId && field) {
    setLocalLabel(field.label || "");
    setLocalHelpText(field.helpText || "");
    setLocalPlaceholder(field.placeholder || "");
    setLocalRequired(field.required || false);
    setLocalOptions(field.options || []);
  }
  if (currentFieldId !== lastFieldId) {
    setLastFieldId(currentFieldId);
  }

  if (!field) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p className="text-sm">Select a field to edit</p>
        </div>
      </div>
    );
  }

  const handleAddOption = () => {
    const newOption = { value: `option${localOptions.length + 1}`, label: `Option ${localOptions.length + 1}` };
    const updated = [...localOptions, newOption];
    setLocalOptions(updated);
    onUpdateField({ options: updated });
  };

  const handleRemoveOption = (index: number) => {
    const updated = localOptions.filter((_, i) => i !== index);
    setLocalOptions(updated);
    onUpdateField({ options: updated });
  };

  const handleUpdateOption = (index: number, updates: Partial<typeof localOptions[0]>) => {
    const updated = localOptions.map((opt, i) => i === index ? { ...opt, ...updates } : opt);
    setLocalOptions(updated);
    onUpdateField({ options: updated });
  };

  const showOptionsEditor = field.componentType === 'dropdown' || field.componentType === 'multiselect';

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Field Settings</h3>
          <p className="text-xs text-gray-500">
            {field.locked ? "Core fields have limited editing" : "Configure field properties"}
          </p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label {field.required && <span className="text-red-600">*</span>}
            {field.locked && <span className="ml-2 text-xs text-gray-500">(Core Field)</span>}
          </label>
          <input
            type="text"
            value={localLabel}
            onChange={(e) => {
              setLocalLabel(e.target.value);
              onUpdateField({ label: e.target.value });
            }}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Help Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Help Text
          </label>
          <textarea
            value={localHelpText}
            onChange={(e) => {
              setLocalHelpText(e.target.value);
              onUpdateField({ helpText: e.target.value });
            }}
            rows={3}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Optional help text to guide users"
          />
        </div>

        {/* Placeholder (for text fields) */}
        {(field.componentType === 'text' || field.componentType === 'textarea' || field.componentType === 'number') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placeholder
            </label>
            <input
              type="text"
              value={localPlaceholder}
              onChange={(e) => {
                setLocalPlaceholder(e.target.value);
                onUpdateField({ placeholder: e.target.value });
              }}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Enter value..."
            />
          </div>
        )}

        {/* Required Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Required Field</span>
            <button
              type="button"
              disabled={field.locked || isReadOnly}
              onClick={() => {
                const newValue = !localRequired;
                setLocalRequired(newValue);
                onUpdateField({ required: newValue });
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localRequired ? "bg-blue-600" : "bg-gray-200"
              } ${field.locked || isReadOnly ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localRequired ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>

        {/* Field Type (read-only for now) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Type
          </label>
          <input
            type="text"
            value={field.componentType}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500"
          />
        </div>

        {/* Options Editor (for dropdown/multiselect) */}
        {showOptionsEditor && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2 mb-2">
              {localOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-2 bg-white p-2 rounded border border-gray-200">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleUpdateOption(index, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      disabled={isReadOnly}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Option label"
                    />
                    <input
                      type="text"
                      value={option.description || ""}
                      onChange={(e) => handleUpdateOption(index, { description: e.target.value })}
                      disabled={isReadOnly}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Optional description"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isReadOnly}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Option
            </button>
          </div>
        )}

        {/* Delete Field Button (only for non-core fields) */}
        {!field.locked && (
          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onRemoveField}
              disabled={isReadOnly}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Field
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

