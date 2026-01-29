"use client";

import React, { useState, useMemo } from "react";
import { useAccess } from "../../contexts/AccessContext";
import { ROLE_LABELS, LOCATION_ROLES } from "../../types/access";
import type { Role } from "../../types/access";

interface InviteModalProps {
  onClose: () => void;
  prefillLocationId?: string;
}

interface LocationAssignment {
  locationId: string;
  role: Role;
}

export default function InviteModal({ onClose, prefillLocationId }: InviteModalProps) {
  const {
    locations,
    isOrgAdmin,
    allowedLocationIds,
    locationContext,
    inviteUser,
    addAuditLogEntry,
    currentUserId,
    currentUser,
    getLocationById,
  } = useAccess();

  const [emails, setEmails] = useState("");
  const [makeOrgAdmin, setMakeOrgAdmin] = useState(false);
  const [locationAssignments, setLocationAssignments] = useState<LocationAssignment[]>(() => {
    // Prefill with the specified location or current context
    if (prefillLocationId) {
      return [{ locationId: prefillLocationId, role: "USER" as Role }];
    }
    if (locationContext.startsWith("LOCATION:")) {
      const locId = locationContext.replace("LOCATION:", "");
      if (isOrgAdmin || allowedLocationIds.includes(locId)) {
        return [{ locationId: locId, role: "USER" as Role }];
      }
    }
    return [];
  });
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [selectedLocationToAdd, setSelectedLocationToAdd] = useState("");

  // Available locations for the current user
  const availableLocations = useMemo(() => {
    const activeLocations = locations.filter(l => l.status === "active");
    if (isOrgAdmin) {
      return activeLocations;
    }
    return activeLocations.filter(l => allowedLocationIds.includes(l.id));
  }, [locations, isOrgAdmin, allowedLocationIds]);

  // Locations not yet assigned
  const unassignedLocations = useMemo(() => {
    const assignedIds = locationAssignments.map(a => a.locationId);
    return availableLocations.filter(l => !assignedIds.includes(l.id));
  }, [availableLocations, locationAssignments]);

  // Validate form
  const isValid = useMemo(() => {
    const emailList = emails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);
    if (emailList.length === 0) return false;
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailList.every(e => emailRegex.test(e))) return false;
    
    // Org Admin doesn't need location assignments
    if (makeOrgAdmin) return true;
    
    // Non-org-admin invites need at least one location
    return locationAssignments.length > 0;
  }, [emails, makeOrgAdmin, locationAssignments]);

  const handleAddLocation = () => {
    if (!selectedLocationToAdd) return;
    setLocationAssignments(prev => [
      ...prev,
      { locationId: selectedLocationToAdd, role: "USER" as Role }
    ]);
    setSelectedLocationToAdd("");
    setShowAddLocation(false);
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocationAssignments(prev => prev.filter(a => a.locationId !== locationId));
  };

  const handleRoleChange = (locationId: string, role: Role) => {
    setLocationAssignments(prev => 
      prev.map(a => a.locationId === locationId ? { ...a, role } : a)
    );
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const emailList = emails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);

    emailList.forEach(email => {
      inviteUser({
        email,
        invited_by_id: currentUserId,
        invited_by_name: currentUser?.name || "Unknown",
        org_role: makeOrgAdmin ? "ORG_ADMIN" : null,
        location_assignments: makeOrgAdmin ? [] : locationAssignments.map(a => ({
          location_id: a.locationId,
          role: a.role,
        })),
      });

      // Log each invite
      const accessSummary = makeOrgAdmin 
        ? "Org Admin" 
        : locationAssignments.map(a => {
            const loc = getLocationById(a.locationId);
            return `${ROLE_LABELS[a.role]} at ${loc?.name}`;
          }).join(", ");

      addAuditLogEntry({
        actor_id: currentUserId,
        actor_name: currentUser?.name || "Unknown",
        action: "invite_sent",
        target_type: "user",
        target_id: email,
        target_name: email,
        details: `Invited as ${accessSummary}`,
      });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Invite People</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email addresses
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses (comma or newline separated)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple emails with commas or new lines
            </p>
          </div>

          {/* Org Admin Toggle (Org Admin only) */}
          {isOrgAdmin && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeOrgAdmin}
                  onChange={(e) => {
                    setMakeOrgAdmin(e.target.checked);
                    if (e.target.checked) {
                      setLocationAssignments([]);
                    }
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Make Org Admin</div>
                  <div className="text-xs text-gray-500">
                    Grant full access to all locations and admin settings
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Location Assignments */}
          {!makeOrgAdmin && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-900">
                  Location Access <span className="text-red-500">*</span>
                </label>
                {unassignedLocations.length > 0 && (
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
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLocationToAdd}
                      onChange={(e) => setSelectedLocationToAdd(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select location...</option>
                      {unassignedLocations.map(loc => (
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
              {locationAssignments.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-sm">Add at least one location</p>
                  <p className="text-xs text-gray-400 mt-1">Users must have access to at least one location</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {locationAssignments.map(assignment => {
                    const location = getLocationById(assignment.locationId);
                    if (!location) return null;

                    return (
                      <div key={assignment.locationId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{location.name}</div>
                        </div>
                        <select
                          value={assignment.role}
                          onChange={(e) => handleRoleChange(assignment.locationId, e.target.value as Role)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {LOCATION_ROLES.map(role => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveLocation(assignment.locationId)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Invites
          </button>
        </div>
      </div>
    </div>
  );
}



