"use client";

import React, { useState, useMemo } from "react";
import { useAccess } from "../../contexts/AccessContext";
import { ROLE_LABELS, LOCATION_ROLES } from "../../types/access";
import type { User, Role, AccessAssignment } from "../../types/access";
import EditAccessDrawer from "./EditAccessDrawer";
import InviteModal from "./InviteModal";

export default function PeopleTab() {
  const {
    users,
    locations,
    accessAssignments,
    isOrgAdmin,
    allowedLocationIds,
    allowedLocations,
    getUserAccessSummary,
    isUserOrgAdmin,
    deactivateUser,
    reactivateUser,
    addAuditLogEntry,
    currentUserId,
    currentUser,
    canDeactivateUser,
    canReactivateUser,
  } = useAccess();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Get location options for filter dropdown
  const locationOptions = useMemo(() => {
    if (isOrgAdmin) {
      return locations.filter(l => l.status === "active");
    }
    return allowedLocations;
  }, [isOrgAdmin, locations, allowedLocations]);

  // Helper to get user's location names
  const getUserLocationNames = (userId: string): string[] => {
    if (isUserOrgAdmin(userId)) {
      return ["All locations"];
    }
    const userAssigns = accessAssignments.filter(
      a => a.user_id === userId && a.scope_type === "LOCATION"
    );
    return userAssigns
      .map(a => locations.find(l => l.id === a.scope_id)?.name)
      .filter((name): name is string => !!name);
  };

  // Filter users based on permissions and filters
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Location Admins can only see users in their locations
    if (!isOrgAdmin) {
      filtered = filtered.filter(user => {
        // Check if user has any assignment in allowed locations
        const userAssignments = accessAssignments.filter(a => a.user_id === user.id);
        return userAssignments.some(a => 
          a.scope_type === "ORG" || 
          (a.scope_type === "LOCATION" && a.scope_id && allowedLocationIds.includes(a.scope_id))
        );
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== "All") {
      filtered = filtered.filter(user => {
        const userAssignments = accessAssignments.filter(a => a.user_id === user.id);
        if (roleFilter === "ORG_ADMIN") {
          return userAssignments.some(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN");
        }
        return userAssignments.some(a => a.role === roleFilter);
      });
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(user => user.status === statusFilter.toLowerCase());
    }

    // Location filter
    if (locationFilter !== "All") {
      filtered = filtered.filter(user => {
        // Org Admins have access to all locations, so they match any location filter
        if (isUserOrgAdmin(user.id)) return true;
        // Check if user has assignment at the selected location
        const userAssignments = accessAssignments.filter(a => a.user_id === user.id);
        return userAssignments.some(
          a => a.scope_type === "LOCATION" && a.scope_id === locationFilter
        );
      });
    }

    return filtered;
  }, [users, accessAssignments, isOrgAdmin, allowedLocationIds, searchQuery, roleFilter, statusFilter, locationFilter, isUserOrgAdmin]);

  const handleDeactivate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Double-check permission (belt and suspenders with the button visibility check)
    if (!canDeactivateUser(userId)) {
      alert("You don't have permission to deactivate this user");
      return;
    }

    deactivateUser(userId);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "user_deactivated",
      target_type: "user",
      target_id: userId,
      target_name: user.name,
      details: `Deactivated user ${user.email}`,
    });
  };

  const handleReactivate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Double-check permission
    if (!canReactivateUser(userId)) {
      alert("You don't have permission to reactivate this user");
      return;
    }

    reactivateUser(userId);
    addAuditLogEntry({
      actor_id: currentUserId,
      actor_name: currentUser?.name || "Unknown",
      action: "user_reactivated",
      target_type: "user",
      target_id: userId,
      target_name: user.name,
      details: `Reactivated user ${user.email}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "invited":
        return "bg-blue-100 text-blue-700";
      case "deactivated":
        return "bg-gray-100 text-gray-700";
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
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="ORG_ADMIN">Org Admin</option>
            <option value="LOCATION_ADMIN">Location Admin</option>
            <option value="USER">User</option>
            <option value="VIEW_ONLY">View Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Deactivated">Deactivated</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Locations</option>
            {locationOptions.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Invite Button */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite People
        </button>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Access</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Locations</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.avatarInitials || user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {getUserAccessSummary(user.id)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {getUserLocationNames(user.id).map((locName, idx) => (
                        <span 
                          key={idx} 
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            locName === "All locations" 
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {locName}
                        </span>
                      ))}
                      {getUserLocationNames(user.id).length === 0 && (
                        <span className="text-xs text-gray-400 italic">No locations</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUserId(user.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit Access
                      </button>
                      {user.status === "active" && canDeactivateUser(user.id) && (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Deactivate
                        </button>
                      )}
                      {user.status === "deactivated" && canReactivateUser(user.id) && (
                        <button
                          onClick={() => handleReactivate(user.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Access Drawer */}
      {selectedUserId && (
        <EditAccessDrawer
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}



