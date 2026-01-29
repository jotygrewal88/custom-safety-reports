"use client";

import React from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../../../src/components/Sidebar";
import SafetyEventDetailsAllFields from "../../../../src/components/SafetyEventDetailsAllFields";

export default function SafetyEventAllFieldsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <SafetyEventDetailsAllFields eventId={eventId || "SE-0006"} />
    </div>
  );
}










