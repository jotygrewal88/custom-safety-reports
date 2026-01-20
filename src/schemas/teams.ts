/**
 * EHS Teams Schema
 * 
 * Teams allow grouping users for:
 * - Bulk assignment of safety events, CAPAs, inspections
 * - Group notifications and safety alerts
 * - Audit and compliance coordination
 * - Incident response teams
 */

export type TeamType = 'safety' | 'operational' | 'functional' | 'location-based' | 'custom';

export type PrimaryFunction = 
  | 'incident-response' 
  | 'inspections' 
  | 'audits' 
  | 'training' 
  | 'compliance' 
  | 'general';

export interface EHSTeam {
  id: string;
  name: string;
  description?: string;
  
  // Team classification
  teamType: TeamType;
  primaryFunction?: PrimaryFunction;
  
  // Member management
  memberIds: string[];         // References EHSUser.id
  leaderId?: string;           // Optional team lead (must be in memberIds)
  
  // Location scope (optional - teams can be location-specific or cross-location)
  locationNodeId?: string;     // If set, limits team to this location scope
  locationPath?: string;       // Denormalized breadcrumb for display
  
  // Capabilities
  canReceiveBulkAssignments: boolean;     // Can be assigned safety events, CAPAs, inspections in bulk
  canReceiveGroupNotifications: boolean;  // Receives team-wide safety alerts
  
  // Status
  status: 'active' | 'inactive';
  
  // Audit trail
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Utility type for team creation form
export interface CreateTeamFormData {
  name: string;
  description?: string;
  teamType: TeamType;
  primaryFunction?: PrimaryFunction;
  memberIds: string[];
  leaderId?: string;
  locationNodeId?: string;
  canReceiveBulkAssignments: boolean;
  canReceiveGroupNotifications: boolean;
}

// Get member count
export function getTeamMemberCount(team: EHSTeam): number {
  return team.memberIds.length;
}

// Check if user is team member
export function isTeamMember(team: EHSTeam, userId: string): boolean {
  return team.memberIds.includes(userId);
}

// Check if user is team leader
export function isTeamLeader(team: EHSTeam, userId: string): boolean {
  return team.leaderId === userId;
}

// Get team display name with member count
export function getTeamDisplayName(team: EHSTeam): string {
  const count = getTeamMemberCount(team);
  return `${team.name} (${count} ${count === 1 ? 'member' : 'members'})`;
}

// Format team type for display
export function formatTeamType(teamType: TeamType): string {
  const typeMap: Record<TeamType, string> = {
    'safety': 'Safety',
    'operational': 'Operational',
    'functional': 'Functional',
    'location-based': 'Location-Based',
    'custom': 'Custom'
  };
  return typeMap[teamType] || teamType;
}

// Format primary function for display
export function formatPrimaryFunction(func?: PrimaryFunction): string {
  if (!func) return 'General';
  
  const funcMap: Record<PrimaryFunction, string> = {
    'incident-response': 'Incident Response',
    'inspections': 'Inspections',
    'audits': 'Audits',
    'training': 'Training',
    'compliance': 'Compliance',
    'general': 'General'
  };
  return funcMap[func] || func;
}

// Create default team capabilities
export function createDefaultCapabilities(): Pick<EHSTeam, 'canReceiveBulkAssignments' | 'canReceiveGroupNotifications'> {
  return {
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true
  };
}
