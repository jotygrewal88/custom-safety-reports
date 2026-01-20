/**
 * Mock Teams Data
 * 
 * Sample teams for testing and development
 */

import type { EHSTeam } from "../schemas/teams";

export const mockTeams: EHSTeam[] = [
  {
    id: "team_001",
    name: "Chicago Plant Incident Response Team",
    description: "First responders for safety incidents and emergencies at Chicago facility",
    teamType: "safety",
    primaryFunction: "incident-response",
    memberIds: ["user_003", "user_004", "user_006"],
    leaderId: "user_003",
    locationNodeId: "loc_chicago",
    locationPath: "Global Operations > North America > United States > Chicago Plant",
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2025-12-01T10:00:00Z",
    createdBy: "user_001"
  },
  {
    id: "team_002",
    name: "Corporate EHS Audit Team",
    description: "Cross-facility audit and compliance verification team",
    teamType: "functional",
    primaryFunction: "audits",
    memberIds: ["user_001", "user_002", "user_008"],
    leaderId: "user_001",
    locationNodeId: undefined, // Cross-location team
    locationPath: undefined,
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-11-15T08:00:00Z",
    updatedAt: "2025-11-15T08:00:00Z",
    createdBy: "user_001"
  },
  {
    id: "team_003",
    name: "Austin Facility Safety Committee",
    description: "Monthly safety committee for Austin location",
    teamType: "location-based",
    primaryFunction: "general",
    memberIds: ["user_005", "user_007"],
    leaderId: "user_005",
    locationNodeId: "loc_austin",
    locationPath: "Global Operations > North America > United States > Austin Facility",
    canReceiveBulkAssignments: false,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-10-20T14:00:00Z",
    updatedAt: "2025-10-20T14:00:00Z",
    createdBy: "user_001"
  },
  {
    id: "team_004",
    name: "OSHA Compliance Specialists",
    description: "Team responsible for OSHA 300 log maintenance and regulatory compliance",
    teamType: "functional",
    primaryFunction: "compliance",
    memberIds: ["user_001", "user_002", "user_003"],
    leaderId: "user_001",
    locationNodeId: undefined, // Cross-location
    locationPath: undefined,
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-09-10T09:00:00Z",
    updatedAt: "2025-09-10T09:00:00Z",
    createdBy: "user_001"
  },
  {
    id: "team_005",
    name: "Chicago Production Line 1 Safety Team",
    description: "Frontline safety team for production line 1",
    teamType: "operational",
    primaryFunction: "inspections",
    memberIds: ["user_004", "user_006"],
    leaderId: "user_004",
    locationNodeId: "loc_chicago_prod_line1",
    locationPath: "Global Operations > North America > United States > Chicago Plant > Production > Line 1",
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-08-05T11:00:00Z",
    updatedAt: "2025-08-05T11:00:00Z",
    createdBy: "user_003"
  },
  {
    id: "team_006",
    name: "North America Regional Safety Coordinators",
    description: "Regional coordination team for North America facilities",
    teamType: "location-based",
    primaryFunction: "general",
    memberIds: ["user_001", "user_003", "user_005"],
    leaderId: "user_001",
    locationNodeId: "loc_north_america",
    locationPath: "Global Operations > North America",
    canReceiveBulkAssignments: true,
    canReceiveGroupNotifications: true,
    status: "active",
    createdAt: "2025-07-01T07:00:00Z",
    updatedAt: "2025-07-01T07:00:00Z",
    createdBy: "user_001"
  },
  {
    id: "team_007",
    name: "Legacy Hazmat Response Team",
    description: "Inactive hazmat response team (replaced by newer team structure)",
    teamType: "safety",
    primaryFunction: "incident-response",
    memberIds: ["user_009", "user_010"],
    leaderId: "user_009",
    locationNodeId: "loc_chicago",
    locationPath: "Global Operations > North America > United States > Chicago Plant",
    canReceiveBulkAssignments: false,
    canReceiveGroupNotifications: false,
    status: "inactive",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
    createdBy: "user_001"
  }
];
