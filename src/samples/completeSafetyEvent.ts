/**
 * Complete Sample Safety Event
 * 
 * This file contains a comprehensive sample safety event submission payload
 * that includes every single custom safety report field type available in the system.
 * 
 * Use this as a reference for:
 * - Understanding all available field types
 * - Testing form rendering with all fields
 * - API integration testing
 * - Documentation examples
 */

import type { SubmissionPayload } from "../schemas/types";

/**
 * Complete sample safety event with all field types populated
 * 
 * Field Types Included:
 * - Core fields: title, dateTime, description, type, location
 * - Text fields: location, assets, guestCustomerName, insuranceProvider, etc.
 * - Textarea fields: immediateActions, additionalDetails, rootCause, etc.
 * - Number fields: estimatedQuantityReleased, estimatedDamageCost
 * - Dropdown fields: type, hazard, severity, injuryType, etc.
 * - Multiselect fields: bodyPartAffected, ppeType, environmentalImpactType
 * - Checkbox fields: ppeWorn, medicalAttentionRequired, environmentalImpact, propertyDamage
 * - DateTime fields: supervisorReviewDate
 * - File fields: media (with attachments)
 * - Signature fields: signoffAcknowledgement
 * - GPS Location fields: gpsLocation
 * - Diagram fields: bodyDiagram, sceneDiagram, sketch
 */
export const completeSampleSafetyEvent: SubmissionPayload = {
  templateVersionId: "injury-report",
  system: {
    title: "Comprehensive Safety Event - All Field Types Example",
    dateTime: "2025-01-15T14:30:00",
    type: "Incident",
    location: "Main Manufacturing Facility, Building A, Floor 3",
    description: "This is a comprehensive sample safety event that demonstrates every single custom safety report field type available in the system. The incident involves a worker who slipped on an oil spill near equipment, resulting in minor injuries. All field types are populated with sample data to serve as a reference."
  },
  values: {
    // GPS Location field (gpsLocation)
    gpsLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      timestamp: "2025-01-15T14:30:00Z"
    },
    
    // Text fields
    assets: "Pump Station #42, Conveyor Belt System B",
    guestCustomerName: "Sarah Johnson",
    insuranceProvider: "State Farm Insurance",
    policyNumber: "SF-2024-789456",
    claimNumber: "CLM-2025-001234",
    driversLicenseNumber: "DL-12345678",
    lawyerName: "Robert Martinez",
    reporterName: "John Doe",
    reporterRole: "Safety Manager",
    supervisorName: "Jane Smith",
    
    // Dropdown fields
    hazard: "Slip/Trip/Fall",
    severity: "Medium",
    personType: "Worker",
    injuryType: "Slip / Trip / Fall",
    medicalTreatmentType: "Clinic visit",
    lostTimeRestrictedDuty: "Restricted duty",
    riskRatingPreControl: "High",
    riskRatingPostControl: "Low",
    
    // Textarea fields
    immediateActions: "1. Immediate medical attention provided to injured worker\n2. Area cordoned off with safety barriers\n3. Oil spill cleaned up using absorbent materials\n4. Incident reported to supervisor\n5. Equipment inspection scheduled",
    additionalDetails: "The incident occurred during routine maintenance operations. Weather conditions were normal. The area was well-lit. Multiple witnesses were present and provided statements.",
    immediateCause: "Oil spill on floor due to equipment malfunction. The pump seal failed, causing hydraulic fluid to leak onto the walkway.",
    rootCause: "Lack of preventive maintenance schedule. The pump had not been inspected or serviced in over 18 months, exceeding the recommended 12-month interval.",
    contributingFactors: "Wet conditions from recent cleaning, inadequate warning signage, insufficient lighting in the area, lack of non-slip floor covering",
    guestContactInfo: "Phone: (555) 123-4567\nEmail: sarah.johnson@example.com\nAddress: 123 Main St, City, State 12345",
    lawyerContact: "Law Firm: Martinez & Associates\nPhone: (555) 987-6543\nEmail: r.martinez@lawfirm.com\nAddress: 456 Legal Blvd, Suite 200, City, State 12345",
    
    // Number fields
    estimatedQuantityReleased: 15.5,
    estimatedDamageCost: 12500,
    
    // Multiselect fields
    bodyPartAffected: ["Leg", "Back", "Arm"],
    ppeType: ["Hard Hat", "Safety Boots", "High-Visibility Vest", "Safety Glasses"],
    environmentalImpactType: ["Soil Contamination", "Water Runoff"],
    
    // Checkbox fields
    ppeWorn: true,
    medicalAttentionRequired: true,
    environmentalImpact: true,
    propertyDamage: true,
    
    // DateTime field
    supervisorReviewDate: "2025-01-16T10:00:00",
    
    // Signature field
    signoffAcknowledgement: "Jane Smith",
    
    // File field (media) - actual files would be uploaded, this is just metadata
    media: [
      {
        name: "incident-photo-1.jpg",
        mime: "image/jpeg",
        bytes: 2048000
      },
      {
        name: "incident-photo-2.jpg",
        mime: "image/jpeg",
        bytes: 1856000
      },
      {
        name: "incident-report.pdf",
        mime: "application/pdf",
        bytes: 512000
      }
    ],
    
    // Diagram fields (base64 encoded images)
    // Note: These are placeholder base64 strings. In production, these would be
    // actual base64-encoded PNG/JPEG images from the drawing components
    bodyDiagram: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    sceneDiagram: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA60e6kgAAAABJRU5ErkJggg==",
    sketch: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
  },
  attachments: [
    {
      fieldId: "media",
      name: "incident-photo-1.jpg",
      mime: "image/jpeg",
      bytes: 2048000
    },
    {
      fieldId: "media",
      name: "incident-photo-2.jpg",
      mime: "image/jpeg",
      bytes: 1856000
    },
    {
      fieldId: "media",
      name: "incident-report.pdf",
      mime: "application/pdf",
      bytes: 512000
    }
  ],
  aiConfidence: {
    hazard: 0.95,
    severity: 0.87,
    injuryType: 0.92,
    immediateCause: 0.78
  },
  origin: {
    title: "manual",
    dateTime: "default",
    type: "manual",
    location: "manual",
    description: "manual",
    gpsLocation: "manual",
    assets: "manual",
    hazard: "ai",
    severity: "ai",
    immediateActions: "manual",
    media: "manual",
    additionalDetails: "manual",
    personType: "manual",
    injuryType: "ai",
    bodyPartAffected: "manual",
    ppeWorn: "manual",
    ppeType: "manual",
    medicalAttentionRequired: "manual",
    medicalTreatmentType: "manual",
    lostTimeRestrictedDuty: "manual",
    immediateCause: "ai",
    rootCause: "manual",
    contributingFactors: "manual",
    riskRatingPreControl: "manual",
    riskRatingPostControl: "manual",
    environmentalImpact: "manual",
    environmentalImpactType: "manual",
    estimatedQuantityReleased: "manual",
    propertyDamage: "manual",
    estimatedDamageCost: "manual",
    guestCustomerName: "manual",
    guestContactInfo: "manual",
    insuranceProvider: "manual",
    policyNumber: "manual",
    claimNumber: "manual",
    driversLicenseNumber: "manual",
    lawyerName: "manual",
    lawyerContact: "manual",
    reporterName: "manual",
    reporterRole: "manual",
    supervisorName: "manual",
    supervisorReviewDate: "manual",
    signoffAcknowledgement: "manual",
    bodyDiagram: "manual",
    sceneDiagram: "manual",
    sketch: "manual"
  }
};

/**
 * Field type summary for documentation:
 * 
 * Core System Fields:
 * - title (text, required)
 * - dateTime (datetime, required)
 * - description (textarea, required)
 * - type (dropdown, optional)
 * - location (text, optional)
 * 
 * Custom Field Types:
 * - Text: location, assets, guestCustomerName, insuranceProvider, policyNumber, 
 *         claimNumber, driversLicenseNumber, lawyerName, reporterName, 
 *         reporterRole, supervisorName
 * - Textarea: immediateActions, additionalDetails, immediateCause, rootCause, 
 *             contributingFactors, guestContactInfo, lawyerContact
 * - Number: estimatedQuantityReleased, estimatedDamageCost
 * - Dropdown: type, hazard, severity, personType, injuryType, 
 *             medicalTreatmentType, lostTimeRestrictedDuty, 
 *             riskRatingPreControl, riskRatingPostControl
 * - Multiselect: bodyPartAffected, ppeType, environmentalImpactType
 * - Checkbox: ppeWorn, medicalAttentionRequired, environmentalImpact, propertyDamage
 * - DateTime: supervisorReviewDate
 * - File: media (with attachments array)
 * - Signature: signoffAcknowledgement
 * - GPS Location: gpsLocation (object with latitude, longitude, accuracy, timestamp)
 * - Body Diagram: bodyDiagram (base64 image)
 * - Scene Diagram: sceneDiagram (base64 image)
 * - Sketch: sketch (base64 image)
 */





