"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CORE_FIELDS, COMMON_SAFETY_FIELDS } from "../templates/safetyEventTemplate";
import type { SafetyEventTemplate, TemplateField, LogicRule } from "../templates/safetyEventTemplate";
import { validateTemplateForActivation, canTransitionStatus, ValidationError } from "../utils/templateValidation";

interface TemplateContextValue {
  templates: Record<string, SafetyEventTemplate>;
  selectedTemplateId: string;
  selectTemplate: (templateId: string) => void;
  createTemplate: (name: string) => string; // Returns new template ID
  renameTemplate: (templateId: string, newName: string) => void;
  duplicateTemplate: (templateId: string) => string; // Returns new template ID
  archiveTemplate: (templateId: string) => void;
  updateTemplateStatus: (
    templateId: string, 
    newStatus: SafetyEventTemplate['status']
  ) => { success: boolean; errors?: ValidationError[] };
  addField: (templateId: string, field: TemplateField, atIndex?: number) => void;
  removeField: (templateId: string, fieldId: string) => void;
  updateField: (templateId: string, fieldId: string, updates: Partial<TemplateField>) => void;
  reorderFields: (templateId: string, newFieldOrder: string[]) => void;
  addLogicRule: (templateId: string, rule: Omit<LogicRule, 'id'>) => void;
  updateLogicRule: (templateId: string, ruleId: string, updates: Partial<LogicRule>) => void;
  deleteLogicRule: (templateId: string, ruleId: string) => void;
  getTemplate: (templateId?: string) => SafetyEventTemplate | undefined;
  checkDuplicateTemplateName: (name: string) => boolean;
  saveTemplates: () => void;
  resetTemplates: () => void;
  hasUnsavedChanges: boolean;
}

export const TemplateContext = createContext<TemplateContextValue | undefined>(undefined);

const STORAGE_KEY = "safetyEventTemplates";
const SELECTED_KEY = "selectedTemplateId";

function deepCloneTemplate(template: SafetyEventTemplate): SafetyEventTemplate {
  return {
    ...template,
    fields: template.fields.map(f => ({ 
      ...f, 
      options: f.options ? f.options.map(o => ({ ...o })) : undefined,
      validation: f.validation ? { ...f.validation } : undefined
    })),
    logicRules: template.logicRules ? template.logicRules.map(r => ({ ...r })) : undefined,
    usage: { ...template.usage }
  };
}

// Create default templates
function createDefaultTemplates(): Record<string, SafetyEventTemplate> {
  const now = new Date().toISOString();
  
  return {
    "injury-report": {
      templateId: "injury-report",
      name: "Injury Report",
      status: "active",
      owner: "System Admin",
      createdAt: now,
      updatedAt: now,
      usage: { qrCodesLinked: 0 },
      fields: [...CORE_FIELDS, ...COMMON_SAFETY_FIELDS]
    },
    "near-miss": {
      templateId: "near-miss",
      name: "Near Miss",
      status: "active",
      owner: "System Admin",
      createdAt: now,
      updatedAt: now,
      usage: { qrCodesLinked: 0 },
      fields: [
        ...CORE_FIELDS,
        ...COMMON_SAFETY_FIELDS.filter(f => f.id !== 'severity') // Example: exclude severity for near miss
      ]
    },
    "customer-incident": {
      templateId: "customer-incident",
      name: "Customer Incident",
      status: "draft",
      owner: "System Admin",
      createdAt: now,
      updatedAt: now,
      usage: { qrCodesLinked: 0 },
      fields: [...CORE_FIELDS, ...COMMON_SAFETY_FIELDS]
    }
  };
}

interface TemplateProviderProps {
  children: ReactNode;
  selectedTemplateId?: string;
}

export function TemplateProvider({ children, selectedTemplateId: initialSelectedId }: TemplateProviderProps) {
  const [templates, setTemplates] = useState<Record<string, SafetyEventTemplate>>(() => {
    // Try to load from localStorage on initial mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as Record<string, SafetyEventTemplate>;
        } catch (e) {
          console.error("Failed to parse stored templates:", e);
        }
      }
    }
    return createDefaultTemplates();
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    // If prop provided, use that (don't check templates yet, will validate in useEffect)
    if (initialSelectedId) {
      return initialSelectedId;
    }
    
    // Try to load last selected from localStorage (don't check templates yet)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SELECTED_KEY);
      if (stored) {
        return stored;
      }
    }
    
    // Default to first template
    return "injury-report";
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Listen for storage events and custom events to sync templates across provider instances
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newTemplates = JSON.parse(e.newValue) as Record<string, SafetyEventTemplate>;
          setTemplates(newTemplates);
        } catch (e) {
          console.error("Failed to parse templates from storage event:", e);
        }
      }
    };

    const handleTemplateUpdate = () => {
      // Reload templates from localStorage when custom event fires
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const newTemplates = JSON.parse(stored) as Record<string, SafetyEventTemplate>;
          setTemplates(newTemplates);
        } catch {
          console.error("Failed to parse templates from custom event");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("templateUpdated", handleTemplateUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("templateUpdated", handleTemplateUpdate);
    };
  }, []);

  // Update selected template when prop changes or templates load
  useEffect(() => {
    // If prop provided and template exists, use it
    if (initialSelectedId && templates[initialSelectedId]) {
      setSelectedTemplateId(initialSelectedId);
      return;
    }
    
    // If current selected doesn't exist in templates, fallback to first available
    if (!templates[selectedTemplateId] && Object.keys(templates).length > 0) {
      const firstTemplateId = Object.keys(templates)[0];
      setSelectedTemplateId(firstTemplateId);
      if (typeof window !== "undefined") {
        localStorage.setItem(SELECTED_KEY, firstTemplateId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedId, templates]);

  const selectTemplate = (templateId: string) => {
    if (templates[templateId]) {
      setSelectedTemplateId(templateId);
      if (typeof window !== "undefined") {
        localStorage.setItem(SELECTED_KEY, templateId);
      }
    }
  };

  const createTemplate = (name: string): string => {
    const newId = `template-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newTemplate: SafetyEventTemplate = {
      templateId: newId,
      name: name,
      status: "draft",
      owner: "Current User",
      createdAt: now,
      updatedAt: now,
      usage: { qrCodesLinked: 0 },
      fields: [...CORE_FIELDS] // Start with only the 3 core fields
    };

    const updatedTemplates = {
      ...templates,
      [newId]: newTemplate
    };

    setTemplates(updatedTemplates);
    
    // Save immediately to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
    
    setHasUnsavedChanges(false);
    return newId;
  };

  const renameTemplate = (templateId: string, newName: string) => {
    setTemplates(prev => {
      if (!prev[templateId]) return prev;
      
      return {
        ...prev,
        [templateId]: {
          ...prev[templateId],
          name: newName,
          updatedAt: new Date().toISOString()
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const duplicateTemplate = (templateId: string): string => {
    const template = templates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const newId = `template-${Date.now()}`;
    const now = new Date().toISOString();
    
    const duplicated = deepCloneTemplate(template);
    duplicated.templateId = newId;
    duplicated.name = `${template.name} (Copy)`;
    duplicated.status = "draft";
    duplicated.createdAt = now;
    duplicated.updatedAt = now;
    duplicated.usage = { qrCodesLinked: 0 };

    const updatedTemplates = {
      ...templates,
      [newId]: duplicated
    };

    setTemplates(updatedTemplates);
    
    // Save immediately to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
    
    setHasUnsavedChanges(false);
    return newId;
  };

  const archiveTemplate = (templateId: string) => {
    setTemplates(prev => {
      if (!prev[templateId]) return prev;
      
      return {
        ...prev,
        [templateId]: {
          ...prev[templateId],
          status: "archived",
          updatedAt: new Date().toISOString()
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateTemplateStatus = (
    templateId: string,
    newStatus: SafetyEventTemplate['status']
  ): { success: boolean; errors?: ValidationError[] } => {
    const template = templates[templateId];
    if (!template) {
      return { 
        success: false, 
        errors: [{ type: 'error', message: 'Template not found' }] 
      };
    }

    // Check if transition is allowed
    const transitionCheck = canTransitionStatus(template.status, newStatus);
    if (!transitionCheck.allowed) {
      return {
        success: false,
        errors: [{
          type: 'error',
          message: transitionCheck.reason || 'Status transition not allowed'
        }]
      };
    }

    // If transitioning to 'active', validate the template
    if (newStatus === 'active') {
      const validation = validateTemplateForActivation(template);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }
    }

    // Update the status
    setTemplates(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
    }));
    
    setHasUnsavedChanges(true);
    
    return { success: true };
  };

  const addField = (templateId: string, field: TemplateField, atIndex?: number) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      // Check if field with this ID already exists (prevents double-add in Strict Mode)
      if (template.fields.some(f => f.id === field.id)) {
        return prev;
      }
      
      const updated = deepCloneTemplate(template);
      
      // Clone the field to avoid mutations
      const fieldToAdd = { ...field };
      
      // Add field at specific index or at the end
      if (atIndex !== undefined && atIndex >= 0 && atIndex <= updated.fields.length) {
        updated.fields.splice(atIndex, 0, fieldToAdd);
      } else {
        // Add to the end (after core fields and existing fields)
        updated.fields.push(fieldToAdd);
      }
      
      updated.updatedAt = new Date().toISOString();
      
      const newTemplates = {
        ...prev,
        [templateId]: updated
      };
      
      // Save to localStorage immediately
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        window.dispatchEvent(new CustomEvent("templateUpdated", { detail: { templateId } }));
      }
      
      return newTemplates;
    });
    setHasUnsavedChanges(true);
  };

  const removeField = (templateId: string, fieldId: string) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      // Only allow removing non-core fields
      updated.fields = updated.fields.filter(f => f.id !== fieldId || f.locked);
      updated.updatedAt = new Date().toISOString();
      
      const newTemplates = {
        ...prev,
        [templateId]: updated
      };
      
      // Save to localStorage immediately and dispatch event for preview sync
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        window.dispatchEvent(new CustomEvent("templateUpdated", { detail: { templateId } }));
      }
      
      return newTemplates;
    });
    setHasUnsavedChanges(true);
  };

  const updateField = (templateId: string, fieldId: string, updates: Partial<TemplateField>) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      const fieldIndex = updated.fields.findIndex(f => f.id === fieldId);
      
      if (fieldIndex === -1) return prev;
      
      const field = updated.fields[fieldIndex];
      
      // Prevent modifying locked properties of core fields
      if (field.locked) {
        // Only allow updating non-structural properties for locked fields
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { required: _required, locked: _locked, fieldType: _fieldType, id: _id, ...allowedUpdates } = updates;
        updated.fields[fieldIndex] = {
          ...field,
          ...allowedUpdates
        };
      } else {
        updated.fields[fieldIndex] = {
          ...field,
          ...updates,
          id: field.id // Never allow changing the ID
        };
      }
      
      updated.updatedAt = new Date().toISOString();
      
      const newTemplates = {
        ...prev,
        [templateId]: updated
      };
      
      // Save to localStorage immediately and dispatch event for preview sync
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        window.dispatchEvent(new CustomEvent("templateUpdated", { detail: { templateId } }));
      }
      
      return newTemplates;
    });
    setHasUnsavedChanges(true);
  };

  const reorderFields = (templateId: string, newFieldOrder: string[]) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      
      // Separate core and non-core fields
      const coreFields = updated.fields.filter(f => f.locked);
      const nonCoreFields = updated.fields.filter(f => !f.locked);
      
      // Create a map for quick lookup
      const fieldMap = new Map(nonCoreFields.map(f => [f.id, f]));
      
      // Reorder non-core fields according to newFieldOrder
      const reorderedNonCore = newFieldOrder
        .map(id => fieldMap.get(id))
        .filter((f): f is TemplateField => f !== undefined);
      
      // Core fields always first, then reordered non-core fields
      updated.fields = [...coreFields, ...reorderedNonCore];
      updated.updatedAt = new Date().toISOString();
      
      const newTemplates = {
        ...prev,
        [templateId]: updated
      };
      
      // Save to localStorage immediately and dispatch event for preview sync
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
        window.dispatchEvent(new CustomEvent("templateUpdated", { detail: { templateId } }));
      }
      
      return newTemplates;
    });
    setHasUnsavedChanges(true);
  };

  const addLogicRule = (templateId: string, rule: Omit<LogicRule, 'id'>) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      const newRule: LogicRule = {
        ...rule,
        id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      updated.logicRules = [...(updated.logicRules || []), newRule];
      updated.updatedAt = new Date().toISOString();
      
      return {
        ...prev,
        [templateId]: updated
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateLogicRule = (templateId: string, ruleId: string, updates: Partial<LogicRule>) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      if (!updated.logicRules) return prev;
      
      const ruleIndex = updated.logicRules.findIndex(r => r.id === ruleId);
      if (ruleIndex === -1) return prev;
      
      updated.logicRules[ruleIndex] = {
        ...updated.logicRules[ruleIndex],
        ...updates,
        id: ruleId // Ensure ID doesn't change
      };
      updated.updatedAt = new Date().toISOString();
      
      return {
        ...prev,
        [templateId]: updated
      };
    });
    setHasUnsavedChanges(true);
  };

  const deleteLogicRule = (templateId: string, ruleId: string) => {
    setTemplates(prev => {
      const template = prev[templateId];
      if (!template) return prev;
      
      const updated = deepCloneTemplate(template);
      if (!updated.logicRules) return prev;
      
      updated.logicRules = updated.logicRules.filter(r => r.id !== ruleId);
      updated.updatedAt = new Date().toISOString();
      
      return {
        ...prev,
        [templateId]: updated
      };
    });
    setHasUnsavedChanges(true);
  };

  const checkDuplicateTemplateName = (name: string): boolean => {
    return Object.values(templates).some(
      template => template.name === name
    );
  };

  const getTemplate = (templateId?: string): SafetyEventTemplate | undefined => {
    const id = templateId || selectedTemplateId;
    return templates[id];
  };

  const saveTemplates = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      setHasUnsavedChanges(false);
    }
  };

  const resetTemplates = () => {
    const defaultTemplates = createDefaultTemplates();
    setTemplates(defaultTemplates);
    setSelectedTemplateId("injury-report");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(SELECTED_KEY, "injury-report");
    }
    setHasUnsavedChanges(false);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        selectedTemplateId,
        selectTemplate,
        createTemplate,
        renameTemplate,
        duplicateTemplate,
        archiveTemplate,
        updateTemplateStatus,
        addField,
        removeField,
        updateField,
        reorderFields,
        addLogicRule,
        updateLogicRule,
        deleteLogicRule,
        getTemplate,
        checkDuplicateTemplateName,
        saveTemplates,
        resetTemplates,
        hasUnsavedChanges
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}
