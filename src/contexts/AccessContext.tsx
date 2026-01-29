"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type {
  Location,
  User,
  AccessAssignment,
  AuditLogEntry,
  PendingInvite,
  Role,
  LocationContextValue,
  LocationStatus,
} from "../types/access";

// Storage keys
const STORAGE_KEYS = {
  locations: "rbac_locations",
  users: "rbac_users",
  assignments: "rbac_assignments",
  currentUserId: "rbac_currentUserId",
  locationContext: "rbac_locationContext",
  auditLog: "rbac_auditLog",
  pendingInvites: "rbac_pendingInvites",
};

// ============================================================================
// SEED DATA
// ============================================================================

const SEED_LOCATIONS: Location[] = [
  { id: "loc-suite-b", name: "Suite B", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-upkeep-hq", name: "UpKeep HQ", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-joty-mfg", name: "Joty's Manufacturing Plant", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-wonka", name: "Willy Wonka's Chocolate Factory", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-utility", name: "Utility Room", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-office", name: "Office Area", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "loc-loading-dock", name: "Loading Dock", status: "active", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
];

const SEED_USERS: User[] = [
  // Core demo personas
  { id: "user-org-admin", name: "Jordan Admin", email: "jordan@upkeep.com", status: "active", avatarInitials: "JA", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "user-loc-admin", name: "Lisa Manager", email: "lisa@upkeep.com", status: "active", avatarInitials: "LM", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "user-multi-loc", name: "Marcus Worker", email: "marcus@upkeep.com", status: "active", avatarInitials: "MW", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "user-single-loc", name: "Sarah Tech", email: "sarah@upkeep.com", status: "active", avatarInitials: "ST", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "user-no-loc", name: "Nathan New", email: "nathan@upkeep.com", status: "active", avatarInitials: "NN", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "user-view-only", name: "Vera Viewer", email: "vera@upkeep.com", status: "active", avatarInitials: "VV", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  // Additional realistic users
  { id: "user-carlos", name: "Carlos Rodriguez", email: "carlos.rodriguez@upkeep.com", status: "active", avatarInitials: "CR", createdAt: "2024-02-15T00:00:00Z", updatedAt: "2024-02-15T00:00:00Z" },
  { id: "user-emily", name: "Emily Chen", email: "emily.chen@upkeep.com", status: "active", avatarInitials: "EC", createdAt: "2024-03-01T00:00:00Z", updatedAt: "2024-03-01T00:00:00Z" },
  { id: "user-david", name: "David Thompson", email: "david.thompson@upkeep.com", status: "active", avatarInitials: "DT", createdAt: "2024-03-15T00:00:00Z", updatedAt: "2024-03-15T00:00:00Z" },
  { id: "user-maria", name: "Maria Santos", email: "maria.santos@upkeep.com", status: "active", avatarInitials: "MS", createdAt: "2024-04-01T00:00:00Z", updatedAt: "2024-04-01T00:00:00Z" },
  { id: "user-james", name: "James Wilson", email: "james.wilson@upkeep.com", status: "active", avatarInitials: "JW", createdAt: "2024-04-15T00:00:00Z", updatedAt: "2024-04-15T00:00:00Z" },
  { id: "user-ashley", name: "Ashley Brown", email: "ashley.brown@upkeep.com", status: "active", avatarInitials: "AB", createdAt: "2024-05-01T00:00:00Z", updatedAt: "2024-05-01T00:00:00Z" },
  { id: "user-michael", name: "Michael Davis", email: "michael.davis@upkeep.com", status: "active", avatarInitials: "MD", createdAt: "2024-05-15T00:00:00Z", updatedAt: "2024-05-15T00:00:00Z" },
  { id: "user-jessica", name: "Jessica Martinez", email: "jessica.martinez@upkeep.com", status: "active", avatarInitials: "JM", createdAt: "2024-06-01T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: "user-robert", name: "Robert Garcia", email: "robert.garcia@upkeep.com", status: "deactivated", avatarInitials: "RG", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: "user-amanda", name: "Amanda Taylor", email: "amanda.taylor@upkeep.com", status: "invited", avatarInitials: "AT", createdAt: "2024-11-15T00:00:00Z", updatedAt: "2024-11-15T00:00:00Z" },
];

const SEED_ASSIGNMENTS: AccessAssignment[] = [
  // Org Admin - has ORG scope (access to all locations)
  { id: "assign-1", user_id: "user-org-admin", scope_type: "ORG", scope_id: null, role: "ORG_ADMIN", created_at: "2024-01-01T00:00:00Z", created_by: "system" },
  
  // Location Admin - admin for 2 locations
  { id: "assign-2", user_id: "user-loc-admin", scope_type: "LOCATION", scope_id: "loc-suite-b", role: "LOCATION_ADMIN", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-3", user_id: "user-loc-admin", scope_type: "LOCATION", scope_id: "loc-upkeep-hq", role: "LOCATION_ADMIN", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Multi-location User - user access to 3 locations
  { id: "assign-4", user_id: "user-multi-loc", scope_type: "LOCATION", scope_id: "loc-joty-mfg", role: "USER", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-5", user_id: "user-multi-loc", scope_type: "LOCATION", scope_id: "loc-wonka", role: "USER", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-6", user_id: "user-multi-loc", scope_type: "LOCATION", scope_id: "loc-suite-b", role: "USER", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Single-location User - user access to only 1 location
  { id: "assign-7", user_id: "user-single-loc", scope_type: "LOCATION", scope_id: "loc-suite-b", role: "USER", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  
  // No-location User - has no assignments (strict migration)
  // (no assignments for user-no-loc)
  
  // View-only user - view only access to 2 locations
  { id: "assign-8", user_id: "user-view-only", scope_type: "LOCATION", scope_id: "loc-office", role: "VIEW_ONLY", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-9", user_id: "user-view-only", scope_type: "LOCATION", scope_id: "loc-utility", role: "VIEW_ONLY", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Carlos Rodriguez - Location Admin for Wonka factory
  { id: "assign-10", user_id: "user-carlos", scope_type: "LOCATION", scope_id: "loc-wonka", role: "LOCATION_ADMIN", created_at: "2024-02-15T00:00:00Z", created_by: "user-org-admin" },
  
  // Emily Chen - User at multiple locations (manufacturing focused)
  { id: "assign-11", user_id: "user-emily", scope_type: "LOCATION", scope_id: "loc-joty-mfg", role: "USER", created_at: "2024-03-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-12", user_id: "user-emily", scope_type: "LOCATION", scope_id: "loc-loading-dock", role: "USER", created_at: "2024-03-01T00:00:00Z", created_by: "user-org-admin" },
  
  // David Thompson - Location Admin for Loading Dock & Utility Room
  { id: "assign-13", user_id: "user-david", scope_type: "LOCATION", scope_id: "loc-loading-dock", role: "LOCATION_ADMIN", created_at: "2024-03-15T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-14", user_id: "user-david", scope_type: "LOCATION", scope_id: "loc-utility", role: "LOCATION_ADMIN", created_at: "2024-03-15T00:00:00Z", created_by: "user-org-admin" },
  
  // Maria Santos - User at Office Area
  { id: "assign-15", user_id: "user-maria", scope_type: "LOCATION", scope_id: "loc-office", role: "USER", created_at: "2024-04-01T00:00:00Z", created_by: "user-org-admin" },
  
  // James Wilson - User at UpKeep HQ
  { id: "assign-16", user_id: "user-james", scope_type: "LOCATION", scope_id: "loc-upkeep-hq", role: "USER", created_at: "2024-04-15T00:00:00Z", created_by: "user-loc-admin" },
  
  // Ashley Brown - View-only at multiple locations
  { id: "assign-17", user_id: "user-ashley", scope_type: "LOCATION", scope_id: "loc-suite-b", role: "VIEW_ONLY", created_at: "2024-05-01T00:00:00Z", created_by: "user-loc-admin" },
  { id: "assign-18", user_id: "user-ashley", scope_type: "LOCATION", scope_id: "loc-wonka", role: "VIEW_ONLY", created_at: "2024-05-01T00:00:00Z", created_by: "user-carlos" },
  { id: "assign-19", user_id: "user-ashley", scope_type: "LOCATION", scope_id: "loc-joty-mfg", role: "VIEW_ONLY", created_at: "2024-05-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Michael Davis - User at Wonka factory
  { id: "assign-20", user_id: "user-michael", scope_type: "LOCATION", scope_id: "loc-wonka", role: "USER", created_at: "2024-05-15T00:00:00Z", created_by: "user-carlos" },
  
  // Jessica Martinez - User at Joty's Manufacturing & Office Area
  { id: "assign-21", user_id: "user-jessica", scope_type: "LOCATION", scope_id: "loc-joty-mfg", role: "USER", created_at: "2024-06-01T00:00:00Z", created_by: "user-org-admin" },
  { id: "assign-22", user_id: "user-jessica", scope_type: "LOCATION", scope_id: "loc-office", role: "USER", created_at: "2024-06-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Robert Garcia - Deactivated user (still has assignments for history)
  { id: "assign-23", user_id: "user-robert", scope_type: "LOCATION", scope_id: "loc-suite-b", role: "USER", created_at: "2024-01-01T00:00:00Z", created_by: "user-org-admin" },
  
  // Amanda Taylor - Invited user with pending access
  { id: "assign-24", user_id: "user-amanda", scope_type: "LOCATION", scope_id: "loc-upkeep-hq", role: "USER", created_at: "2024-11-15T00:00:00Z", created_by: "user-loc-admin" },
];

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface AccessContextValue {
  // Data
  locations: Location[];
  users: User[];
  accessAssignments: AccessAssignment[];
  auditLog: AuditLogEntry[];
  pendingInvites: PendingInvite[];
  
  // Current user state
  currentUserId: string;
  currentUser: User | undefined;
  locationContext: LocationContextValue;
  
  // Computed permissions for current user
  isOrgAdmin: boolean;
  isLocationAdmin: boolean;
  allowedLocationIds: string[];
  allowedLocations: Location[];
  
  // Permission checks
  canAccessLocation: (locationId: string) => boolean;
  canManageLocation: (locationId: string) => boolean;
  canEditRecord: (locationId: string) => boolean;
  canCreateRecords: boolean;
  getRoleForLocation: (locationId: string) => Role | null;
  
  // User info helpers
  getUserById: (userId: string) => User | undefined;
  getLocationById: (locationId: string) => Location | undefined;
  getUserAccessSummary: (userId: string) => string;
  getUserLocationCount: (userId: string) => number;
  getLocationUserCount: (locationId: string) => number;
  getLocationAdmins: (locationId: string) => User[];
  isUserOrgAdmin: (userId: string) => boolean;
  isUserLocationAdmin: (userId: string) => boolean;
  canDeactivateUser: (targetUserId: string) => boolean;
  canReactivateUser: (targetUserId: string) => boolean;
  
  // Actions
  setCurrentUserId: (userId: string) => void;
  setLocationContext: (context: LocationContextValue) => void;
  
  // CRUD operations
  addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => Location;
  updateLocation: (locationId: string, updates: Partial<Pick<Location, 'name' | 'status' | 'address' | 'timezone' | 'code'>>) => void;
  
  addAccessAssignment: (userId: string, scopeType: 'ORG' | 'LOCATION', scopeId: string | null, role: Role) => void;
  removeAccessAssignment: (assignmentId: string) => void;
  updateAccessAssignment: (assignmentId: string, role: Role) => void;
  
  inviteUser: (invite: Omit<PendingInvite, 'id' | 'sent_at'>) => void;
  cancelInvite: (inviteId: string) => void;
  resendInvite: (inviteId: string) => void;
  
  deactivateUser: (userId: string) => void;
  reactivateUser: (userId: string) => void;
  
  // Audit
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  
  // Reset
  resetToSeedData: () => void;
}

const AccessContext = createContext<AccessContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AccessProviderProps {
  children: ReactNode;
}

export function AccessProvider({ children }: AccessProviderProps) {
  // State
  const [locations, setLocations] = useState<Location[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.locations);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return SEED_LOCATIONS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.users);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return SEED_USERS;
  });

  const [accessAssignments, setAccessAssignments] = useState<AccessAssignment[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.assignments);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return SEED_ASSIGNMENTS;
  });

  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.currentUserId);
      if (stored) return stored;
    }
    return "user-org-admin"; // Default to org admin for initial view
  });

  const [locationContext, setLocationContextState] = useState<LocationContextValue>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.locationContext);
      if (stored) return stored as LocationContextValue;
    }
    return "ALL_LOCATIONS";
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.auditLog);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return [];
  });

  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.pendingInvites);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.locations, JSON.stringify(locations));
    }
  }, [locations]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(accessAssignments));
    }
  }, [accessAssignments]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.currentUserId, currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.locationContext, locationContext);
    }
  }, [locationContext]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(auditLog.slice(0, 50))); // Keep last 50
    }
  }, [auditLog]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.pendingInvites, JSON.stringify(pendingInvites));
    }
  }, [pendingInvites]);

  // Computed values
  const currentUser = users.find(u => u.id === currentUserId);

  const userAssignments = accessAssignments.filter(a => a.user_id === currentUserId);
  
  const isOrgAdmin = userAssignments.some(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN");

  const isLocationAdmin = userAssignments.some(a => a.role === "LOCATION_ADMIN");

  const allowedLocationIds = isOrgAdmin
    ? locations.filter(l => l.status === "active").map(l => l.id)
    : userAssignments
        .filter(a => a.scope_type === "LOCATION" && a.scope_id)
        .map(a => a.scope_id as string);

  const allowedLocations = locations.filter(l => allowedLocationIds.includes(l.id));

  const canCreateRecords = allowedLocationIds.length > 0 && 
    userAssignments.some(a => 
      a.role === "ORG_ADMIN" || 
      a.role === "LOCATION_ADMIN" || 
      a.role === "USER"
    );

  // Permission check functions
  const canAccessLocation = useCallback((locationId: string): boolean => {
    if (isOrgAdmin) return true;
    return allowedLocationIds.includes(locationId);
  }, [isOrgAdmin, allowedLocationIds]);

  const canManageLocation = useCallback((locationId: string): boolean => {
    if (isOrgAdmin) return true;
    return userAssignments.some(
      a => a.scope_type === "LOCATION" && a.scope_id === locationId && a.role === "LOCATION_ADMIN"
    );
  }, [isOrgAdmin, userAssignments]);

  const canEditRecord = useCallback((locationId: string): boolean => {
    if (isOrgAdmin) return true;
    const assignment = userAssignments.find(
      a => a.scope_type === "LOCATION" && a.scope_id === locationId
    );
    return assignment ? ["LOCATION_ADMIN", "USER"].includes(assignment.role) : false;
  }, [isOrgAdmin, userAssignments]);

  const getRoleForLocation = useCallback((locationId: string): Role | null => {
    if (isOrgAdmin) return "ORG_ADMIN";
    const assignment = userAssignments.find(
      a => a.scope_type === "LOCATION" && a.scope_id === locationId
    );
    return assignment?.role || null;
  }, [isOrgAdmin, userAssignments]);

  // Helper functions
  const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);
  
  const getLocationById = useCallback((locationId: string) => locations.find(l => l.id === locationId), [locations]);

  const isUserOrgAdmin = useCallback((userId: string): boolean => {
    return accessAssignments.some(
      a => a.user_id === userId && a.scope_type === "ORG" && a.role === "ORG_ADMIN"
    );
  }, [accessAssignments]);

  const isUserLocationAdmin = useCallback((userId: string): boolean => {
    return accessAssignments.some(
      a => a.user_id === userId && a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN"
    );
  }, [accessAssignments]);

  // Permission to deactivate/reactivate users based on role hierarchy
  const canDeactivateUser = useCallback((targetUserId: string): boolean => {
    // Cannot deactivate yourself
    if (targetUserId === currentUserId) return false;
    
    // Check if target is an Org Admin - no one can deactivate an Org Admin
    const targetIsOrgAdmin = accessAssignments.some(
      a => a.user_id === targetUserId && a.scope_type === "ORG" && a.role === "ORG_ADMIN"
    );
    if (targetIsOrgAdmin) return false;
    
    // Org Admins can deactivate anyone except other Org Admins (handled above)
    if (isOrgAdmin) return true;
    
    // Check if target is a Location Admin
    const targetIsLocationAdmin = accessAssignments.some(
      a => a.user_id === targetUserId && a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN"
    );
    
    // Location Admins cannot deactivate other Location Admins
    if (targetIsLocationAdmin) return false;
    
    // Location Admins can only deactivate Users/View-only in their managed locations
    if (isLocationAdmin) {
      // Get locations the current user administers
      const managedLocationIds = userAssignments
        .filter(a => a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN")
        .map(a => a.scope_id);
      
      // Get target user's location assignments
      const targetLocations = accessAssignments
        .filter(a => a.user_id === targetUserId && a.scope_type === "LOCATION")
        .map(a => a.scope_id);
      
      // Target must have at least one location that the current user manages
      return targetLocations.some(locId => managedLocationIds.includes(locId));
    }
    
    // Regular Users and View-only cannot deactivate anyone
    return false;
  }, [currentUserId, isOrgAdmin, isLocationAdmin, userAssignments, accessAssignments]);

  const canReactivateUser = useCallback((targetUserId: string): boolean => {
    // Same logic as deactivation - if you can deactivate them, you can reactivate them
    // Cannot reactivate yourself (you're already active if you're doing this)
    if (targetUserId === currentUserId) return false;
    
    // Check if target is an Org Admin - only Org Admins can reactivate Org Admins
    const targetIsOrgAdmin = accessAssignments.some(
      a => a.user_id === targetUserId && a.scope_type === "ORG" && a.role === "ORG_ADMIN"
    );
    if (targetIsOrgAdmin) {
      // Only Org Admins can reactivate other Org Admins
      return isOrgAdmin;
    }
    
    // Org Admins can reactivate anyone
    if (isOrgAdmin) return true;
    
    // Check if target is a Location Admin
    const targetIsLocationAdmin = accessAssignments.some(
      a => a.user_id === targetUserId && a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN"
    );
    
    // Location Admins cannot reactivate other Location Admins
    if (targetIsLocationAdmin) return false;
    
    // Location Admins can only reactivate Users/View-only in their managed locations
    if (isLocationAdmin) {
      const managedLocationIds = userAssignments
        .filter(a => a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN")
        .map(a => a.scope_id);
      
      const targetLocations = accessAssignments
        .filter(a => a.user_id === targetUserId && a.scope_type === "LOCATION")
        .map(a => a.scope_id);
      
      return targetLocations.some(locId => managedLocationIds.includes(locId));
    }
    
    return false;
  }, [currentUserId, isOrgAdmin, isLocationAdmin, userAssignments, accessAssignments]);

  const getUserAccessSummary = useCallback((userId: string): string => {
    const userAssigns = accessAssignments.filter(a => a.user_id === userId);
    const orgAssign = userAssigns.find(a => a.scope_type === "ORG");
    
    if (orgAssign) {
      return "Org Admin";
    }
    
    const locationAssigns = userAssigns.filter(a => a.scope_type === "LOCATION");
    if (locationAssigns.length === 0) {
      return "No access";
    }
    
    // Group by role
    const roleGroups: Record<string, string[]> = {};
    locationAssigns.forEach(a => {
      const loc = locations.find(l => l.id === a.scope_id);
      if (loc) {
        if (!roleGroups[a.role]) roleGroups[a.role] = [];
        roleGroups[a.role].push(loc.name);
      }
    });
    
    const summaries = Object.entries(roleGroups).map(([role, locs]) => {
      const roleLabel = role === "LOCATION_ADMIN" ? "Location Admin" : 
                       role === "VIEW_ONLY" ? "View-only" : "User";
      if (locs.length <= 2) {
        return `${roleLabel}: ${locs.join(", ")}`;
      }
      return `${roleLabel}: ${locs.length} locations`;
    });
    
    return summaries.join(" | ");
  }, [accessAssignments, locations]);

  const getUserLocationCount = useCallback((userId: string): number => {
    if (isUserOrgAdmin(userId)) {
      return locations.filter(l => l.status === "active").length;
    }
    return accessAssignments.filter(
      a => a.user_id === userId && a.scope_type === "LOCATION"
    ).length;
  }, [accessAssignments, locations, isUserOrgAdmin]);

  const getLocationUserCount = useCallback((locationId: string): number => {
    // Count org admins + location-specific assignments
    const orgAdmins = accessAssignments.filter(
      a => a.scope_type === "ORG" && a.role === "ORG_ADMIN"
    ).length;
    const locationUsers = accessAssignments.filter(
      a => a.scope_type === "LOCATION" && a.scope_id === locationId
    ).length;
    return orgAdmins + locationUsers;
  }, [accessAssignments]);

  const getLocationAdmins = useCallback((locationId: string): User[] => {
    // Get org admins
    const orgAdminIds = accessAssignments
      .filter(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN")
      .map(a => a.user_id);
    
    // Get location admins for this location
    const locAdminIds = accessAssignments
      .filter(a => a.scope_type === "LOCATION" && a.scope_id === locationId && a.role === "LOCATION_ADMIN")
      .map(a => a.user_id);
    
    const allAdminIds = [...new Set([...orgAdminIds, ...locAdminIds])];
    return users.filter(u => allAdminIds.includes(u.id));
  }, [accessAssignments, users]);

  // Actions
  const setCurrentUserId = useCallback((userId: string) => {
    setCurrentUserIdState(userId);
    // Reset location context based on new user's permissions
    const newUserAssignments = accessAssignments.filter(a => a.user_id === userId);
    const newIsOrgAdmin = newUserAssignments.some(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN");
    
    if (newIsOrgAdmin) {
      setLocationContextState("ALL_LOCATIONS");
    } else {
      const locationAssigns = newUserAssignments.filter(a => a.scope_type === "LOCATION");
      if (locationAssigns.length === 0) {
        setLocationContextState("ALL_ASSIGNED"); // Will show empty
      } else if (locationAssigns.length === 1) {
        setLocationContextState(`LOCATION:${locationAssigns[0].scope_id}`);
      } else {
        setLocationContextState("ALL_ASSIGNED");
      }
    }
  }, [accessAssignments]);

  const setLocationContext = useCallback((context: LocationContextValue) => {
    setLocationContextState(context);
  }, []);

  // CRUD Operations
  const addLocation = useCallback((location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Location => {
    const now = new Date().toISOString();
    const newLocation: Location = {
      ...location,
      id: `loc-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  }, []);

  const updateLocation = useCallback((locationId: string, updates: Partial<Pick<Location, 'name' | 'status' | 'address' | 'timezone' | 'code'>>) => {
    setLocations(prev => prev.map(l => 
      l.id === locationId 
        ? { ...l, ...updates, updatedAt: new Date().toISOString() }
        : l
    ));
  }, []);

  const addAccessAssignment = useCallback((userId: string, scopeType: 'ORG' | 'LOCATION', scopeId: string | null, role: Role) => {
    const newAssignment: AccessAssignment = {
      id: `assign-${Date.now()}`,
      user_id: userId,
      scope_type: scopeType,
      scope_id: scopeId,
      role,
      created_at: new Date().toISOString(),
      created_by: currentUserId,
    };
    setAccessAssignments(prev => [...prev, newAssignment]);
  }, [currentUserId]);

  const removeAccessAssignment = useCallback((assignmentId: string) => {
    // Check if this is the last org admin
    const assignment = accessAssignments.find(a => a.id === assignmentId);
    if (assignment?.scope_type === "ORG" && assignment?.role === "ORG_ADMIN") {
      const orgAdminCount = accessAssignments.filter(
        a => a.scope_type === "ORG" && a.role === "ORG_ADMIN"
      ).length;
      if (orgAdminCount <= 1) {
        console.error("Cannot remove the last Org Admin");
        return;
      }
    }
    setAccessAssignments(prev => prev.filter(a => a.id !== assignmentId));
  }, [accessAssignments]);

  const updateAccessAssignment = useCallback((assignmentId: string, role: Role) => {
    setAccessAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, role } : a
    ));
  }, []);

  const inviteUser = useCallback((invite: Omit<PendingInvite, 'id' | 'sent_at'>) => {
    const newInvite: PendingInvite = {
      ...invite,
      id: `invite-${Date.now()}`,
      sent_at: new Date().toISOString(),
    };
    setPendingInvites(prev => [...prev, newInvite]);
  }, []);

  const cancelInvite = useCallback((inviteId: string) => {
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
  }, []);

  const resendInvite = useCallback((inviteId: string) => {
    setPendingInvites(prev => prev.map(i =>
      i.id === inviteId ? { ...i, sent_at: new Date().toISOString() } : i
    ));
  }, []);

  const deactivateUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: "deactivated" as const, updatedAt: new Date().toISOString() } : u
    ));
  }, []);

  const reactivateUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: "active" as const, updatedAt: new Date().toISOString() } : u
    ));
  }, []);

  const addAuditLogEntry = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const resetToSeedData = useCallback(() => {
    setLocations(SEED_LOCATIONS);
    setUsers(SEED_USERS);
    setAccessAssignments(SEED_ASSIGNMENTS);
    setCurrentUserIdState("user-org-admin");
    setLocationContextState("ALL_LOCATIONS");
    setAuditLog([]);
    setPendingInvites([]);
  }, []);

  const value: AccessContextValue = {
    // Data
    locations,
    users,
    accessAssignments,
    auditLog,
    pendingInvites,
    
    // Current user state
    currentUserId,
    currentUser,
    locationContext,
    
    // Computed permissions
    isOrgAdmin,
    isLocationAdmin,
    allowedLocationIds,
    allowedLocations,
    
    // Permission checks
    canAccessLocation,
    canManageLocation,
    canEditRecord,
    canCreateRecords,
    getRoleForLocation,
    
    // User info helpers
    getUserById,
    getLocationById,
    getUserAccessSummary,
    getUserLocationCount,
    getLocationUserCount,
    getLocationAdmins,
    isUserOrgAdmin,
    isUserLocationAdmin,
    canDeactivateUser,
    canReactivateUser,
    
    // Actions
    setCurrentUserId,
    setLocationContext,
    
    // CRUD operations
    addLocation,
    updateLocation,
    addAccessAssignment,
    removeAccessAssignment,
    updateAccessAssignment,
    inviteUser,
    cancelInvite,
    resendInvite,
    deactivateUser,
    reactivateUser,
    
    // Audit
    addAuditLogEntry,
    
    // Reset
    resetToSeedData,
  };

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error("useAccess must be used within an AccessProvider");
  }
  return context;
}



