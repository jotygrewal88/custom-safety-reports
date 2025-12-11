"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "../../../src/components/Sidebar";
import SafetyEventFormRuntime from "../../../src/components/SafetyEventFormRuntime";

export default function NewSafetyEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 ml-64">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-semibold">UpKeep EHS</span>
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
        <SafetyEventFormRuntime />
      </main>
    </div>
  );
}
