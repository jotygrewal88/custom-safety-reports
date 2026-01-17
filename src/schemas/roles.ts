/**
 * EHS Custom Role & Permissions Type Definitions
 * 
 * Defines the structure for custom roles with granular permission controls
 * across Safety Events, CAPAs, Compliance, Documentation, and CMMS Bridge.
 */

export interface SafetyEventsPermissions {
  create: boolean;
  viewAll: boolean;
  editOwn: boolean;
  editAll: boolean;
  delete: boolean;
}

export interface CAPAsPermissions {
  create: boolean;
  assign: boolean;
  approveClose: boolean;
  viewAll: boolean;
}

export interface CompliancePermissions {
  accessOSHALogs: boolean;  // Access to PII - medical/injury logs
  exportPII: boolean;         // Export PII data
  signLogs: boolean;          // Sign official compliance logs
}

export interface DocumentationPermissions {
  createJHASOP: boolean;      // Create Job Hazard Analysis / Standard Operating Procedures
  editTemplates: boolean;
  viewOnly: boolean;
  approveDocuments: boolean;
}

export interface CMMSBridgePermissions {
  safetyOverride: boolean;    // "Safety Override" - Edit/Delete rights on Safety-tagged Work Orders
}

export interface RolePermissions {
  safetyEvents: SafetyEventsPermissions;
  capas: CAPAsPermissions;
  compliance: CompliancePermissions;
  documentation: DocumentationPermissions;
  cmmsBridge: CMMSBridgePermissions;
}

export interface CustomRole {
  id: string;
  name: string;
  permissions: RolePermissions;
  isSystemRole?: boolean;     // True for non-deletable template roles
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Helper type for permission checking
export type PermissionCategory = 'safetyEvents' | 'capas' | 'compliance' | 'documentation' | 'cmmsBridge';

// Utility function to create default (empty) permissions
export function createDefaultPermissions(): RolePermissions {
  return {
    safetyEvents: {
      create: false,
      viewAll: false,
      editOwn: false,
      editAll: false,
      delete: false,
    },
    capas: {
      create: false,
      assign: false,
      approveClose: false,
      viewAll: false,
    },
    compliance: {
      accessOSHALogs: false,
      exportPII: false,
      signLogs: false,
    },
    documentation: {
      createJHASOP: false,
      editTemplates: false,
      viewOnly: false,
      approveDocuments: false,
    },
    cmmsBridge: {
      safetyOverride: false,
    },
  };
}

// Utility function to count enabled permissions
export function countEnabledPermissions(permissions: RolePermissions): number {
  let count = 0;
  
  Object.values(permissions.safetyEvents).forEach(val => { if (val) count++; });
  Object.values(permissions.capas).forEach(val => { if (val) count++; });
  Object.values(permissions.compliance).forEach(val => { if (val) count++; });
  Object.values(permissions.documentation).forEach(val => { if (val) count++; });
  Object.values(permissions.cmmsBridge).forEach(val => { if (val) count++; });
  
  return count;
}
