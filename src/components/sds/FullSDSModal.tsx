"use client";

import React from "react";
import { type SDSDocument } from "./UploadSDSModal";
import { GHSPictogramList } from "./GHSPictograms";

interface FullSDSModalProps {
  sds: SDSDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive sample data for all 16 GHS sections
// This maps SDS document IDs to their full 16-section data
const FULL_SDS_DATA: Record<string, FullSDSData> = {
  "sds-001": {
    // Section 1: Identification
    identification: {
      productName: "Industrial Grade Acetone",
      productCode: "GCS-ACE-01",
      manufacturer: {
        name: "Global Chem Supply, Inc.",
        address: "1200 Chemical Boulevard, Suite 450",
        city: "Houston",
        state: "TX",
        zip: "77002",
        country: "USA",
        phone: "+1 (713) 555-0142",
        fax: "+1 (713) 555-0143",
        email: "safety@globalchemsupply.com",
        website: "www.globalchemsupply.com"
      },
      emergencyPhone: "CHEMTREC: 1-800-424-9300 (24 hours)",
      recommendedUse: "Industrial solvent, cleaning agent, degreaser, paint thinner, nail polish remover base",
      restrictionsOnUse: "Not for use in food processing areas. Not recommended for pharmaceutical applications without further purification."
    },
    // Section 2: Hazard Identification
    hazardIdentification: {
      ghsClassification: [
        "Flammable Liquid, Category 2",
        "Eye Irritation, Category 2A",
        "Specific Target Organ Toxicity - Single Exposure (Narcotic Effects), Category 3"
      ],
      signalWord: "Danger",
      hazardStatements: [
        "H225: Highly flammable liquid and vapor.",
        "H319: Causes serious eye irritation.",
        "H336: May cause drowsiness or dizziness."
      ],
      precautionaryStatements: {
        prevention: [
          "P210: Keep away from heat, hot surfaces, sparks, open flames and other ignition sources. No smoking.",
          "P233: Keep container tightly closed.",
          "P240: Ground and bond container and receiving equipment.",
          "P241: Use explosion-proof electrical, ventilating, and lighting equipment.",
          "P242: Use non-sparking tools.",
          "P243: Take action to prevent static discharges.",
          "P261: Avoid breathing dust/fume/gas/mist/vapors/spray.",
          "P264: Wash hands thoroughly after handling.",
          "P271: Use only outdoors or in a well-ventilated area.",
          "P280: Wear protective gloves/protective clothing/eye protection/face protection."
        ],
        response: [
          "P303+P361+P353: IF ON SKIN (or hair): Take off immediately all contaminated clothing. Rinse skin with water.",
          "P304+P340: IF INHALED: Remove person to fresh air and keep comfortable for breathing.",
          "P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses, if present and easy to do. Continue rinsing.",
          "P312: Call a POISON CENTER or doctor/physician if you feel unwell.",
          "P337+P313: If eye irritation persists: Get medical advice/attention.",
          "P370+P378: In case of fire: Use dry chemical, CO2, water spray or regular foam to extinguish."
        ],
        storage: [
          "P403+P233: Store in a well-ventilated place. Keep container tightly closed.",
          "P403+P235: Store in a well-ventilated place. Keep cool.",
          "P405: Store locked up."
        ],
        disposal: [
          "P501: Dispose of contents/container in accordance with local/regional/national/international regulations."
        ]
      },
      otherHazards: [
        "May form explosive peroxides upon prolonged exposure to air and light.",
        "Vapors may travel to source of ignition and flash back.",
        "Containers may explode when heated."
      ]
    },
    // Section 3: Composition/Information on Ingredients
    composition: {
      substanceOrMixture: "Substance",
      ingredients: [
        {
          chemicalName: "Acetone",
          commonName: "2-Propanone, Dimethyl ketone",
          casNumber: "67-64-1",
          ecNumber: "200-662-2",
          concentration: "99.5% min",
          classification: "Flam. Liq. 2; Eye Irrit. 2A; STOT SE 3"
        }
      ],
      impurities: [
        { name: "Water", concentration: "< 0.3%" },
        { name: "Methanol", concentration: "< 0.05%" },
        { name: "Aldehydes (as formaldehyde)", concentration: "< 0.002%" }
      ]
    },
    // Section 4: First-Aid Measures
    firstAid: {
      inhalation: "Remove person to fresh air and keep comfortable for breathing. If experiencing respiratory symptoms, seek medical attention. If not breathing, give artificial respiration. If breathing is difficult, give oxygen by trained personnel.",
      skinContact: "Take off immediately all contaminated clothing and wash it before reuse. Wash skin thoroughly with soap and water for at least 15 minutes. If skin irritation occurs, get medical advice/attention.",
      eyeContact: "Rinse cautiously with water for at least 15 minutes. Remove contact lenses, if present and easy to do. Continue rinsing. If eye irritation persists, get medical advice/attention from an ophthalmologist.",
      ingestion: "Rinse mouth with water. Do NOT induce vomiting. If vomiting occurs spontaneously, keep head below hips to prevent aspiration. Get immediate medical attention. Never give anything by mouth to an unconscious person.",
      acuteSymptoms: [
        "Eye irritation, redness, tearing",
        "Skin dryness and irritation with prolonged contact",
        "Headache, dizziness, drowsiness",
        "Nausea, vomiting (if ingested)",
        "Central nervous system depression"
      ],
      delayedSymptoms: [
        "Dermatitis from repeated exposure",
        "Potential liver and kidney effects from chronic exposure"
      ],
      medicalAttention: "Treat symptomatically. No specific antidote. Contact a poison control center or physician for treatment advice. Take this SDS to the health professional."
    },
    // Section 5: Fire-Fighting Measures
    fireFighting: {
      suitableExtinguishingMedia: [
        "Carbon dioxide (CO2)",
        "Dry chemical powder",
        "Alcohol-resistant foam",
        "Water spray (fog)"
      ],
      unsuitableExtinguishingMedia: [
        "Water jet (may spread fire)"
      ],
      specificHazards: [
        "Highly flammable liquid and vapor.",
        "Vapors may form explosive mixtures with air.",
        "Vapors are heavier than air and may travel along the ground to a source of ignition and flash back.",
        "Containers may rupture or explode if exposed to heat or fire.",
        "Combustion products may include carbon monoxide, carbon dioxide, and other toxic gases."
      ],
      protectiveEquipment: "Firefighters should wear full protective equipment including self-contained breathing apparatus (SCBA) with full facepiece operated in positive pressure mode. Structural firefighters' protective clothing provides limited protection in fire situations ONLY; it is not effective in spill situations where direct contact with the substance is possible.",
      specialProcedures: "Move containers from fire area if it can be done without risk. Cool containers with water spray until well after fire is out. Use water spray to keep fire-exposed containers cool. For massive fire, use unmanned hose holders or monitor nozzles."
    },
    // Section 6: Accidental Release Measures
    accidentalRelease: {
      personalPrecautions: [
        "Evacuate personnel to safe areas.",
        "Remove all sources of ignition.",
        "Ventilate area of leak or spill.",
        "Use personal protective equipment as specified in Section 8.",
        "Avoid breathing vapors.",
        "Do not touch or walk through spilled material."
      ],
      protectiveEquipment: "Wear appropriate personal protective equipment including chemical splash goggles, chemical-resistant gloves (butyl rubber or nitrile), and chemical-resistant clothing. For large spills, use self-contained breathing apparatus.",
      emergencyProcedures: "Isolate spill or leak area immediately for at least 50 meters (150 feet) in all directions. Keep unauthorized personnel away. Stay upwind. Keep out of low areas.",
      environmentalPrecautions: [
        "Prevent entry into waterways, sewers, basements, or confined areas.",
        "Notify authorities if product enters drains, sewers, or waterways.",
        "Dike far ahead of liquid spill for later disposal."
      ],
      containmentMethods: [
        "Stop leak if without risk.",
        "Contain spill with inert material (sand, earth, vermiculite).",
        "Use spark-proof tools and explosion-proof equipment.",
        "All equipment used when handling this product must be grounded."
      ],
      cleanupMethods: [
        "Absorb spillage with non-combustible absorbent material.",
        "Place in appropriate container for disposal.",
        "Wash contaminated area with water.",
        "Dispose of collected material in accordance with applicable regulations."
      ]
    },
    // Section 7: Handling and Storage
    handlingAndStorage: {
      safeHandling: [
        "Use only in well-ventilated areas.",
        "Keep away from heat, sparks, open flames, and hot surfaces.",
        "Use explosion-proof electrical, ventilating, and lighting equipment.",
        "Use non-sparking tools.",
        "Take action to prevent static discharges.",
        "Ground and bond containers during transfer operations.",
        "Do not breathe vapors or mist.",
        "Avoid contact with eyes, skin, and clothing.",
        "Wash thoroughly after handling.",
        "Do not eat, drink, or smoke when using this product."
      ],
      hygieneRequirements: [
        "Handle in accordance with good industrial hygiene and safety practice.",
        "Wash hands before breaks and at the end of the workday.",
        "Remove contaminated clothing and protective equipment before entering eating areas.",
        "Wash contaminated clothing before reuse."
      ],
      storageConditions: [
        "Store in a cool, dry, well-ventilated area.",
        "Store away from incompatible materials (oxidizers, acids, bases).",
        "Keep container tightly closed when not in use.",
        "Store in properly labeled containers.",
        "Store at temperatures below 40°C (104°F).",
        "Protect from sunlight.",
        "Store locked up."
      ],
      incompatibilities: [
        "Strong oxidizers (may cause fire or explosion)",
        "Strong acids",
        "Strong bases",
        "Amines",
        "Chlorinated compounds"
      ],
      temperatureGuidance: "Store at temperatures between 15-25°C (59-77°F). Do not expose to temperatures exceeding 50°C (122°F).",
      ventilationRequirements: "Mechanical exhaust required. Local exhaust ventilation at point of use recommended."
    },
    // Section 8: Exposure Controls/Personal Protection
    exposureControls: {
      occupationalExposureLimits: [
        { agency: "OSHA PEL", value: "1000 ppm (2400 mg/m³) TWA" },
        { agency: "ACGIH TLV", value: "250 ppm TWA; 500 ppm STEL" },
        { agency: "NIOSH REL", value: "250 ppm (590 mg/m³) TWA" }
      ],
      biologicalExposureIndices: "ACGIH BEI: Acetone in urine: 50 mg/L (end of shift)",
      engineeringControls: [
        "Use process enclosures, local exhaust ventilation, or other engineering controls to keep worker exposure below recommended limits.",
        "Ensure adequate ventilation, especially in confined areas.",
        "Use explosion-proof ventilation equipment.",
        "Facilities storing or utilizing this material should be equipped with an eyewash facility and a safety shower."
      ],
      ppe: {
        eyeFace: "Chemical splash goggles. Face shield for splash hazards. Contact lenses should not be worn when working with this chemical.",
        skin: "Butyl rubber or nitrile rubber gloves (minimum thickness 0.4mm, breakthrough time >480 min). Chemical-resistant apron. For prolonged exposure, wear chemical-resistant suit.",
        respiratory: "For concentrations up to 1000 ppm: Use NIOSH-approved organic vapor cartridge respirator. For higher concentrations or unknown levels: Use NIOSH-approved supplied-air respirator (SAR) or self-contained breathing apparatus (SCBA).",
        body: "Wear appropriate protective clothing to prevent skin contact. Flame-resistant clothing recommended in areas where ignition sources may be present."
      },
      generalHygiene: "Wash hands before eating, drinking, smoking, or using toilet facilities. Remove contaminated clothing promptly. Wash contaminated areas of the body immediately upon contact."
    },
    // Section 9: Physical and Chemical Properties
    physicalChemicalProperties: {
      appearance: "Clear, colorless liquid",
      odor: "Sweetish, mint-like, pungent",
      odorThreshold: "13-100 ppm",
      ph: "7 (neutral)",
      meltingPoint: "-94.7°C (-138.5°F)",
      boilingPoint: "56.1°C (133°F) at 760 mmHg",
      flashPoint: "-20°C (-4°F) (closed cup)",
      evaporationRate: "7.7 (butyl acetate = 1)",
      flammability: "Highly flammable liquid",
      upperExplosiveLimit: "12.8% (v/v)",
      lowerExplosiveLimit: "2.5% (v/v)",
      vaporPressure: "231 mmHg at 25°C",
      vaporDensity: "2.0 (air = 1)",
      relativeDensity: "0.791 at 20°C",
      solubility: "Completely miscible with water",
      partitionCoefficient: "log Kow = -0.24",
      autoIgnitionTemperature: "465°C (869°F)",
      decompositionTemperature: "Not determined",
      viscosity: "0.32 cP at 20°C",
      molecularWeight: "58.08 g/mol",
      molecularFormula: "C3H6O"
    },
    // Section 10: Stability and Reactivity
    stabilityReactivity: {
      chemicalStability: "Stable under normal conditions of use, storage, and transport.",
      possibilityOfHazardousReactions: "May form explosive peroxides. Hazardous polymerization does not occur.",
      conditionsToAvoid: [
        "Heat, flames, and sparks",
        "Prolonged exposure to light",
        "Static discharge",
        "Temperatures above 50°C (122°F)"
      ],
      incompatibleMaterials: [
        "Strong oxidizing agents",
        "Strong acids (sulfuric, nitric, hydrochloric)",
        "Strong bases (sodium hydroxide, potassium hydroxide)",
        "Halogens (chlorine, bromine)",
        "Isocyanates",
        "Aldehydes"
      ],
      hazardousDecompositionProducts: [
        "Carbon monoxide",
        "Carbon dioxide",
        "Organic peroxides (under prolonged exposure to air)"
      ]
    },
    // Section 11: Toxicological Information
    toxicologicalInformation: {
      routesOfExposure: ["Inhalation", "Skin contact", "Eye contact", "Ingestion"],
      acuteToxicity: {
        oral: "LD50 (rat): 5,800 mg/kg",
        dermal: "LD50 (rabbit): >15,800 mg/kg",
        inhalation: "LC50 (rat, 4h): 76 mg/L (approximately 32,000 ppm)"
      },
      skinCorrosionIrritation: "Causes mild skin irritation. Prolonged or repeated contact may cause drying and cracking of the skin.",
      eyeDamageIrritation: "Causes serious eye irritation. May cause corneal injury.",
      respiratorySkinSensitization: "Not classified as a respiratory or skin sensitizer.",
      germCellMutagenicity: "Not classified as a germ cell mutagen based on available data.",
      carcinogenicity: {
        status: "Not classifiable as a human carcinogen",
        agencies: [
          { agency: "IARC", classification: "Not listed" },
          { agency: "NTP", classification: "Not listed" },
          { agency: "OSHA", classification: "Not listed" }
        ]
      },
      reproductiveToxicity: "No evidence of reproductive toxicity in animal studies at relevant doses.",
      stotSingleExposure: "May cause drowsiness or dizziness (Category 3, narcotic effects).",
      stotRepeatedExposure: "May cause liver and kidney damage with prolonged or repeated exposure at high concentrations.",
      aspirationHazard: "Not classified as an aspiration hazard."
    },
    // Section 12: Ecological Information
    ecologicalInformation: {
      ecotoxicity: [
        { organism: "Fish (Pimephales promelas)", value: "LC50 (96h): 8,300 mg/L" },
        { organism: "Daphnia magna", value: "EC50 (48h): 12,600 mg/L" },
        { organism: "Algae (Selenastrum capricornutum)", value: "EC50 (72h): 7,500 mg/L" }
      ],
      persistenceAndDegradability: "Readily biodegradable. BOD5/COD ratio indicates good biodegradability. Biodegradation: 90% in 28 days (OECD 301D).",
      bioaccumulativePotential: "Low potential for bioaccumulation. Log Kow = -0.24 indicates low bioaccumulation potential.",
      mobilityInSoil: "High mobility in soil. Expected to volatilize from soil surfaces. May leach to groundwater.",
      otherAdverseEffects: "Not expected to be harmful to the ozone layer. Low potential for long-range transport."
    },
    // Section 13: Disposal Considerations
    disposalConsiderations: {
      disposalMethods: [
        "Dispose of contents/container in accordance with local/regional/national/international regulations.",
        "Incinerate at an approved hazardous waste facility.",
        "Absorb on inert material and dispose as hazardous waste.",
        "Do not discharge into drains, sewers, or waterways."
      ],
      wasteClassification: "Hazardous Waste - EPA Hazardous Waste Number: U002 (Acetone). Listed hazardous waste under RCRA. Check state and local requirements which may be more restrictive.",
      contaminatedPackaging: "Empty containers may retain product residue. Do not reuse containers. Triple rinse empty containers and offer for recycling or dispose as hazardous waste."
    },
    // Section 14: Transport Information
    transportInformation: {
      unNumber: "UN1090",
      properShippingName: "Acetone",
      hazardClass: "3 (Flammable Liquid)",
      packingGroup: "II",
      environmentalHazards: "Not classified as a marine pollutant",
      specialPrecautions: [
        "Keep container tightly closed and in a cool, well-ventilated place.",
        "Protect from sunlight.",
        "Keep away from sources of ignition.",
        "Take precautions to prevent static buildup."
      ],
      transportByMode: {
        dot: "UN1090, Acetone, 3, PG II",
        imdg: "UN1090, ACETONE, 3, PG II",
        iata: "UN1090, Acetone, 3, PG II",
        tdg: "UN1090, ACETONE, 3, PG II"
      },
      limitedQuantity: "1 L (DOT)"
    },
    // Section 15: Regulatory Information
    regulatoryInformation: {
      usaRegulations: [
        { regulation: "OSHA", status: "Listed as hazardous substance" },
        { regulation: "TSCA", status: "Listed on TSCA inventory" },
        { regulation: "CERCLA/SARA", status: "Reportable Quantity (RQ): 5,000 lbs (2,270 kg)" },
        { regulation: "SARA 311/312", status: "Immediate (acute) health hazard, Fire hazard" },
        { regulation: "SARA 313", status: "Not listed" },
        { regulation: "Clean Air Act", status: "Listed as HAP (Hazardous Air Pollutant)" },
        { regulation: "Clean Water Act", status: "Not listed as priority pollutant" }
      ],
      stateRegulations: [
        { state: "California Prop 65", status: "Not listed" },
        { state: "New Jersey RTK", status: "Listed" },
        { state: "Pennsylvania RTK", status: "Listed" },
        { state: "Massachusetts RTK", status: "Listed" }
      ],
      internationalRegulations: [
        { regulation: "REACH (EU)", status: "Pre-registered. EC Number: 200-662-2" },
        { regulation: "WHMIS (Canada)", status: "Class B-2 (Flammable liquid); Class D-2B (Toxic - Other toxic effects)" },
        { regulation: "GHS (Global)", status: "Classified according to UN GHS Rev. 8" }
      ]
    },
    // Section 16: Other Information
    otherInformation: {
      dateOfPreparation: "November 15, 2024",
      lastRevisionDate: "November 15, 2024",
      revisionNumber: "3.0",
      revisionHistory: [
        { version: "1.0", date: "January 10, 2020", changes: "Initial release" },
        { version: "2.0", date: "March 15, 2022", changes: "Updated Section 8 PPE requirements; Added ecological data" },
        { version: "3.0", date: "November 15, 2024", changes: "Updated to GHS Rev. 8; Revised exposure limits; Updated regulatory information" }
      ],
      preparedBy: "Global Chem Supply Safety Department",
      contactInfo: "safety@globalchemsupply.com | +1 (713) 555-0142",
      disclaimer: "The information provided in this Safety Data Sheet is correct to the best of our knowledge at the date of its publication. The information is designed only as guidance for safe handling, use, processing, storage, transportation, disposal and release and is not to be considered a warranty or quality specification. The information relates only to the specific material designated and may not be valid for such material used in combination with any other materials or in any process, unless specified in the text.",
      abbreviations: [
        "ACGIH - American Conference of Governmental Industrial Hygienists",
        "CAS - Chemical Abstracts Service",
        "CERCLA - Comprehensive Environmental Response, Compensation, and Liability Act",
        "DOT - Department of Transportation",
        "EC - European Community",
        "EPA - Environmental Protection Agency",
        "GHS - Globally Harmonized System",
        "IATA - International Air Transport Association",
        "IMDG - International Maritime Dangerous Goods",
        "LC50 - Lethal Concentration 50%",
        "LD50 - Lethal Dose 50%",
        "NIOSH - National Institute for Occupational Safety and Health",
        "OSHA - Occupational Safety and Health Administration",
        "PEL - Permissible Exposure Limit",
        "PPE - Personal Protective Equipment",
        "RCRA - Resource Conservation and Recovery Act",
        "REL - Recommended Exposure Limit",
        "SARA - Superfund Amendments and Reauthorization Act",
        "STEL - Short-Term Exposure Limit",
        "STOT - Specific Target Organ Toxicity",
        "TDG - Transportation of Dangerous Goods",
        "TLV - Threshold Limit Value",
        "TSCA - Toxic Substances Control Act",
        "TWA - Time-Weighted Average",
        "UN - United Nations",
        "WHMIS - Workplace Hazardous Materials Information System"
      ],
      references: [
        "29 CFR 1910.1200 (OSHA Hazard Communication Standard)",
        "NIOSH Pocket Guide to Chemical Hazards",
        "ACGIH TLVs and BEIs",
        "EPA Integrated Risk Information System (IRIS)"
      ]
    }
  }
};

// Type definitions for full SDS data
interface FullSDSData {
  identification: {
    productName: string;
    productCode: string;
    manufacturer: {
      name: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      phone: string;
      fax: string;
      email: string;
      website: string;
    };
    emergencyPhone: string;
    recommendedUse: string;
    restrictionsOnUse: string;
  };
  hazardIdentification: {
    ghsClassification: string[];
    signalWord: string;
    hazardStatements: string[];
    precautionaryStatements: {
      prevention: string[];
      response: string[];
      storage: string[];
      disposal: string[];
    };
    otherHazards: string[];
  };
  composition: {
    substanceOrMixture: string;
    ingredients: Array<{
      chemicalName: string;
      commonName: string;
      casNumber: string;
      ecNumber: string;
      concentration: string;
      classification: string;
    }>;
    impurities: Array<{ name: string; concentration: string }>;
  };
  firstAid: {
    inhalation: string;
    skinContact: string;
    eyeContact: string;
    ingestion: string;
    acuteSymptoms: string[];
    delayedSymptoms: string[];
    medicalAttention: string;
  };
  fireFighting: {
    suitableExtinguishingMedia: string[];
    unsuitableExtinguishingMedia: string[];
    specificHazards: string[];
    protectiveEquipment: string;
    specialProcedures: string;
  };
  accidentalRelease: {
    personalPrecautions: string[];
    protectiveEquipment: string;
    emergencyProcedures: string;
    environmentalPrecautions: string[];
    containmentMethods: string[];
    cleanupMethods: string[];
  };
  handlingAndStorage: {
    safeHandling: string[];
    hygieneRequirements: string[];
    storageConditions: string[];
    incompatibilities: string[];
    temperatureGuidance: string;
    ventilationRequirements: string;
  };
  exposureControls: {
    occupationalExposureLimits: Array<{ agency: string; value: string }>;
    biologicalExposureIndices: string;
    engineeringControls: string[];
    ppe: {
      eyeFace: string;
      skin: string;
      respiratory: string;
      body: string;
    };
    generalHygiene: string;
  };
  physicalChemicalProperties: {
    appearance: string;
    odor: string;
    odorThreshold: string;
    ph: string;
    meltingPoint: string;
    boilingPoint: string;
    flashPoint: string;
    evaporationRate: string;
    flammability: string;
    upperExplosiveLimit: string;
    lowerExplosiveLimit: string;
    vaporPressure: string;
    vaporDensity: string;
    relativeDensity: string;
    solubility: string;
    partitionCoefficient: string;
    autoIgnitionTemperature: string;
    decompositionTemperature: string;
    viscosity: string;
    molecularWeight: string;
    molecularFormula: string;
  };
  stabilityReactivity: {
    chemicalStability: string;
    possibilityOfHazardousReactions: string;
    conditionsToAvoid: string[];
    incompatibleMaterials: string[];
    hazardousDecompositionProducts: string[];
  };
  toxicologicalInformation: {
    routesOfExposure: string[];
    acuteToxicity: {
      oral: string;
      dermal: string;
      inhalation: string;
    };
    skinCorrosionIrritation: string;
    eyeDamageIrritation: string;
    respiratorySkinSensitization: string;
    germCellMutagenicity: string;
    carcinogenicity: {
      status: string;
      agencies: Array<{ agency: string; classification: string }>;
    };
    reproductiveToxicity: string;
    stotSingleExposure: string;
    stotRepeatedExposure: string;
    aspirationHazard: string;
  };
  ecologicalInformation: {
    ecotoxicity: Array<{ organism: string; value: string }>;
    persistenceAndDegradability: string;
    bioaccumulativePotential: string;
    mobilityInSoil: string;
    otherAdverseEffects: string;
  };
  disposalConsiderations: {
    disposalMethods: string[];
    wasteClassification: string;
    contaminatedPackaging: string;
  };
  transportInformation: {
    unNumber: string;
    properShippingName: string;
    hazardClass: string;
    packingGroup: string;
    environmentalHazards: string;
    specialPrecautions: string[];
    transportByMode: {
      dot: string;
      imdg: string;
      iata: string;
      tdg: string;
    };
    limitedQuantity: string;
  };
  regulatoryInformation: {
    usaRegulations: Array<{ regulation: string; status: string }>;
    stateRegulations: Array<{ state: string; status: string }>;
    internationalRegulations: Array<{ regulation: string; status: string }>;
  };
  otherInformation: {
    dateOfPreparation: string;
    lastRevisionDate: string;
    revisionNumber: string;
    revisionHistory: Array<{ version: string; date: string; changes: string }>;
    preparedBy: string;
    contactInfo: string;
    disclaimer: string;
    abbreviations: string[];
    references: string[];
  };
}

// Generate default data for SDSs that don't have full data defined
function generateDefaultFullData(sds: SDSDocument): FullSDSData {
  return {
    identification: {
      productName: sds.product,
      productCode: sds.productCode || "N/A",
      manufacturer: {
        name: sds.manufacturer,
        address: "123 Industrial Way",
        city: "Safety City",
        state: "TX",
        zip: "77001",
        country: "USA",
        phone: "+1 (800) 555-0100",
        fax: "+1 (800) 555-0101",
        email: `info@${sds.manufacturer.toLowerCase().replace(/\s+/g, "")}.com`,
        website: `www.${sds.manufacturer.toLowerCase().replace(/\s+/g, "")}.com`
      },
      emergencyPhone: "CHEMTREC: 1-800-424-9300 (24 hours)",
      recommendedUse: "Industrial and professional use",
      restrictionsOnUse: "Use only as directed. Follow all applicable regulations."
    },
    hazardIdentification: {
      ghsClassification: sds.hazardStatements.map((_, i) => `Hazard Category ${i + 1}`),
      signalWord: sds.signalWord,
      hazardStatements: sds.hazardStatements.map((s, i) => `H${300 + i}: ${s}`),
      precautionaryStatements: {
        prevention: [
          "P210: Keep away from heat, sparks, open flames.",
          "P280: Wear protective gloves/protective clothing/eye protection."
        ],
        response: [
          "P301+P310: IF SWALLOWED: Immediately call a POISON CENTER.",
          "P303+P361+P353: IF ON SKIN: Remove/Take off immediately all contaminated clothing."
        ],
        storage: [
          "P403+P233: Store in a well-ventilated place. Keep container tightly closed.",
          "P405: Store locked up."
        ],
        disposal: [
          "P501: Dispose of contents/container in accordance with regulations."
        ]
      },
      otherHazards: ["May be harmful if swallowed or inhaled."]
    },
    composition: {
      substanceOrMixture: "Substance",
      ingredients: [{
        chemicalName: sds.product,
        commonName: sds.product,
        casNumber: sds.casNumber || "N/A",
        ecNumber: "N/A",
        concentration: "99%",
        classification: "See Section 2"
      }],
      impurities: [{ name: "Water", concentration: "< 1%" }]
    },
    firstAid: {
      inhalation: sds.firstAid.inhalation,
      skinContact: sds.firstAid.skin,
      eyeContact: sds.firstAid.eyes,
      ingestion: "Do NOT induce vomiting. Rinse mouth with water. Seek medical attention.",
      acuteSymptoms: ["Irritation", "Discomfort"],
      delayedSymptoms: ["Prolonged exposure may cause chronic effects"],
      medicalAttention: "Treat symptomatically. Contact a physician for treatment advice."
    },
    fireFighting: {
      suitableExtinguishingMedia: ["Carbon dioxide", "Dry chemical", "Foam", "Water spray"],
      unsuitableExtinguishingMedia: ["Water jet (may spread fire)"],
      specificHazards: ["May produce toxic fumes when burning"],
      protectiveEquipment: "Wear self-contained breathing apparatus and full protective gear.",
      specialProcedures: "Cool containers with water spray. Evacuate area."
    },
    accidentalRelease: {
      personalPrecautions: ["Evacuate area", "Remove ignition sources", "Ventilate area"],
      protectiveEquipment: "Wear appropriate PPE as specified in Section 8.",
      emergencyProcedures: "Isolate spill area. Keep unauthorized personnel away.",
      environmentalPrecautions: ["Prevent entry into drains and waterways"],
      containmentMethods: ["Contain with inert material", "Use spark-proof tools"],
      cleanupMethods: ["Absorb with inert material", "Dispose according to regulations"]
    },
    handlingAndStorage: {
      safeHandling: sds.storageHandling?.handling || ["Handle with care", "Use proper PPE"],
      hygieneRequirements: ["Wash hands after handling", "Do not eat or drink while handling"],
      storageConditions: sds.storageHandling?.storage || ["Store in cool, dry place", "Keep container closed"],
      incompatibilities: ["Strong oxidizers", "Strong acids", "Strong bases"],
      temperatureGuidance: "Store at 15-25°C (59-77°F)",
      ventilationRequirements: "Use adequate ventilation."
    },
    exposureControls: {
      occupationalExposureLimits: [
        { agency: "OSHA PEL", value: "See OSHA regulations" },
        { agency: "ACGIH TLV", value: "See ACGIH guidelines" }
      ],
      biologicalExposureIndices: "Not established",
      engineeringControls: ["Use local exhaust ventilation", "Ensure adequate ventilation"],
      ppe: {
        eyeFace: sds.ppe.filter(p => p.toLowerCase().includes("eye") || p.toLowerCase().includes("face") || p.toLowerCase().includes("glass")).join(", ") || "Safety glasses",
        skin: sds.ppe.filter(p => p.toLowerCase().includes("glove")).join(", ") || "Chemical-resistant gloves",
        respiratory: sds.ppe.filter(p => p.toLowerCase().includes("respirator") || p.toLowerCase().includes("mask")).join(", ") || "Use in well-ventilated area",
        body: sds.ppe.filter(p => p.toLowerCase().includes("clothing") || p.toLowerCase().includes("coat") || p.toLowerCase().includes("apron")).join(", ") || "Protective clothing"
      },
      generalHygiene: "Wash hands before breaks and at end of workday."
    },
    physicalChemicalProperties: {
      appearance: sds.appearance,
      odor: "Characteristic",
      odorThreshold: "Not determined",
      ph: sds.phValue,
      meltingPoint: "Not determined",
      boilingPoint: "Not determined",
      flashPoint: sds.flashPoint,
      evaporationRate: "Not determined",
      flammability: sds.pictograms.includes("Flame") ? "Flammable" : "Not flammable",
      upperExplosiveLimit: "Not determined",
      lowerExplosiveLimit: "Not determined",
      vaporPressure: "Not determined",
      vaporDensity: "Not determined",
      relativeDensity: "Not determined",
      solubility: "Not determined",
      partitionCoefficient: "Not determined",
      autoIgnitionTemperature: "Not determined",
      decompositionTemperature: "Not determined",
      viscosity: "Not determined",
      molecularWeight: "Not determined",
      molecularFormula: "N/A"
    },
    stabilityReactivity: {
      chemicalStability: "Stable under normal conditions.",
      possibilityOfHazardousReactions: "None known under normal conditions.",
      conditionsToAvoid: ["Heat", "Flames", "Sparks", "Incompatible materials"],
      incompatibleMaterials: ["Strong oxidizers", "Strong acids", "Strong bases"],
      hazardousDecompositionProducts: ["Carbon oxides", "Other toxic fumes"]
    },
    toxicologicalInformation: {
      routesOfExposure: ["Inhalation", "Skin contact", "Eye contact", "Ingestion"],
      acuteToxicity: {
        oral: "Not determined",
        dermal: "Not determined",
        inhalation: "Not determined"
      },
      skinCorrosionIrritation: sds.pictograms.includes("Corrosion") ? "Corrosive to skin" : "May cause irritation",
      eyeDamageIrritation: "May cause eye irritation",
      respiratorySkinSensitization: "Not classified",
      germCellMutagenicity: "Not classified",
      carcinogenicity: {
        status: "Not classified",
        agencies: [
          { agency: "IARC", classification: "Not listed" },
          { agency: "NTP", classification: "Not listed" }
        ]
      },
      reproductiveToxicity: "Not classified",
      stotSingleExposure: "See Section 2 for hazard statements",
      stotRepeatedExposure: "Not classified",
      aspirationHazard: "Not classified"
    },
    ecologicalInformation: {
      ecotoxicity: [{ organism: "Aquatic organisms", value: "Not determined" }],
      persistenceAndDegradability: "Not determined",
      bioaccumulativePotential: "Not determined",
      mobilityInSoil: "Not determined",
      otherAdverseEffects: "Prevent release to environment."
    },
    disposalConsiderations: {
      disposalMethods: ["Dispose according to local/regional/national regulations"],
      wasteClassification: "Check local regulations for waste classification.",
      contaminatedPackaging: "Empty containers should be disposed as hazardous waste."
    },
    transportInformation: {
      unNumber: "See transport regulations",
      properShippingName: sds.product,
      hazardClass: sds.pictograms.includes("Flame") ? "3" : "N/A",
      packingGroup: "II",
      environmentalHazards: sds.pictograms.includes("Environment") ? "Marine pollutant" : "Not classified",
      specialPrecautions: ["Keep container closed", "Protect from damage"],
      transportByMode: {
        dot: "See regulations",
        imdg: "See regulations",
        iata: "See regulations",
        tdg: "See regulations"
      },
      limitedQuantity: "See regulations"
    },
    regulatoryInformation: {
      usaRegulations: [
        { regulation: "TSCA", status: "Listed" },
        { regulation: "OSHA", status: "May be regulated" }
      ],
      stateRegulations: [
        { state: "California Prop 65", status: "Check current listing" }
      ],
      internationalRegulations: [
        { regulation: "GHS", status: "Classified according to GHS" }
      ]
    },
    otherInformation: {
      dateOfPreparation: sds.revisionDate,
      lastRevisionDate: sds.revisionDate,
      revisionNumber: "1.0",
      revisionHistory: [
        { version: "1.0", date: sds.revisionDate, changes: "Initial release" }
      ],
      preparedBy: `${sds.manufacturer} Safety Department`,
      contactInfo: `Contact ${sds.manufacturer} for more information`,
      disclaimer: "The information provided in this Safety Data Sheet is correct to the best of our knowledge. The information is provided as a guide for safe handling and is not to be considered a warranty.",
      abbreviations: [
        "CAS - Chemical Abstracts Service",
        "GHS - Globally Harmonized System",
        "PPE - Personal Protective Equipment"
      ],
      references: ["OSHA 29 CFR 1910.1200"]
    }
  };
}

// Section Header Component
function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-blue-600">
      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );
}

// Info Row Component
function InfoRow({ label, value, className = "" }: { label: string; value: string | React.ReactNode; className?: string }) {
  return (
    <div className={`flex py-1.5 ${className}`}>
      <span className="text-sm font-medium text-gray-600 w-48 flex-shrink-0">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

// Bullet List Component
function BulletList({ items, color = "gray" }: { items: string[]; color?: "gray" | "red" | "blue" | "green" | "amber" }) {
  const colors = {
    gray: "text-gray-500",
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    amber: "text-amber-500"
  };
  
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-800">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors[color].replace("text-", "bg-")}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function FullSDSModal({ sds, isOpen, onClose }: FullSDSModalProps) {
  if (!sds || !isOpen) return null;

  // Get full data for this SDS, or generate default
  const fullData = FULL_SDS_DATA[sds.id] || generateDefaultFullData(sds);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold">Safety Data Sheet</h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    fullData.hazardIdentification.signalWord === "Danger"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}>
                    {fullData.hazardIdentification.signalWord}
                  </span>
                </div>
                <p className="text-blue-100 text-sm">{fullData.identification.productName}</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Pictograms in header */}
                <div className="bg-white/10 rounded-lg p-2">
                  <GHSPictogramList pictograms={sds.pictograms} size="md" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Section 1: Identification */}
            <section>
              <SectionHeader number={1} title="IDENTIFICATION" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <InfoRow label="Product Name" value={<span className="font-semibold">{fullData.identification.productName}</span>} />
                  <InfoRow label="Product Code" value={fullData.identification.productCode} />
                  <InfoRow label="Recommended Use" value={fullData.identification.recommendedUse} />
                  <InfoRow label="Restrictions" value={fullData.identification.restrictionsOnUse} />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Manufacturer/Supplier</h4>
                  <p className="text-sm font-medium text-gray-900">{fullData.identification.manufacturer.name}</p>
                  <p className="text-sm text-gray-600">{fullData.identification.manufacturer.address}</p>
                  <p className="text-sm text-gray-600">{fullData.identification.manufacturer.city}, {fullData.identification.manufacturer.state} {fullData.identification.manufacturer.zip}</p>
                  <p className="text-sm text-gray-600">{fullData.identification.manufacturer.country}</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm"><span className="font-medium">Phone:</span> {fullData.identification.manufacturer.phone}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {fullData.identification.manufacturer.email}</p>
                  </div>
                  <div className="mt-3 p-2 bg-red-100 rounded border border-red-200">
                    <p className="text-sm font-bold text-red-800">EMERGENCY: {fullData.identification.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Hazard Identification */}
            <section>
              <SectionHeader number={2} title="HAZARD(S) IDENTIFICATION" />
              <div className="space-y-4">
                <div className="flex flex-wrap items-start gap-4 mb-6">
                  <span className={`px-4 py-2 rounded-lg text-lg font-bold uppercase flex-shrink-0 ${
                    fullData.hazardIdentification.signalWord === "Danger"
                      ? "bg-red-600 text-white"
                      : "bg-amber-500 text-white"
                  }`}>
                    {fullData.hazardIdentification.signalWord}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <GHSPictogramList pictograms={sds.pictograms} size="md" showLabels />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">GHS Classification</h4>
                  <BulletList items={fullData.hazardIdentification.ghsClassification} color="red" />
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Hazard Statements</h4>
                  <BulletList items={fullData.hazardIdentification.hazardStatements} color="red" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Prevention</h4>
                    <BulletList items={fullData.hazardIdentification.precautionaryStatements.prevention} color="blue" />
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Response</h4>
                    <BulletList items={fullData.hazardIdentification.precautionaryStatements.response} color="green" />
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">Storage</h4>
                    <BulletList items={fullData.hazardIdentification.precautionaryStatements.storage} color="amber" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Disposal</h4>
                    <BulletList items={fullData.hazardIdentification.precautionaryStatements.disposal} color="gray" />
                  </div>
                </div>
                
                {fullData.hazardIdentification.otherHazards.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Other Hazards</h4>
                    <BulletList items={fullData.hazardIdentification.otherHazards} />
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Composition */}
            <section>
              <SectionHeader number={3} title="COMPOSITION / INFORMATION ON INGREDIENTS" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-2 font-semibold">Chemical Name</th>
                      <th className="text-left px-4 py-2 font-semibold">Common Name</th>
                      <th className="text-left px-4 py-2 font-semibold">CAS No.</th>
                      <th className="text-left px-4 py-2 font-semibold">EC No.</th>
                      <th className="text-left px-4 py-2 font-semibold">Concentration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullData.composition.ingredients.map((ing, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="px-4 py-2">{ing.chemicalName}</td>
                        <td className="px-4 py-2">{ing.commonName}</td>
                        <td className="px-4 py-2 font-mono">{ing.casNumber}</td>
                        <td className="px-4 py-2 font-mono">{ing.ecNumber}</td>
                        <td className="px-4 py-2">{ing.concentration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fullData.composition.impurities.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Impurities</h4>
                  <div className="flex gap-4">
                    {fullData.composition.impurities.map((imp, i) => (
                      <span key={i} className="text-sm text-gray-600">{imp.name}: {imp.concentration}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Section 4: First-Aid Measures */}
            <section>
              <SectionHeader number={4} title="FIRST-AID MEASURES" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-bold text-blue-900 uppercase">Eye Contact</span>
                  </div>
                  <p className="text-sm text-blue-800">{fullData.firstAid.eyeContact}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    <span className="font-bold text-blue-900 uppercase">Skin Contact</span>
                  </div>
                  <p className="text-sm text-blue-800">{fullData.firstAid.skinContact}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className="font-bold text-blue-900 uppercase">Inhalation</span>
                  </div>
                  <p className="text-sm text-blue-800">{fullData.firstAid.inhalation}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-blue-900 uppercase">Ingestion</span>
                  </div>
                  <p className="text-sm text-blue-800">{fullData.firstAid.ingestion}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Acute Symptoms</h4>
                  <BulletList items={fullData.firstAid.acuteSymptoms} color="red" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delayed Symptoms</h4>
                  <BulletList items={fullData.firstAid.delayedSymptoms} color="amber" />
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900"><span className="font-semibold">Medical Attention:</span> {fullData.firstAid.medicalAttention}</p>
              </div>
            </section>

            {/* Section 5: Fire-Fighting Measures */}
            <section>
              <SectionHeader number={5} title="FIRE-FIGHTING MEASURES" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Suitable Extinguishing Media</h4>
                  <BulletList items={fullData.fireFighting.suitableExtinguishingMedia} color="green" />
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Unsuitable Extinguishing Media</h4>
                  <BulletList items={fullData.fireFighting.unsuitableExtinguishingMedia} color="red" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Specific Hazards from Combustion</h4>
                <BulletList items={fullData.fireFighting.specificHazards} color="amber" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Protective Equipment for Firefighters</h4>
                  <p className="text-sm text-gray-800">{fullData.fireFighting.protectiveEquipment}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Procedures</h4>
                  <p className="text-sm text-gray-800">{fullData.fireFighting.specialProcedures}</p>
                </div>
              </div>
            </section>

            {/* Section 6: Accidental Release */}
            <section>
              <SectionHeader number={6} title="ACCIDENTAL RELEASE MEASURES" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Precautions</h4>
                  <BulletList items={fullData.accidentalRelease.personalPrecautions} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Environmental Precautions</h4>
                  <BulletList items={fullData.accidentalRelease.environmentalPrecautions} color="green" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Containment Methods</h4>
                  <BulletList items={fullData.accidentalRelease.containmentMethods} color="blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cleanup Methods</h4>
                  <BulletList items={fullData.accidentalRelease.cleanupMethods} color="amber" />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900"><span className="font-semibold">Protective Equipment:</span> {fullData.accidentalRelease.protectiveEquipment}</p>
              </div>
            </section>

            {/* Section 7: Handling and Storage */}
            <section>
              <SectionHeader number={7} title="HANDLING AND STORAGE" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Safe Handling Practices</h4>
                  <BulletList items={fullData.handlingAndStorage.safeHandling} color="amber" />
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Storage Conditions</h4>
                  <BulletList items={fullData.handlingAndStorage.storageConditions} color="blue" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Incompatibilities</h4>
                  <BulletList items={fullData.handlingAndStorage.incompatibilities} color="red" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Temperature Guidance</h4>
                  <p className="text-sm text-gray-800">{fullData.handlingAndStorage.temperatureGuidance}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ventilation</h4>
                  <p className="text-sm text-gray-800">{fullData.handlingAndStorage.ventilationRequirements}</p>
                </div>
              </div>
            </section>

            {/* Section 8: Exposure Controls / Personal Protection */}
            <section>
              <SectionHeader number={8} title="EXPOSURE CONTROLS / PERSONAL PROTECTION" />
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-2 font-semibold">Agency</th>
                      <th className="text-left px-4 py-2 font-semibold">Exposure Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullData.exposureControls.occupationalExposureLimits.map((limit, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="px-4 py-2 font-medium">{limit.agency}</td>
                        <td className="px-4 py-2">{limit.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Engineering Controls</h4>
                <BulletList items={fullData.exposureControls.engineeringControls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">PPE Requirements</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase">Eye/Face Protection</p>
                      <p className="text-sm text-green-900">{fullData.exposureControls.ppe.eyeFace}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase">Skin Protection</p>
                      <p className="text-sm text-green-900">{fullData.exposureControls.ppe.skin}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase">Respiratory Protection</p>
                      <p className="text-sm text-green-900">{fullData.exposureControls.ppe.respiratory}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-800 uppercase">Body Protection</p>
                      <p className="text-sm text-green-900">{fullData.exposureControls.ppe.body}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Biological Exposure Indices</h4>
                  <p className="text-sm text-gray-800 mb-4">{fullData.exposureControls.biologicalExposureIndices}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">General Hygiene</h4>
                  <p className="text-sm text-gray-800">{fullData.exposureControls.generalHygiene}</p>
                </div>
              </div>
            </section>

            {/* Section 9: Physical and Chemical Properties */}
            <section>
              <SectionHeader number={9} title="PHYSICAL AND CHEMICAL PROPERTIES" />
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Appearance", value: fullData.physicalChemicalProperties.appearance },
                  { label: "Odor", value: fullData.physicalChemicalProperties.odor },
                  { label: "Odor Threshold", value: fullData.physicalChemicalProperties.odorThreshold },
                  { label: "pH", value: fullData.physicalChemicalProperties.ph },
                  { label: "Melting Point", value: fullData.physicalChemicalProperties.meltingPoint },
                  { label: "Boiling Point", value: fullData.physicalChemicalProperties.boilingPoint },
                  { label: "Flash Point", value: fullData.physicalChemicalProperties.flashPoint },
                  { label: "Evaporation Rate", value: fullData.physicalChemicalProperties.evaporationRate },
                  { label: "Flammability", value: fullData.physicalChemicalProperties.flammability },
                  { label: "Upper Explosive Limit", value: fullData.physicalChemicalProperties.upperExplosiveLimit },
                  { label: "Lower Explosive Limit", value: fullData.physicalChemicalProperties.lowerExplosiveLimit },
                  { label: "Vapor Pressure", value: fullData.physicalChemicalProperties.vaporPressure },
                  { label: "Vapor Density", value: fullData.physicalChemicalProperties.vaporDensity },
                  { label: "Relative Density", value: fullData.physicalChemicalProperties.relativeDensity },
                  { label: "Solubility", value: fullData.physicalChemicalProperties.solubility },
                  { label: "Partition Coefficient", value: fullData.physicalChemicalProperties.partitionCoefficient },
                  { label: "Auto-Ignition Temp", value: fullData.physicalChemicalProperties.autoIgnitionTemperature },
                  { label: "Decomposition Temp", value: fullData.physicalChemicalProperties.decompositionTemperature },
                  { label: "Viscosity", value: fullData.physicalChemicalProperties.viscosity },
                  { label: "Molecular Weight", value: fullData.physicalChemicalProperties.molecularWeight },
                  { label: "Molecular Formula", value: fullData.physicalChemicalProperties.molecularFormula },
                ].map((prop, i) => (
                  <div key={i} className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-purple-600 mb-1">{prop.label}</p>
                    <p className="text-sm font-semibold text-purple-900">{prop.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 10: Stability and Reactivity */}
            <section>
              <SectionHeader number={10} title="STABILITY AND REACTIVITY" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chemical Stability</h4>
                  <p className="text-sm text-gray-800">{fullData.stabilityReactivity.chemicalStability}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Possibility of Hazardous Reactions</h4>
                  <p className="text-sm text-gray-800">{fullData.stabilityReactivity.possibilityOfHazardousReactions}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conditions to Avoid</h4>
                  <BulletList items={fullData.stabilityReactivity.conditionsToAvoid} color="amber" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Incompatible Materials</h4>
                  <BulletList items={fullData.stabilityReactivity.incompatibleMaterials} color="red" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Hazardous Decomposition Products</h4>
                <BulletList items={fullData.stabilityReactivity.hazardousDecompositionProducts} />
              </div>
            </section>

            {/* Section 11: Toxicological Information */}
            <section>
              <SectionHeader number={11} title="TOXICOLOGICAL INFORMATION" />
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Routes of Exposure</h4>
                <div className="flex gap-2">
                  {fullData.toxicologicalInformation.routesOfExposure.map((route, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{route}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 mb-1">Acute Toxicity (Oral)</p>
                  <p className="text-sm font-semibold text-red-900">{fullData.toxicologicalInformation.acuteToxicity.oral}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 mb-1">Acute Toxicity (Dermal)</p>
                  <p className="text-sm font-semibold text-red-900">{fullData.toxicologicalInformation.acuteToxicity.dermal}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 mb-1">Acute Toxicity (Inhalation)</p>
                  <p className="text-sm font-semibold text-red-900">{fullData.toxicologicalInformation.acuteToxicity.inhalation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Skin Corrosion/Irritation" value={fullData.toxicologicalInformation.skinCorrosionIrritation} />
                <InfoRow label="Eye Damage/Irritation" value={fullData.toxicologicalInformation.eyeDamageIrritation} />
                <InfoRow label="Sensitization" value={fullData.toxicologicalInformation.respiratorySkinSensitization} />
                <InfoRow label="Germ Cell Mutagenicity" value={fullData.toxicologicalInformation.germCellMutagenicity} />
                <InfoRow label="Reproductive Toxicity" value={fullData.toxicologicalInformation.reproductiveToxicity} />
                <InfoRow label="Aspiration Hazard" value={fullData.toxicologicalInformation.aspirationHazard} />
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Carcinogenicity</h4>
                <p className="text-sm text-gray-800 mb-2">{fullData.toxicologicalInformation.carcinogenicity.status}</p>
                <div className="flex gap-4">
                  {fullData.toxicologicalInformation.carcinogenicity.agencies.map((agency, i) => (
                    <span key={i} className="text-sm"><span className="font-medium">{agency.agency}:</span> {agency.classification}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 12: Ecological Information */}
            <section>
              <SectionHeader number={12} title="ECOLOGICAL INFORMATION" />
              <p className="text-xs text-gray-500 italic mb-4">Note: This section is non-mandatory under OSHA but recommended.</p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Ecotoxicity</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-4 py-2 font-semibold">Test Organism</th>
                        <th className="text-left px-4 py-2 font-semibold">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fullData.ecologicalInformation.ecotoxicity.map((test, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          <td className="px-4 py-2">{test.organism}</td>
                          <td className="px-4 py-2">{test.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Persistence/Degradability" value={fullData.ecologicalInformation.persistenceAndDegradability} />
                <InfoRow label="Bioaccumulation Potential" value={fullData.ecologicalInformation.bioaccumulativePotential} />
                <InfoRow label="Mobility in Soil" value={fullData.ecologicalInformation.mobilityInSoil} />
                <InfoRow label="Other Adverse Effects" value={fullData.ecologicalInformation.otherAdverseEffects} />
              </div>
            </section>

            {/* Section 13: Disposal Considerations */}
            <section>
              <SectionHeader number={13} title="DISPOSAL CONSIDERATIONS" />
              <p className="text-xs text-gray-500 italic mb-4">Note: This section is non-mandatory under OSHA but recommended.</p>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Disposal Methods</h4>
                <BulletList items={fullData.disposalConsiderations.disposalMethods} />
              </div>
              <InfoRow label="Waste Classification" value={fullData.disposalConsiderations.wasteClassification} />
              <InfoRow label="Contaminated Packaging" value={fullData.disposalConsiderations.contaminatedPackaging} className="mt-2" />
            </section>

            {/* Section 14: Transport Information */}
            <section>
              <SectionHeader number={14} title="TRANSPORT INFORMATION" />
              <p className="text-xs text-gray-500 italic mb-4">Note: This section is non-mandatory under OSHA but recommended.</p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">UN Number</p>
                  <p className="text-lg font-bold text-amber-900">{fullData.transportInformation.unNumber}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">Hazard Class</p>
                  <p className="text-lg font-bold text-amber-900">{fullData.transportInformation.hazardClass}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">Packing Group</p>
                  <p className="text-lg font-bold text-amber-900">{fullData.transportInformation.packingGroup}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">Limited Quantity</p>
                  <p className="text-lg font-bold text-amber-900">{fullData.transportInformation.limitedQuantity}</p>
                </div>
              </div>
              <InfoRow label="Proper Shipping Name" value={fullData.transportInformation.properShippingName} />
              <InfoRow label="Environmental Hazards" value={fullData.transportInformation.environmentalHazards} className="mt-2" />
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Transport by Mode</h4>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(fullData.transportInformation.transportByMode).map(([mode, value]) => (
                    <div key={mode} className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500 uppercase">{mode}</p>
                      <p className="text-xs text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 15: Regulatory Information */}
            <section>
              <SectionHeader number={15} title="REGULATORY INFORMATION" />
              <p className="text-xs text-gray-500 italic mb-4">Note: This section is non-mandatory under OSHA but recommended.</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">USA Regulations</h4>
                  <div className="space-y-1">
                    {fullData.regulatoryInformation.usaRegulations.map((reg, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{reg.regulation}:</span> <span className="text-gray-600">{reg.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">State Regulations</h4>
                  <div className="space-y-1">
                    {fullData.regulatoryInformation.stateRegulations.map((reg, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{reg.state}:</span> <span className="text-gray-600">{reg.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">International Regulations</h4>
                  <div className="space-y-1">
                    {fullData.regulatoryInformation.internationalRegulations.map((reg, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{reg.regulation}:</span> <span className="text-gray-600">{reg.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 16: Other Information */}
            <section>
              <SectionHeader number={16} title="OTHER INFORMATION" />
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Date of Preparation</p>
                  <p className="text-sm font-semibold text-blue-900">{fullData.otherInformation.dateOfPreparation}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Last Revision Date</p>
                  <p className="text-sm font-semibold text-blue-900">{fullData.otherInformation.lastRevisionDate}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Revision Number</p>
                  <p className="text-sm font-semibold text-blue-900">{fullData.otherInformation.revisionNumber}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Revision History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-4 py-2 font-semibold">Version</th>
                        <th className="text-left px-4 py-2 font-semibold">Date</th>
                        <th className="text-left px-4 py-2 font-semibold">Changes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fullData.otherInformation.revisionHistory.map((rev, i) => (
                        <tr key={i} className="border-b border-gray-200">
                          <td className="px-4 py-2 font-medium">{rev.version}</td>
                          <td className="px-4 py-2">{rev.date}</td>
                          <td className="px-4 py-2">{rev.changes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InfoRow label="Prepared By" value={fullData.otherInformation.preparedBy} />
                <InfoRow label="Contact Information" value={fullData.otherInformation.contactInfo} />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Disclaimer</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{fullData.otherInformation.disclaimer}</p>
              </div>

              <details className="mb-4">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">Abbreviations (click to expand)</summary>
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
                  {fullData.otherInformation.abbreviations.map((abbr, i) => (
                    <span key={i}>{abbr}</span>
                  ))}
                </div>
              </details>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">References</h4>
                <BulletList items={fullData.otherInformation.references} />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="text-sm text-gray-500">
              <span className="font-medium">SDS Revision:</span> {fullData.otherInformation.revisionNumber} | 
              <span className="ml-2 font-medium">Last Updated:</span> {fullData.otherInformation.lastRevisionDate}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
