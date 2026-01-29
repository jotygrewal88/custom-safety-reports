'use client';

import React, { useState } from 'react';

interface AIInsight {
  whatChanged: string[];
  whyItMatters: string[];
  whatToDoNext: string[];
}

interface AIInsightCardProps {
  title?: string;
  insight: AIInsight;
  loading?: boolean;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  lastUpdated?: string;
  onRefresh?: () => void;
  followUpPrompts?: string[];
  onFollowUp?: (prompt: string) => void;
}

export function AIInsightCard({
  title = 'AI Safety Summary',
  insight,
  loading = false,
  className = '',
  collapsible = false,
  defaultExpanded = true,
  lastUpdated,
  onRefresh,
  followUpPrompts,
  onFollowUp,
}: AIInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const renderSection = (
    sectionTitle: string,
    items: string[],
    icon: React.ReactNode,
    bgColor: string
  ) => (
    <div className={`rounded-lg p-4 ${bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold text-gray-900">{sectionTitle}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-5 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-blue-100 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-blue-100/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-blue-100/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-blue-100/50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-blue-100/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {lastUpdated && (
              <p className="text-xs text-gray-500">Updated {lastUpdated}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-blue-100 rounded transition-colors"
              title="Refresh summary"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-blue-100 rounded transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {(!collapsible || isExpanded) && (
        <div className="p-5">
          <div className="space-y-4">
            {/* What Changed */}
            {insight.whatChanged.length > 0 && renderSection(
              'What Changed',
              insight.whatChanged,
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>,
              'bg-white/60'
            )}

            {/* Why It Matters */}
            {insight.whyItMatters.length > 0 && renderSection(
              'Why It Matters',
              insight.whyItMatters,
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>,
              'bg-white/60'
            )}

            {/* What To Do Next */}
            {insight.whatToDoNext.length > 0 && renderSection(
              'What To Do Next',
              insight.whatToDoNext,
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>,
              'bg-white/60'
            )}
          </div>

          {/* Follow-up Prompts */}
          {followUpPrompts && followUpPrompts.length > 0 && onFollowUp && (
            <div className="mt-5 pt-4 border-t border-blue-100/50">
              <p className="text-xs font-medium text-gray-500 mb-2">Ask a follow-up question:</p>
              <div className="flex flex-wrap gap-2">
                {followUpPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowUp(prompt)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact variant for dashboard headers
interface CompactAIInsightProps {
  summary: string;
  className?: string;
}

export function CompactAIInsight({ summary, className = '' }: CompactAIInsightProps) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 ${className}`}>
      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p className="text-sm text-gray-700">{summary}</p>
    </div>
  );
}

// Generate mock AI insights based on data
export function generateMockExecutiveInsight(): AIInsight {
  return {
    whatChanged: [
      'Safety events decreased 12% compared to last month',
      'TRIR improved from 2.4 to 2.1 this quarter',
      'Near-miss reporting increased by 25%, indicating better safety awareness',
    ],
    whyItMatters: [
      'The decrease in incidents suggests safety initiatives are working',
      'Improved TRIR puts us below industry benchmark of 2.5',
      'Higher near-miss reporting typically predicts fewer serious incidents',
    ],
    whatToDoNext: [
      'Continue forklift safety campaign at Chicago facility',
      'Review the 3 overdue CAPAs from Dallas Distribution Center',
      'Schedule quarterly safety review for all site managers',
    ],
  };
}

export function generateMockOperationalInsight(): AIInsight {
  return {
    whatChanged: [
      '5 new safety events reported today (3 near-misses, 2 observations)',
      'Chicago Plant has 2 high-severity open events requiring attention',
      '4 CAPAs are due within the next 7 days',
    ],
    whyItMatters: [
      'Both high-severity events involve forklift operations - potential pattern',
      'Quick CAPA closure prevents compliance gaps',
      'Near-miss trend in warehouse areas needs monitoring',
    ],
    whatToDoNext: [
      'Prioritize review of forklift-related events at Chicago',
      'Assign resources to close CAPAs due this week',
      'Schedule safety briefing for warehouse team',
    ],
  };
}
