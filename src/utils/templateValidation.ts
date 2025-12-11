import type { SafetyEventTemplate } from "../templates/safetyEventTemplate";
import { CORE_FIELDS } from "../templates/safetyEventTemplate";

export interface ValidationError {
  type: 'error' | 'warning';
  field?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a template before it can be set to 'active' status
 */
export function validateTemplateForActivation(template: SafetyEventTemplate): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. Check that all core fields are present
  const coreFieldIds = CORE_FIELDS.map(f => f.id);
  const templateFieldIds = template.fields.map(f => f.id);
  
  for (const coreId of coreFieldIds) {
    if (!templateFieldIds.includes(coreId)) {
      const coreField = CORE_FIELDS.find(f => f.id === coreId);
      errors.push({
        type: 'error',
        field: coreId,
        message: `Missing required core field: "${coreField?.label || coreId}"`
      });
    }
  }

  // 2. Check that no field has an empty or missing label
  for (const field of template.fields) {
    if (!field.label || field.label.trim() === '') {
      errors.push({
        type: 'error',
        field: field.id,
        message: `Field "${field.id}" has an empty label`
      });
    }
  }

  // 3. Check that all fields have valid field types
  const validComponentTypes = [
    'text', 'textarea', 'number', 'datetime', 'dropdown', 
    'multiselect', 'checkbox', 'file', 'signature',
    'bodyDiagram', 'sceneDiagram', 'sketch'
  ];
  
  for (const field of template.fields) {
    if (!validComponentTypes.includes(field.componentType)) {
      errors.push({
        type: 'error',
        field: field.id,
        message: `Field "${field.label}" has an invalid field type: "${field.componentType}"`
      });
    }
  }

  // 4. Validate logic rules
  if (template.logicRules && template.logicRules.length > 0) {
    for (const rule of template.logicRules) {
      // Check that triggerFieldId exists
      const triggerField = template.fields.find(f => f.id === rule.triggerFieldId);
      if (!triggerField) {
        errors.push({
          type: 'error',
          message: `Logic rule references non-existent trigger field: "${rule.triggerFieldId}"`
        });
      }

      // Check that targetFieldId exists
      const targetField = template.fields.find(f => f.id === rule.targetFieldId);
      if (!targetField) {
        errors.push({
          type: 'error',
          message: `Logic rule references non-existent target field: "${rule.targetFieldId}"`
        });
      }

      // Check that rules don't try to hide or make optional a core field
      if (targetField && coreFieldIds.includes(rule.targetFieldId)) {
        if (rule.action === 'hide') {
          errors.push({
            type: 'error',
            message: `Logic rule attempts to hide core field "${targetField.label}"`
          });
        }
        if (rule.action === 'optional') {
          errors.push({
            type: 'error',
            message: `Logic rule attempts to make core field "${targetField.label}" optional`
          });
        }
      }

      // Check that value is provided for operators that need it
      const valueRequiredOperators = [
        'equals', 'not_equals', 'contains', 'does_not_contain',
        'is_one_of', 'is_not_one_of', 'greater_than', 'less_than',
        'greater_than_or_equal', 'less_than_or_equal'
      ];
      
      if (valueRequiredOperators.includes(rule.operator) && !rule.value) {
        errors.push({
          type: 'warning',
          message: `Logic rule with operator "${rule.operator}" is missing a value`
        });
      }
    }
  }

  // 5. Check for dropdown/multiselect fields without options
  for (const field of template.fields) {
    if ((field.componentType === 'dropdown' || field.componentType === 'multiselect') && 
        (!field.options || field.options.length === 0)) {
      errors.push({
        type: 'warning',
        field: field.id,
        message: `Field "${field.label}" is a ${field.componentType} but has no options defined`
      });
    }
  }

  return {
    isValid: errors.filter(e => e.type === 'error').length === 0,
    errors
  };
}

/**
 * Check if a template status transition is allowed
 */
export function canTransitionStatus(
  currentStatus: SafetyEventTemplate['status'],
  newStatus: SafetyEventTemplate['status']
): { allowed: boolean; reason?: string } {
  // Same status - no change
  if (currentStatus === newStatus) {
    return { allowed: true };
  }

  // draft → active: requires validation (checked elsewhere)
  if (currentStatus === 'draft' && newStatus === 'active') {
    return { allowed: true };
  }

  // draft → archived: allowed
  if (currentStatus === 'draft' && newStatus === 'archived') {
    return { allowed: true };
  }

  // active → draft: allowed
  if (currentStatus === 'active' && newStatus === 'draft') {
    return { allowed: true };
  }

  // active → archived: allowed
  if (currentStatus === 'active' && newStatus === 'archived') {
    return { allowed: true };
  }

  // archived → active: not allowed directly (must go through draft first)
  if (currentStatus === 'archived' && newStatus === 'active') {
    return { 
      allowed: false, 
      reason: 'Cannot activate an archived template directly. Change to draft first.' 
    };
  }

  // archived → draft: not allowed in this implementation (to keep it simple)
  if (currentStatus === 'archived' && newStatus === 'draft') {
    return { 
      allowed: false, 
      reason: 'Archived templates cannot be unarchived. Please duplicate this template instead.' 
    };
  }

  return { allowed: false, reason: 'Invalid status transition' };
}







