/**
 * Field Type Definitions and Mappers
 * 
 * Defines basic field types, palette items, and conversion utilities
 * between TemplateField and FieldDef for form runtime compatibility.
 */

import type { TemplateField } from "./safetyEventTemplate";
import type { FieldDef } from "../schemas/types";

// Basic field types that can be added as custom fields
export interface BasicFieldType {
  id: string;
  componentType: TemplateField['componentType'];
  label: string;
  icon: string;
  defaultConfig: Partial<TemplateField>;
}

export const BASIC_FIELD_TYPES: BasicFieldType[] = [
  {
    id: "text",
    componentType: "text",
    label: "Short Text",
    icon: "text",
    defaultConfig: {
      fieldType: "custom",
      componentType: "text",
      label: "New Text Field",
      placeholder: "Enter text...",
      required: false
    }
  },
  {
    id: "textarea",
    componentType: "textarea",
    label: "Long Text",
    icon: "textarea",
    defaultConfig: {
      fieldType: "custom",
      componentType: "textarea",
      label: "New Text Area",
      placeholder: "Enter detailed text...",
      required: false
    }
  },
  {
    id: "number",
    componentType: "number",
    label: "Number",
    icon: "number",
    defaultConfig: {
      fieldType: "custom",
      componentType: "number",
      label: "New Number Field",
      placeholder: "0",
      required: false
    }
  },
  {
    id: "dropdown",
    componentType: "dropdown",
    label: "Dropdown",
    icon: "dropdown",
    defaultConfig: {
      fieldType: "custom",
      componentType: "dropdown",
      label: "New Dropdown",
      required: false,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" }
      ]
    }
  },
  {
    id: "multiselect",
    componentType: "multiselect",
    label: "Multi-select",
    icon: "multiselect",
    defaultConfig: {
      fieldType: "custom",
      componentType: "multiselect",
      label: "New Multi-select",
      required: false,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" }
      ]
    }
  },
  {
    id: "checkbox",
    componentType: "checkbox",
    label: "Checkbox",
    icon: "checkbox",
    defaultConfig: {
      fieldType: "custom",
      componentType: "checkbox",
      label: "New Checkbox",
      required: false
    }
  },
  {
    id: "datetime",
    componentType: "datetime",
    label: "Date/Time",
    icon: "datetime",
    defaultConfig: {
      fieldType: "custom",
      componentType: "datetime",
      label: "New Date/Time Field",
      required: false
    }
  },
  {
    id: "file",
    componentType: "file",
    label: "File Upload",
    icon: "file",
    defaultConfig: {
      fieldType: "custom",
      componentType: "file",
      label: "New File Upload",
      helpText: "Upload files (up to 5 files, 10MB each)",
      required: false,
      validation: {
        maxFiles: 5,
        maxSize: 10485760, // 10MB
        mimeTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"]
      }
    }
  },
  {
    id: "gpsLocation",
    componentType: "gpsLocation",
    label: "GPS Location",
    icon: "gps",
    defaultConfig: {
      fieldType: "custom",
      componentType: "gpsLocation",
      label: "GPS Location",
      helpText: "Automatically captures your current GPS coordinates",
      required: true
    }
  }
];

/**
 * Convert TemplateField to FieldDef for compatibility with form runtime
 */
export function templateFieldToFieldDef(field: TemplateField): FieldDef {
  return {
    id: field.id,
    label: field.label,
    type: mapComponentTypeToFieldDefType(field.componentType),
    required: field.required,
    helpText: field.helpText,
    placeholder: field.placeholder,
    // Use label for display, but we should ideally update FieldDef to support option objects
    options: field.options?.map(o => o.label || o.value),
    visible: true, // All fields in template are visible by default
    validation: field.validation
  } as FieldDef;
}

/**
 * Map TemplateField componentType to FieldDef type
 */
function mapComponentTypeToFieldDefType(componentType: TemplateField['componentType']): string {
  const typeMap: Record<TemplateField['componentType'], string> = {
    'text': 'text',
    'textarea': 'textarea',
    'dropdown': 'dropdown',
    'multiselect': 'multiselect',
    'checkbox': 'checkbox',
    'datetime': 'dateTime',
    'file': 'file',
    'signature': 'signature',
    'number': 'number',
    'bodyDiagram': 'bodyDiagram',
    'sceneDiagram': 'sceneDiagram',
    'sketch': 'sketch',
    'gpsLocation': 'gpsLocation'
  };
  return typeMap[componentType] || 'text';
}

/**
 * Generate a unique field ID for new custom fields
 */
export function generateFieldId(label: string): string {
  const timestamp = Date.now();
  const sanitized = label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return `custom_${sanitized}_${timestamp}`;
}

/**
 * Create a new custom field from a basic field type
 */
export function createCustomField(basicFieldType: BasicFieldType, customLabel?: string): TemplateField {
  const label = customLabel || basicFieldType.defaultConfig.label || basicFieldType.label;
  const id = generateFieldId(label);
  
  return {
    id,
    ...basicFieldType.defaultConfig,
    label,
    locked: false  // Ensure custom fields are deletable
  } as TemplateField;
}

/**
 * Validate a TemplateField
 */
export function validateTemplateField(field: TemplateField): string[] {
  const errors: string[] = [];
  
  if (!field.id) {
    errors.push("Field ID is required");
  }
  
  if (!field.label || field.label.trim() === "") {
    errors.push("Field label is required");
  }
  
  if (field.componentType === 'dropdown' || field.componentType === 'multiselect') {
    if (!field.options || field.options.length === 0) {
      errors.push("Dropdown and multi-select fields must have at least one option");
    }
  }
  
  return errors;
}

