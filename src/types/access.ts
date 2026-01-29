// RBAC Types for Location-Based Access & Permissions

export type Role = 'ORG_ADMIN' | 'LOCATION_ADMIN' | 'USER' | 'VIEW_ONLY';
export type ScopeType = 'ORG' | 'LOCATION';
export type UserStatus = 'active' | 'invited' | 'deactivated';
export type LocationStatus = 'active' | 'inactive';

// Location context values for the global UI state
export type LocationContextValue = 'ALL_LOCATIONS' | 'ALL_ASSIGNED' | `LOCATION:${string}`;

export interface Location {
  id: string;
  name: string;
  status: LocationStatus;
  address?: string;
  timezone?: string;
  code?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  avatarInitials?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessAssignment {
  id: string;
  user_id: string;
  scope_type: ScopeType;
  scope_id: string | null; // null when scope_type is ORG
  role: Role;
  created_at: string;
  created_by: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  action: 
    | 'invite_sent'
    | 'invite_cancelled'
    | 'access_granted'
    | 'access_revoked'
    | 'role_changed'
    | 'org_role_changed'
    | 'user_deactivated'
    | 'user_reactivated'
    | 'location_created'
    | 'location_updated';
  target_type: 'user' | 'location';
  target_id: string;
  target_name: string;
  details: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  invited_by_id: string;
  invited_by_name: string;
  org_role: Role | null;
  location_assignments: Array<{
    location_id: string;
    role: Role;
  }>;
  sent_at: string;
}

// Role display helpers
export const ROLE_LABELS: Record<Role, string> = {
  ORG_ADMIN: 'Org Admin',
  LOCATION_ADMIN: 'Location Admin',
  USER: 'User',
  VIEW_ONLY: 'View Only',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  ORG_ADMIN: 'Full access to all locations. Can manage users, locations, and settings.',
  LOCATION_ADMIN: 'Full admin capabilities within assigned locations.',
  USER: 'Can create and edit records within assigned locations.',
  VIEW_ONLY: 'Read-only access within assigned locations.',
};

// Location-scoped roles (excludes ORG_ADMIN which is org-scoped)
export const LOCATION_ROLES: Role[] = ['LOCATION_ADMIN', 'USER', 'VIEW_ONLY'];



