"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Sidebar from "../../src/components/Sidebar";
import LocationSwitcher from "../../src/components/LocationSwitcher";
import { AccessPointProvider, useAccessPoint } from "../../src/contexts/AccessPointContext";
import { TemplateProvider } from "../../src/contexts/TemplateContext";
import { useAccess } from "../../src/contexts/AccessContext";
import { filterByLocationContext, getLocationIdFromName, isLocationFilterLocked } from "../../src/utils/accessFilters";
import CreateAccessPointModal from "../../src/components/CreateAccessPointModal";
import QRCodeModal from "../../src/components/QRCodeModal";

function AccessPointsListContent() {
  const { getAllAccessPoints, archiveAccessPoint } = useAccessPoint();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Access context for RBAC filtering
  const {
    isOrgAdmin,
    allowedLocationIds,
    allowedLocations,
    locationContext,
    locations,
    canCreateRecords,
    getLocationById,
  } = useAccess();

  const accessPoints = getAllAccessPoints();

  // Determine if location filter is locked (single-location user)
  const filterLocked = isLocationFilterLocked({ isOrgAdmin, allowedLocationIds, locationContext });

  // Get the "Showing" pill label
  const getShowingLabel = () => {
    if (locationContext === "ALL_LOCATIONS") {
      return { text: "All locations", locked: false };
    }
    if (locationContext === "ALL_ASSIGNED") {
      return { text: "All assigned locations", locked: false };
    }
    if (locationContext.startsWith("LOCATION:")) {
      const locId = locationContext.replace("LOCATION:", "");
      const loc = getLocationById(locId);
      const isLocked = !isOrgAdmin && allowedLocationIds.length === 1;
      return { text: loc?.name || "Unknown", locked: isLocked };
    }
    return { text: "Unknown", locked: false };
  };

  const showingInfo = getShowingLabel();

  // Get available location options for the filter dropdown
  const locationOptions = useMemo(() => {
    if (isOrgAdmin) {
      const allLocs = locations.filter(l => l.status === "active");
      return ["All", ...allLocs.map(l => l.name)];
    } else {
      return ["All", ...allowedLocations.map(l => l.name)];
    }
  }, [isOrgAdmin, locations, allowedLocations]);

  // Check if user has no location access
  const hasNoAccess = !isOrgAdmin && allowedLocationIds.length === 0;

  // Filter access points based on location context and permissions
  const filteredAccessPoints = useMemo(() => {
    // First apply location context filter (RBAC)
    let filtered = filterByLocationContext(
      accessPoints,
      (ap) => getLocationIdFromName(ap.location),
      { isOrgAdmin, allowedLocationIds, locationContext }
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ap =>
        ap.name.toLowerCase().includes(query) ||
        ap.location.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ap => ap.status === statusFilter);
    }

    // Apply location filter (additional filter within allowed locations)
    if (locationFilter !== "All") {
      filtered = filtered.filter(ap => ap.location === locationFilter);
    }

    return filtered;
  }, [accessPoints, searchQuery, statusFilter, locationFilter, isOrgAdmin, allowedLocationIds, locationContext]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric"
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700 border-green-200";
      case "archived": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleArchive = (id: string) => {
    if (confirm("Are you sure you want to archive this access point?")) {
      archiveAccessPoint(id);
      setOpenMenuId(null);
    }
  };

  const handleShowQRCode = (id: string) => {
    setSelectedAccessPoint(id);
  };

  // No access state
  if (hasNoAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <header className="bg-white border-b border-gray-200 ml-64">
          <div className="px-8 py-3 flex items-center justify-between">
            <LocationSwitcher />
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">4</span>
              </button>
              <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed">
                + Create
              </button>
              <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium text-sm">J</span>
              </div>
            </div>
          </div>
        </header>
        <main className="ml-64 px-8 py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Location Access</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              You don&apos;t have access to any locations. Contact an Org Admin to request access.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Contact Admin
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 ml-64">
        <div className="px-8 py-3 flex items-center justify-between">
          <LocationSwitcher />
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">4</span>
            </button>
            {canCreateRecords ? (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Create
              </button>
            ) : (
              <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed">
                + Create
              </button>
            )}
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-medium text-sm">J</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="ml-64 px-8 py-6">
        {/* Page Header with Showing Pill */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Access Points</h1>
              <p className="text-sm text-gray-600">Track and manage all access points</p>
            </div>
            {/* Showing Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              showingInfo.locked 
                ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <span>Showing:</span>
              <span className="font-medium">{showingInfo.text}</span>
              {showingInfo.locked && (
                <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Search and Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search access points..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Create Access Point
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Location</span>
            <div className="relative">
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                disabled={filterLocked}
                className={`px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  filterLocked 
                    ? 'cursor-not-allowed bg-gray-50 text-gray-500' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {locationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {filterLocked && (
                <svg className="absolute right-8 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Created By</span>
            <select className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>All</option>
            </select>
          </div>

          <button className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created Date Range
          </button>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Include Archived</span>
          </label>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Point Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccessPoints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      {locationContext.startsWith("LOCATION:") ? (
                        <>
                          <p className="font-medium text-gray-700">No access points in {showingInfo.text}</p>
                          <p className="text-xs text-gray-400 mt-1">Create an access point or change your location filter</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-700">No access points found</p>
                          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or create a new access point</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccessPoints.map((ap) => (
                  <tr key={ap.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {ap.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ap.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {ap.asset || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{ap.createdBy}</div>
                      <div className="text-xs text-gray-500">joty.grewal@upkeep.com</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(ap.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeColor(ap.status)}`}>
                        {ap.status === 'active' ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm relative">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShowQRCode(ap.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View QR Code"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === ap.id ? null : ap.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                        {openMenuId === ap.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleArchive(ap.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Archive
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Access Point Modal */}
      <CreateAccessPointModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(id) => {
          setShowCreateModal(false);
          setSelectedAccessPoint(id);
        }}
      />

      {/* QR Code Modal */}
      {selectedAccessPoint && (
        <QRCodeModal
          accessPointId={selectedAccessPoint}
          isOpen={!!selectedAccessPoint}
          onClose={() => setSelectedAccessPoint(null)}
        />
      )}
    </div>
  );
}

export default function AccessPointsPage() {
  return (
    <TemplateProvider>
      <AccessPointProvider>
        <AccessPointsListContent />
      </AccessPointProvider>
    </TemplateProvider>
  );
}

