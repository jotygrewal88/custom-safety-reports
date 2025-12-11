import type { FieldDef } from "../schemas/types";
import { isPermanentlyRequired } from "../runtime/logic";

export type ValidationError = {
  fieldId: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

/**
 * Validates a single field value against its definition
 */
function validateField(
  field: FieldDef,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  isVisible: boolean,
  isRequired: boolean
): ValidationError | null {
  // Skip validation for hidden fields (unless permanently required)
  if (!isVisible && !isPermanentlyRequired(field.id)) {
    return null;
  }

  // Check required
  if (isRequired) {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      return {
        fieldId: field.id,
        message: `${field.label} is required`,
      };
    }
  }

  // Skip further validation if empty and not required
  if (value === undefined || value === null || value === "") {
    return null;
  }

  // Validate against field validation rules
  if (field.validation) {
    const { regex, min, max, fileTypes, maxBytes } = field.validation;

    // Regex validation
    if (regex && typeof value === "string") {
      const regexObj = new RegExp(regex);
      if (!regexObj.test(value)) {
        return {
          fieldId: field.id,
          message: `${field.label} format is invalid`,
        };
      }
    }

    // Number min/max validation
    if (typeof value === "number") {
      if (min !== undefined && value < min) {
        return {
          fieldId: field.id,
          message: `${field.label} must be at least ${min}`,
        };
      }
      if (max !== undefined && value > max) {
        return {
          fieldId: field.id,
          message: `${field.label} must be at most ${max}`,
        };
      }
    }

    // String length validation
    if (typeof value === "string") {
      if (min !== undefined && value.length < min) {
        return {
          fieldId: field.id,
          message: `${field.label} must be at least ${min} characters`,
        };
      }
      if (max !== undefined && value.length > max) {
        return {
          fieldId: field.id,
          message: `${field.label} must be at most ${max} characters`,
        };
      }
    }

    // File validation
    if (field.type === "file" && Array.isArray(value)) {
      // Check file count (max 20 files)
      if (value.length > 20) {
        return {
          fieldId: field.id,
          message: `Maximum 20 files allowed`,
        };
      }

      // Check each file
      for (const file of value) {
        if (fileTypes && file.mime) {
          const matches = fileTypes.some((type) => {
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0];
              return file.mime.startsWith(baseType + "/");
            }
            return file.mime === type;
          });

          if (!matches) {
            return {
              fieldId: field.id,
              message: `File type ${file.mime} is not allowed. Allowed types: ${fileTypes.join(", ")}`,
            };
          }
        }

        if (maxBytes && file.bytes && file.bytes > maxBytes) {
          const mb = (maxBytes / 1024 / 1024).toFixed(0);
          return {
            fieldId: field.id,
            message: `File "${file.name}" exceeds maximum size of ${mb}MB`,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Validates all fields against their definitions and computed states
 */
export function validateForm(
  fields: FieldDef[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>,
  visibility: Map<string, boolean>,
  requirements: Map<string, boolean>
): ValidationResult {
  const errors: ValidationError[] = [];

  fields.forEach((field) => {
    const isVisible = visibility.get(field.id) ?? field.visible !== false;
    const isRequired = requirements.get(field.id) ?? field.required === true;
    const value = values[field.id];

    const error = validateField(field, value, isVisible, isRequired);
    if (error) {
      errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single field (for onBlur validation)
 */
export function validateSingleField(
  field: FieldDef,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  isVisible: boolean,
  isRequired: boolean
): ValidationError | null {
  return validateField(field, value, isVisible, isRequired);
}

