"use client";

import React, { useState, useMemo } from "react";
import type { LogicRule, TemplateField } from "../templates/safetyEventTemplate";
import { applyLogicRules } from "../utils/logicEngine";

interface RuleTestingPanelProps {
  rules: LogicRule[];
  fields: TemplateField[];
  coreFieldIds: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockValue = any;

export default function RuleTestingPanel({ rules, fields, coreFieldIds }: RuleTestingPanelProps) {
  const [mockValues, setMockValues] = useState<Record<string, MockValue>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Evaluate rules with mock values
  const evaluationResult = useMemo(() => {
    if (!isExpanded || rules.length === 0) {
      return { fieldVisibility: {}, fieldRequired: {}, triggeredRules: [] };
    }

    const { fieldVisibility, fieldRequired } = applyLogicRules(
      rules,
      mockValues,
      fields,
      coreFieldIds
    );

    // Find which rules were triggered
    const triggeredRules: string[] = [];
    rules.forEach(rule => {
      const triggerField = fields.find(f => f.id === rule.triggerFieldId);
      if (!triggerField) return;

      const triggerValue = mockValues[rule.triggerFieldId];
      let matches = false;

      switch (rule.operator) {
        case 'equals':
          if (triggerField.componentType === 'checkbox') {
            matches = triggerValue === (rule.value === 'true' || rule.value === '1');
          } else if (triggerField.componentType === 'multiselect') {
            const values = Array.isArray(triggerValue) ? triggerValue : [];
            matches = values.includes(rule.value);
          } else {
            matches = String(triggerValue || '') === String(rule.value || '');
          }
          break;
        case 'not_equals':
          if (triggerField.componentType === 'checkbox') {
            matches = triggerValue !== (rule.value === 'true' || rule.value === '1');
          } else if (triggerField.componentType === 'multiselect') {
            const values = Array.isArray(triggerValue) ? triggerValue : [];
            matches = !values.includes(rule.value);
          } else {
            matches = String(triggerValue || '') !== String(rule.value || '');
          }
          break;
        case 'is_empty':
          if (triggerField.componentType === 'multiselect') {
            matches = !Array.isArray(triggerValue) || triggerValue.length === 0;
          } else {
            matches = !triggerValue || triggerValue === '';
          }
          break;
        case 'is_not_empty':
          if (triggerField.componentType === 'multiselect') {
            matches = Array.isArray(triggerValue) && triggerValue.length > 0;
          } else {
            matches = !!triggerValue && triggerValue !== '';
          }
          break;
        case 'contains':
          const strValue = String(triggerValue || '').toLowerCase();
          const searchValue = String(rule.value || '').toLowerCase();
          matches = strValue.includes(searchValue);
          break;
        case 'does_not_contain':
          const strValue2 = String(triggerValue || '').toLowerCase();
          const searchValue2 = String(rule.value || '').toLowerCase();
          matches = !strValue2.includes(searchValue2);
          break;
        case 'is_one_of':
          const valueArray = Array.isArray(rule.value) 
            ? rule.value 
            : (typeof rule.value === 'string' ? rule.value.split(',').map(v => v.trim()) : []);
          if (triggerField.componentType === 'multiselect') {
            const values = Array.isArray(triggerValue) ? triggerValue : [];
            matches = values.some(v => valueArray.includes(v));
          } else {
            matches = valueArray.includes(String(triggerValue || ''));
          }
          break;
        case 'is_not_one_of':
          const valueArray2 = Array.isArray(rule.value) 
            ? rule.value 
            : (typeof rule.value === 'string' ? rule.value.split(',').map(v => v.trim()) : []);
          if (triggerField.componentType === 'multiselect') {
            const values = Array.isArray(triggerValue) ? triggerValue : [];
            matches = !values.some(v => valueArray2.includes(v));
          } else {
            matches = !valueArray2.includes(String(triggerValue || ''));
          }
          break;
        case 'greater_than':
          const numValue = parseFloat(String(triggerValue || '0'));
          const compareValue = parseFloat(String(rule.value || '0'));
          matches = !isNaN(numValue) && !isNaN(compareValue) && numValue > compareValue;
          break;
        case 'less_than':
          const numValue2 = parseFloat(String(triggerValue || '0'));
          const compareValue2 = parseFloat(String(rule.value || '0'));
          matches = !isNaN(numValue2) && !isNaN(compareValue2) && numValue2 < compareValue2;
          break;
        case 'greater_than_or_equal':
          const numValue3 = parseFloat(String(triggerValue || '0'));
          const compareValue3 = parseFloat(String(rule.value || '0'));
          matches = !isNaN(numValue3) && !isNaN(compareValue3) && numValue3 >= compareValue3;
          break;
        case 'less_than_or_equal':
          const numValue4 = parseFloat(String(triggerValue || '0'));
          const compareValue4 = parseFloat(String(rule.value || '0'));
          matches = !isNaN(numValue4) && !isNaN(compareValue4) && numValue4 <= compareValue4;
          break;
      }

      if (matches) {
        triggeredRules.push(rule.id);
      }
    });

    return { fieldVisibility, fieldRequired, triggeredRules };
  }, [rules, mockValues, fields, coreFieldIds, isExpanded]);

  // Get field label by ID
  const getFieldLabel = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  // Get affected fields summary
  const affectedFields = useMemo(() => {
    const affected: Array<{ fieldId: string; label: string; changes: string[] }> = [];
    
    fields.forEach(field => {
      const changes: string[] = [];
      const isVisible = evaluationResult.fieldVisibility[field.id];
      const isRequired = evaluationResult.fieldRequired[field.id];
      const wasVisible = true; // Default visibility
      const wasRequired = field.required;

      if (isVisible !== undefined && isVisible !== wasVisible) {
        changes.push(isVisible ? 'Shown' : 'Hidden');
      }
      if (isRequired !== undefined && isRequired !== wasRequired) {
        changes.push(isRequired ? 'Required' : 'Optional');
      }

      if (changes.length > 0) {
        affected.push({
          fieldId: field.id,
          label: field.label,
          changes
        });
      }
    });

    return affected;
  }, [evaluationResult, fields]);

  // Set mock value for a field
  const setMockValue = (fieldId: string, value: MockValue) => {
    setMockValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Clear all mock values
  const clearMockValues = () => {
    setMockValues({});
  };

  // Render input for field based on its type
  const renderFieldInput = (field: TemplateField) => {
    const value = mockValues[field.id] || '';

    switch (field.componentType) {
      case 'dropdown':
      case 'multiselect':
        if (!field.options || field.options.length === 0) {
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => setMockValue(field.id, e.target.value)}
              placeholder="Enter value..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          );
        }
        if (field.componentType === 'multiselect') {
          return (
            <select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setMockValue(field.id, selected);
              }}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              size={Math.min(field.options.length, 4)}
            >
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          );
        }
        return (
          <select
            value={value}
            onChange={(e) => setMockValue(field.id, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Select --</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => setMockValue(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {value ? 'Checked' : 'Unchecked'}
            </span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setMockValue(field.id, e.target.value)}
            placeholder="Enter number..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setMockValue(field.id, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setMockValue(field.id, e.target.value)}
            placeholder="Enter value..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
    }
  };

  // Filter fields that are referenced in rules (trigger or target)
  const relevantFields = useMemo(() => {
    const relevantIds = new Set<string>();
    rules.forEach(rule => {
      relevantIds.add(rule.triggerFieldId);
      relevantIds.add(rule.targetFieldId);
    });
    return fields.filter(f => relevantIds.has(f.id));
  }, [rules, fields]);

  if (rules.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-gray-600 font-medium">No rules to test</p>
        <p className="text-gray-500 text-sm mt-1">Add some rules above to enable testing</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-900">Test Rules</h4>
          <span className="text-xs text-gray-500">
            ({rules.length} rule{rules.length !== 1 ? 's' : ''})
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Instructions */}
          <p className="text-sm text-gray-600">
            Set mock values below to test how your rules behave. The results will update in real-time.
          </p>

          {/* Mock Value Inputs */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">Mock Field Values</h5>
              {Object.keys(mockValues).length > 0 && (
                <button
                  onClick={clearMockValues}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {relevantFields.map(field => (
                <div key={field.id} className="flex items-start gap-2">
                  <label className="flex-1 text-sm text-gray-700 pt-1">
                    {field.label}
                  </label>
                  <div className="flex-1">
                    {renderFieldInput(field)}
                  </div>
                </div>
              ))}
              {relevantFields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No fields referenced in rules
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          {Object.keys(mockValues).length > 0 && (
            <>
              {/* Triggered Rules */}
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Triggered Rules
                </h5>
                {evaluationResult.triggeredRules.length > 0 ? (
                  <div className="space-y-1">
                    {evaluationResult.triggeredRules.map(ruleId => {
                      const rule = rules.find(r => r.id === ruleId);
                      if (!rule) return null;
                      return (
                        <div key={ruleId} className="text-sm text-gray-700 bg-green-50 px-2 py-1 rounded">
                          IF {getFieldLabel(rule.triggerFieldId)} {rule.operator.replace(/_/g, ' ')} {rule.value && `"${rule.value}"`} 
                          {' '}THEN {rule.action} {getFieldLabel(rule.targetFieldId)}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No rules triggered with current values</p>
                )}
              </div>

              {/* Affected Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Affected Fields
                </h5>
                {affectedFields.length > 0 ? (
                  <div className="space-y-1">
                    {affectedFields.map(({ fieldId, label, changes }) => (
                      <div key={fieldId} className="text-sm bg-blue-50 px-2 py-1 rounded flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{label}</span>
                        <div className="flex items-center gap-2">
                          {changes.map((change, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-0.5 rounded ${
                                change === 'Hidden' ? 'bg-red-100 text-red-700' :
                                change === 'Shown' ? 'bg-green-100 text-green-700' :
                                change === 'Required' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {change}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No fields affected by current rules</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

