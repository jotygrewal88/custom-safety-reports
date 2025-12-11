"use client";

import React from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../../src/components/Sidebar";
import SafetyEventDetails from "../../../src/components/SafetyEventDetails";

// Mock data for safety event details
const getMockEventData = (id: string) => {
  const baseEvent = {
    id: id,
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
    description: "A worker slipped and fell on an oil spill near Pump Station #42. The incident occurred during routine maintenance operations. The worker sustained minor injuries and was immediately attended to by the on-site medical team.",
    immediateActions: "1. Immediate medical attention provided to the injured worker\n2. Area cordoned off with safety barriers\n3. Oil spill cleaned up using appropriate absorbent materials\n4. Incident reported to supervisor and safety team\n5. Root cause investigation initiated",
    oshaReportable: false,
    summary: "Worker injury due to oil spill - immediate actions taken, area secured",
    capas: [
      {
        id: "CAPA-001",
        title: "Implement Regular Floor Inspection Schedule",
        status: "In Progress",
        owner: "Sarah Johnson",
        dueDate: "Aug 15, 2025"
      },
      {
        id: "CAPA-002",
        title: "Enhanced PPE Requirements for Maintenance Area",
        status: "Open",
        owner: "Mike Chen",
        dueDate: "Aug 20, 2025"
      }
    ],
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

  return baseEvent;
};

export default function SafetyEventViewPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const eventData = getMockEventData(eventId || "SE-0006");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <SafetyEventDetails event={eventData} />
    </div>
  );
}





