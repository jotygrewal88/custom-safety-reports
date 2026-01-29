"use client";

import React from "react";
import Link from "next/link";
import { useAccess } from "../../contexts/AccessContext";

interface AccessDeniedProps {
  message?: string;
  showSwitchLocation?: boolean;
  showContactAdmin?: boolean;
}

export default function AccessDenied({
  message = "You don't have access to this location.",
  showSwitchLocation = true,
  showContactAdmin = true,
}: AccessDeniedProps) {
  const { users, accessAssignments, allowedLocations } = useAccess();

  // Get org admins for contact info
  const orgAdmins = accessAssignments
    .filter(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN")
    .map(a => users.find(u => u.id === a.user_id))
    .filter(Boolean);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      
      <div className="flex items-center gap-3">
        {showSwitchLocation && allowedLocations.length > 0 && (
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Safety Events
          </Link>
        )}
        
        {showContactAdmin && orgAdmins.length > 0 && (
          <button
            onClick={() => {
              const adminList = orgAdmins.map(a => `${a?.name} (${a?.email})`).join("\n");
              alert(`Contact an Org Admin for access:\n\n${adminList}`);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Contact Admin
          </button>
        )}
      </div>
    </div>
  );
}

interface NoLocationAssignedProps {
  title?: string;
  message?: string;
}

export function NoLocationAssigned({
  title = "No Location Access",
  message = "You don't have access to any locations. Contact an Org Admin to request access.",
}: NoLocationAssignedProps) {
  const { users, accessAssignments } = useAccess();

  // Get org admins for contact info
  const orgAdmins = accessAssignments
    .filter(a => a.scope_type === "ORG" && a.role === "ORG_ADMIN")
    .map(a => users.find(u => u.id === a.user_id))
    .filter(Boolean);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      
      {orgAdmins.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Contact an Org Admin:</p>
          <div className="space-y-2">
            {orgAdmins.slice(0, 3).map((admin) => (
              <div key={admin?.id} className="flex items-center justify-center gap-2 text-sm">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {admin?.avatarInitials || admin?.name.charAt(0)}
                  </span>
                </div>
                <span className="text-gray-700">{admin?.name}</span>
                <span className="text-gray-400">•</span>
                <a href={`mailto:${admin?.email}`} className="text-blue-600 hover:underline">
                  {admin?.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



