/**
 * Safety Event Form Template Definition
 * 
 * This template defines the structure and fields for Safety Event forms.
 * Supports flexible template building with core, common, and custom fields.
 */

import { COMMON_SAFETY_FIELDS } from "./paletteFields";

export interface TemplateField {
  id: string;
  fieldType: 'core' | 'common' | 'custom';
  componentType: 'text' | 'textarea' | 'dropdown' | 'multiselect' | 'checkbox' | 'datetime' | 'file' | 'signature' | 'number' | 'bodyDiagram' | 'sceneDiagram' | 'sketch' | 'gpsLocation';
  label: string;
  helpText?: string;
  placeholder?: string;
  required: boolean;
  locked?: boolean; // For core fields that cannot be removed or modified
  options?: Array<{ value: string; label: string; description?: string }>;
  validation?: {
    min?: number;
    max?: number;
    maxSize?: number;
    maxFiles?: number;
    mimeTypes?: string[];
  };
}

export interface LogicRule {
  id: string;
  triggerFieldId: string;
  operator: 
    | 'equals' 
    | 'not_equals' 
    | 'is_empty' 
    | 'is_not_empty'
    | 'contains'
    | 'does_not_contain'
    | 'is_one_of'
    | 'is_not_one_of'
    | 'greater_than'
    | 'less_than'
    | 'greater_than_or_equal'
    | 'less_than_or_equal';
  value?: string | string[]; // Can be array for is_one_of/is_not_one_of
  action: 'show' | 'hide' | 'require' | 'optional';
  targetFieldId: string;
}

export interface SafetyEventTemplate {
  templateId: string;
  name: string;
  status: 'draft' | 'active' | 'archived';
  owner: string;
  createdAt: string;
  updatedAt: string;
  usage: { qrCodesLinked: number };
  fields: TemplateField[]; // Ordered list including core + all fields
  logicRules?: LogicRule[]; // Conditional logic rules for this template
}

// Core fields that are always present and locked
export const CORE_FIELDS: TemplateField[] = [
  {
    id: "title",
    fieldType: "core",
    componentType: "text",
    label: "Report Title",
    helpText: "Brief summary of the safety event",
    placeholder: "e.g., Slip and fall in warehouse",
    required: true,
    locked: true
  },
  {
    id: "dateTime",
    fieldType: "core",
    componentType: "datetime",
    label: "Date & Time of Incident",
    helpText: "When did this event occur?",
    required: true,
    locked: true
  },
  {
    id: "description",
    fieldType: "core",
    componentType: "textarea",
    label: "Description",
    helpText: "Provide a detailed description of what happened",
    placeholder: "Describe what happened in detail...",
    required: true,
    locked: true
  }
];

// Re-export COMMON_SAFETY_FIELDS for backward compatibility
export { COMMON_SAFETY_FIELDS };

// Default template configuration
export const defaultTemplate: SafetyEventTemplate = {
  templateId: "injury-report",
  name: "Injury Report",
  status: "active",
  owner: "System Admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  usage: { qrCodesLinked: 0 },
  fields: [
    ...CORE_FIELDS,
    ...COMMON_SAFETY_FIELDS
  ]
};

// Helper function to get only the core fields
export function getCoreFields(): TemplateField[] {
  return CORE_FIELDS;
}

// Helper function to get all fields from a template
export function getAllFields(template: SafetyEventTemplate): TemplateField[] {
  return template.fields;
}

// Helper function to check if a field is required
export function isFieldRequired(template: SafetyEventTemplate, fieldId: string): boolean {
  const field = template.fields.find(f => f.id === fieldId);
  return field?.required ?? false;
}

// Helper function to check if a field is locked (core field)
export function isFieldLocked(field: TemplateField): boolean {
  return field.locked === true || field.fieldType === 'core';
}
