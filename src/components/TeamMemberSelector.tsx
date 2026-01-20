/**
 * Team Member Selector Component
 * 
 * Multi-select component for adding users to teams.
 * Shows active users with checkboxes and displays selected count.
 */

import React, { useState } from "react";
import type { EHSUser } from "../schemas/users";

interface TeamMemberSelectorProps {
  users: EHSUser[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  leaderId?: string;
  onLeaderChange?: (userId: string | undefined) => void;
}

export default function TeamMemberSelector({
  users,
  selectedUserIds,
  onChange,
  leaderId,
  onLeaderChange
}: TeamMemberSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || user.email.toLowerCase().includes(query);
  });

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      // Remove user
      const newSelection = selectedUserIds.filter(id => id !== userId);
      onChange(newSelection);
      
      // If removing the leader, clear leader selection
      if (leaderId === userId && onLeaderChange) {
        onLeaderChange(undefined);
      }
    } else {
      // Add user
      onChange([...selectedUserIds, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      // Deselect all
      onChange([]);
      if (onLeaderChange) {
        onLeaderChange(undefined);
      }
    } else {
      // Select all
      onChange(users.map(u => u.id));
    }
  };

  const handleSetLeader = (userId: string) => {
    if (onLeaderChange) {
      onLeaderChange(leaderId === userId ? undefined : userId);
    }
  };

  const selectedCount = selectedUserIds.length;
  const allSelected = selectedUserIds.length === users.length && users.length > 0;
  const someSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg 
          className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Select All */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200">
        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <input
            type="checkbox"
            checked={allSelected}
            ref={input => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={() => {}}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <span className="text-sm text-gray-500">
          {selectedCount} selected
        </span>
      </div>

      {/* User List */}
      <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {searchQuery ? "No users found matching your search" : "No users available"}
          </div>
        ) : (
          filteredUsers.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            const isLeader = leaderId === user.id;

            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleUser(user.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {isLeader && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        Team Lead
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {user.roleName && (
                    <p className="text-xs text-gray-400 truncate">{user.roleName}</p>
                  )}
                </div>

                {isSelected && onLeaderChange && (
                  <button
                    type="button"
                    onClick={() => handleSetLeader(user.id)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      isLeader
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                    }`}
                    title={isLeader ? "Remove as team lead" : "Set as team lead"}
                  >
                    {isLeader ? "★ Lead" : "Set Lead"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedCount > 0 && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Selected members will receive team notifications and can be assigned tasks as a group
        </p>
      )}
    </div>
  );
}
