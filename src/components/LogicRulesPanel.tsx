"use client";

import React, { useState } from "react";
import type { LogicRule, TemplateField } from "../templates/safetyEventTemplate";
import { validateRules } from "../utils/logicEngine";
import RuleTestingPanel from "./RuleTestingPanel";

interface LogicRulesPanelProps {
  rules: LogicRule[];
  fields: TemplateField[];
  coreFieldIds: string[];
  onAddRule: (rule: Omit<LogicRule, 'id'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<LogicRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export default function LogicRulesPanel({
  rules,
  fields,
  coreFieldIds,
  onAddRule,
  onUpdateRule,
  onDeleteRule
}: LogicRulesPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  
  // Form state
  const [triggerFieldId, setTriggerFieldId] = useState('');
  const [operator, setOperator] = useState<LogicRule['operator']>('equals');
  const [value, setValue] = useState('');
  const [action, setAction] = useState<LogicRule['action']>('show');
  const [targetFieldId, setTargetFieldId] = useState('');

  // Get field label by ID
  const getFieldLabel = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  // Get operator display text
  const getOperatorText = (op: LogicRule['operator']) => {
    switch (op) {
      case 'equals': return 'equals';
      case 'not_equals': return 'does not equal';
      case 'is_empty': return 'is empty';
      case 'is_not_empty': return 'is not empty';
      case 'contains': return 'contains';
      case 'does_not_contain': return 'does not contain';
      case 'is_one_of': return 'is one of';
      case 'is_not_one_of': return 'is not one of';
      case 'greater_than': return 'is greater than';
      case 'less_than': return 'is less than';
      case 'greater_than_or_equal': return 'is greater than or equal to';
      case 'less_than_or_equal': return 'is less than or equal to';
    }
  };

  // Get action display text
  const getActionText = (act: LogicRule['action']) => {
    switch (act) {
      case 'show': return 'Show';
      case 'hide': return 'Hide';
      case 'require': return 'Require';
      case 'optional': return 'Make optional';
    }
  };

  // Fields that can be triggers (exclude special types that don't have values)
  const triggerableFields = fields.filter(f => 
    !['bodyDiagram', 'sceneDiagram', 'sketch', 'signature'].includes(f.componentType)
  );

  // Fields that can be targets (all non-core fields, or all fields for safe actions)
  const targetableFields = (currentAction: LogicRule['action']) => {
    if (currentAction === 'hide' || currentAction === 'optional') {
      // For hide/optional, only allow non-core fields
      return fields.filter(f => !coreFieldIds.includes(f.id));
    }
    // For show/require, allow all fields
    return fields;
  };

  // Get options for a field (for equals/not_equals with dropdown/multiselect)
  const getFieldOptions = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return [];
    return field.options;
  };

  // Should show value input?
  const shouldShowValueInput = (op: LogicRule['operator'], fieldId: string) => {
    // Operators that don't need a value input
    if (op === 'is_empty' || op === 'is_not_empty') return false;
    
    // All other operators need a value
    return !!fieldId; // Show value input if trigger field is selected
  };

  // Reset form
  const resetForm = () => {
    setTriggerFieldId('');
    setOperator('equals');
    setValue('');
    setAction('show');
    setTargetFieldId('');
    setEditingRuleId(null);
    setShowForm(false);
  };

  // Start editing a rule
  const startEdit = (rule: LogicRule) => {
    setTriggerFieldId(rule.triggerFieldId);
    setOperator(rule.operator);
    // Handle both string and string[] values
    const valueStr = Array.isArray(rule.value) ? rule.value.join(',') : (rule.value || '');
    setValue(valueStr);
    setAction(rule.action);
    setTargetFieldId(rule.targetFieldId);
    setEditingRuleId(rule.id);
    setShowForm(true);
  };

  // Save rule (add or update)
  const handleSave = () => {
    if (!triggerFieldId || !targetFieldId) {
      alert('Please select both trigger and target fields');
      return;
    }

    const ruleData: Omit<LogicRule, 'id'> = {
      triggerFieldId,
      operator,
      value: shouldShowValueInput(operator, triggerFieldId) ? value : undefined,
      action,
      targetFieldId
    };

    if (editingRuleId) {
      onUpdateRule(editingRuleId, ruleData);
    } else {
      onAddRule(ruleData);
    }

    resetForm();
  };

  // Validate rules and get warnings
  const warnings = validateRules(rules, fields, coreFieldIds);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conditional Logic</h3>
          <p className="text-sm text-gray-500 mt-1">
            Define rules to show/hide fields or change validation based on form values
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Rule
          </button>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800">Configuration Warnings</h4>
              <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                {warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rule Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              {editingRuleId ? 'Edit Rule' : 'New Rule'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Trigger Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                When this field
              </label>
              <select
                value={triggerFieldId}
                onChange={(e) => {
                  setTriggerFieldId(e.target.value);
                  setValue(''); // Reset value when trigger changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select field...</option>
                {triggerableFields.map(field => (
                  <option key={field.id} value={field.id}>{field.label}</option>
                ))}
              </select>
            </div>

            {/* Operator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as LogicRule['operator'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Basic Comparisons">
                  <option value="equals">Equals</option>
                  <option value="not_equals">Does not equal</option>
                  <option value="is_empty">Is empty</option>
                  <option value="is_not_empty">Is not empty</option>
                </optgroup>
                <optgroup label="Text Operators">
                  <option value="contains">Contains</option>
                  <option value="does_not_contain">Does not contain</option>
                </optgroup>
                <optgroup label="Multiple Values">
                  <option value="is_one_of">Is one of</option>
                  <option value="is_not_one_of">Is not one of</option>
                </optgroup>
                <optgroup label="Numeric & Date Comparisons">
                  <option value="greater_than">Is greater than</option>
                  <option value="less_than">Is less than</option>
                  <option value="greater_than_or_equal">Is greater than or equal to</option>
                  <option value="less_than_or_equal">Is less than or equal to</option>
                </optgroup>
              </select>
            </div>

            {/* Value (conditional) */}
            {shouldShowValueInput(operator, triggerFieldId) && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                  {(operator === 'is_one_of' || operator === 'is_not_one_of') && (
                    <span className="ml-1 text-xs text-gray-500">(comma-separated for multiple)</span>
                  )}
                </label>
                {(() => {
                  const triggerField = fields.find(f => f.id === triggerFieldId);
                  const options = getFieldOptions(triggerFieldId);

                  // For "is_one_of" and "is_not_one_of" operators
                  if (operator === 'is_one_of' || operator === 'is_not_one_of') {
                    if ((triggerField?.componentType === 'dropdown' || triggerField?.componentType === 'multiselect') && options.length > 0) {
                      // Multi-select for dropdown fields
                      return (
                        <select
                          multiple
                          value={Array.isArray(value) ? value : (value ? value.split(',').map(v => v.trim()) : [])}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setValue(selected.join(','));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          size={Math.min(options.length, 5)}
                        >
                          {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      );
                    }
                    // Textarea for text fields
                    return (
                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter values separated by commas (e.g., value1, value2, value3)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    );
                  }

                  // For numeric comparison operators
                  if (['greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal'].includes(operator)) {
                    return (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter number..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    );
                  }

                  // Standard single-value operators
                  if (triggerField?.componentType === 'dropdown' || triggerField?.componentType === 'multiselect') {
                    if (options.length > 0) {
                      return (
                        <select
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select value...</option>
                          {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      );
                    }
                  }

                  if (triggerField?.componentType === 'checkbox') {
                    return (
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select value...</option>
                        <option value="true">Checked</option>
                        <option value="false">Unchecked</option>
                      </select>
                    );
                  }

                  // Default text input
                  return (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter value..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  );
                })()}
              </div>
            )}

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Then
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as LogicRule['action'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="show">Show</option>
                <option value="hide">Hide</option>
                <option value="require">Require</option>
                <option value="optional">Make optional</option>
              </select>
            </div>

            {/* Target Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                This field
              </label>
              <select
                value={targetFieldId}
                onChange={(e) => setTargetFieldId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select field...</option>
                {targetableFields(action).map(field => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                    {coreFieldIds.includes(field.id) ? ' (Core)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {editingRuleId ? 'Update Rule' : 'Add Rule'}
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {rules.length > 0 ? (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">IF</span>{' '}
                  <span className="text-blue-600">{getFieldLabel(rule.triggerFieldId)}</span>{' '}
                  <span className="text-gray-600">{getOperatorText(rule.operator)}</span>
                  {rule.value && (
                    <>
                      {' '}<span className="font-medium text-gray-900">&quot;{rule.value}&quot;</span>
                    </>
                  )}
                  {' '}<span className="font-medium">THEN</span>{' '}
                  <span className="text-gray-600">{getActionText(rule.action)}</span>{' '}
                  <span className="text-blue-600">{getFieldLabel(rule.targetFieldId)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => startEdit(rule)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit rule"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this rule?')) {
                      onDeleteRule(rule.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete rule"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No rules defined yet. Click &quot;Add Rule&quot; to create your first conditional logic rule.
        </div>
      )}

      {/* Testing Panel */}
      <RuleTestingPanel
        rules={rules}
        fields={fields}
        coreFieldIds={coreFieldIds}
      />
    </div>
  );
}

