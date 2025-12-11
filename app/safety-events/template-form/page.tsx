"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../../src/components/Sidebar";
import SafetyEventFormRuntime from "../../../src/components/SafetyEventFormRuntime";
import TemplateSelector from "../../../src/components/TemplateSelector";
import { TemplateProvider, useTemplate } from "../../../src/contexts/TemplateContext";

function TemplateFormContent({ templateId }: { templateId?: string | null }) {
  const { getTemplate, selectedTemplateId } = useTemplate();
  const currentTemplate = getTemplate();
  const finalTemplateId = templateId || selectedTemplateId;
  
  return (
    <>
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 ml-64">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {finalTemplateId && (
              <Link 
                href={`/settings/safety-templates/${finalTemplateId}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back to Template</span>
              </Link>
            )}
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-lg font-semibold">UpKeep EHS</span>
              {currentTemplate && (
                <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Preview: {currentTemplate.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">4</span>
            </button>
            <Link href="/safetyevents/new" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              + Create
            </Link>
            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-medium text-sm">J</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="ml-64 max-w-6xl mx-auto px-6 py-8">
        <SafetyEventFormRuntime useCustomTemplate={true} />
      </main>
    </>
  );
}

function TemplateFormPageInner() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const templateIdsParam = searchParams.get("templateIds");
  const accessPointId = searchParams.get("accessPointId") || undefined;
  const location = searchParams.get("location") || undefined;
  const asset = searchParams.get("asset") || undefined;

  // Handle multiple templates
  if (templateIdsParam && !templateId) {
    const templateIds = templateIdsParam.split(',').filter(Boolean);
    if (templateIds.length > 1) {
      // Show template selector
      return (
        <TemplateProvider>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <TemplateSelector 
              templateIds={templateIds}
              accessPointId={accessPointId}
              location={location}
              asset={asset}
            />
          </div>
        </TemplateProvider>
      );
    } else if (templateIds.length === 1) {
      // Single template, redirect to single template flow
      const params = new URLSearchParams();
      params.set('templateId', templateIds[0]);
      if (accessPointId) params.set('accessPointId', accessPointId);
      if (location) params.set('location', location);
      if (asset) params.set('asset', asset);
      // Use the single templateId flow below
      const finalTemplateId = templateIds[0];
      return (
        <TemplateProvider selectedTemplateId={finalTemplateId}>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <TemplateFormContent templateId={finalTemplateId} />
          </div>
        </TemplateProvider>
      );
    }
  }

  // Single template flow (backward compatible)
  const finalTemplateId = templateId || "injury-report";

  return (
    <TemplateProvider selectedTemplateId={finalTemplateId}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <TemplateFormContent templateId={finalTemplateId} />
      </div>
    </TemplateProvider>
  );
}

export default function TemplateFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <TemplateFormPageInner />
    </Suspense>
  );
}
