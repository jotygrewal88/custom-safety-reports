/**
 * EHS Permissions Data Structure
 * 
 * Extracted from FUNCTIONAL_SPECS.md - Core EHS modules for Custom Roles
 * 
 * Simple Mode (5 modules): Event, CAPA, OSHA, Access Points, LOTO
 * Advanced Mode (9 modules): Adds PTW, JHA, SOP, Audit
 */

export interface PermissionAction {
  id: string;           // e.g., "event:create"
  label: string;        // e.g., "Report Incident"
  description: string;  // e.g., "Create a new safety event"
  permission: string;   // e.g., "CREATE", "VIEW", "EDIT", etc.
}

export interface PermissionEntity {
  entity: string;       // e.g., "Safety Event"
  actions: PermissionAction[];
}

export interface PermissionModule {
  moduleId: string;     // e.g., "event"
  moduleName: string;   // e.g., "Incident Management"
  description: string;
  advancedOnly?: boolean;  // Show only in advanced mode
  features: PermissionEntity[];
}

export const EHS_PERMISSIONS: PermissionModule[] = [
  // === SIMPLE MODE MODULES (5) ===
  
  {
    moduleId: "event",
    moduleName: "Incident Management",
    description: "Safety event reporting and tracking",
    features: [
      {
        entity: "Safety Event",
        actions: [
          { id: "event:create", label: "Report Incident", description: "Create new safety event", permission: "CREATE" },
          { id: "event:view", label: "View Incident Details", description: "Access full details", permission: "VIEW" },
          { id: "event:view-list", label: "Browse Incident Log", description: "List all events", permission: "VIEW" },
          { id: "event:edit", label: "Update Incident", description: "Modify event details", permission: "EDIT" },
          { id: "event:archive", label: "Archive Incident", description: "Soft-delete", permission: "EDIT" },
          { id: "event:delete", label: "Permanently Delete", description: "Hard delete", permission: "DELETE" },
          { id: "event:export", label: "Export Data", description: "Download as CSV", permission: "EXPORT" },
          { id: "event:comment", label: "Add Comment", description: "Post comment", permission: "COMMENT" },
          { id: "event:view-comments", label: "View Comments", description: "Read threads", permission: "VIEW" },
          { id: "event:delete-comment", label: "Delete Comment", description: "Remove comment", permission: "EDIT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "capa",
    moduleName: "Corrective & Preventive Actions",
    description: "CAPA management with ownership tracking",
    features: [
      {
        entity: "CAPA",
        actions: [
          { id: "capa:create", label: "Create CAPA", description: "Create corrective action", permission: "CREATE" },
          { id: "capa:view", label: "View Details", description: "Access CAPA details", permission: "VIEW" },
          { id: "capa:view-list", label: "Browse CAPAs", description: "List all CAPAs", permission: "VIEW" },
          { id: "capa:edit", label: "Update CAPA", description: "Modify details", permission: "EDIT" },
          { id: "capa:duplicate", label: "Duplicate CAPA", description: "Copy with attachments", permission: "CREATE" },
          { id: "capa:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "capa:delete", label: "Permanently Delete", description: "Hard delete", permission: "DELETE" },
          { id: "capa:export", label: "Export Data", description: "Download as CSV", permission: "EXPORT" },
          { id: "capa:comment", label: "Add Comment", description: "Post comment", permission: "COMMENT" },
          { id: "capa:view-comments", label: "View Comments", description: "Read threads", permission: "VIEW" },
          { id: "capa:delete-comment", label: "Delete Comment", description: "Remove comment", permission: "EDIT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "osha",
    moduleName: "OSHA Compliance",
    description: "Complete OSHA recordkeeping and reporting (Contains PII)",
    features: [
      {
        entity: "OSHA Report (300/301)",
        actions: [
          { id: "osha-report:create", label: "Create Report", description: "Record injury/illness", permission: "CREATE" },
          { id: "osha-report:view", label: "View Report", description: "Access details", permission: "VIEW" },
          { id: "osha-report:view-list", label: "Browse Reports", description: "List all reports", permission: "VIEW" },
          { id: "osha-report:edit", label: "Update Report", description: "Modify classification", permission: "EDIT" },
          { id: "osha-report:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "osha-report:delete", label: "Permanently Delete", description: "Hard delete", permission: "DELETE" },
          { id: "osha-report:export", label: "Export", description: "Download as CSV", permission: "EXPORT" }
        ]
      },
      {
        entity: "OSHA 300A Summary",
        actions: [
          { id: "osha-summary:view-cases", label: "View Annual Summary", description: "Access 300A with rates", permission: "VIEW" },
          { id: "osha-summary:view-establishment", label: "View Establishment Info", description: "Company hours/details", permission: "VIEW" },
          { id: "osha-summary:upsert-establishment", label: "Update Establishment", description: "Modify hours worked", permission: "CREATE" },
          { id: "osha-summary:certify", label: "Executive Certification", description: "Sign 300A", permission: "CREATE" },
          { id: "osha-summary:archive", label: "Archive Summary", description: "Archive year", permission: "CREATE" },
          { id: "osha-summary:view-archived", label: "View Archived", description: "Previous years", permission: "VIEW" }
        ]
      },
      {
        entity: "OSHA Agency Report",
        actions: [
          { id: "osha-agency:create", label: "Create Submission", description: "Draft agency report", permission: "CREATE" },
          { id: "osha-agency:view", label: "View Submission", description: "Access report", permission: "VIEW" },
          { id: "osha-agency:view-list", label: "Browse Submissions", description: "List reports", permission: "VIEW" },
          { id: "osha-agency:edit", label: "Update Submission", description: "Modify before submit", permission: "EDIT" },
          { id: "osha-agency:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "osha-agency:export", label: "Export", description: "Download as CSV", permission: "EXPORT" }
        ]
      },
      {
        entity: "OSHA Location",
        actions: [
          { id: "osha-location:create", label: "Register Location", description: "Add establishment", permission: "CREATE" },
          { id: "osha-location:view", label: "View Location", description: "Access details", permission: "VIEW" },
          { id: "osha-location:view-list", label: "Browse Locations", description: "List locations", permission: "VIEW" },
          { id: "osha-location:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "osha-location:export", label: "Export", description: "Download as CSV", permission: "EXPORT" }
        ]
      },
      {
        entity: "OSHA Audit Trail",
        actions: [
          { id: "osha-audit-trail:view", label: "View Audit Trail", description: "Compliance logs", permission: "VIEW" },
          { id: "osha-audit-trail:create", label: "Log Action", description: "Manual log entry", permission: "CREATE" }
        ]
      }
    ]
  },
  
  {
    moduleId: "access-point",
    moduleName: "Access Points (QR Codes)",
    description: "QR code generation for locations",
    features: [
      {
        entity: "Access Point",
        actions: [
          { id: "access-point:create", label: "Create", description: "Generate QR code", permission: "CREATE" },
          { id: "access-point:create-bulk", label: "Bulk Create", description: "Import with AI matching", permission: "CREATE" },
          { id: "access-point:view", label: "View", description: "Access details", permission: "VIEW" },
          { id: "access-point:view-list", label: "Browse", description: "List all QR codes", permission: "VIEW" },
          { id: "access-point:edit", label: "Update", description: "Modify assignment", permission: "EDIT" },
          { id: "access-point:archive", label: "Archive", description: "Deactivate", permission: "EDIT" },
          { id: "access-point:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "access-point:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "loto",
    moduleName: "Lockout/Tagout",
    description: "Equipment isolation procedures",
    features: [
      {
        entity: "LOTO Procedure",
        actions: [
          { id: "loto:create", label: "Create Procedure", description: "Draft LOTO", permission: "CREATE" },
          { id: "loto:view", label: "View Procedure", description: "Access details", permission: "VIEW" },
          { id: "loto:view-list", label: "Browse Library", description: "List all LOTOs", permission: "VIEW" },
          { id: "loto:edit", label: "Update", description: "Modify procedure", permission: "EDIT" },
          { id: "loto:duplicate", label: "Duplicate", description: "Copy procedure", permission: "CREATE" },
          { id: "loto:submit-review", label: "Submit", description: "Send to approvers", permission: "UPDATE_STATUS" },
          { id: "loto:approve", label: "Approve", description: "Sign off", permission: "UPDATE_STATUS" },
          { id: "loto:reject", label: "Reject", description: "Send back", permission: "UPDATE_STATUS" },
          { id: "loto:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "loto:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "loto:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  },
  
  // === ADVANCED MODE MODULES (4) ===
  
  {
    moduleId: "ptw",
    moduleName: "Permit to Work",
    description: "High-risk work authorization",
    advancedOnly: true,
    features: [
      {
        entity: "Work Permit",
        actions: [
          { id: "ptw:create", label: "Create Permit", description: "Draft PTW", permission: "CREATE" },
          { id: "ptw:view", label: "View Permit", description: "Access details", permission: "VIEW" },
          { id: "ptw:view-list", label: "Browse Permits", description: "List all PTWs", permission: "VIEW" },
          { id: "ptw:edit", label: "Update", description: "Modify permit", permission: "EDIT" },
          { id: "ptw:duplicate", label: "Duplicate", description: "Copy permit", permission: "CREATE" },
          { id: "ptw:submit-review", label: "Submit", description: "Send to approvers", permission: "UPDATE_STATUS" },
          { id: "ptw:approve", label: "Approve", description: "Authorize work", permission: "UPDATE_STATUS" },
          { id: "ptw:reject", label: "Reject", description: "Send back", permission: "UPDATE_STATUS" },
          { id: "ptw:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "ptw:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "ptw:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "jha",
    moduleName: "Job Hazard Analysis",
    description: "Task risk assessment",
    advancedOnly: true,
    features: [
      {
        entity: "JHA",
        actions: [
          { id: "jha:create", label: "Create JHA", description: "Draft analysis", permission: "CREATE" },
          { id: "jha:view", label: "View JHA", description: "Access details", permission: "VIEW" },
          { id: "jha:view-list", label: "Browse Library", description: "List all JHAs", permission: "VIEW" },
          { id: "jha:edit", label: "Update", description: "Modify JHA", permission: "EDIT" },
          { id: "jha:submit-review", label: "Submit", description: "Send to approvers", permission: "UPDATE_STATUS" },
          { id: "jha:approve", label: "Approve", description: "Sign off", permission: "UPDATE_STATUS" },
          { id: "jha:reject", label: "Reject", description: "Send back", permission: "UPDATE_STATUS" },
          { id: "jha:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "jha:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "jha:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "sop",
    moduleName: "Standard Operating Procedures",
    description: "SOP documentation and approval",
    advancedOnly: true,
    features: [
      {
        entity: "SOP",
        actions: [
          { id: "sop:create", label: "Create SOP", description: "Draft procedure", permission: "CREATE" },
          { id: "sop:view", label: "View SOP", description: "Access details", permission: "VIEW" },
          { id: "sop:view-list", label: "Browse Library", description: "List all SOPs", permission: "VIEW" },
          { id: "sop:edit", label: "Update", description: "Modify SOP", permission: "EDIT" },
          { id: "sop:duplicate", label: "Duplicate", description: "Copy SOP", permission: "CREATE" },
          { id: "sop:submit-review", label: "Submit", description: "Send to approvers", permission: "UPDATE_STATUS" },
          { id: "sop:approve", label: "Approve", description: "Sign off", permission: "UPDATE_STATUS" },
          { id: "sop:reject", label: "Reject", description: "Send back", permission: "UPDATE_STATUS" },
          { id: "sop:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "sop:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "sop:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  },
  
  {
    moduleId: "audit",
    moduleName: "Safety Audits",
    description: "Audit management with checklist generation",
    advancedOnly: true,
    features: [
      {
        entity: "Audit",
        actions: [
          { id: "audit:create", label: "Create Audit", description: "Schedule inspection", permission: "CREATE" },
          { id: "audit:view", label: "View Audit", description: "Access details", permission: "VIEW" },
          { id: "audit:view-list", label: "Browse Audits", description: "List all audits", permission: "VIEW" },
          { id: "audit:edit", label: "Update", description: "Modify audit", permission: "EDIT" },
          { id: "audit:duplicate", label: "Duplicate", description: "Copy template", permission: "CREATE" },
          { id: "audit:submit-review", label: "Submit", description: "Send to approvers", permission: "UPDATE_STATUS" },
          { id: "audit:approve", label: "Approve", description: "Sign off", permission: "UPDATE_STATUS" },
          { id: "audit:reject", label: "Reject", description: "Send back", permission: "UPDATE_STATUS" },
          { id: "audit:archive", label: "Archive", description: "Soft-delete", permission: "EDIT" },
          { id: "audit:delete", label: "Delete", description: "Hard delete", permission: "DELETE" },
          { id: "audit:export", label: "Export", description: "Download CSV", permission: "EXPORT" }
        ]
      }
    ]
  }
];

/**
 * Helper function to get all modules visible in a given mode
 */
export function getVisibleModules(advancedMode: boolean): PermissionModule[] {
  return EHS_PERMISSIONS.filter(module => !module.advancedOnly || advancedMode);
}

/**
 * Helper function to count total actions in a module
 */
export function countModuleActions(module: PermissionModule): number {
  return module.features.reduce((total, feature) => total + feature.actions.length, 0);
}

/**
 * Helper function to find a module by ID
 */
export function getModuleById(moduleId: string): PermissionModule | undefined {
  return EHS_PERMISSIONS.find(m => m.moduleId === moduleId);
}

/**
 * Helper function to extract action key from action ID
 * Example: "event:create" → "create"
 */
export function getActionKey(actionId: string): string {
  const parts = actionId.split(':');
  return parts.length > 1 ? parts[1] : actionId;
}
