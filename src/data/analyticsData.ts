// Mock Analytics Data for UpKeep EHS Proactive Safety Reporting
// This data is designed to demonstrate realistic scenarios and relationships

import {
  AnalyticsSafetyEvent,
  CAPA,
  OSHA300Entry,
  OSHA300ASummary,
  OSHAQuarterlySummary,
  OSHALocation,
  SafetyWorkOrder,
  Asset,
  EventClassification,
  Severity,
  EventStatus,
  CapaType,
  CapaStatus,
  WorkOrderStatus,
  HazardCategory,
} from '../types/analytics';

// ============================================================================
// SITES & LOCATIONS
// ============================================================================

export const SITES = [
  { id: 'site_001', name: 'Chicago Manufacturing Plant' },
  { id: 'site_002', name: 'Dallas Distribution Center' },
  { id: 'site_003', name: 'Phoenix Assembly Facility' },
  { id: 'site_004', name: 'Atlanta Warehouse' },
  { id: 'site_005', name: 'Denver Operations Center' },
];

export const LOCATIONS = [
  { id: 'loc_001', name: 'Production Floor A', siteId: 'site_001' },
  { id: 'loc_002', name: 'Production Floor B', siteId: 'site_001' },
  { id: 'loc_003', name: 'Warehouse', siteId: 'site_001' },
  { id: 'loc_004', name: 'Loading Dock', siteId: 'site_002' },
  { id: 'loc_005', name: 'Storage Area', siteId: 'site_002' },
  { id: 'loc_006', name: 'Assembly Line 1', siteId: 'site_003' },
  { id: 'loc_007', name: 'Assembly Line 2', siteId: 'site_003' },
  { id: 'loc_008', name: 'Shipping Area', siteId: 'site_004' },
  { id: 'loc_009', name: 'Receiving Dock', siteId: 'site_004' },
  { id: 'loc_010', name: 'Main Operations', siteId: 'site_005' },
];

// ============================================================================
// USERS (Reporters, Owners, Assignees)
// ============================================================================

export const USERS = [
  { id: 'user_001', name: 'Maria Garcia' },
  { id: 'user_002', name: 'James Wilson' },
  { id: 'user_003', name: 'Sarah Chen' },
  { id: 'user_004', name: 'Michael Johnson' },
  { id: 'user_005', name: 'Emily Davis' },
  { id: 'user_006', name: 'Robert Martinez' },
  { id: 'user_007', name: 'Jennifer Lee' },
  { id: 'user_008', name: 'David Brown' },
  { id: 'user_009', name: 'Lisa Anderson' },
  { id: 'user_010', name: 'Chris Taylor' },
];

// ============================================================================
// ASSETS
// ============================================================================

export const ASSETS: Asset[] = [
  { id: 'asset_001', name: 'Forklift #12', assetTag: 'FL-012', category: 'Material Handling', siteId: 'site_001', siteName: 'Chicago Manufacturing Plant', locationId: 'loc_003', locationName: 'Warehouse', status: 'operational' },
  { id: 'asset_002', name: 'CNC Machine A1', assetTag: 'CNC-A1', category: 'Manufacturing', siteId: 'site_001', siteName: 'Chicago Manufacturing Plant', locationId: 'loc_001', locationName: 'Production Floor A', status: 'operational' },
  { id: 'asset_003', name: 'Conveyor Belt System', assetTag: 'CB-001', category: 'Material Handling', siteId: 'site_002', siteName: 'Dallas Distribution Center', locationId: 'loc_004', locationName: 'Loading Dock', status: 'operational' },
  { id: 'asset_004', name: 'Hydraulic Press #3', assetTag: 'HP-003', category: 'Manufacturing', siteId: 'site_001', siteName: 'Chicago Manufacturing Plant', locationId: 'loc_002', locationName: 'Production Floor B', status: 'under_maintenance' },
  { id: 'asset_005', name: 'Assembly Robot R2', assetTag: 'AR-R2', category: 'Automation', siteId: 'site_003', siteName: 'Phoenix Assembly Facility', locationId: 'loc_006', locationName: 'Assembly Line 1', status: 'operational' },
  { id: 'asset_006', name: 'Pallet Jack #7', assetTag: 'PJ-007', category: 'Material Handling', siteId: 'site_004', siteName: 'Atlanta Warehouse', locationId: 'loc_008', locationName: 'Shipping Area', status: 'operational' },
  { id: 'asset_007', name: 'Industrial Mixer', assetTag: 'IM-001', category: 'Manufacturing', siteId: 'site_003', siteName: 'Phoenix Assembly Facility', locationId: 'loc_007', locationName: 'Assembly Line 2', status: 'operational' },
  { id: 'asset_008', name: 'Forklift #15', assetTag: 'FL-015', category: 'Material Handling', siteId: 'site_002', siteName: 'Dallas Distribution Center', locationId: 'loc_005', locationName: 'Storage Area', status: 'operational' },
  { id: 'asset_009', name: 'Welding Station B', assetTag: 'WS-B', category: 'Manufacturing', siteId: 'site_001', siteName: 'Chicago Manufacturing Plant', locationId: 'loc_001', locationName: 'Production Floor A', status: 'operational' },
  { id: 'asset_010', name: 'Packaging Machine', assetTag: 'PM-001', category: 'Packaging', siteId: 'site_004', siteName: 'Atlanta Warehouse', locationId: 'loc_008', locationName: 'Shipping Area', status: 'out_of_service' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEventId(index: number): string {
  return `SE-${String(index).padStart(5, '0')}`;
}

// Date ranges for mock data
const now = new Date();
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// ============================================================================
// SAFETY EVENTS (55 events with realistic distribution)
// ============================================================================

const eventTemplates: Array<Partial<AnalyticsSafetyEvent>> = [
  // Incidents (lagging) - 15 events
  { classification: 'incident', title: 'Forklift collision with racking', hazardCategory: 'struck_by', severity: 'high' },
  { classification: 'incident', title: 'Employee slip on wet floor', hazardCategory: 'slip_trip_fall', severity: 'medium' },
  { classification: 'incident', title: 'Hand injury from machine', hazardCategory: 'caught_in', severity: 'high' },
  { classification: 'incident', title: 'Chemical splash to arm', hazardCategory: 'chemical', severity: 'medium' },
  { classification: 'incident', title: 'Back strain from lifting', hazardCategory: 'ergonomic', severity: 'medium' },
  { classification: 'incident', title: 'Cut from sharp metal edge', hazardCategory: 'machine_guarding', severity: 'low' },
  { classification: 'incident', title: 'Trip over power cord', hazardCategory: 'slip_trip_fall', severity: 'low' },
  { classification: 'incident', title: 'Electric shock from faulty equipment', hazardCategory: 'electrical', severity: 'critical' },
  { classification: 'incident', title: 'Eye irritation from dust', hazardCategory: 'ppe', severity: 'low' },
  { classification: 'incident', title: 'Struck by falling object', hazardCategory: 'struck_by', severity: 'high' },
  { classification: 'incident', title: 'Burn from hot surface', hazardCategory: 'fire', severity: 'medium' },
  { classification: 'incident', title: 'Repetitive strain injury', hazardCategory: 'ergonomic', severity: 'medium' },
  { classification: 'incident', title: 'Finger caught in conveyor', hazardCategory: 'caught_in', severity: 'high' },
  { classification: 'incident', title: 'Slip on oil spill', hazardCategory: 'slip_trip_fall', severity: 'medium' },
  { classification: 'incident', title: 'Inhalation of fumes', hazardCategory: 'chemical', severity: 'medium' },
  
  // Near Misses (leading) - 20 events
  { classification: 'near_miss', title: 'Near collision between forklifts', hazardCategory: 'struck_by', severity: 'high' },
  { classification: 'near_miss', title: 'Object nearly fell from shelf', hazardCategory: 'struck_by', severity: 'medium' },
  { classification: 'near_miss', title: 'Slip without injury', hazardCategory: 'slip_trip_fall', severity: 'low' },
  { classification: 'near_miss', title: 'Machine started unexpectedly', hazardCategory: 'machine_guarding', severity: 'critical' },
  { classification: 'near_miss', title: 'Chemical container nearly tipped', hazardCategory: 'chemical', severity: 'high' },
  { classification: 'near_miss', title: 'Electrical spark from outlet', hazardCategory: 'electrical', severity: 'medium' },
  { classification: 'near_miss', title: 'Heavy load almost dropped', hazardCategory: 'ergonomic', severity: 'medium' },
  { classification: 'near_miss', title: 'Fire alarm triggered by equipment', hazardCategory: 'fire', severity: 'high' },
  { classification: 'near_miss', title: 'PPE failure during operation', hazardCategory: 'ppe', severity: 'medium' },
  { classification: 'near_miss', title: 'Forklift brake failure', hazardCategory: 'struck_by', severity: 'critical' },
  { classification: 'near_miss', title: 'Crane cable fraying noticed', hazardCategory: 'caught_in', severity: 'high' },
  { classification: 'near_miss', title: 'Gas leak detected early', hazardCategory: 'chemical', severity: 'high' },
  { classification: 'near_miss', title: 'Scaffolding instability found', hazardCategory: 'slip_trip_fall', severity: 'high' },
  { classification: 'near_miss', title: 'Emergency stop activated in time', hazardCategory: 'machine_guarding', severity: 'medium' },
  { classification: 'near_miss', title: 'Falling debris narrowly avoided', hazardCategory: 'struck_by', severity: 'medium' },
  { classification: 'near_miss', title: 'Wet floor almost caused fall', hazardCategory: 'slip_trip_fall', severity: 'low' },
  { classification: 'near_miss', title: 'Tool left in walking path', hazardCategory: 'housekeeping', severity: 'low' },
  { classification: 'near_miss', title: 'Unsecured ladder noticed', hazardCategory: 'slip_trip_fall', severity: 'medium' },
  { classification: 'near_miss', title: 'Missing guard discovered', hazardCategory: 'machine_guarding', severity: 'high' },
  { classification: 'near_miss', title: 'Overloaded pallet spotted', hazardCategory: 'ergonomic', severity: 'medium' },
  
  // Hazards (leading) - 10 events
  { classification: 'hazard', title: 'Exposed wiring in break room', hazardCategory: 'electrical', severity: 'high' },
  { classification: 'hazard', title: 'Damaged floor tiles creating trip hazard', hazardCategory: 'slip_trip_fall', severity: 'medium' },
  { classification: 'hazard', title: 'Inadequate ventilation in paint area', hazardCategory: 'chemical', severity: 'high' },
  { classification: 'hazard', title: 'Missing machine guard on press', hazardCategory: 'machine_guarding', severity: 'critical' },
  { classification: 'hazard', title: 'Blocked emergency exit', hazardCategory: 'fire', severity: 'critical' },
  { classification: 'hazard', title: 'Worn forklift tires', hazardCategory: 'struck_by', severity: 'medium' },
  { classification: 'hazard', title: 'Leaking hydraulic fluid', hazardCategory: 'slip_trip_fall', severity: 'medium' },
  { classification: 'hazard', title: 'Improper chemical storage', hazardCategory: 'chemical', severity: 'high' },
  { classification: 'hazard', title: 'Defective safety harness', hazardCategory: 'ppe', severity: 'high' },
  { classification: 'hazard', title: 'Excessive noise levels', hazardCategory: 'environmental', severity: 'medium' },
  
  // Observations (leading) - 10 events
  { classification: 'observation', title: 'Worker not wearing safety glasses', hazardCategory: 'ppe', severity: 'medium' },
  { classification: 'observation', title: 'Housekeeping needs improvement', hazardCategory: 'housekeeping', severity: 'low' },
  { classification: 'observation', title: 'Improper lifting technique observed', hazardCategory: 'ergonomic', severity: 'medium' },
  { classification: 'observation', title: 'Emergency equipment inspection overdue', hazardCategory: 'fire', severity: 'medium' },
  { classification: 'observation', title: 'Safety signage missing', hazardCategory: 'other', severity: 'low' },
  { classification: 'observation', title: 'Workers bypassing safety procedure', hazardCategory: 'machine_guarding', severity: 'high' },
  { classification: 'observation', title: 'Inadequate lighting in storage', hazardCategory: 'housekeeping', severity: 'low' },
  { classification: 'observation', title: 'First aid kit needs restocking', hazardCategory: 'other', severity: 'low' },
  { classification: 'observation', title: 'Forklift operator without certification', hazardCategory: 'struck_by', severity: 'high' },
  { classification: 'observation', title: 'Hearing protection not worn', hazardCategory: 'ppe', severity: 'medium' },
];

// Generate 55 safety events
export const SAFETY_EVENTS: AnalyticsSafetyEvent[] = eventTemplates.map((template, index) => {
  const site = getRandomItem(SITES);
  const siteLocations = LOCATIONS.filter(l => l.siteId === site.id);
  const location = siteLocations.length > 0 ? getRandomItem(siteLocations) : null;
  const reporter = getRandomItem(USERS);
  const assignee = Math.random() > 0.3 ? getRandomItem(USERS) : null;
  
  // Determine status based on date
  const eventDate = randomDate(threeMonthsAgo, today);
  const eventDateObj = new Date(eventDate);
  const daysSinceEvent = Math.floor((now.getTime() - eventDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: EventStatus;
  if (daysSinceEvent < 3) {
    status = 'open';
  } else if (daysSinceEvent < 14) {
    status = Math.random() > 0.4 ? 'in_review' : 'open';
  } else {
    status = Math.random() > 0.2 ? 'closed' : 'in_review';
  }
  
  // Assign asset to some events (60%)
  const asset = Math.random() > 0.4 ? getRandomItem(ASSETS) : null;
  
  // OSHA recordable for incidents with high/critical severity (30% of those)
  const oshaRecordable = template.classification === 'incident' && 
    (template.severity === 'high' || template.severity === 'critical') && 
    Math.random() > 0.7;

  return {
    id: generateEventId(index + 1),
    title: template.title!,
    description: `${template.title} reported at ${site.name}${location ? `, ${location.name}` : ''}. Immediate action was taken to address the situation.`,
    classification: template.classification!,
    severity: template.severity!,
    status,
    eventDate,
    siteId: site.id,
    siteName: site.name,
    locationId: location?.id,
    locationName: location?.name,
    hazardCategory: template.hazardCategory,
    reporterId: reporter.id,
    reporterName: reporter.name,
    assigneeId: assignee?.id,
    assigneeName: assignee?.name,
    assetId: asset?.id,
    assetName: asset?.name,
    oshaRecordable,
    oshaReportable: oshaRecordable,
    daysAway: oshaRecordable ? Math.floor(Math.random() * 5) : undefined,
    restrictedDays: oshaRecordable ? Math.floor(Math.random() * 10) : undefined,
    linkedCapaIds: [],
    linkedWorkOrderIds: [],
    createdAt: eventDate,
    updatedAt: status === 'closed' ? randomDate(new Date(eventDate), now) : eventDate,
    closedAt: status === 'closed' ? randomDate(new Date(eventDate), now) : undefined,
  };
});

// Add some recent events (today and this week)
const recentEventTemplates = [
  { classification: 'near_miss' as EventClassification, title: 'Forklift near-miss in warehouse', hazardCategory: 'struck_by' as HazardCategory, severity: 'high' as Severity },
  { classification: 'observation' as EventClassification, title: 'PPE compliance check - issues found', hazardCategory: 'ppe' as HazardCategory, severity: 'medium' as Severity },
  { classification: 'hazard' as EventClassification, title: 'Spill in production area', hazardCategory: 'slip_trip_fall' as HazardCategory, severity: 'medium' as Severity },
  { classification: 'incident' as EventClassification, title: 'Minor cut from handling materials', hazardCategory: 'caught_in' as HazardCategory, severity: 'low' as Severity },
  { classification: 'near_miss' as EventClassification, title: 'Stack almost toppled', hazardCategory: 'struck_by' as HazardCategory, severity: 'medium' as Severity },
];

recentEventTemplates.forEach((template, index) => {
  const site = getRandomItem(SITES);
  const reporter = getRandomItem(USERS);
  const eventDate = index < 2 ? 
    new Date(today.getTime() - Math.random() * 12 * 60 * 60 * 1000).toISOString() : // Today
    randomDate(oneWeekAgo, today); // This week

  SAFETY_EVENTS.push({
    id: generateEventId(56 + index),
    title: template.title,
    description: `${template.title} at ${site.name}. Investigation ongoing.`,
    classification: template.classification,
    severity: template.severity,
    status: 'open',
    eventDate,
    siteId: site.id,
    siteName: site.name,
    hazardCategory: template.hazardCategory,
    reporterId: reporter.id,
    reporterName: reporter.name,
    oshaRecordable: false,
    linkedCapaIds: [],
    linkedWorkOrderIds: [],
    createdAt: eventDate,
    updatedAt: eventDate,
  });
});

// ============================================================================
// CAPAs (35 CAPAs linked to events)
// ============================================================================

const capaTemplates = [
  { title: 'Install additional safety guards on equipment', type: 'corrective' as CapaType },
  { title: 'Implement forklift traffic management system', type: 'corrective' as CapaType },
  { title: 'Update chemical handling procedures', type: 'corrective' as CapaType },
  { title: 'Repair floor surface and add anti-slip coating', type: 'corrective' as CapaType },
  { title: 'Replace worn safety equipment', type: 'corrective' as CapaType },
  { title: 'Conduct ergonomic assessment of workstations', type: 'preventive' as CapaType },
  { title: 'Enhance PPE training program', type: 'preventive' as CapaType },
  { title: 'Install additional emergency lighting', type: 'preventive' as CapaType },
  { title: 'Implement lockout/tagout refresher training', type: 'preventive' as CapaType },
  { title: 'Develop machine-specific safety procedures', type: 'preventive' as CapaType },
  { title: 'Upgrade ventilation system in chemical storage', type: 'corrective' as CapaType },
  { title: 'Install motion sensors for pedestrian warnings', type: 'preventive' as CapaType },
  { title: 'Conduct comprehensive safety audit', type: 'preventive' as CapaType },
  { title: 'Replace electrical panel with updated model', type: 'corrective' as CapaType },
  { title: 'Implement weekly safety inspections', type: 'preventive' as CapaType },
];

export const CAPAS: CAPA[] = [];

// Generate CAPAs linked to events
const eventsNeedingCapas = SAFETY_EVENTS.filter(e => 
  e.classification === 'incident' || 
  (e.classification !== 'observation' && (e.severity === 'high' || e.severity === 'critical'))
);

eventsNeedingCapas.slice(0, 35).forEach((event, index) => {
  const template = capaTemplates[index % capaTemplates.length];
  const owner = getRandomItem(USERS);
  const assignedBy = getRandomItem(USERS.filter(u => u.id !== owner.id));
  const createdDate = new Date(new Date(event.eventDate).getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
  const dueDate = new Date(createdDate.getTime() + (14 + Math.random() * 30) * 24 * 60 * 60 * 1000);
  
  // Determine status based on due date
  let status: CapaStatus;
  let closedDate: string | undefined;
  
  if (dueDate < now) {
    // Past due date
    if (Math.random() > 0.3) {
      status = 'closed';
      closedDate = new Date(dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      status = Math.random() > 0.5 ? 'in_progress' : 'pending_review'; // Overdue
    }
  } else {
    // Not yet due
    const randomStatus = Math.random();
    if (randomStatus > 0.7) status = 'open';
    else if (randomStatus > 0.3) status = 'in_progress';
    else status = 'pending_review';
  }

  const capa: CAPA = {
    id: `CAPA-${String(index + 1).padStart(4, '0')}`,
    title: template.title,
    description: `${template.title} in response to ${event.title}.`,
    type: template.type,
    status,
    ownerId: owner.id,
    ownerName: owner.name,
    assignedById: assignedBy.id,
    assignedByName: assignedBy.name,
    siteId: event.siteId,
    siteName: event.siteName,
    createdDate: createdDate.toISOString(),
    dueDate: dueDate.toISOString(),
    closedDate,
    linkedEventIds: [event.id],
    linkedWorkOrderIds: [],
    priority: event.severity,
    effectivenessVerified: status === 'closed' ? Math.random() > 0.3 : undefined,
    effectivenessVerifiedDate: status === 'closed' && Math.random() > 0.3 
      ? new Date(new Date(closedDate!).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() 
      : undefined,
  };

  CAPAS.push(capa);
  
  // Link CAPA back to event
  event.linkedCapaIds.push(capa.id);
});

// ============================================================================
// OSHA DATA
// ============================================================================

// Fixed OSHA location data with realistic employee counts
export const OSHA_LOCATIONS: OSHALocation[] = [
  { id: 'osha_site_001', name: 'Chicago Manufacturing Plant', naicsCode: '332999', sic: '3599', averageEmployees: 285 },
  { id: 'osha_site_002', name: 'Dallas Distribution Center', naicsCode: '493110', sic: '4225', averageEmployees: 165 },
  { id: 'osha_site_003', name: 'Phoenix Assembly Facility', naicsCode: '332999', sic: '3599', averageEmployees: 210 },
  { id: 'osha_site_004', name: 'Atlanta Warehouse', naicsCode: '493110', sic: '4225', averageEmployees: 125 },
  { id: 'osha_site_005', name: 'Denver Operations Center', naicsCode: '332999', sic: '3599', averageEmployees: 95 },
];

const currentYear = now.getFullYear();

// Realistic quarterly OSHA summaries with actual incident data
export const OSHA_QUARTERLY_SUMMARIES: OSHAQuarterlySummary[] = [
  // Chicago - largest facility, moderate incident rate
  { oshaLocationId: 'osha_site_001', year: currentYear - 1, quarter: 1, recordableCount: 3, dartCount: 2, hoursWorked: 142500, daysAway: 8, daysRestricted: 12, trir: 4.21, dart: 2.81 },
  { oshaLocationId: 'osha_site_001', year: currentYear - 1, quarter: 2, recordableCount: 2, dartCount: 1, hoursWorked: 148200, daysAway: 5, daysRestricted: 7, trir: 2.70, dart: 1.35 },
  { oshaLocationId: 'osha_site_001', year: currentYear - 1, quarter: 3, recordableCount: 4, dartCount: 2, hoursWorked: 145000, daysAway: 10, daysRestricted: 15, trir: 5.52, dart: 2.76 },
  { oshaLocationId: 'osha_site_001', year: currentYear - 1, quarter: 4, recordableCount: 2, dartCount: 1, hoursWorked: 140800, daysAway: 3, daysRestricted: 8, trir: 2.84, dart: 1.42 },
  { oshaLocationId: 'osha_site_001', year: currentYear, quarter: 1, recordableCount: 3, dartCount: 2, hoursWorked: 147000, daysAway: 7, daysRestricted: 14, trir: 4.08, dart: 2.72 },
  
  // Dallas - distribution, lower incident rate
  { oshaLocationId: 'osha_site_002', year: currentYear - 1, quarter: 1, recordableCount: 1, dartCount: 1, hoursWorked: 82500, daysAway: 4, daysRestricted: 6, trir: 2.42, dart: 2.42 },
  { oshaLocationId: 'osha_site_002', year: currentYear - 1, quarter: 2, recordableCount: 2, dartCount: 1, hoursWorked: 85800, daysAway: 3, daysRestricted: 5, trir: 4.66, dart: 2.33 },
  { oshaLocationId: 'osha_site_002', year: currentYear - 1, quarter: 3, recordableCount: 1, dartCount: 0, hoursWorked: 84200, daysAway: 0, daysRestricted: 0, trir: 2.38, dart: 0 },
  { oshaLocationId: 'osha_site_002', year: currentYear - 1, quarter: 4, recordableCount: 2, dartCount: 1, hoursWorked: 83000, daysAway: 5, daysRestricted: 8, trir: 4.82, dart: 2.41 },
  { oshaLocationId: 'osha_site_002', year: currentYear, quarter: 1, recordableCount: 1, dartCount: 1, hoursWorked: 85500, daysAway: 2, daysRestricted: 4, trir: 2.34, dart: 2.34 },
  
  // Phoenix - assembly, moderate
  { oshaLocationId: 'osha_site_003', year: currentYear - 1, quarter: 1, recordableCount: 2, dartCount: 1, hoursWorked: 105000, daysAway: 4, daysRestricted: 6, trir: 3.81, dart: 1.90 },
  { oshaLocationId: 'osha_site_003', year: currentYear - 1, quarter: 2, recordableCount: 1, dartCount: 1, hoursWorked: 109200, daysAway: 3, daysRestricted: 5, trir: 1.83, dart: 1.83 },
  { oshaLocationId: 'osha_site_003', year: currentYear - 1, quarter: 3, recordableCount: 3, dartCount: 2, hoursWorked: 107500, daysAway: 8, daysRestricted: 12, trir: 5.58, dart: 3.72 },
  { oshaLocationId: 'osha_site_003', year: currentYear - 1, quarter: 4, recordableCount: 1, dartCount: 0, hoursWorked: 104000, daysAway: 0, daysRestricted: 0, trir: 1.92, dart: 0 },
  { oshaLocationId: 'osha_site_003', year: currentYear, quarter: 1, recordableCount: 2, dartCount: 1, hoursWorked: 108000, daysAway: 5, daysRestricted: 7, trir: 3.70, dart: 1.85 },
  
  // Atlanta - warehouse, good safety record
  { oshaLocationId: 'osha_site_004', year: currentYear - 1, quarter: 1, recordableCount: 1, dartCount: 0, hoursWorked: 62500, daysAway: 0, daysRestricted: 0, trir: 3.20, dart: 0 },
  { oshaLocationId: 'osha_site_004', year: currentYear - 1, quarter: 2, recordableCount: 1, dartCount: 1, hoursWorked: 65000, daysAway: 3, daysRestricted: 4, trir: 3.08, dart: 3.08 },
  { oshaLocationId: 'osha_site_004', year: currentYear - 1, quarter: 3, recordableCount: 0, dartCount: 0, hoursWorked: 64200, daysAway: 0, daysRestricted: 0, trir: 0, dart: 0 },
  { oshaLocationId: 'osha_site_004', year: currentYear - 1, quarter: 4, recordableCount: 1, dartCount: 1, hoursWorked: 63000, daysAway: 2, daysRestricted: 5, trir: 3.17, dart: 3.17 },
  { oshaLocationId: 'osha_site_004', year: currentYear, quarter: 1, recordableCount: 1, dartCount: 0, hoursWorked: 64500, daysAway: 0, daysRestricted: 0, trir: 3.10, dart: 0 },
  
  // Denver - smallest, low incident rate
  { oshaLocationId: 'osha_site_005', year: currentYear - 1, quarter: 1, recordableCount: 1, dartCount: 0, hoursWorked: 47500, daysAway: 0, daysRestricted: 0, trir: 4.21, dart: 0 },
  { oshaLocationId: 'osha_site_005', year: currentYear - 1, quarter: 2, recordableCount: 0, dartCount: 0, hoursWorked: 49400, daysAway: 0, daysRestricted: 0, trir: 0, dart: 0 },
  { oshaLocationId: 'osha_site_005', year: currentYear - 1, quarter: 3, recordableCount: 1, dartCount: 1, hoursWorked: 48200, daysAway: 5, daysRestricted: 7, trir: 4.15, dart: 4.15 },
  { oshaLocationId: 'osha_site_005', year: currentYear - 1, quarter: 4, recordableCount: 0, dartCount: 0, hoursWorked: 47000, daysAway: 0, daysRestricted: 0, trir: 0, dart: 0 },
  { oshaLocationId: 'osha_site_005', year: currentYear, quarter: 1, recordableCount: 1, dartCount: 0, hoursWorked: 49000, daysAway: 0, daysRestricted: 0, trir: 4.08, dart: 0 },
];

// Annual 300A summaries - aggregated from quarterly data
export const OSHA_300A_SUMMARIES: OSHA300ASummary[] = OSHA_LOCATIONS.map((location, idx) => {
  // Get all quarterly data for this location (current year + prior year for YTD context)
  const allQuarterData = OSHA_QUARTERLY_SUMMARIES.filter(
    q => q.oshaLocationId === location.id
  );
  
  // Current year data
  const currentYearData = allQuarterData.filter(q => q.year === currentYear);
  
  // Calculate totals from current year quarterly data
  const totals = currentYearData.reduce((acc, q) => ({
    recordables: acc.recordables + q.recordableCount,
    dart: acc.dart + q.dartCount,
    hours: acc.hours + q.hoursWorked,
    daysAway: acc.daysAway + q.daysAway,
    daysRestricted: acc.daysRestricted + q.daysRestricted,
  }), { recordables: 0, dart: 0, hours: 0, daysAway: 0, daysRestricted: 0 });

  // If no current year data, use prior year
  const priorYearData = allQuarterData.filter(q => q.year === currentYear - 1);
  const priorTotals = priorYearData.reduce((acc, q) => ({
    recordables: acc.recordables + q.recordableCount,
    dart: acc.dart + q.dartCount,
    hours: acc.hours + q.hoursWorked,
    daysAway: acc.daysAway + q.daysAway,
    daysRestricted: acc.daysRestricted + q.daysRestricted,
  }), { recordables: 0, dart: 0, hours: 0, daysAway: 0, daysRestricted: 0 });

  // Use combined data for display
  const displayTotals = totals.hours > 0 ? totals : priorTotals;

  return {
    id: `300a_${location.id}_${currentYear}`,
    oshaLocationId: location.id,
    year: currentYear,
    establishmentName: location.name,
    streetAddress: `${1000 + idx * 100} Industrial Blvd`,
    city: ['Chicago', 'Dallas', 'Phoenix', 'Atlanta', 'Denver'][idx],
    state: ['IL', 'TX', 'AZ', 'GA', 'CO'][idx],
    zip: ['60601', '75201', '85001', '30301', '80201'][idx],
    industry: 'Manufacturing',
    naicsCode: location.naicsCode || '332999',
    annualAverageEmployees: location.averageEmployees,
    totalHoursWorked: displayTotals.hours,
    totalDeaths: 0,
    totalDaysAwayFromWork: Math.ceil(displayTotals.dart * 0.4),
    totalJobTransferOrRestriction: Math.ceil(displayTotals.dart * 0.6),
    totalOtherRecordableCases: Math.max(0, displayTotals.recordables - displayTotals.dart),
    totalDaysAway: displayTotals.daysAway,
    totalDaysRestricted: displayTotals.daysRestricted,
    totalInjuries: displayTotals.recordables,
    totalSkinDisorders: 0,
    totalRespiratoryConditions: 0,
    totalPoisonings: 0,
    totalHearingLoss: 0,
    totalOtherIllnesses: 0,
    trir: displayTotals.hours > 0 ? (displayTotals.recordables * 200000) / displayTotals.hours : 0,
    dart: displayTotals.hours > 0 ? (displayTotals.dart * 200000) / displayTotals.hours : 0,
    ltir: displayTotals.hours > 0 ? (Math.ceil(displayTotals.dart * 0.4) * 200000) / displayTotals.hours : 0,
    certifiedBy: 'Safety Director',
    certifiedTitle: 'EHS Manager',
    certifiedDate: new Date(currentYear, 1, 15).toISOString(),
    certifiedPhone: '555-123-4567',
  };
});

// OSHA 300 entries from recordable events
export const OSHA_300_ENTRIES: OSHA300Entry[] = SAFETY_EVENTS
  .filter(e => e.oshaRecordable)
  .map((event, index) => {
    const eventDate = new Date(event.eventDate);
    const quarter = (Math.floor(eventDate.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
    const oshaLocationId = `osha_${event.siteId}`;
    
    return {
      id: `osha300_${index + 1}`,
      oshaLocationId: oshaLocationId,
      caseNumber: `${eventDate.getFullYear()}-${String(index + 1).padStart(3, '0')}`,
      employeeName: event.reporterName,
      jobTitle: 'Production Worker',
      dateOfInjury: event.eventDate,
      whereOccurred: event.locationName || event.siteName,
      description: event.description,
      death: false,
      daysAwayFromWork: (event.daysAway || 0) > 0,
      jobTransferOrRestriction: (event.restrictedDays || 0) > 0,
      otherRecordableCase: (event.daysAway || 0) === 0 && (event.restrictedDays || 0) === 0,
      daysAway: event.daysAway || 0,
      daysRestricted: event.restrictedDays || 0,
      injuryType: 'injury',
      linkedEventId: event.id,
      year: eventDate.getFullYear(),
      quarter,
    };
  });

// ============================================================================
// SAFETY WORK ORDERS (45 work orders)
// ============================================================================

const workOrderTemplates = [
  { title: 'Repair machine guard', type: 'corrective' as const },
  { title: 'Replace worn floor mats', type: 'corrective' as const },
  { title: 'Fix electrical outlet', type: 'corrective' as const },
  { title: 'Repair handrail', type: 'corrective' as const },
  { title: 'Replace emergency lighting', type: 'corrective' as const },
  { title: 'Monthly safety equipment inspection', type: 'inspection' as const },
  { title: 'Quarterly fire extinguisher check', type: 'inspection' as const },
  { title: 'Annual forklift certification', type: 'inspection' as const },
  { title: 'Weekly eye wash station test', type: 'inspection' as const },
  { title: 'Preventive maintenance - CNC machine', type: 'preventive' as const },
  { title: 'Preventive maintenance - Conveyor system', type: 'preventive' as const },
  { title: 'Preventive maintenance - HVAC system', type: 'preventive' as const },
  { title: 'Emergency repair - Hydraulic leak', type: 'emergency' as const },
  { title: 'Emergency repair - Gas leak', type: 'emergency' as const },
  { title: 'Replace safety signage', type: 'corrective' as const },
];

export const SAFETY_WORK_ORDERS: SafetyWorkOrder[] = [];

// Create work orders, some linked to events/CAPAs
for (let i = 0; i < 45; i++) {
  const template = workOrderTemplates[i % workOrderTemplates.length];
  const site = getRandomItem(SITES);
  const siteLocations = LOCATIONS.filter(l => l.siteId === site.id);
  const location = siteLocations.length > 0 ? getRandomItem(siteLocations) : null;
  const asset = Math.random() > 0.4 ? getRandomItem(ASSETS.filter(a => a.siteId === site.id)) : null;
  const assignee = Math.random() > 0.2 ? getRandomItem(USERS) : null;
  const createdBy = getRandomItem(USERS);
  
  const createdDate = randomDate(threeMonthsAgo, today);
  const createdDateObj = new Date(createdDate);
  const daysSinceCreated = Math.floor((now.getTime() - createdDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine status and dates
  let status: WorkOrderStatus;
  let completedDate: string | undefined;
  let dueDate: string | undefined;
  
  if (template.type === 'emergency') {
    dueDate = new Date(createdDateObj.getTime() + 24 * 60 * 60 * 1000).toISOString();
    status = Math.random() > 0.2 ? 'completed' : 'in_progress';
    if (status === 'completed') {
      completedDate = new Date(createdDateObj.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString();
    }
  } else if (template.type === 'inspection') {
    dueDate = new Date(createdDateObj.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    status = daysSinceCreated > 7 ? 'completed' : (Math.random() > 0.5 ? 'in_progress' : 'open');
    if (status === 'completed') {
      completedDate = new Date(createdDateObj.getTime() + (3 + Math.random() * 4) * 24 * 60 * 60 * 1000).toISOString();
    }
  } else {
    dueDate = new Date(createdDateObj.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString();
    if (daysSinceCreated < 3) {
      status = 'open';
    } else if (daysSinceCreated < 10) {
      status = Math.random() > 0.4 ? 'in_progress' : 'open';
    } else {
      const rand = Math.random();
      if (rand > 0.7) status = 'completed';
      else if (rand > 0.4) status = 'in_progress';
      else if (rand > 0.1) status = 'open';
      else status = 'cancelled';
    }
    if (status === 'completed') {
      completedDate = new Date(createdDateObj.getTime() + (5 + Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  // Link some work orders to events
  let linkedEventId: string | undefined;
  let linkedCapaId: string | undefined;
  
  if (i < 15 && template.type === 'corrective') {
    const event = SAFETY_EVENTS[i];
    linkedEventId = event?.id;
    if (linkedEventId && event) {
      event.linkedWorkOrderIds.push(`WO-${String(i + 1).padStart(5, '0')}`);
    }
  }
  
  // Link some to CAPAs
  if (i >= 15 && i < 25) {
    const capa = CAPAS[i - 15];
    linkedCapaId = capa?.id;
    if (linkedCapaId && capa) {
      capa.linkedWorkOrderIds.push(`WO-${String(i + 1).padStart(5, '0')}`);
    }
  }

  SAFETY_WORK_ORDERS.push({
    id: `WO-${String(i + 1).padStart(5, '0')}`,
    title: template.title,
    description: `${template.title} at ${location?.name || site.name}`,
    status,
    priority: template.type === 'emergency' ? 'critical' : (Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low')),
    assetId: asset?.id,
    assetName: asset?.name,
    siteId: site.id,
    siteName: site.name,
    locationId: location?.id,
    locationName: location?.name,
    assigneeId: assignee?.id,
    assigneeName: assignee?.name,
    createdById: createdBy.id,
    createdByName: createdBy.name,
    createdDate,
    dueDate,
    completedDate,
    linkedEventId,
    linkedCapaId,
    workOrderType: template.type,
  });
}

// ============================================================================
// COMPUTED ANALYTICS HELPERS
// ============================================================================

export function getEventsBySeverity(events: AnalyticsSafetyEvent[]): Record<Severity, number> {
  return events.reduce((acc, event) => {
    acc[event.severity] = (acc[event.severity] || 0) + 1;
    return acc;
  }, {} as Record<Severity, number>);
}

export function getEventsByClassification(events: AnalyticsSafetyEvent[]): Record<EventClassification, number> {
  return events.reduce((acc, event) => {
    acc[event.classification] = (acc[event.classification] || 0) + 1;
    return acc;
  }, {} as Record<EventClassification, number>);
}

export function getEventsBySite(events: AnalyticsSafetyEvent[]): Array<{ siteId: string; siteName: string; count: number }> {
  const siteMap = events.reduce((acc, event) => {
    if (!acc[event.siteId]) {
      acc[event.siteId] = { siteId: event.siteId, siteName: event.siteName, count: 0 };
    }
    acc[event.siteId].count++;
    return acc;
  }, {} as Record<string, { siteId: string; siteName: string; count: number }>);
  
  return Object.values(siteMap).sort((a, b) => b.count - a.count);
}

export function getCapasByOwner(capas: CAPA[]): Array<{ ownerId: string; ownerName: string; count: number; overdue: number }> {
  const ownerMap = capas.reduce((acc, capa) => {
    if (!acc[capa.ownerId]) {
      acc[capa.ownerId] = { ownerId: capa.ownerId, ownerName: capa.ownerName, count: 0, overdue: 0 };
    }
    acc[capa.ownerId].count++;
    if (capa.status !== 'closed' && new Date(capa.dueDate) < new Date()) {
      acc[capa.ownerId].overdue++;
    }
    return acc;
  }, {} as Record<string, { ownerId: string; ownerName: string; count: number; overdue: number }>);
  
  return Object.values(ownerMap).sort((a, b) => b.overdue - a.overdue);
}

export function getDataConfidenceMetrics(events: AnalyticsSafetyEvent[]) {
  const total = events.length;
  return {
    eventsWithSeverity: events.filter(e => e.severity).length,
    eventsWithHazardCategory: events.filter(e => e.hazardCategory).length,
    eventsWithAssetLinkage: events.filter(e => e.assetId).length,
    eventsWithCapaLinkage: events.filter(e => e.linkedCapaIds.length > 0).length,
    totalEvents: total,
  };
}

// ============================================================================
// DATE UTILITIES FOR ANALYTICS
// ============================================================================

export function getDateRange(timeRange: string): { startDate: Date; endDate: Date } {
  const end = new Date();
  let start: Date;
  
  switch (timeRange) {
    case 'today':
      start = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      break;
    case '7d':
      start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'ytd':
      start = new Date(end.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate: start, endDate: end };
}

export function filterEventsByDateRange(
  events: AnalyticsSafetyEvent[],
  startDate: Date,
  endDate: Date
): AnalyticsSafetyEvent[] {
  return events.filter(event => {
    const eventDate = new Date(event.eventDate);
    return eventDate >= startDate && eventDate <= endDate;
  });
}
