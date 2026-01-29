"use client";

import React, { useState } from "react";
import Link from "next/link";
import FieldDisplay from "./FieldDisplay";
import { 
  INCIDENT_DETAILS_FIELDS, 
  INJURY_MEDICAL_FIELDS, 
  CAUSE_RISK_FIELDS, 
  ENVIRONMENTAL_PROPERTY_FIELDS, 
  GUEST_LEGAL_FIELDS, 
  SIGNOFF_REVIEW_FIELDS,
  DIAGRAMS_SKETCHES_FIELDS 
} from "../templates/paletteFields";

interface SafetyEventDetailsAllFieldsProps {
  eventId: string;
}

export default function SafetyEventDetailsAllFields({ eventId }: SafetyEventDetailsAllFieldsProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Mock data showing examples of all field types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFieldValues: Record<string, any> = {
    // Incident Details
    type: "Incident",
    location: "Joty's Manufacturing Plant",
    gpsLocation: { latitude: 37.7749, longitude: -122.4194 },
    assets: "Pump Station #42",
    hazard: "Slip/Trip/Fall",
    severity: "Medium",
    immediateActions: "1. Immediate medical attention provided\n2. Area cordoned off\n3. Oil spill cleaned up",
    media: [
      { name: "incident-photo-1.jpg", size: 2048000 },
      { name: "incident-photo-2.jpg", size: 1856000 }
    ],
    additionalDetails: "Additional context about the incident...",
    personType: "Worker",

    // Injury & Medical
    injuryType: "Slip / Trip / Fall",
    bodyPartAffected: ["Leg", "Back"],
    ppeWorn: true,
    ppeType: ["Hard Hat", "Safety Boots"],
    medicalAttentionRequired: true,
    medicalTreatmentType: "Clinic visit",
    lostTimeRestrictedDuty: "Restricted duty",

    // Cause & Risk
    immediateCause: "Oil spill on floor due to equipment malfunction",
    rootCause: "Lack of preventive maintenance schedule",
    contributingFactors: "Wet conditions, inadequate signage",
    riskRatingPreControl: "High",
    riskRatingPostControl: "Low",

    // Environmental & Property
    environmentalImpact: false,
    environmentalImpactType: [],
    estimatedQuantityReleased: "",
    propertyDamage: true,
    estimatedDamageCost: 5000,

    // Guest/Legal
    guestCustomerName: "",
    guestContactInfo: "",
    insuranceProvider: "",
    policyNumber: "",
    claimNumber: "",
    driversLicenseNumber: "",
    lawyerName: "",
    lawyerContact: "",

    // Sign-off
    reporterName: "John Doe",
    reporterRole: "Safety Manager",
    supervisorName: "Jane Smith",
    supervisorReviewDate: new Date("2025-07-16T10:00:00").toISOString(),
    signoffAcknowledgement: { name: "Jane Smith" },

    // Diagrams
    bodyDiagram: { data: "mock" },
    sceneDiagram: { data: "mock" },
    sketch: { data: "mock" }
  };

  const event = {
    id: eventId,
    title: "Worker Slips and Falls Due to Oil Spill",
    type: "Incident",
    status: "In Review",
    severity: "Medium",
    dateTime: "Jul 15, 2025 10:10 AM",
    location: "Joty's Manufacturing Plant",
    asset: "Pump Station #42",
    reporter: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "JD"
    },
    description: "A worker slipped and fell on an oil spill near Pump Station #42. The incident occurred during routine maintenance operations.",
    immediateActions: "1. Immediate medical attention provided\n2. Area cordoned off\n3. Oil spill cleaned up",
    oshaReportable: false,
    summary: "Worker injury due to oil spill - immediate actions taken",
    statusTimeline: [
      {
        status: "Opened",
        timestamp: "Jul 15, 2025 10:10 AM",
        icon: "document"
      },
      {
        status: "In Review",
        timestamp: "Jul 15, 2025 2:30 PM",
        icon: "clock"
      }
    ]
  };

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderFieldCard = (field: { id: string; label: string; componentType: string; helpText?: string; options?: Array<{ value: string; label: string }> }, value: any) => {
    return (
      <div key={field.id} className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{field.label}</h3>
        {field.helpText && (
          <p className="text-xs text-gray-500 mb-3">{field.helpText}</p>
        )}
        <FieldDisplay field={field} value={value} />
      </div>
    );
  };

  return (
    <div className="ml-64">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/safetyevents/${eventId}`}
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
                href={`/safetyevents/${eventId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                View Standard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Fields View</h1>
          <p className="text-sm text-gray-600">This page demonstrates all possible field types that can be included in a safety event template.</p>
        </div>

        <div className="space-y-6">
          {/* Incident Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Incident Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INCIDENT_DETAILS_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Injury & Medical Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury & Medical</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INJURY_MEDICAL_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Cause & Risk Analysis Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cause & Risk Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAUSE_RISK_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Environmental & Property Impact Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Environmental & Property Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ENVIRONMENTAL_PROPERTY_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Guest / Customer & Legal Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest / Customer & Legal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUEST_LEGAL_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Diagrams & Sketches Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagrams & Sketches</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DIAGRAMS_SKETCHES_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>

          {/* Sign-off & Review Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign-off & Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIGNOFF_REVIEW_FIELDS.map(field => 
                renderFieldCard(field, mockFieldValues[field.id])
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}










