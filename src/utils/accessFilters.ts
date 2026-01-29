import type { LocationContextValue } from "../types/access";

/**
 * Maps location names from dummy data to location IDs
 */
export const LOCATION_NAME_TO_ID: Record<string, string> = {
  "Suite B": "loc-suite-b",
  "UpKeep HQ": "loc-upkeep-hq",
  "Joty's Manufacturing Plant": "loc-joty-mfg",
  "Willy Wonka's Chocolate Factory": "loc-wonka",
  "Utility Room": "loc-utility",
  "Office Area": "loc-office",
  "Loading Dock": "loc-loading-dock", // Access point location
  "No location": "", // Special case - records without a location
  "Demo": "loc-demo", // Demo location for the all-fields example
};

export const LOCATION_ID_TO_NAME: Record<string, string> = {
  "loc-suite-b": "Suite B",
  "loc-upkeep-hq": "UpKeep HQ",
  "loc-joty-mfg": "Joty's Manufacturing Plant",
  "loc-wonka": "Willy Wonka's Chocolate Factory",
  "loc-utility": "Utility Room",
  "loc-office": "Office Area",
  "loc-loading-dock": "Loading Dock",
  "loc-demo": "Demo",
};

/**
 * Get the location ID from a location name
 */
export function getLocationIdFromName(locationName: string): string {
  return LOCATION_NAME_TO_ID[locationName] || "";
}

/**
 * Get the location name from a location ID
 */
export function getLocationNameFromId(locationId: string): string {
  return LOCATION_ID_TO_NAME[locationId] || "Unknown";
}

interface FilterContext {
  isOrgAdmin: boolean;
  allowedLocationIds: string[];
  locationContext: LocationContextValue;
}

/**
 * Filter items based on location context and user permissions
 * 
 * @param items - Array of items to filter
 * @param getLocationId - Function to extract location ID from an item (should return the location ID, not the name)
 * @param context - The current access context
 * @returns Filtered array of items
 */
export function filterByLocationContext<T>(
  items: T[],
  getLocationId: (item: T) => string,
  context: FilterContext
): T[] {
  const { isOrgAdmin, allowedLocationIds, locationContext } = context;

  // Org Admin with ALL_LOCATIONS -> no filter
  if (isOrgAdmin && locationContext === "ALL_LOCATIONS") {
    return items;
  }

  // Org Admin with specific location -> filter to that location
  if (isOrgAdmin && locationContext.startsWith("LOCATION:")) {
    const targetLocationId = locationContext.replace("LOCATION:", "");
    return items.filter(item => {
      const itemLocationId = getLocationId(item);
      return itemLocationId === targetLocationId;
    });
  }

  // Non-admin: first filter to allowed locations only
  let filteredItems = items.filter(item => {
    const itemLocationId = getLocationId(item);
    // Empty location ID means "No location" - only visible to Org Admin
    if (!itemLocationId) {
      return false;
    }
    return allowedLocationIds.includes(itemLocationId);
  });

  // Then apply location context filter
  if (locationContext.startsWith("LOCATION:")) {
    const targetLocationId = locationContext.replace("LOCATION:", "");
    filteredItems = filteredItems.filter(item => {
      const itemLocationId = getLocationId(item);
      return itemLocationId === targetLocationId;
    });
  }
  // ALL_ASSIGNED just uses the already-filtered list

  return filteredItems;
}

/**
 * Check if a user can access a specific record based on its location
 */
export function canAccessRecord(
  recordLocationId: string,
  context: FilterContext
): boolean {
  const { isOrgAdmin, allowedLocationIds } = context;

  // Org Admin can access everything
  if (isOrgAdmin) {
    return true;
  }

  // "No location" records are only visible to Org Admin
  if (!recordLocationId) {
    return false;
  }

  // Check if location is in allowed list
  return allowedLocationIds.includes(recordLocationId);
}

/**
 * Get filtered location options for dropdowns based on user permissions
 */
export function getFilteredLocationOptions(
  allLocations: Array<{ id: string; name: string; status: string }>,
  context: FilterContext,
  includeAllOption: boolean = true
): Array<{ value: string; label: string; disabled?: boolean }> {
  const { isOrgAdmin, allowedLocationIds } = context;

  const options: Array<{ value: string; label: string; disabled?: boolean }> = [];

  if (includeAllOption) {
    options.push({ value: "All", label: "All" });
  }

  const activeLocations = allLocations.filter(l => l.status === "active");

  if (isOrgAdmin) {
    // Org Admin can see all locations
    activeLocations.forEach(loc => {
      options.push({ value: loc.name, label: loc.name });
    });
  } else {
    // Non-admin can only see allowed locations
    activeLocations.forEach(loc => {
      if (allowedLocationIds.includes(loc.id)) {
        options.push({ value: loc.name, label: loc.name });
      }
    });
  }

  return options;
}

/**
 * Determine if the location filter should be disabled/locked
 */
export function isLocationFilterLocked(context: FilterContext): boolean {
  const { isOrgAdmin, allowedLocationIds } = context;
  
  // Single-location users have a locked filter
  return !isOrgAdmin && allowedLocationIds.length === 1;
}

/**
 * Get the appropriate empty state message
 */
export function getEmptyStateMessage(
  context: FilterContext,
  locationContext: LocationContextValue,
  locations: Array<{ id: string; name: string }>
): { title: string; message: string } {
  const { isOrgAdmin, allowedLocationIds } = context;

  // No location access
  if (!isOrgAdmin && allowedLocationIds.length === 0) {
    return {
      title: "No location access",
      message: "You don't have access to any locations. Contact an Org Admin to request access.",
    };
  }

  // Viewing a specific location with no records
  if (locationContext.startsWith("LOCATION:")) {
    const locId = locationContext.replace("LOCATION:", "");
    const loc = locations.find(l => l.id === locId);
    return {
      title: "No records found",
      message: `No safety events in ${loc?.name || "this location"} yet.`,
    };
  }

  // Viewing all locations with no records
  return {
    title: "No records found",
    message: "No safety events match your current filters.",
  };
}



