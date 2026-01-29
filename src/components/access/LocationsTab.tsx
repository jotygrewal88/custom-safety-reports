"use client";

import React, { useState, useMemo } from "react";
import { useAccess } from "../../contexts/AccessContext";
import { ROLE_LABELS, LOCATION_ROLES } from "../../types/access";
import type { Location, Role } from "../../types/access";
import InviteModal from "./InviteModal";

export default function LocationsTab() {
  const {
    locations,
    users,
    accessAssignments,
    isOrgAdmin,
    allowedLocationIds,
    getLocationUserCount,
    getLocationAdmins,
    addLocation,
    updateLocation,
    addAuditLogEntry,
    currentUserId,
    currentUser,
  } = useAccess();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLocationId, setInviteLocationId] = useState<string | null>(null);

  // Filter locations based on permissions and filters
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Location Admins can only see their locations
    if (!isOrgAdmin) {
      filtered = filtered.filter(loc => allowedLocationIds.includes(loc.id));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(loc => loc.status === statusFilter.toLowerCase());
    }

    return filtered;
  }, [locations, isOrgAdmin, allowedLocationIds, searchQuery, statusFilter]);

  const handleAddLocation = () => {
    if (!newLocationName.trim()) return;

    const newLoc = addLocation({
      name: newLocationName.trim(),
      status: "active",
    });

    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "location_created",
      target_type: "location",
      target_id: newLoc.id,
      target_name: newLoc.name,
      details: `Created new location "${newLoc.name}"`,
    });

    setNewLocationName("");
    setShowAddLocation(false);
  };

  const handleStatusToggle = (locationId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateLocation(locationId, { status: newStatus as "active" | "inactive" });

    const location = locations.find(l => l.id === locationId);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "location_updated",
      target_type: "location",
      target_id: locationId,
      target_name: location?.name || "Unknown",
      details: `Changed status to ${newStatus}`,
    });
  };

  const handleInviteToLocation = (locationId: string) => {
    setInviteLocationId(locationId);
    setShowInviteModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Add Location Button (Org Admin only) */}
        {isOrgAdmin && (
          <button
            onClick={() => setShowAddLocation(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
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
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Location</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Location name..."
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLocation}
              disabled={!newLocationName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowAddLocation(false);
                setNewLocationName("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">People</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Admins</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLocations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No locations found matching your criteria
                </td>
              </tr>
            ) : (
              filteredLocations.map((location) => {
                const admins = getLocationAdmins(location.id);
                const userCount = getLocationUserCount(location.id);

                return (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(location.status)}`}>
                        {location.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{userCount} user{userCount !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center group relative">
                        {admins.slice(0, 3).map((admin, i) => (
                          <div
                            key={admin.id}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white -ml-1 first:ml-0 cursor-default"
                            title={admin.name}
                          >
                            {admin.avatarInitials || admin.name.charAt(0)}
                          </div>
                        ))}
                        {admins.length > 3 && (
                          <div 
                            className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white -ml-1 cursor-default"
                            title={admins.slice(3).map(a => a.name).join(', ')}
                          >
                            +{admins.length - 3}
                          </div>
                        )}
                        {admins.length === 0 && (
                          <span className="text-xs text-gray-400">No admins</span>
                        )}
                        {/* Tooltip showing all admin names on hover */}
                        {admins.length > 0 && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                              <div className="font-medium mb-1">Admins ({admins.length})</div>
                              {admins.map(admin => (
                                <div key={admin.id} className="text-gray-300">{admin.name}</div>
                              ))}
                            </div>
                            <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLocationId(location.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleInviteToLocation(location.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Invite
                        </button>
                        {isOrgAdmin && (
                          <button
                            onClick={() => handleStatusToggle(location.id, location.status)}
                            className={`text-sm ${location.status === 'active' ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {location.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manage Location Drawer */}
      {selectedLocationId && (
        <ManageLocationDrawer
          locationId={selectedLocationId}
          onClose={() => setSelectedLocationId(null)}
          onInvite={() => handleInviteToLocation(selectedLocationId)}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal 
          onClose={() => {
            setShowInviteModal(false);
            setInviteLocationId(null);
          }}
          prefillLocationId={inviteLocationId || undefined}
        />
      )}
    </div>
  );
}

// Manage Location Drawer Component
function ManageLocationDrawer({ 
  locationId, 
  onClose,
  onInvite,
}: { 
  locationId: string; 
  onClose: () => void;
  onInvite: () => void;
}) {
  const {
    locations,
    users,
    accessAssignments,
    isOrgAdmin,
    allowedLocationIds,
    updateAccessAssignment,
    removeAccessAssignment,
    addAuditLogEntry,
    currentUserId,
    currentUser,
  } = useAccess();

  const location = locations.find(l => l.id === locationId);

  // Get users with access to this location
  const locationAssignments = accessAssignments.filter(
    a => (a.scope_type === "LOCATION" && a.scope_id === locationId) ||
         (a.scope_type === "ORG" && a.role === "ORG_ADMIN")
  );

  // Group users by role
  const usersByRole = {
    orgAdmins: locationAssignments
      .filter(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN")
      .map(a => ({ user: users.find(u => u.id === a.user_id), assignment: a }))
      .filter(({ user }) => user),
    locationAdmins: locationAssignments
      .filter(a => a.scope_type === "LOCATION" && a.role === "LOCATION_ADMIN")
      .map(a => ({ user: users.find(u => u.id === a.user_id), assignment: a }))
      .filter(({ user }) => user),
    users: locationAssignments
      .filter(a => a.scope_type === "LOCATION" && a.role === "USER")
      .map(a => ({ user: users.find(u => u.id === a.user_id), assignment: a }))
      .filter(({ user }) => user),
    viewOnly: locationAssignments
      .filter(a => a.scope_type === "LOCATION" && a.role === "VIEW_ONLY")
      .map(a => ({ user: users.find(u => u.id === a.user_id), assignment: a }))
      .filter(({ user }) => user),
  };

  const handleRoleChange = (assignmentId: string, newRole: Role) => {
    const assignment = accessAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const user = users.find(u => u.id === assignment.user_id);
    updateAccessAssignment(assignmentId, newRole);
    
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "role_changed",
      target_type: "user",
      target_id: assignment.user_id,
      target_name: user?.name || "Unknown",
      details: `Changed role to ${ROLE_LABELS[newRole]} for ${location?.name}`,
    });
  };

  const handleRemoveAccess = (assignmentId: string) => {
    const assignment = accessAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const user = users.find(u => u.id === assignment.user_id);
    removeAccessAssignment(assignmentId);
    
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "access_revoked",
      target_type: "user",
      target_id: assignment.user_id,
      target_name: user?.name || "Unknown",
      details: `Removed access to ${location?.name}`,
    });
  };

  if (!location) return null;

  const renderUserGroup = (
    title: string, 
    items: Array<{ user: typeof users[0] | undefined; assignment: typeof accessAssignments[0] }>,
    isOrgScope: boolean = false
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
        <div className="space-y-2">
          {items.map(({ user, assignment }) => {
            if (!user) return null;
            return (
              <div key={assignment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {user.avatarInitials || user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                {!isOrgScope && (
                  <>
                    <select
                      value={assignment.role}
                      onChange={(e) => handleRoleChange(assignment.id, e.target.value as Role)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {LOCATION_ROLES.map(role => (
                        <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveAccess(assignment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove access"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
                {isOrgScope && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Org Admin
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{location.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${location.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {location.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Invite Button */}
          <button
            onClick={onInvite}
            className="w-full mb-6 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite people to this location
          </button>

          {/* User Groups */}
          {renderUserGroup("Org Admins", usersByRole.orgAdmins, true)}
          {renderUserGroup("Location Admins", usersByRole.locationAdmins)}
          {renderUserGroup("Users", usersByRole.users)}
          {renderUserGroup("View Only", usersByRole.viewOnly)}

          {locationAssignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-sm">No users have access to this location</p>
              <p className="text-xs text-gray-400 mt-1">Invite people to get started</p>
            </div>
          )}
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



