"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { GHSPictogramSelector, GHSPictogramList, type GHSPictogramType } from "./GHSPictograms";

// SDS Document interface - expanded for 16-section GHS standard
export interface SDSDocument {
  id: string;
  // Identification
  product: string;
  manufacturer: string;
  casNumber: string;
  revisionDate: string;
  productCode: string;
  // Hazards
  signalWord: string;
  pictograms: GHSPictogramType[];
  hazardStatements: string[];
  // Safety Response
  ppe: string[];
  firstAid: {
    eyes: string;
    skin: string;
    inhalation: string;
  };
  // Storage & Handling (Sections 7 & 10)
  storageHandling: {
    storage: string[];
    handling: string[];
  };
  // Physical Properties
  flashPoint: string;
  phValue: string;
  appearance: string;
  // Location
  locationPath: string[];
  uploadedAt: string;
}

interface UploadSDSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sds: SDSDocument) => void;
}

// Comprehensive 16-section GHS Dummy Data for Industrial Grade Acetone
const DUMMY_SDS_DATA = {
  identification: {
    productName: "Industrial Grade Acetone",
    manufacturer: "Global Chem Supply",
    casNumber: "67-64-1",
    revisionDate: "2024-11-15",
    productCode: "GCS-ACE-01"
  },
  hazards: {
    signalWord: "Danger",
    pictograms: ["Flame", "Exclamation Mark"] as GHSPictogramType[],
    hazardStatements: [
      "Highly flammable liquid and vapor.",
      "Causes serious eye irritation.",
      "May cause drowsiness or dizziness."
    ]
  },
  safetyResponse: {
    ppe: [
      "Safety glasses with side-shields",
      "Butyl rubber gloves",
      "Nitrile rubber gloves",
      "Protective clothing"
    ],
    firstAid: {
      eyes: "IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses, if present and easy to do. Continue rinsing.",
      skin: "IF ON SKIN (or hair): Take off immediately all contaminated clothing. Rinse skin with water.",
      inhalation: "IF INHALED: Remove person to fresh air and keep comfortable for breathing."
    }
  },
  storageHandling: {
    storage: [
      "Keep away from heat, sparks, open flames, and hot surfaces",
      "Store in a well-ventilated place",
      "Keep container tightly closed",
      "Store locked up"
    ],
    handling: [
      "Use only outdoors or in a well-ventilated area",
      "Avoid breathing vapors or mist",
      "Wash hands thoroughly after handling",
      "Do not eat, drink, or smoke when using this product"
    ]
  },
  physicalProperties: {
    flashPoint: "-20°C (-4°F)",
    phValue: "7.0",
    appearance: "Colorless liquid"
  },
  locationHierarchy: {
    level1: "North Facility",
    level2: "Production Wing",
    level3: "Assembly Line",
    level4: "Robot Arm 1",
    level5: "Base Unit",
    level6: "Servo Motor"
  }
};

// 6-Level CMMS Hierarchy data
const CMMS_HIERARCHY = {
  sites: ["Main Campus", "North Facility", "Distribution Center"],
  areas: {
    "Main Campus": ["Building A", "Building B", "Warehouse"],
    "North Facility": ["Production Wing", "Admin Wing"],
    "Distribution Center": ["Loading Bay", "Storage"]
  } as Record<string, string[]>,
  systems: {
    "Building A": ["HVAC System", "Electrical System", "Plumbing"],
    "Building B": ["HVAC System", "Fire Suppression"],
    "Warehouse": ["Conveyor System", "Climate Control"],
    "Production Wing": ["Assembly Line", "Quality Control"],
    "Admin Wing": ["HVAC System", "IT Infrastructure"],
    "Loading Bay": ["Dock Equipment", "Material Handling"],
    "Storage": ["Racking System", "Climate Control"]
  } as Record<string, string[]>,
  equipment: {
    "HVAC System": ["AHU-01", "AHU-02", "Chiller Unit"],
    "Electrical System": ["Main Panel", "Generator", "UPS"],
    "Plumbing": ["Main Pump", "Water Heater"],
    "Fire Suppression": ["Sprinkler Control", "Fire Pump"],
    "Conveyor System": ["Belt Conveyor A", "Belt Conveyor B"],
    "Climate Control": ["Dehumidifier", "Heater Unit"],
    "Assembly Line": ["Robot Arm 1", "Robot Arm 2", "Welding Station"],
    "Quality Control": ["Inspection Camera", "Testing Rig"],
    "IT Infrastructure": ["Server Rack", "Network Switch"],
    "Dock Equipment": ["Dock Leveler", "Truck Restraint"],
    "Material Handling": ["Forklift Charger", "Pallet Jack Station"],
    "Racking System": ["Rack A", "Rack B", "Rack C"]
  } as Record<string, string[]>,
  subunits: {
    "AHU-01": ["Fan Assembly", "Filter Bank", "Coil Section"],
    "AHU-02": ["Fan Assembly", "Filter Bank"],
    "Chiller Unit": ["Compressor", "Condenser", "Evaporator"],
    "Main Panel": ["Breaker Section", "Metering"],
    "Generator": ["Engine", "Alternator", "Control Panel"],
    "Main Pump": ["Motor", "Impeller Assembly"],
    "Robot Arm 1": ["Base Unit", "Arm Section", "End Effector"],
    "Robot Arm 2": ["Base Unit", "Arm Section", "End Effector"],
    "Belt Conveyor A": ["Drive Unit", "Belt Section", "Tensioner"],
    "Dock Leveler": ["Hydraulic Unit", "Platform"],
    "Rack A": ["Level 1", "Level 2", "Level 3"]
  } as Record<string, string[]>,
  components: {
    "Fan Assembly": ["Motor", "Bearings", "Belt Drive"],
    "Filter Bank": ["Pre-Filter", "HEPA Filter"],
    "Coil Section": ["Cooling Coil", "Heating Coil"],
    "Compressor": ["Piston", "Valve Assembly", "Crankshaft"],
    "Engine": ["Fuel Injector", "Starter Motor", "Alternator"],
    "Base Unit": ["Servo Motor", "Encoder", "Gearbox"],
    "Arm Section": ["Joint Motor", "Position Sensor"],
    "End Effector": ["Gripper", "Sensor Array"],
    "Drive Unit": ["Motor", "Gearbox", "Coupling"],
    "Hydraulic Unit": ["Pump", "Cylinder", "Valve"],
    "Level 1": ["Shelf A", "Shelf B", "Shelf C"]
  } as Record<string, string[]>
};

const SIGNAL_WORDS = ["Danger", "Warning", "None"];

export default function UploadSDSModal({ isOpen, onClose, onSuccess }: UploadSDSModalProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form data - expanded for 16-section GHS
  const [formData, setFormData] = useState({
    product: "",
    manufacturer: "",
    casNumber: "",
    revisionDate: "",
    productCode: "",
    signalWord: "Danger",
    pictograms: [] as GHSPictogramType[],
    hazardStatements: [] as string[],
    ppe: [] as string[],
    firstAid: {
      eyes: "",
      skin: "",
      inhalation: ""
    },
    storageHandling: {
      storage: [] as string[],
      handling: [] as string[]
    },
    flashPoint: "",
    phValue: "",
    appearance: ""
  });
  
  // Location selection
  const [locationSelection, setLocationSelection] = useState({
    site: "",
    area: "",
    system: "",
    equipment: "",
    subunit: "",
    component: ""
  });

  // Reset form when modal opens - this is an intentional reset pattern for modals
  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/purity */
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsProcessing(false);
      setFormData({
        product: "",
        manufacturer: "",
        casNumber: "",
        revisionDate: "",
        productCode: "",
        signalWord: "Danger",
        pictograms: [],
        hazardStatements: [],
        ppe: [],
        firstAid: { eyes: "", skin: "", inhalation: "" },
        storageHandling: { storage: [], handling: [] },
        flashPoint: "",
        phValue: "",
        appearance: ""
      });
      setLocationSelection({
        site: "",
        area: "",
        system: "",
        equipment: "",
        subunit: "",
        component: ""
      });
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/purity */

  // Simulate AI processing and auto-fill form
  const simulateAIProcessing = useCallback(() => {
    setIsProcessing(true);
    
    // Simulate AI processing for 2.5 seconds
    setTimeout(() => {
      // Auto-fill form with comprehensive dummy data
      setFormData({
        product: DUMMY_SDS_DATA.identification.productName,
        manufacturer: DUMMY_SDS_DATA.identification.manufacturer,
        casNumber: DUMMY_SDS_DATA.identification.casNumber,
        revisionDate: DUMMY_SDS_DATA.identification.revisionDate,
        productCode: DUMMY_SDS_DATA.identification.productCode,
        signalWord: DUMMY_SDS_DATA.hazards.signalWord,
        pictograms: DUMMY_SDS_DATA.hazards.pictograms,
        hazardStatements: DUMMY_SDS_DATA.hazards.hazardStatements,
        ppe: DUMMY_SDS_DATA.safetyResponse.ppe,
        firstAid: DUMMY_SDS_DATA.safetyResponse.firstAid,
        storageHandling: DUMMY_SDS_DATA.storageHandling,
        flashPoint: DUMMY_SDS_DATA.physicalProperties.flashPoint,
        phValue: DUMMY_SDS_DATA.physicalProperties.phValue,
        appearance: DUMMY_SDS_DATA.physicalProperties.appearance
      });
      
      // Also pre-fill location hierarchy
      setLocationSelection({
        site: DUMMY_SDS_DATA.locationHierarchy.level1,
        area: DUMMY_SDS_DATA.locationHierarchy.level2,
        system: DUMMY_SDS_DATA.locationHierarchy.level3,
        equipment: DUMMY_SDS_DATA.locationHierarchy.level4,
        subunit: DUMMY_SDS_DATA.locationHierarchy.level5,
        component: DUMMY_SDS_DATA.locationHierarchy.level6
      });
      
      setIsProcessing(false);
      setCurrentStep(2);
    }, 2500);
  }, []);

  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      simulateAIProcessing();
    }
  }, [simulateAIProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  // Get available options for each level based on selections
  const getAreaOptions = () => locationSelection.site ? (CMMS_HIERARCHY.areas[locationSelection.site] || []) : [];
  const getSystemOptions = () => locationSelection.area ? (CMMS_HIERARCHY.systems[locationSelection.area] || []) : [];
  const getEquipmentOptions = () => locationSelection.system ? (CMMS_HIERARCHY.equipment[locationSelection.system] || []) : [];
  const getSubunitOptions = () => locationSelection.equipment ? (CMMS_HIERARCHY.subunits[locationSelection.equipment] || []) : [];
  const getComponentOptions = () => locationSelection.subunit ? (CMMS_HIERARCHY.components[locationSelection.subunit] || []) : [];

  // Build breadcrumb path
  const getBreadcrumbPath = () => {
    const path = [];
    if (locationSelection.site) path.push(locationSelection.site);
    if (locationSelection.area) path.push(locationSelection.area);
    if (locationSelection.system) path.push(locationSelection.system);
    if (locationSelection.equipment) path.push(locationSelection.equipment);
    if (locationSelection.subunit) path.push(locationSelection.subunit);
    if (locationSelection.component) path.push(locationSelection.component);
    return path;
  };

  // Handle location change with cascade reset
  const handleLocationChange = (level: string, value: string) => {
    const newSelection = { ...locationSelection };
    
    switch (level) {
      case "site":
        newSelection.site = value;
        newSelection.area = "";
        newSelection.system = "";
        newSelection.equipment = "";
        newSelection.subunit = "";
        newSelection.component = "";
        break;
      case "area":
        newSelection.area = value;
        newSelection.system = "";
        newSelection.equipment = "";
        newSelection.subunit = "";
        newSelection.component = "";
        break;
      case "system":
        newSelection.system = value;
        newSelection.equipment = "";
        newSelection.subunit = "";
        newSelection.component = "";
        break;
      case "equipment":
        newSelection.equipment = value;
        newSelection.subunit = "";
        newSelection.component = "";
        break;
      case "subunit":
        newSelection.subunit = value;
        newSelection.component = "";
        break;
      case "component":
        newSelection.component = value;
        break;
    }
    
    setLocationSelection(newSelection);
  };

  // Handle form submission
  const handleSubmit = () => {
    const sds: SDSDocument = {
      id: `sds-${Date.now()}`,
      product: formData.product,
      manufacturer: formData.manufacturer,
      casNumber: formData.casNumber,
      revisionDate: formData.revisionDate,
      productCode: formData.productCode,
      signalWord: formData.signalWord,
      pictograms: formData.pictograms,
      hazardStatements: formData.hazardStatements,
      ppe: formData.ppe,
      firstAid: formData.firstAid,
      storageHandling: formData.storageHandling,
      flashPoint: formData.flashPoint,
      phValue: formData.phValue,
      appearance: formData.appearance,
      locationPath: getBreadcrumbPath(),
      uploadedAt: new Date().toISOString()
    };
    
    onSuccess(sds);
    onClose();
  };

  // Navigation
  const canProceedToStep3 = formData.product && formData.manufacturer;
  const canSubmit = locationSelection.site; // At minimum, need a site selected

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upload Safety Data Sheet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 ${currentStep >= step ? "text-blue-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step 
                      ? "bg-blue-600 text-white" 
                      : currentStep === step 
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600" 
                        : "bg-gray-100 text-gray-400"
                  }`}>
                    {currentStep > step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {step === 1 ? "Upload File" : step === 2 ? "Review GHS Data" : "Assign Location"}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: File Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {/* Loading Spinner */}
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing SDS Document</h3>
                  <p className="text-sm text-gray-600 text-center max-w-sm animate-pulse">
                    AI Engine parsing 16 GHS sections and extracting pictograms...
                  </p>
                </div>
              ) : (
                <>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {isDragActive ? "Drop the PDF here" : "Drag & drop your SDS PDF"}
                    </h3>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                  </div>
                  
                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-500">or for demo purposes</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  
                  {/* Simulate Upload Button */}
                  <button
                    onClick={simulateAIProcessing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Simulate SDS Upload (Demo)
                  </button>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">AI-Powered Extraction</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Our AI engine will automatically extract all 16 GHS sections including product identification, 
                          hazard statements, PPE requirements, first aid measures, and physical properties.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Step 2: GHS Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Identification Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                  Identification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label>
                    <input
                      type="text"
                      value={formData.casNumber}
                      onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                    <input
                      type="text"
                      value={formData.productCode}
                      onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revision Date</label>
                    <input
                      type="text"
                      value={formData.revisionDate}
                      onChange={(e) => setFormData({ ...formData, revisionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Hazards Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">2</span>
                  Hazard Identification
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Signal Word</label>
                      <select
                        value={formData.signalWord}
                        onChange={(e) => setFormData({ ...formData, signalWord: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formData.signalWord === "Danger" 
                            ? "border-red-300 bg-red-50 text-red-700 font-medium" 
                            : formData.signalWord === "Warning"
                              ? "border-amber-300 bg-amber-50 text-amber-700 font-medium"
                              : "border-gray-300"
                        }`}
                      >
                        {SIGNAL_WORDS.map(word => (
                          <option key={word} value={word}>{word}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GHS Pictograms</label>
                    <GHSPictogramSelector
                      selected={formData.pictograms}
                      onChange={(pictograms) => setFormData({ ...formData, pictograms })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Statements</label>
                    <div className="space-y-2">
                      {formData.hazardStatements.map((statement, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-100">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-red-800">{statement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Safety Response Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">3</span>
                  Safety Response
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required PPE</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.ppe.map((item, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Aid Measures</label>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">👁️</span>
                          <span className="text-sm font-medium text-blue-900">Eyes</span>
                        </div>
                        <p className="text-sm text-blue-800">{formData.firstAid.eyes}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🖐️</span>
                          <span className="text-sm font-medium text-blue-900">Skin</span>
                        </div>
                        <p className="text-sm text-blue-800">{formData.firstAid.skin}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">💨</span>
                          <span className="text-sm font-medium text-blue-900">Inhalation</span>
                        </div>
                        <p className="text-sm text-blue-800">{formData.firstAid.inhalation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Physical Properties Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">4</span>
                  Physical Properties
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Flash Point</p>
                    <p className="text-sm font-semibold text-gray-900">{formData.flashPoint}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">pH Value</p>
                    <p className="text-sm font-semibold text-gray-900">{formData.phValue}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Appearance</p>
                    <p className="text-sm font-semibold text-gray-900">{formData.appearance}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Location Assignment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">6-Level CMMS Location Assignment</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Assign this SDS to a specific location in your asset hierarchy
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Level 1: Site */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 1: Site *
                  </label>
                  <select
                    value={locationSelection.site}
                    onChange={(e) => handleLocationChange("site", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Site...</option>
                    {CMMS_HIERARCHY.sites.map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                </div>
                
                {/* Level 2: Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 2: Area
                  </label>
                  <select
                    value={locationSelection.area}
                    onChange={(e) => handleLocationChange("area", e.target.value)}
                    disabled={!locationSelection.site}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Area...</option>
                    {getAreaOptions().map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                {/* Level 3: System */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 3: System
                  </label>
                  <select
                    value={locationSelection.system}
                    onChange={(e) => handleLocationChange("system", e.target.value)}
                    disabled={!locationSelection.area}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select System...</option>
                    {getSystemOptions().map(system => (
                      <option key={system} value={system}>{system}</option>
                    ))}
                  </select>
                </div>
                
                {/* Level 4: Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 4: Equipment
                  </label>
                  <select
                    value={locationSelection.equipment}
                    onChange={(e) => handleLocationChange("equipment", e.target.value)}
                    disabled={!locationSelection.system}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Equipment...</option>
                    {getEquipmentOptions().map(equipment => (
                      <option key={equipment} value={equipment}>{equipment}</option>
                    ))}
                  </select>
                </div>
                
                {/* Level 5: Sub-unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 5: Sub-unit
                  </label>
                  <select
                    value={locationSelection.subunit}
                    onChange={(e) => handleLocationChange("subunit", e.target.value)}
                    disabled={!locationSelection.equipment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Sub-unit...</option>
                    {getSubunitOptions().map(subunit => (
                      <option key={subunit} value={subunit}>{subunit}</option>
                    ))}
                  </select>
                </div>
                
                {/* Level 6: Component */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level 6: Component
                  </label>
                  <select
                    value={locationSelection.component}
                    onChange={(e) => handleLocationChange("component", e.target.value)}
                    disabled={!locationSelection.subunit}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Component...</option>
                    {getComponentOptions().map(component => (
                      <option key={component} value={component}>{component}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Breadcrumb Path */}
              {getBreadcrumbPath().length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Path</label>
                  <div className="flex items-center flex-wrap gap-1 text-sm">
                    {getBreadcrumbPath().map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        <span className={`px-2 py-1 rounded ${
                          index === getBreadcrumbPath().length - 1 
                            ? "bg-blue-100 text-blue-700 font-medium" 
                            : "bg-white text-gray-700 border border-gray-200"
                        }`}>
                          {item}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">SDS Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-600">Product:</span>
                    <span className="ml-2 text-blue-900 font-medium">{formData.product}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Manufacturer:</span>
                    <span className="ml-2 text-blue-900 font-medium">{formData.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">CAS Number:</span>
                    <span className="ml-2 text-blue-900 font-mono">{formData.casNumber}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Signal Word:</span>
                    <span className={`ml-2 font-medium ${formData.signalWord === "Danger" ? "text-red-600" : "text-amber-600"}`}>
                      {formData.signalWord}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-blue-600">Pictograms:</span>
                    <GHSPictogramList pictograms={formData.pictograms} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          
          <div className="flex items-center gap-3">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 || (currentStep === 2 && !canProceedToStep3)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Save SDS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
