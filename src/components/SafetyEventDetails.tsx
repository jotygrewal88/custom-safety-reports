"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SafetyEventDetailsProps {
  event: {
    id: string;
    title: string;
    type: string;
    status: string;
    severity: string;
    dateTime: string;
    location: string;
    asset?: string;
    reporter: {
      name: string;
      email: string;
      avatar: string;
    };
    description: string;
    immediateActions: string;
    oshaReportable: boolean;
    summary: string;
    capas?: Array<{
      id: string;
      title: string;
      status: string;
      owner: string;
      dueDate: string;
    }>;
    statusTimeline?: Array<{
      status: string;
      timestamp: string;
      icon: string;
    }>;
  };
}

export default function SafetyEventDetails({ event }: SafetyEventDetailsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Review": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Closed": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Low": return "bg-green-50 text-green-700 border-green-200";
      case "Medium": return "bg-orange-50 text-orange-700 border-orange-200";
      case "High": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Incident": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Observation": return "bg-green-100 text-green-700 border-green-200";
      case "Customer Incident": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Near Miss": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Review":
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "Opened":
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ml-64">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm font-semibold text-gray-900">{event.id}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeColor(event.status)}`}>
                {getStatusIcon(event.status)}
                {event.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getSeverityBadgeColor(event.severity)}`}>
                {event.severity}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getTypeBadgeColor(event.type)}`}>
                {event.type}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/safetyevents/${event.id}/all-fields`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                View All Fields
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      View
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Duplicate
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        <div className="flex gap-6">
          {/* Left Content Area */}
          <div className="flex-1 space-y-6">
            {/* Event Title & Metadata Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.dateTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-medium text-xs">{event.reporter.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{event.reporter.name}</div>
                    <div className="text-xs text-gray-500">{event.reporter.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Summary Card */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Incident Summary</h2>
                  <p className="text-sm text-gray-700">{event.summary}</p>
                </div>
                {event.oshaReportable && (
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span className="text-sm font-medium">OSHA</span>
                  </div>
                )}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Take Action
              </button>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Immediate Actions Taken Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions Taken</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{event.immediateActions}</p>
            </div>

            {/* Linked CAPAs Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Linked CAPAs</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Create CAPA
                </button>
              </div>
              {event.capas && event.capas.length > 0 ? (
                <div className="space-y-3">
                  {event.capas.map((capa) => (
                    <div key={capa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{capa.id}</span>
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">{capa.status}</span>
                        </div>
                        <div className="text-sm text-gray-600">{capa.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Owner: {capa.owner} • Due: {capa.dueDate}
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No CAPAs linked to this event.</p>
              )}
            </div>

            {/* Comments Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 font-medium text-xs">JD</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment or tag a teammate using @..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Use @username to mention • Press Cmd + Enter to send
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Location and Assets Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location and Assets</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Location</div>
                    <div className="text-sm text-gray-600">{event.location}</div>
                  </div>
                </div>
                {event.asset && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Asset</div>
                      <div className="text-sm text-gray-600">{event.asset}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h2>
              {event.statusTimeline && event.statusTimeline.length > 0 ? (
                <div className="space-y-4">
                  {event.statusTimeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 ${item.status === "In Review" ? "text-yellow-500" : "text-green-500"}`}>
                        {item.icon === "clock" ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.status}</div>
                        <div className="text-xs text-gray-500">{item.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No timeline data available.</p>
              )}
            </div>

            {/* Audit Trail Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <span>View Internal Log</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

