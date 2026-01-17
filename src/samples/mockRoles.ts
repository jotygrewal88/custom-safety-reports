/**
 * Mock Custom Roles Data
 * 
 * Predefined system roles to help administrators understand permission patterns.
 * These roles are marked as system roles and cannot be deleted.
 */

import type { CustomRole } from "../schemas/roles";

export const mockRoles: CustomRole[] = [
  {
    id: "role_safety_admin",
    name: "Safety Administrator",
    isSystemRole: true,
    permissions: {
      safetyEvents: {
        create: true,
        viewAll: true,
        editOwn: true,
        editAll: true,
        delete: true,
      },
      capas: {
        create: true,
        assign: true,
        approveClose: true,
        viewAll: true,
      },
      compliance: {
        accessOSHALogs: true,
        exportPII: true,
        signLogs: true,
      },
      documentation: {
        createJHASOP: true,
        editTemplates: true,
        viewOnly: false,
        approveDocuments: true,
      },
      cmmsBridge: {
        safetyOverride: true,
      },
    },
    createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    createdBy: "system",
  },
  {
    id: "role_safety_manager",
    name: "Safety Manager",
    isSystemRole: true,
    permissions: {
      safetyEvents: {
        create: true,
        viewAll: true,
        editOwn: true,
        editAll: true,
        delete: false,
      },
      capas: {
        create: true,
        assign: true,
        approveClose: true,
        viewAll: true,
      },
      compliance: {
        accessOSHALogs: true,
        exportPII: false,
        signLogs: false,
      },
      documentation: {
        createJHASOP: true,
        editTemplates: false,
        viewOnly: false,
        approveDocuments: true,
      },
      cmmsBridge: {
        safetyOverride: true,
      },
    },
    createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    createdBy: "system",
  },
  {
    id: "role_field_tech",
    name: "Field Technician",
    isSystemRole: true,
    permissions: {
      safetyEvents: {
        create: true,
        viewAll: false,
        editOwn: true,
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
        viewOnly: true,
        approveDocuments: false,
      },
      cmmsBridge: {
        safetyOverride: false,
      },
    },
    createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    createdBy: "system",
  },
  {
    id: "role_view_only",
    name: "View Only",
    isSystemRole: true,
    permissions: {
      safetyEvents: {
        create: false,
        viewAll: true,
        editOwn: false,
        editAll: false,
        delete: false,
      },
      capas: {
        create: false,
        assign: false,
        approveClose: false,
        viewAll: true,
      },
      compliance: {
        accessOSHALogs: false,
        exportPII: false,
        signLogs: false,
      },
      documentation: {
        createJHASOP: false,
        editTemplates: false,
        viewOnly: true,
        approveDocuments: false,
      },
      cmmsBridge: {
        safetyOverride: false,
      },
    },
    createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    createdBy: "system",
  },
];
