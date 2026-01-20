/**
 * Create Team Modal Component
 * 
 * Modal for creating and editing teams.
 * Includes team name, type, members selection, and team lead assignment.
 */

import React, { useState, useEffect } from "react";
import TeamMemberSelector from "./TeamMemberSelector";
import LocationNodeSelector from "./LocationNodeSelector";
import type { EHSTeam, TeamType, PrimaryFunction, CreateTeamFormData } from "../schemas/teams";
import { formatTeamType, formatPrimaryFunction } from "../schemas/teams";
import type { EHSUser } from "../schemas/users";
import type { LocationNode } from "../schemas/locations";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateTeamFormData) => void;
  existingTeam?: EHSTeam; // For edit mode
  checkDuplicateName: (name: string, excludeId?: string) => boolean;
  users: EHSUser[];
  locationNodes: LocationNode[];
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  existingTeam,
  checkDuplicateName,
  users,
  locationNodes
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamType, setTeamType] = useState<TeamType>("safety");
  const [primaryFunction, setPrimaryFunction] = useState<PrimaryFunction | undefined>("general");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [leaderId, setLeaderId] = useState<string | undefined>();
  const [locationNodeId, setLocationNodeId] = useState<string | undefined>();
  const [locationPath, setLocationPath] = useState("");
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [canReceiveBulkAssignments, setCanReceiveBulkAssignments] = useState(true);
  const [canReceiveGroupNotifications, setCanReceiveGroupNotifications] = useState(true);
  const [error, setError] = useState("");

  const isEditMode = !!existingTeam;
  const activeUsers = users.filter(u => u.status === "active");

  // Reset form when modal opens/closes or when existingTeam changes
  useEffect(() => {
    if (isOpen) {
      if (existingTeam) {
        setName(existingTeam.name);
        setDescription(existingTeam.description || "");
        setTeamType(existingTeam.teamType);
        setPrimaryFunction(existingTeam.primaryFunction);
        setMemberIds(existingTeam.memberIds);
        setLeaderId(existingTeam.leaderId);
        setLocationNodeId(existingTeam.locationNodeId);
        setLocationPath(existingTeam.locationPath || "");
        setCanReceiveBulkAssignments(existingTeam.canReceiveBulkAssignments);
        setCanReceiveGroupNotifications(existingTeam.canReceiveGroupNotifications);
      } else {
        setName("");
        setDescription("");
        setTeamType("safety");
        setPrimaryFunction("general");
        setMemberIds([]);
        setLeaderId(undefined);
        setLocationNodeId(undefined);
        setLocationPath("");
        setCanReceiveBulkAssignments(true);
        setCanReceiveGroupNotifications(true);
      }
      setError("");
    }
  }, [isOpen, existingTeam]);

  const validateForm = (): boolean => {
    // Name required
    if (!name.trim()) {
      setError("Team name is required");
      return false;
    }

    // Check for duplicate name
    const isDuplicate = checkDuplicateName(name, existingTeam?.id);
    if (isDuplicate) {
      setError(`A team with name "${name}" already exists`);
      return false;
    }

    // At least one member required
    if (memberIds.length === 0) {
      setError("Please select at least one team member");
      return false;
    }

    // If leader is set, must be in members list
    if (leaderId && !memberIds.includes(leaderId)) {
      setError("Team lead must be a team member");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: CreateTeamFormData = {
      name: name.trim(),
      description: description.trim() || undefined,
      teamType,
      primaryFunction,
      memberIds,
      leaderId,
      locationNodeId,
      canReceiveBulkAssignments,
      canReceiveGroupNotifications,
    };

    onSubmit(formData);
  };

  const handleLocationSelect = (nodeId: string, path: string) => {
    setLocationNodeId(nodeId);
    setLocationPath(path);
    setShowLocationSelector(false);
    setError("");
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const teamTypes: { value: TeamType; label: string; description: string }[] = [
    { value: "safety", label: "Safety", description: "Incident response, safety committees" },
    { value: "operational", label: "Operational", description: "Department or shift-based teams" },
    { value: "functional", label: "Functional", description: "Audits, compliance, training" },
    { value: "location-based", label: "Location-Based", description: "Facility or area-specific" },
    { value: "custom", label: "Custom", description: "Other team types" },
  ];

  const primaryFunctions: { value: PrimaryFunction; label: string }[] = [
    { value: "incident-response", label: "Incident Response" },
    { value: "inspections", label: "Inspections" },
    { value: "audits", label: "Audits" },
    { value: "training", label: "Training" },
    { value: "compliance", label: "Compliance" },
    { value: "general", label: "General" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50"
          onClick={handleCancel}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Team" : "Create New Team"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isEditMode ? "Update team details and members" : "Create a team for bulk assignments and group notifications"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g., Chicago Incident Response Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of team purpose and responsibilities"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
              </div>

              {/* Team Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={teamType}
                  onChange={(e) => setTeamType(e.target.value as TeamType)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {teamTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Function */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Function
                </label>
                <select
                  value={primaryFunction || ""}
                  onChange={(e) => setPrimaryFunction((e.target.value || undefined) as PrimaryFunction | undefined)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {primaryFunctions.map(func => (
                    <option key={func.value} value={func.value}>
                      {func.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Scope */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Scope (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowLocationSelector(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  {locationPath ? (
                    <span className="text-gray-900 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {locationPath}
                    </span>
                  ) : (
                    <span className="text-gray-500">Cross-location team (no specific location)</span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {locationPath && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocationNodeId(undefined);
                      setLocationPath("");
                    }}
                    className="mt-1 text-xs text-purple-600 hover:text-purple-700"
                  >
                    Clear location (make cross-location team)
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Leave empty for cross-location teams (e.g., corporate audit team)
                </p>
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members <span className="text-red-500">*</span>
                </label>
                <TeamMemberSelector
                  users={activeUsers}
                  selectedUserIds={memberIds}
                  onChange={setMemberIds}
                  leaderId={leaderId}
                  onLeaderChange={setLeaderId}
                />
              </div>

              {/* Capabilities */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Team Capabilities</h3>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canReceiveBulkAssignments}
                    onChange={(e) => setCanReceiveBulkAssignments(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bulk Assignments</p>
                    <p className="text-xs text-gray-500">Team can receive safety events, CAPAs, and inspections in bulk</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canReceiveGroupNotifications}
                    onChange={(e) => setCanReceiveGroupNotifications(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Group Notifications</p>
                    <p className="text-xs text-gray-500">Team receives group safety alerts and incident notifications</p>
                  </div>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                {isEditMode ? "Save Changes" : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationNodeSelector
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSelect={handleLocationSelect}
        currentSelection={locationNodeId || ""}
        nodes={locationNodes}
      />
    </>
  );
}
