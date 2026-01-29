// Analytics Data Types for UpKeep EHS Proactive Safety Reporting

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type EventClassification = 
  | 'incident'
  | 'near_miss'
  | 'hazard'
  | 'observation'
  | 'unsafe_condition';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type EventStatus = 'open' | 'in_review' | 'closed';

export type CapaType = 'corrective' | 'preventive';

export type CapaStatus = 'open' | 'in_progress' | 'pending_review' | 'closed';

export type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export type HazardCategory =
  | 'slip_trip_fall'
  | 'struck_by'
  | 'caught_in'
  | 'electrical'
  | 'chemical'
  | 'ergonomic'
  | 'fire'
  | 'machine_guarding'
  | 'ppe'
  | 'housekeeping'
  | 'environmental'
  | 'other';

// ============================================================================
// SAFETY EVENTS (Analytics-Enhanced)
// ============================================================================

export interface AnalyticsSafetyEvent {
  id: string;
  title: string;
  description: string;
  
  // Required analytics fields
  classification: EventClassification;
  severity: Severity;
  status: EventStatus;
  eventDate: string; // ISO date string
  
  // Location & organizational
  siteId: string;
  siteName: string;
  locationId?: string;
  locationName?: string;
  department?: string;
  
  // Categorization
  hazardCategory?: HazardCategory;
  templateId?: string;
  templateName?: string;
  
  // Asset linkage
  assetId?: string;
  assetName?: string;
  
  // People
  reporterId: string;
  reporterName: string;
  assigneeId?: string;
  assigneeName?: string;
  
  // OSHA tracking
  oshaRecordable: boolean;
  oshaReportable?: boolean;
  daysAway?: number;
  restrictedDays?: number;
  
  // Linkages
  linkedCapaIds: string[];
  linkedWorkOrderIds: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  
  // AI/Metadata
  aiConfidenceScore?: number;
}

// ============================================================================
// CAPAs (Corrective and Preventive Actions)
// ============================================================================

export interface CAPA {
  id: string;
  title: string;
  description: string;
  
  // Core fields
  type: CapaType;
  status: CapaStatus;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  assignedById: string;
  assignedByName: string;
  
  // Location
  siteId: string;
  siteName: string;
  
  // Dates
  createdDate: string;
  dueDate: string;
  closedDate?: string;
  
  // Linkages
  linkedEventIds: string[];
  linkedWorkOrderIds: string[];
  
  // Root cause & effectiveness
  rootCause?: string;
  effectivenessVerified?: boolean;
  effectivenessVerifiedDate?: string;
  
  // Priority
  priority: Severity;
}

// ============================================================================
// OSHA LOGS
// ============================================================================

export interface OSHALocation {
  id: string;
  name: string;
  naicsCode?: string;
  sic?: string;
  averageEmployees: number;
}

export interface OSHA300Entry {
  id: string;
  oshaLocationId: string;
  caseNumber: string;
  employeeName: string;
  jobTitle: string;
  dateOfInjury: string;
  whereOccurred: string;
  description: string;
  
  // Injury classification
  death: boolean;
  daysAwayFromWork: boolean;
  jobTransferOrRestriction: boolean;
  otherRecordableCase: boolean;
  
  // Days
  daysAway: number;
  daysRestricted: number;
  
  // Injury type
  injuryType: 'injury' | 'skin_disorder' | 'respiratory' | 'poisoning' | 'hearing_loss' | 'other';
  
  // Linked safety event
  linkedEventId?: string;
  
  // Period
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

export interface OSHA300ASummary {
  id: string;
  oshaLocationId: string;
  year: number;
  
  // Location info
  establishmentName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  industry: string;
  naicsCode: string;
  
  // Employment
  annualAverageEmployees: number;
  totalHoursWorked: number;
  
  // Injury/Illness totals
  totalDeaths: number;
  totalDaysAwayFromWork: number;
  totalJobTransferOrRestriction: number;
  totalOtherRecordableCases: number;
  
  // Total days
  totalDaysAway: number;
  totalDaysRestricted: number;
  
  // Injury types
  totalInjuries: number;
  totalSkinDisorders: number;
  totalRespiratoryConditions: number;
  totalPoisonings: number;
  totalHearingLoss: number;
  totalOtherIllnesses: number;
  
  // Calculated rates (per 200,000 hours)
  trir: number; // Total Recordable Incident Rate
  dart: number; // Days Away, Restricted, or Transferred
  ltir: number; // Lost Time Incident Rate
  
  // Certification
  certifiedBy?: string;
  certifiedTitle?: string;
  certifiedDate?: string;
  certifiedPhone?: string;
}

// Quarterly aggregation for trending
export interface OSHAQuarterlySummary {
  oshaLocationId: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  
  recordableCount: number;
  dartCount: number;
  hoursWorked: number;
  daysAway: number;
  daysRestricted: number;
  
  // Rates
  trir: number;
  dart: number;
}

// ============================================================================
// SAFETY WORK ORDERS
// ============================================================================

export interface SafetyWorkOrder {
  id: string;
  title: string;
  description?: string;
  
  // Status
  status: WorkOrderStatus;
  priority: Severity;
  
  // Asset linkage
  assetId?: string;
  assetName?: string;
  
  // Location
  siteId: string;
  siteName: string;
  locationId?: string;
  locationName?: string;
  
  // Ownership
  assigneeId?: string;
  assigneeName?: string;
  createdById: string;
  createdByName: string;
  
  // Dates
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  
  // Linkages
  linkedEventId?: string;
  linkedCapaId?: string;
  
  // Work order type
  workOrderType: 'corrective' | 'preventive' | 'inspection' | 'emergency';
}

// ============================================================================
// ASSETS (for correlation)
// ============================================================================

export interface Asset {
  id: string;
  name: string;
  assetTag?: string;
  category: string;
  siteId: string;
  siteName: string;
  locationId?: string;
  locationName?: string;
  status: 'operational' | 'under_maintenance' | 'out_of_service';
}

// ============================================================================
// FILTER & AGGREGATION TYPES
// ============================================================================

export type TimeRange = 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom';

export interface AnalyticsFilters {
  timeRange: TimeRange;
  startDate?: string;
  endDate?: string;
  siteIds: string[];
  locationIds: string[];
  severities: Severity[];
  classifications: EventClassification[];
  hazardCategories: HazardCategory[];
  templateIds: string[];
  assetIds: string[];
}

export interface DateRangeResult {
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// WIDGET DATA TYPES
// ============================================================================

export interface KPIData {
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'flat';
}

export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DistributionItem {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface RankedItem {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  metadata?: Record<string, string | number>;
  trend?: 'up' | 'down' | 'flat';
}

// ============================================================================
// DATA CONFIDENCE
// ============================================================================

export interface DataConfidenceMetrics {
  eventsWithSeverity: number;
  eventsWithHazardCategory: number;
  eventsWithAssetLinkage: number;
  eventsWithCapaLinkage: number;
  totalEvents: number;
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const SEVERITY_COLORS: Record<Severity, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
};

export const CLASSIFICATION_LABELS: Record<EventClassification, string> = {
  incident: 'Incident',
  near_miss: 'Near Miss',
  hazard: 'Hazard',
  observation: 'Observation',
  unsafe_condition: 'Unsafe Condition',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  open: 'Open',
  in_review: 'In Review',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<EventStatus, { bg: string; text: string }> = {
  open: { bg: 'bg-blue-100', text: 'text-blue-800' },
  in_review: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  closed: { bg: 'bg-green-100', text: 'text-green-800' },
};

export const CAPA_STATUS_LABELS: Record<CapaStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  closed: 'Closed',
};

export const CAPA_TYPE_LABELS: Record<CapaType, string> = {
  corrective: 'Corrective',
  preventive: 'Preventive',
};

export const HAZARD_CATEGORY_LABELS: Record<HazardCategory, string> = {
  slip_trip_fall: 'Slip, Trip, Fall',
  struck_by: 'Struck By',
  caught_in: 'Caught In/Between',
  electrical: 'Electrical',
  chemical: 'Chemical Exposure',
  ergonomic: 'Ergonomic',
  fire: 'Fire/Explosion',
  machine_guarding: 'Machine Guarding',
  ppe: 'PPE',
  housekeeping: 'Housekeeping',
  environmental: 'Environmental',
  other: 'Other',
};

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ============================================================================
// LEADING vs LAGGING INDICATORS
// ============================================================================

export const LEADING_CLASSIFICATIONS: EventClassification[] = [
  'near_miss',
  'hazard',
  'observation',
  'unsafe_condition',
];

export const LAGGING_CLASSIFICATIONS: EventClassification[] = [
  'incident',
];

export function isLeadingIndicator(classification: EventClassification): boolean {
  return LEADING_CLASSIFICATIONS.includes(classification);
}

export function isLaggingIndicator(classification: EventClassification): boolean {
  return LAGGING_CLASSIFICATIONS.includes(classification);
}
