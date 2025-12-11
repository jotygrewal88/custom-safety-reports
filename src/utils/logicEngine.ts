/**
 * Logic Engine for Template Conditional Rules
 * 
 * Evaluates IF/THEN rules defined by admins to control field visibility and validation.
 */

import type { LogicRule, TemplateField } from "../templates/safetyEventTemplate";

/**
 * Evaluate a single logic rule against current form state
 */
export function evaluateRule(
  rule: LogicRule,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValues: Record<string, any>,
  fieldDefinitions: TemplateField[]
): boolean {
  const triggerValue = fieldValues[rule.triggerFieldId];
  const triggerField = fieldDefinitions.find(f => f.id === rule.triggerFieldId);
  
  if (!triggerField) {
    return false; // Field doesn't exist, rule fails
  }
  
  switch (rule.operator) {
    case 'equals':
      // Handle different field types
      if (triggerField.componentType === 'checkbox') {
        return triggerValue === (rule.value === 'true' || rule.value === '1');
      }
      if (triggerField.componentType === 'multiselect') {
        const values = Array.isArray(triggerValue) ? triggerValue : [];
        return values.includes(rule.value);
      }
      return String(triggerValue || '') === String(rule.value || '');
      
    case 'not_equals':
      if (triggerField.componentType === 'checkbox') {
        return triggerValue !== (rule.value === 'true' || rule.value === '1');
      }
      if (triggerField.componentType === 'multiselect') {
        const values = Array.isArray(triggerValue) ? triggerValue : [];
        return !values.includes(rule.value);
      }
      return String(triggerValue || '') !== String(rule.value || '');
      
    case 'is_empty':
      if (triggerField.componentType === 'multiselect') {
        return !Array.isArray(triggerValue) || triggerValue.length === 0;
      }
      return !triggerValue || triggerValue === '' || triggerValue === null || triggerValue === undefined;
      
    case 'is_not_empty':
      if (triggerField.componentType === 'multiselect') {
        return Array.isArray(triggerValue) && triggerValue.length > 0;
      }
      return !!triggerValue && triggerValue !== '';
      
    case 'contains':
      // For text fields - check if value contains substring
      const strValue = String(triggerValue || '').toLowerCase();
      const searchValue = String(rule.value || '').toLowerCase();
      return strValue.includes(searchValue);
      
    case 'does_not_contain':
      const strValue2 = String(triggerValue || '').toLowerCase();
      const searchValue2 = String(rule.value || '').toLowerCase();
      return !strValue2.includes(searchValue2);
      
    case 'is_one_of':
      // Check if value is in a list of values
      const valueArray = Array.isArray(rule.value) ? rule.value : [rule.value];
      if (triggerField.componentType === 'multiselect') {
        const values = Array.isArray(triggerValue) ? triggerValue : [];
        return values.some(v => valueArray.includes(v));
      }
      return valueArray.includes(String(triggerValue || ''));
      
    case 'is_not_one_of':
      const valueArray2 = Array.isArray(rule.value) ? rule.value : [rule.value];
      if (triggerField.componentType === 'multiselect') {
        const values = Array.isArray(triggerValue) ? triggerValue : [];
        return !values.some(v => valueArray2.includes(v));
      }
      return !valueArray2.includes(String(triggerValue || ''));
      
    case 'greater_than':
      // For numeric comparisons
      const numValue = parseFloat(String(triggerValue || '0'));
      const compareValue = parseFloat(String(rule.value || '0'));
      return !isNaN(numValue) && !isNaN(compareValue) && numValue > compareValue;
      
    case 'less_than':
      const numValue2 = parseFloat(String(triggerValue || '0'));
      const compareValue2 = parseFloat(String(rule.value || '0'));
      return !isNaN(numValue2) && !isNaN(compareValue2) && numValue2 < compareValue2;
      
    case 'greater_than_or_equal':
      const numValue3 = parseFloat(String(triggerValue || '0'));
      const compareValue3 = parseFloat(String(rule.value || '0'));
      return !isNaN(numValue3) && !isNaN(compareValue3) && numValue3 >= compareValue3;
      
    case 'less_than_or_equal':
      const numValue4 = parseFloat(String(triggerValue || '0'));
      const compareValue4 = parseFloat(String(rule.value || '0'));
      return !isNaN(numValue4) && !isNaN(compareValue4) && numValue4 <= compareValue4;
      
    default:
      return false;
  }
}

/**
 * Apply all logic rules to determine field visibility and required status
 */
export function applyLogicRules(
  rules: LogicRule[] | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValues: Record<string, any>,
  fieldDefinitions: TemplateField[],
  coreFieldIds: string[]
): {
  fieldVisibility: Record<string, boolean>;
  fieldRequired: Record<string, boolean>;
} {
  // Initialize all fields as visible with their default required state
  const fieldVisibility: Record<string, boolean> = {};
  const fieldRequired: Record<string, boolean> = {};
  
  fieldDefinitions.forEach(field => {
    fieldVisibility[field.id] = true; // Default: all fields visible
    fieldRequired[field.id] = field.required; // Use field's default required state
  });
  
  // If no rules, return defaults
  if (!rules || rules.length === 0) {
    return { fieldVisibility, fieldRequired };
  }
  
  // Collect actions by target field
  const hideActions: Set<string> = new Set();
  const showActions: Set<string> = new Set();
  const requireActions: Set<string> = new Set();
  const optionalActions: Set<string> = new Set();
  
  // Evaluate all rules
  rules.forEach(rule => {
    const ruleMatches = evaluateRule(rule, fieldValues, fieldDefinitions);
    
    if (ruleMatches) {
      const targetField = fieldDefinitions.find(f => f.id === rule.targetFieldId);
      if (!targetField) return; // Target field doesn't exist
      
      const isCoreField = coreFieldIds.includes(rule.targetFieldId);
      
      switch (rule.action) {
        case 'hide':
          // Protect core fields from being hidden
          if (!isCoreField) {
            hideActions.add(rule.targetFieldId);
          }
          break;
          
        case 'show':
          showActions.add(rule.targetFieldId);
          break;
          
        case 'require':
          requireActions.add(rule.targetFieldId);
          break;
          
        case 'optional':
          // Protect core fields from being made optional
          if (!isCoreField) {
            optionalActions.add(rule.targetFieldId);
          }
          break;
      }
    }
  });
  
  // Apply actions in order: hide/show first, then require/optional
  
  // Step 1: Apply visibility (hide wins over show)
  fieldDefinitions.forEach(field => {
    if (hideActions.has(field.id)) {
      fieldVisibility[field.id] = false;
    } else if (showActions.has(field.id)) {
      fieldVisibility[field.id] = true;
    }
  });
  
  // Step 2: Apply required state (require wins over optional, only for visible fields)
  fieldDefinitions.forEach(field => {
    if (fieldVisibility[field.id]) {
      // Only apply required/optional to visible fields
      if (requireActions.has(field.id)) {
        fieldRequired[field.id] = true;
      } else if (optionalActions.has(field.id)) {
        fieldRequired[field.id] = false;
      }
    } else {
      // Hidden fields are not required for validation
      fieldRequired[field.id] = false;
    }
  });
  
  return { fieldVisibility, fieldRequired };
}

/**
 * Validate rules for potential issues (for builder UI warnings)
 */
export function validateRules(
  rules: LogicRule[],
  fieldDefinitions: TemplateField[],
  coreFieldIds: string[]
): string[] {
  const warnings: string[] = [];
  
  rules.forEach((rule, index) => {
    const triggerField = fieldDefinitions.find(f => f.id === rule.triggerFieldId);
    const targetField = fieldDefinitions.find(f => f.id === rule.targetFieldId);
    
    // Check if fields exist
    if (!triggerField) {
      warnings.push(`Rule ${index + 1}: Trigger field not found in template`);
      return; // Skip further validation for this rule
    }
    if (!targetField) {
      warnings.push(`Rule ${index + 1}: Target field not found in template`);
    }
    
    // Warn about actions on core fields
    if (targetField && coreFieldIds.includes(rule.targetFieldId)) {
      if (rule.action === 'hide') {
        warnings.push(`Rule ${index + 1}: Cannot hide core field "${targetField.label}"`);
      }
      if (rule.action === 'optional') {
        warnings.push(`Rule ${index + 1}: Cannot make core field "${targetField.label}" optional`);
      }
    }
    
    // Check if value is needed for operator
    const valueRequiredOperators = [
      'equals', 'not_equals', 'contains', 'does_not_contain',
      'is_one_of', 'is_not_one_of', 'greater_than', 'less_than',
      'greater_than_or_equal', 'less_than_or_equal'
    ];
    
    if (valueRequiredOperators.includes(rule.operator) && !rule.value) {
      warnings.push(`Rule ${index + 1}: Operator "${rule.operator}" requires a value`);
    }
    
    // Validate operator/field type compatibility
    const numericOperators = ['greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'];
    const textOperators = ['contains', 'does_not_contain'];
    
    if (numericOperators.includes(rule.operator)) {
      // Numeric operators should be used with number or datetime fields
      if (triggerField.componentType !== 'number' && triggerField.componentType !== 'datetime') {
        warnings.push(
          `Rule ${index + 1}: Operator "${rule.operator}" is intended for numeric or date fields, but "${triggerField.label}" is ${triggerField.componentType}`
        );
      }
    }
    
    if (textOperators.includes(rule.operator)) {
      // Text operators should be used with text or textarea fields
      if (triggerField.componentType !== 'text' && triggerField.componentType !== 'textarea') {
        warnings.push(
          `Rule ${index + 1}: Operator "${rule.operator}" is intended for text fields, but "${triggerField.label}" is ${triggerField.componentType}`
        );
      }
    }
    
    // Check for conflicting rules (same trigger + operator + value, different actions on same target)
    const conflictingRules = rules.filter((r, i) => 
      i !== index && 
      r.triggerFieldId === rule.triggerFieldId &&
      r.operator === rule.operator &&
      r.value === rule.value &&
      r.targetFieldId === rule.targetFieldId
    );
    
    if (conflictingRules.length > 0) {
      warnings.push(
        `Rule ${index + 1}: Multiple rules with same trigger condition affecting "${targetField?.label || rule.targetFieldId}"`
      );
    }
  });
  
  return warnings;
}
