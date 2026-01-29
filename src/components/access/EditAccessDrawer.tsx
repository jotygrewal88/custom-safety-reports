"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAccess } from "../../contexts/AccessContext";
import { ROLE_LABELS, LOCATION_ROLES } from "../../types/access";
import type { Role, AccessAssignment } from "../../types/access";

interface EditAccessDrawerProps {
  userId: string;
  onClose: () => void;
}

export default function EditAccessDrawer({ userId, onClose }: EditAccessDrawerProps) {
  const {
    users,
    locations,
    accessAssignments,
    isOrgAdmin,
    allowedLocationIds,
    getUserById,
    isUserOrgAdmin,
    addAccessAssignment,
    removeAccessAssignment,
    updateAccessAssignment,
    addAuditLogEntry,
    currentUserId,
    currentUser,
  } = useAccess();

  const user = getUserById(userId);
  const [isOrgAdminRole, setIsOrgAdminRole] = useState(isUserOrgAdmin(userId));
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [selectedLocationToAdd, setSelectedLocationToAdd] = useState("");

  // Get user's current assignments
  const userAssignments = useMemo(() => {
    return accessAssignments.filter(a => a.user_id === userId);
  }, [accessAssignments, userId]);

  const orgAssignment = userAssignments.find(a => a.scope_type === "ORG");
  const locationAssignments = userAssignments.filter(a => a.scope_type === "LOCATION");

  // Locations the user currently has access to
  const assignedLocationIds = locationAssignments.map(a => a.scope_id).filter(Boolean) as string[];

  // Available locations to add (not already assigned)
  const availableLocations = useMemo(() => {
    const activeLocations = locations.filter(l => l.status === "active");
    if (isOrgAdmin) {
      return activeLocations.filter(l => !assignedLocationIds.includes(l.id));
    }
    // Location Admin can only add locations they manage
    return activeLocations.filter(l => 
      allowedLocationIds.includes(l.id) && !assignedLocationIds.includes(l.id)
    );
  }, [locations, isOrgAdmin, allowedLocationIds, assignedLocationIds]);

  // Check if current user can edit this user
  const canEdit = useMemo(() => {
    if (isOrgAdmin) return true;
    // Location Admin can only edit users in their locations
    return locationAssignments.some(a => 
      a.scope_id && allowedLocationIds.includes(a.scope_id)
    );
  }, [isOrgAdmin, allowedLocationIds, locationAssignments]);

  // Check if this is the last Org Admin
  const isLastOrgAdmin = useMemo(() => {
    if (!isUserOrgAdmin(userId)) return false;
    const orgAdminCount = accessAssignments.filter(
      a => a.scope_type === "ORG" && a.role === "ORG_ADMIN"
    ).length;
    return orgAdminCount <= 1;
  }, [accessAssignments, userId, isUserOrgAdmin]);

  const handleOrgAdminToggle = () => {
    if (!isOrgAdmin) return; // Only Org Admins can change org role

    if (isOrgAdminRole && isLastOrgAdmin) {
      alert("Cannot remove the last Org Admin");
      return;
    }

    if (isOrgAdminRole) {
      // Remove org admin role
      if (orgAssignment) {
        removeAccessAssignment(orgAssignment.id);
        addAuditLogEntry({
          actor_id: currentUserId,
          actor_name: currentUser?.name || "Unknown",
          action: "org_role_changed",
          target_type: "user",
          target_id: userId,
          target_name: user?.name || "Unknown",
          details: "Removed Org Admin role",
        });
      }
    } else {
      // Add org admin role
      addAccessAssignment(userId, "ORG", null, "ORG_ADMIN");
      addAuditLogEntry({
        actor_id: currentUserId,
        actor_name: currentUser?.name || "Unknown",
        action: "org_role_changed",
        target_type: "user",
        target_id: userId,
        target_name: user?.name || "Unknown",
        details: "Granted Org Admin role",
      });
    }
    setIsOrgAdminRole(!isOrgAdminRole);
  };

  const handleLocationRoleChange = (assignmentId: string, newRole: Role) => {
    const assignment = accessAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    updateAccessAssignment(assignmentId, newRole);
    
    const location = locations.find(l => l.id === assignment.scope_id);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "role_changed",
      target_type: "user",
      target_id: userId,
      target_name: user?.name || "Unknown",
      details: `Changed role to ${ROLE_LABELS[newRole]} for ${location?.name || "Unknown location"}`,
    });
  };

  const handleRemoveLocation = (assignmentId: string) => {
    const assignment = accessAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    removeAccessAssignment(assignmentId);
    
    const location = locations.find(l => l.id === assignment.scope_id);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "access_revoked",
      target_type: "user",
      target_id: userId,
      target_name: user?.name || "Unknown",
      details: `Removed access to ${location?.name || "Unknown location"}`,
    });
  };

  const handleAddLocation = () => {
    if (!selectedLocationToAdd) return;

    addAccessAssignment(userId, "LOCATION", selectedLocationToAdd, "USER");
    
    const location = locations.find(l => l.id === selectedLocationToAdd);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "access_granted",
      target_type: "user",
      target_id: userId,
      target_name: user?.name || "Unknown",
      details: `Granted User access to ${location?.name || "Unknown location"}`,
    });

    setSelectedLocationToAdd("");
    setShowAddLocation(false);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Access</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {user.avatarInitials || user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
              user.status === "active" ? "bg-green-100 text-green-700" :
              user.status === "invited" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {user.status}
            </span>
          </div>

          {/* Organization Role (Org Admin only) */}
          {isOrgAdmin && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Organization Role</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOrgAdminRole}
                    onChange={handleOrgAdminToggle}
                    disabled={isLastOrgAdmin && isOrgAdminRole}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Org Admin</div>
                    <div className="text-xs text-gray-500">
                      Full access to all locations, users, and settings
                    </div>
                  </div>
                </label>
                {isLastOrgAdmin && isOrgAdminRole && (
                  <div className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded">
                    Cannot remove - this is the last Org Admin
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Access */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Location Access</h3>
              {availableLocations.length > 0 && (
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Location
                </button>
              )}
            </div>

            {/* Add Location Form */}
            {showAddLocation && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedLocationToAdd}
                    onChange={(e) => setSelectedLocationToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select location...</option>
                    {availableLocations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddLocation}
                    disabled={!selectedLocationToAdd}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddLocation(false);
                      setSelectedLocationToAdd("");
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Location Assignments List */}
            {locationAssignments.length === 0 && !isOrgAdminRole ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="text-sm">No location access assigned</p>
                <p className="text-xs text-gray-400 mt-1">Add locations above to grant access</p>
              </div>
            ) : isOrgAdminRole ? (
              <div className="text-center py-8 text-gray-500 bg-purple-50 rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-purple-700">Org Admin</p>
                <p className="text-xs text-purple-500 mt-1">Has access to all locations</p>
              </div>
            ) : (
              <div className="space-y-2">
                {locationAssignments.map(assignment => {
                  const location = locations.find(l => l.id === assignment.scope_id);
                  if (!location) return null;

                  // Check if current user can edit this assignment
                  const canEditAssignment = isOrgAdmin || allowedLocationIds.includes(location.id);

                  return (
                    <div key={assignment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </div>
                      <select
                        value={assignment.role}
                        onChange={(e) => handleLocationRoleChange(assignment.id, e.target.value as Role)}
                        disabled={!canEditAssignment}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {LOCATION_ROLES.map(role => (
                          <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                        ))}
                      </select>
                      {canEditAssignment && (
                        <button
                          onClick={() => handleRemoveLocation(assignment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove access"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}



