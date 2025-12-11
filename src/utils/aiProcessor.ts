/**
 * AI Processor - Keyword-based rules for extracting field values from text
 * 
 * This is a stubbed frontend-only implementation for the prototype.
 * In production, this would call a backend AI service.
 */

export interface AISuggestion {
  fieldId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  confidence: number;
}

/**
 * Process text input and return AI suggestions based on keyword matching
 */
export function processAIText(text: string): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const lowerText = text.toLowerCase();

  // Title extraction - look for short descriptive phrases
  const titleMatch = lowerText.match(/(?:i had|there was|a|an)\s+([^.!?]{10,60})/);
  if (titleMatch) {
    const title = titleMatch[1].trim().charAt(0).toUpperCase() + titleMatch[1].trim().slice(1);
    if (title.length > 5 && title.length < 100) {
      suggestions.push({ fieldId: "title", value: title, confidence: 0.75 });
    }
  }

  // Location detection
  if (lowerText.match(/\b(warehouse|factory|plant|office|building|site|location)\s+([a-z]+)/i)) {
    const locationMatch = lowerText.match(/\b(warehouse|factory|plant|office|building|site)\s+([a-z]+)/i);
    if (locationMatch) {
      suggestions.push({ 
        fieldId: "location", 
        value: locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1), 
        confidence: 0.8 
      });
    }
  }

  // Hazard Category rules
  if (lowerText.includes("slip") || lowerText.includes("wet") || lowerText.includes("fall") || lowerText.includes("trip")) {
    suggestions.push({ fieldId: "hazard", value: "Slip/Trip/Fall", confidence: 0.9 });
  }
  if (lowerText.includes("electrical") || lowerText.includes("shock") || lowerText.includes("wire")) {
    suggestions.push({ fieldId: "hazard", value: "Electrical", confidence: 0.85 });
  }
  if (lowerText.includes("chemical") || lowerText.includes("spill") || lowerText.includes("exposure")) {
    suggestions.push({ fieldId: "hazard", value: "Chemical", confidence: 0.85 });
  }
  if (lowerText.includes("ergonomic") || lowerText.includes("strain") || lowerText.includes("repetitive")) {
    suggestions.push({ fieldId: "hazard", value: "Ergonomic", confidence: 0.8 });
  }

  // Severity rules
  if (lowerText.includes("serious") || lowerText.includes("severe") || lowerText.includes("fracture") || lowerText.includes("broken") || lowerText.includes("hospital")) {
    suggestions.push({ fieldId: "severity", value: "High", confidence: 0.85 });
  } else if (lowerText.includes("bruise") || lowerText.includes("minor") || lowerText.includes("small")) {
    suggestions.push({ fieldId: "severity", value: "Medium", confidence: 0.75 });
  } else if (lowerText.includes("low") || lowerText.includes("slight")) {
    suggestions.push({ fieldId: "severity", value: "Low", confidence: 0.7 });
  }

  // Injury Type rules
  if (lowerText.includes("sprain") || lowerText.includes("twist")) {
    suggestions.push({ fieldId: "injuryType", value: "Sprain", confidence: 0.85 });
  }
  if (lowerText.includes("cut") || lowerText.includes("laceration") || lowerText.includes("bleed")) {
    suggestions.push({ fieldId: "injuryType", value: "Laceration", confidence: 0.85 });
  }
  if (lowerText.includes("fracture") || lowerText.includes("broken") || lowerText.includes("break")) {
    suggestions.push({ fieldId: "injuryType", value: "Fracture", confidence: 0.9 });
  }
  if (lowerText.includes("burn") || lowerText.includes("scald")) {
    suggestions.push({ fieldId: "injuryType", value: "Burn", confidence: 0.85 });
  }

  // Body Part detection
  const bodyPartsMap: Record<string, string> = {
    "head": "Head",
    "arm": "Arm",
    "hand": "Hand",
    "back": "Back",
    "leg": "Leg",
    "foot": "Foot",
    "shoulder": "Arm", // Map shoulder to Arm
    "knee": "Leg", // Map knee to Leg
    "ankle": "Leg", // Map ankle to Leg
    "wrist": "Hand", // Map wrist to Hand
    "finger": "Hand" // Map finger to Hand
  };
  
  const detectedParts: string[] = [];
  Object.entries(bodyPartsMap).forEach(([keyword, mappedPart]) => {
    if (lowerText.includes(keyword) && !detectedParts.includes(mappedPart)) {
      detectedParts.push(mappedPart);
    }
  });
  
  if (detectedParts.length > 0) {
    suggestions.push({ fieldId: "bodyPart", value: detectedParts, confidence: 0.8 });
  }

  // Date/Time extraction (if mentioned)
  const dateMatch = lowerText.match(/\b(today|yesterday|this morning|this afternoon|earlier)\b/);
  if (dateMatch) {
    // For prototype, we'll use current date/time which is already default
    // In production, would parse relative dates
  }

  return suggestions;
}

