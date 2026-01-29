"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Sidebar from "../../src/components/Sidebar";
import LocationSwitcher from "../../src/components/LocationSwitcher";
import { useAccess } from "../../src/contexts/AccessContext";
import UploadSDSModal, { type SDSDocument } from "../../src/components/sds/UploadSDSModal";
import { GHSPictogramList } from "../../src/components/sds/GHSPictograms";
import SDSQuickViewDrawer from "../../src/components/sds/SDSQuickViewDrawer";
import FullSDSModal from "../../src/components/sds/FullSDSModal";
import LabelGeneratorModal from "../../src/components/sds/LabelGeneratorModal";
import BinderBuilderModal from "../../src/components/sds/BinderBuilderModal";
import LocationTree from "../../src/components/sds/LocationTree";
import SDSAIAssistant from "../../src/components/sds/SDSAIAssistant";
import { type GHSPictogramType } from "../../src/components/sds/GHSPictograms";

// Sample SDS data representing various materials commonly found in industrial settings
const SAMPLE_SDS_DATA: SDSDocument[] = [
  {
    id: "sds-001",
    product: "Industrial Grade Acetone",
    manufacturer: "Global Chem Supply",
    casNumber: "67-64-1",
    revisionDate: "2024-11-15",
    productCode: "GCS-ACE-01",
    signalWord: "Danger",
    pictograms: ["Flame", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Highly flammable liquid and vapor.",
      "Causes serious eye irritation.",
      "May cause drowsiness or dizziness."
    ],
    ppe: ["Safety glasses with side-shields", "Butyl rubber gloves", "Nitrile rubber gloves", "Protective clothing"],
    firstAid: {
      eyes: "IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses if present.",
      skin: "IF ON SKIN: Take off immediately all contaminated clothing. Rinse skin with water.",
      inhalation: "IF INHALED: Remove person to fresh air and keep comfortable for breathing."
    },
    storageHandling: {
      storage: ["Keep away from heat, sparks, open flames", "Store in well-ventilated place", "Keep container tightly closed", "Store locked up"],
      handling: ["Use only outdoors or in well-ventilated area", "Avoid breathing vapors", "Wash hands thoroughly after handling", "Do not eat, drink or smoke when using"]
    },
    flashPoint: "-20°C (-4°F)",
    phValue: "7.0",
    appearance: "Colorless liquid",
    locationPath: ["North Facility", "Production Wing", "Assembly Line", "Robot Arm 1", "Base Unit", "Servo Motor"],
    uploadedAt: "2024-12-01T10:30:00Z"
  },
  {
    id: "sds-002",
    product: "Sulfuric Acid 98%",
    manufacturer: "ChemCore Industries",
    casNumber: "7664-93-9",
    revisionDate: "2024-10-20",
    productCode: "CCI-SA-98",
    signalWord: "Danger",
    pictograms: ["Corrosion", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Causes severe skin burns and eye damage.",
      "May be corrosive to metals.",
      "Harmful if inhaled."
    ],
    ppe: ["Full face shield", "Acid-resistant gloves", "Chemical-resistant apron", "Rubber boots"],
    firstAid: {
      eyes: "Immediately flush with plenty of water for at least 20 minutes. Seek medical attention immediately.",
      skin: "Remove contaminated clothing. Flush skin with water for at least 20 minutes.",
      inhalation: "Move to fresh air. If breathing is difficult, give oxygen. Seek medical attention."
    },
    storageHandling: {
      storage: ["Store in corrosion-resistant container", "Keep away from incompatible materials", "Store in cool, dry area", "Keep container closed when not in use"],
      handling: ["Do not add water to acid", "Use only with adequate ventilation", "Avoid contact with skin, eyes, clothing", "Use appropriate PPE at all times"]
    },
    flashPoint: "N/A (Non-flammable)",
    phValue: "<1",
    appearance: "Colorless to yellowish oily liquid",
    locationPath: ["Main Campus", "Chemical Storage", "Acid Cabinet", "Shelf A", "Section 1", "Container A-3"],
    uploadedAt: "2024-11-15T09:00:00Z"
  },
  {
    id: "sds-003",
    product: "Isopropyl Alcohol 99%",
    manufacturer: "PureChem Labs",
    casNumber: "67-63-0",
    revisionDate: "2024-09-05",
    productCode: "PCL-IPA-99",
    signalWord: "Danger",
    pictograms: ["Flame", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Highly flammable liquid and vapor.",
      "Causes serious eye irritation.",
      "May cause drowsiness or dizziness."
    ],
    ppe: ["Safety goggles", "Nitrile gloves", "Lab coat", "Closed-toe shoes"],
    firstAid: {
      eyes: "Rinse cautiously with water for several minutes. Consult physician if irritation persists.",
      skin: "Wash with soap and water. Remove contaminated clothing.",
      inhalation: "Move to fresh air. Rest in position comfortable for breathing."
    },
    storageHandling: {
      storage: ["Keep away from heat and ignition sources", "Store in flammable liquid storage cabinet", "Ground containers when transferring", "Keep away from oxidizers"],
      handling: ["Use explosion-proof equipment", "No smoking in handling area", "Keep container closed when not in use", "Bond and ground containers during transfer"]
    },
    flashPoint: "12°C (53°F)",
    phValue: "7.0",
    appearance: "Clear, colorless liquid with mild odor",
    locationPath: ["Distribution Center", "Warehouse A", "Flammables Section", "Rack 3", "Level 2", "Bin F-12"],
    uploadedAt: "2024-11-20T14:15:00Z"
  },
  {
    id: "sds-004",
    product: "Sodium Hydroxide Pellets",
    manufacturer: "BaseChem Corp",
    casNumber: "1310-73-2",
    revisionDate: "2024-08-12",
    productCode: "BCC-NaOH-P",
    signalWord: "Danger",
    pictograms: ["Corrosion"] as GHSPictogramType[],
    hazardStatements: [
      "Causes severe skin burns and eye damage.",
      "May be corrosive to metals."
    ],
    ppe: ["Chemical splash goggles", "Neoprene gloves", "Face shield", "Chemical-resistant clothing"],
    firstAid: {
      eyes: "Immediately flush with water for at least 30 minutes. Hold eyelids open. Get immediate medical attention.",
      skin: "Immediately flush with water while removing contaminated clothing. Get medical attention.",
      inhalation: "Remove to fresh air. If not breathing, give artificial respiration."
    },
    storageHandling: {
      storage: ["Store in dry area away from acids", "Keep container tightly closed", "Store away from aluminum, zinc, tin", "Protect from moisture"],
      handling: ["Avoid contact with skin and eyes", "Do not mix with acids", "Add slowly to water when diluting", "Use only non-sparking tools"]
    },
    flashPoint: "N/A (Non-flammable)",
    phValue: "14 (in solution)",
    appearance: "White pellets or flakes",
    locationPath: ["North Facility", "Admin Wing", "Janitorial", "Cabinet B", "Shelf 2", "Container J-7"],
    uploadedAt: "2024-10-05T11:30:00Z"
  },
  {
    id: "sds-005",
    product: "Hydraulic Oil ISO 46",
    manufacturer: "LubriTech Systems",
    casNumber: "64742-65-0",
    revisionDate: "2024-07-22",
    productCode: "LTS-HYD-46",
    signalWord: "Warning",
    pictograms: ["Exclamation Mark", "Environment"] as GHSPictogramType[],
    hazardStatements: [
      "May cause skin irritation with prolonged exposure.",
      "Toxic to aquatic life with long lasting effects."
    ],
    ppe: ["Safety glasses", "Oil-resistant gloves", "Protective clothing", "Respirator for mist"],
    firstAid: {
      eyes: "Flush eyes with water for 15 minutes. Seek medical attention if irritation persists.",
      skin: "Wash thoroughly with soap and water. Remove contaminated clothing.",
      inhalation: "Move to fresh air if mist is inhaled."
    },
    storageHandling: {
      storage: ["Store in cool, dry place away from heat", "Keep container closed when not in use", "Prevent release to environment", "Store away from strong oxidizers"],
      handling: ["Avoid prolonged skin contact", "Use proper spill containment", "Do not discharge to drains", "Clean up spills immediately"]
    },
    flashPoint: "220°C (428°F)",
    phValue: "N/A",
    appearance: "Amber colored liquid",
    locationPath: ["Main Campus", "Maintenance Shop", "Fluid Storage", "Oil Rack", "Row C", "Drum Station 4"],
    uploadedAt: "2024-11-08T08:45:00Z"
  },
  {
    id: "sds-006",
    product: "Welding Electrode E7018",
    manufacturer: "ArcWeld Industries",
    casNumber: "Mixture",
    revisionDate: "2024-06-30",
    productCode: "AWI-E7018",
    signalWord: "Danger",
    pictograms: ["Exclamation Mark", "Health Hazard"] as GHSPictogramType[],
    hazardStatements: [
      "May cause respiratory irritation.",
      "May cause cancer (welding fumes).",
      "Causes eye irritation."
    ],
    ppe: ["Welding helmet with proper shade", "Respirator with P100 filters", "Leather gloves", "Flame-resistant clothing"],
    firstAid: {
      eyes: "Flush with water for 15 minutes. Seek medical attention.",
      skin: "Wash with soap and water. Treat burns appropriately.",
      inhalation: "Move to fresh air. Seek medical attention if symptoms persist."
    },
    storageHandling: {
      storage: ["Store in dry conditions", "Keep electrodes in original packaging", "Protect from moisture", "Store away from food and beverages"],
      handling: ["Use only with adequate ventilation", "Avoid breathing fumes", "Do not weld on containers that held hazardous materials", "Keep away from combustibles"]
    },
    flashPoint: "N/A",
    phValue: "N/A",
    appearance: "Metallic rod with flux coating",
    locationPath: ["North Facility", "Production Wing", "Welding Bay", "Station 2", "Tool Cabinet", "Drawer A"],
    uploadedAt: "2024-10-25T13:20:00Z"
  },
  {
    id: "sds-007",
    product: "Compressed Oxygen Gas",
    manufacturer: "AirGas Pro",
    casNumber: "7782-44-7",
    revisionDate: "2024-11-01",
    productCode: "AGP-O2-IND",
    signalWord: "Danger",
    pictograms: ["Oxidizer", "Gas Cylinder"] as GHSPictogramType[],
    hazardStatements: [
      "May cause or intensify fire; oxidizer.",
      "Contains gas under pressure; may explode if heated."
    ],
    ppe: ["Safety glasses", "Leather gloves", "Safety shoes", "Flame-resistant clothing"],
    firstAid: {
      eyes: "Not typically hazardous. Flush if debris enters eye.",
      skin: "In case of frostbite from rapid release, warm slowly with lukewarm water.",
      inhalation: "High concentrations may cause dizziness. Move to fresh air."
    },
    storageHandling: {
      storage: ["Store cylinders upright and secured", "Keep away from heat sources", "Store away from flammable materials", "Protect from physical damage"],
      handling: ["Never use oil or grease on valves", "Open valve slowly", "Use appropriate regulator", "Keep away from flames and sparks"]
    },
    flashPoint: "N/A (Supports combustion)",
    phValue: "N/A",
    appearance: "Colorless, odorless gas",
    locationPath: ["Main Campus", "Gas Storage Yard", "Cylinder Rack", "Zone A", "Position 3", "Cylinder O2-45"],
    uploadedAt: "2024-11-28T10:00:00Z"
  },
  {
    id: "sds-008",
    product: "Methyl Ethyl Ketone (MEK)",
    manufacturer: "SolventPro Inc",
    casNumber: "78-93-3",
    revisionDate: "2024-09-18",
    productCode: "SPI-MEK-01",
    signalWord: "Danger",
    pictograms: ["Flame", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Highly flammable liquid and vapor.",
      "Causes serious eye irritation.",
      "May cause respiratory irritation.",
      "May cause drowsiness or dizziness."
    ],
    ppe: ["Chemical splash goggles", "Butyl rubber gloves", "Supplied air respirator", "Flame-resistant clothing"],
    firstAid: {
      eyes: "Rinse cautiously with water for at least 15 minutes.",
      skin: "Wash with plenty of soap and water.",
      inhalation: "Remove to fresh air and keep at rest. Seek medical attention."
    },
    storageHandling: {
      storage: ["Store in flammable liquid storage area", "Keep away from heat, sparks, open flame", "Store in cool, well-ventilated place", "Keep container tightly closed"],
      handling: ["Use only with adequate ventilation", "Ground and bond containers", "Use explosion-proof equipment", "Avoid prolonged or repeated exposure"]
    },
    flashPoint: "-9°C (16°F)",
    phValue: "7.0",
    appearance: "Clear, colorless liquid with sweet odor",
    locationPath: ["Distribution Center", "Warehouse B", "Solvent Area", "Aisle 4", "Section C", "Drum D-8"],
    uploadedAt: "2024-11-12T15:30:00Z"
  },
  {
    id: "sds-009",
    product: "Diesel Fuel #2",
    manufacturer: "PetroMax Fuels",
    casNumber: "68476-34-6",
    revisionDate: "2024-10-10",
    productCode: "PMF-DF2-ULS",
    signalWord: "Warning",
    pictograms: ["Flame", "Health Hazard", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Combustible liquid.",
      "May be fatal if swallowed and enters airways.",
      "Suspected of causing cancer.",
      "Causes skin irritation."
    ],
    ppe: ["Safety glasses", "Nitrile gloves", "Protective clothing", "Vapor respirator if poorly ventilated"],
    firstAid: {
      eyes: "Flush with water for 15 minutes.",
      skin: "Wash with soap and water. Remove contaminated clothing.",
      inhalation: "Move to fresh air. Seek medical attention if symptoms occur."
    },
    storageHandling: {
      storage: ["Store away from ignition sources", "Keep in approved storage tanks", "Ground storage tanks properly", "Maintain spill containment"],
      handling: ["No smoking during handling", "Ground equipment during transfer", "Avoid breathing vapors", "Do not siphon by mouth"]
    },
    flashPoint: "52°C (126°F)",
    phValue: "N/A",
    appearance: "Clear to yellow liquid with petroleum odor",
    locationPath: ["Main Campus", "Vehicle Depot", "Fuel Station", "Tank Farm", "Tank 2", "Fill Point A"],
    uploadedAt: "2024-11-05T07:15:00Z"
  },
  {
    id: "sds-010",
    product: "Ammonia Solution 25%",
    manufacturer: "ChemCore Industries",
    casNumber: "1336-21-6",
    revisionDate: "2024-08-28",
    productCode: "CCI-NH3-25",
    signalWord: "Danger",
    pictograms: ["Corrosion", "Exclamation Mark", "Environment"] as GHSPictogramType[],
    hazardStatements: [
      "Causes severe skin burns and eye damage.",
      "Harmful if inhaled.",
      "Very toxic to aquatic life."
    ],
    ppe: ["Full face shield", "Butyl rubber gloves", "Chemical-resistant suit", "Self-contained breathing apparatus"],
    firstAid: {
      eyes: "Immediately flush with water for at least 30 minutes. Get emergency medical help.",
      skin: "Remove contaminated clothing. Flush skin with water for 20 minutes.",
      inhalation: "Move to fresh air immediately. Give artificial respiration if not breathing. Seek emergency care."
    },
    storageHandling: {
      storage: ["Store in cool, well-ventilated area", "Keep away from acids and oxidizers", "Store in corrosion-resistant containers", "Prevent release to environment"],
      handling: ["Use only with adequate ventilation", "Avoid breathing vapors", "Do not mix with bleach or acids", "Use appropriate PPE at all times"]
    },
    flashPoint: "N/A (Non-flammable)",
    phValue: "11.6",
    appearance: "Colorless liquid with strong pungent odor",
    locationPath: ["North Facility", "Refrigeration Plant", "Chemical Room", "Cabinet A", "Shelf 1", "Container R-2"],
    uploadedAt: "2024-10-30T09:45:00Z"
  }
];

export default function SDSLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sdsDocuments, setSdsDocuments] = useState<SDSDocument[]>(SAMPLE_SDS_DATA);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // New state for enhanced features
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quickViewSDS, setQuickViewSDS] = useState<SDSDocument | null>(null);
  const [fullViewSDS, setFullViewSDS] = useState<SDSDocument | null>(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showBinderModal, setShowBinderModal] = useState(false);
  const [labelPrintDocument, setLabelPrintDocument] = useState<SDSDocument | null>(null);
  
  // Location Explorer state
  const [selectedLocationPath, setSelectedLocationPath] = useState<string[] | null>(null);
  
  const {
    isOrgAdmin,
    allowedLocationIds,
    locationContext,
    getLocationById,
  } = useAccess();

  // Auto-hide success toast
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Handle successful SDS upload
  const handleUploadSuccess = (sds: SDSDocument) => {
    setSdsDocuments(prev => [...prev, sds]);
    setShowSuccessToast(true);
  };

  // Filter documents based on location and search
  const filteredDocuments = useMemo(() => {
    let docs = sdsDocuments;
    
    // Location filter - match documents where locationPath starts with selectedPath
    if (selectedLocationPath && selectedLocationPath.length > 0) {
      docs = docs.filter(doc => {
        // Check if doc.locationPath starts with selectedLocationPath
        return selectedLocationPath.every((segment, index) => 
          doc.locationPath[index] === segment
        );
      });
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter(doc =>
        doc.product.toLowerCase().includes(query) ||
        doc.manufacturer.toLowerCase().includes(query) ||
        doc.casNumber.toLowerCase().includes(query)
      );
    }
    
    return docs;
  }, [sdsDocuments, searchQuery, selectedLocationPath]);

  // Get selected documents for label generation
  const selectedDocuments = useMemo(() => {
    return sdsDocuments.filter(doc => selectedIds.has(doc.id));
  }, [sdsDocuments, selectedIds]);

  // Get the "Showing" pill label
  const getShowingLabel = () => {
    if (locationContext === "ALL_LOCATIONS") {
      return { text: "All locations", locked: false };
    }
    if (locationContext === "ALL_ASSIGNED") {
      return { text: "All assigned locations", locked: false };
    }
    if (locationContext.startsWith("LOCATION:")) {
      const locId = locationContext.replace("LOCATION:", "");
      const loc = getLocationById(locId);
      const isLocked = !isOrgAdmin && allowedLocationIds.length === 1;
      return { text: loc?.name || "Unknown", locked: isLocked };
    }
    return { text: "Unknown", locked: false };
  };

  const showingInfo = getShowingLabel();

  // Get current location name for binder
  const currentLocationName = useMemo(() => {
    if (locationContext === "ALL_LOCATIONS") {
      return "All Locations";
    }
    if (locationContext === "ALL_ASSIGNED") {
      return "All Assigned Locations";
    }
    if (locationContext.startsWith("LOCATION:")) {
      const locId = locationContext.replace("LOCATION:", "");
      const loc = getLocationById(locId);
      return loc?.name || "Unknown Location";
    }
    return "Unknown Location";
  }, [locationContext, getLocationById]);

  // Check if user has no location access
  const hasNoAccess = !isOrgAdmin && allowedLocationIds.length === 0;

  // Format location path as breadcrumb
  const formatLocationPath = (path: string[]) => {
    if (path.length === 0) return "—";
    if (path.length <= 2) return path.join(" > ");
    return `${path[0]} > ... > ${path[path.length - 1]}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Checkbox selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDocuments.length && filteredDocuments.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDocuments.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const isAllSelected = filteredDocuments.length > 0 && selectedIds.size === filteredDocuments.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredDocuments.length;

  // No access state
  if (hasNoAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <header className="bg-white border-b border-gray-200 ml-64">
          <div className="px-8 py-3 flex items-center justify-between">
            <LocationSwitcher />
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
        <main className="ml-64 px-8 py-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Location Access</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              You don&apos;t have access to any locations. Contact an Org Admin to request access.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Contact Admin
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 ml-64">
        <div className="px-8 py-3 flex items-center justify-between">
          <LocationSwitcher />
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
      <main className="ml-64 px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">SDS Library</h1>
            <p className="text-sm text-gray-600">Manage Safety Data Sheets across your locations</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-6">
          {/* Left Column - Location Explorer (25%) */}
          <div className="w-1/4 flex flex-col">
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Explorer</h2>
              <LocationTree
                documents={sdsDocuments}
                selectedPath={selectedLocationPath}
                onSelectLocation={setSelectedLocationPath}
              />
            </div>
            
            {/* PRD Documentation Link */}
            <div className="mt-4">
              <Link
                href="/sdslibraryproductspecs"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Product Documentation</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Main Content (75%) */}
          <div className="w-3/4">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Content Header with Search and Actions */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search SDS by product, manufacturer, or CAS number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 ml-4">
                    {/* Generate Labels Button - shown when rows selected */}
                    {selectedIds.size > 0 && (
                      <button 
                        onClick={() => setShowLabelModal(true)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Generate Labels ({selectedIds.size})
                      </button>
                    )}

                    {/* Generate Site Binder Button */}
                    <button 
                      onClick={() => setShowBinderModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Site Binder
                    </button>

                    {/* Upload Button */}
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload SDS
                    </button>
                  </div>
                </div>

                {/* Selection Info Bar */}
                {selectedIds.size > 0 && (
                  <div className="mt-3 flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
                    <span className="text-sm text-blue-700">
                      <span className="font-medium">{selectedIds.size}</span> of {filteredDocuments.length} selected
                    </span>
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
              </div>

              {/* Table or Empty State */}
              {filteredDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {/* Checkbox Column */}
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = isSomeSelected;
                            }}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Manufacturer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          CAS No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Location (Level 6)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Pictograms
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr 
                          key={doc.id} 
                          className={`hover:bg-gray-50 ${selectedIds.has(doc.id) ? "bg-blue-50" : ""}`}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(doc.id)}
                              onChange={() => toggleSelect(doc.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setFullViewSDS(doc)}
                                className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-blue-200 transition-colors cursor-pointer"
                                title="View Full SDS"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                              <div>
                                <button 
                                  onClick={() => setFullViewSDS(doc)}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-left"
                                >
                                  {doc.product}
                                </button>
                                <div className="text-xs text-gray-500">Added {formatDate(doc.uploadedAt)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {doc.manufacturer}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-mono text-gray-700">{doc.casNumber || "—"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative group">
                              <span className="text-sm text-gray-700 truncate block max-w-[180px] cursor-help border-b border-dashed border-gray-400">
                                {formatLocationPath(doc.locationPath)}
                              </span>
                              {/* Location Hierarchy Tooltip - positioned below to avoid clipping */}
                              <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
                                <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 min-w-[280px] max-w-[350px]">
                                  {/* Arrow pointer at top */}
                                  <div className="absolute left-6 top-0 transform -translate-y-full">
                                    <div className="border-8 border-transparent border-b-gray-900"></div>
                                  </div>
                                  <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Full Location Hierarchy</div>
                                  <div className="space-y-1">
                                    {doc.locationPath.map((level, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-16 flex-shrink-0">Level {index + 1}:</span>
                                        <span className={`text-sm ${index === doc.locationPath.length - 1 ? 'text-blue-400 font-medium' : 'text-white'}`}>
                                          {level}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Visual path representation */}
                                  <div className="mt-3 pt-2 border-t border-gray-700">
                                    <div className="text-xs text-gray-400 mb-1">Path:</div>
                                    <div className="flex items-center flex-wrap gap-1 text-xs">
                                      {doc.locationPath.map((level, index) => (
                                        <React.Fragment key={index}>
                                          {index > 0 && <span className="text-gray-500">›</span>}
                                          <span className={index === doc.locationPath.length - 1 ? 'text-blue-400' : 'text-gray-300'}>
                                            {level}
                                          </span>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <GHSPictogramList pictograms={doc.pictograms} size="sm" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setQuickViewSDS(doc)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Quick View
                              </button>
                              <button className="text-gray-600 hover:text-gray-800 text-sm">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-800 text-sm">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Safety Data Sheets</h3>
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                    Upload your first SDS document to start building your safety data sheet library.
                  </p>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload SDS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Upload SDS Modal */}
      <UploadSDSModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Quick View Drawer */}
      <SDSQuickViewDrawer
        sds={quickViewSDS}
        isOpen={quickViewSDS !== null}
        onClose={() => setQuickViewSDS(null)}
        onOpenFullSDS={(sds) => setFullViewSDS(sds)}
        onPrintLabel={(sds) => {
          setLabelPrintDocument(sds);
          setShowLabelModal(true);
        }}
      />

      {/* Full SDS Modal */}
      <FullSDSModal
        sds={fullViewSDS}
        isOpen={fullViewSDS !== null}
        onClose={() => setFullViewSDS(null)}
      />

      {/* Label Generator Modal */}
      <LabelGeneratorModal
        isOpen={showLabelModal}
        onClose={() => {
          setShowLabelModal(false);
          setLabelPrintDocument(null);
        }}
        documents={labelPrintDocument ? [labelPrintDocument] : selectedDocuments}
      />

      {/* Binder Builder Modal */}
      <BinderBuilderModal
        isOpen={showBinderModal}
        onClose={() => setShowBinderModal(false)}
        documents={sdsDocuments}
        locationName={currentLocationName}
      />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">SDS Added to Library</span>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="ml-2 hover:bg-white/20 rounded p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {/* SDS AI Assistant Chatbot */}
      <SDSAIAssistant />
    </div>
  );
}
