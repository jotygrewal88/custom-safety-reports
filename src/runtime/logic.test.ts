import { describe, it, expect } from "vitest";
import { evaluateLogic } from "./logic";
import type { LogicRule, FieldDef } from "../schemas/types";

describe("evaluateLogic", () => {
  const createFieldMap = (fields: FieldDef[]): Map<string, FieldDef> => {
    const map = new Map<string, FieldDef>();
    fields.forEach((f) => map.set(f.id, f));
    return map;
  };

  describe("show + require on boolean", () => {
    it("should show and require a field when boolean is true", () => {
      const fields: FieldDef[] = [
        { id: "medical", label: "Medical Attention Required?", type: "boolean" },
        { id: "hospital", label: "Hospital Name", type: "text", visible: false },
      ];

      const rules: LogicRule[] = [
        {
          id: "l1",
          when: [{ fieldId: "medical", op: "eq", value: true }],
          then: [
            { action: "show", targetId: "hospital" },
            { action: "require", targetId: "hospital" },
          ],
        },
      ];

      const fieldMap = createFieldMap(fields);
      
      // When medical is false
      const resultFalse = evaluateLogic(rules, { medical: false }, fieldMap);
      expect(resultFalse.visibility.get("hospital")).toBe(false);
      expect(resultFalse.required.get("hospital")).toBe(false);

      // When medical is true
      const resultTrue = evaluateLogic(rules, { medical: true }, fieldMap);
      expect(resultTrue.visibility.get("hospital")).toBe(true);
      expect(resultTrue.required.get("hospital")).toBe(true);
    });
  });

  describe("severity=High requires photos", () => {
    it("should require photos field when severity is High", () => {
      const fields: FieldDef[] = [
        { id: "severity", label: "Severity", type: "dropdown", options: ["Low", "Medium", "High"] },
        { id: "photos", label: "Photos/Videos", type: "file" },
      ];

      const rules: LogicRule[] = [
        {
          id: "l2",
          when: [{ fieldId: "severity", op: "eq", value: "High" }],
          then: [{ action: "require", targetId: "photos" }],
        },
      ];

      const fieldMap = createFieldMap(fields);
      
      // When severity is Low
      const resultLow = evaluateLogic(rules, { severity: "Low" }, fieldMap);
      expect(resultLow.required.get("photos")).toBe(false);

      // When severity is Medium
      const resultMedium = evaluateLogic(rules, { severity: "Medium" }, fieldMap);
      expect(resultMedium.required.get("photos")).toBe(false);

      // When severity is High
      const resultHigh = evaluateLogic(rules, { severity: "High" }, fieldMap);
      expect(resultHigh.required.get("photos")).toBe(true);
    });
  });

  describe("hide + optional removes validation error", () => {
    it("should hide field and make it optional when condition is met", () => {
      const fields: FieldDef[] = [
        { id: "showAdvanced", label: "Show Advanced", type: "boolean" },
        { id: "advancedField", label: "Advanced Field", type: "text", required: true },
      ];

      const rules: LogicRule[] = [
        {
          id: "l3",
          when: [{ fieldId: "showAdvanced", op: "eq", value: false }],
          then: [
            { action: "hide", targetId: "advancedField" },
            { action: "optional", targetId: "advancedField" },
          ],
        },
      ];

      const fieldMap = createFieldMap(fields);
      
      // When showAdvanced is true (field should be visible and required)
      const resultTrue = evaluateLogic(rules, { showAdvanced: true }, fieldMap);
      expect(resultTrue.visibility.get("advancedField")).toBe(true);
      expect(resultTrue.required.get("advancedField")).toBe(true);

      // When showAdvanced is false (field should be hidden and optional)
      const resultFalse = evaluateLogic(rules, { showAdvanced: false }, fieldMap);
      expect(resultFalse.visibility.get("advancedField")).toBe(false);
      expect(resultFalse.required.get("advancedField")).toBe(false);
    });

    it("should handle hide winning over show", () => {
      const fields: FieldDef[] = [
        { id: "toggle", label: "Toggle", type: "boolean" },
        { id: "conditional", label: "Conditional Field", type: "text", visible: false },
      ];

      const rules: LogicRule[] = [
        {
          id: "hideRule",
          when: [{ fieldId: "toggle", op: "eq", value: false }],
          then: [{ action: "hide", targetId: "conditional" }],
        },
        {
          id: "showRule",
          when: [{ fieldId: "toggle", op: "eq", value: true }],
          then: [{ action: "show", targetId: "conditional" }],
        },
      ];

      const fieldMap = createFieldMap(fields);
      
      // When toggle is false (hide should win)
      const resultFalse = evaluateLogic(rules, { toggle: false }, fieldMap);
      expect(resultFalse.visibility.get("conditional")).toBe(false);

      // When toggle is true (show should work)
      const resultTrue = evaluateLogic(rules, { toggle: true }, fieldMap);
      expect(resultTrue.visibility.get("conditional")).toBe(true);
    });
  });

  describe("permanent required fields", () => {
    it("should always require title, dateTime, and description", () => {
      const fields: FieldDef[] = [
        { id: "title", label: "Title", type: "text" },
        { id: "dateTime", label: "Date & Time", type: "dateTime" },
        { id: "description", label: "Description", type: "textarea" },
        { id: "toggle", label: "Toggle", type: "boolean" },
      ];

      const rules: LogicRule[] = [
        {
          id: "tryOptional",
          when: [{ fieldId: "toggle", op: "eq", value: true }],
          then: [
            { action: "optional", targetId: "title" },
            { action: "optional", targetId: "dateTime" },
            { action: "optional", targetId: "description" },
          ],
        },
      ];

      const fieldMap = createFieldMap(fields);
      const result = evaluateLogic(rules, { toggle: true }, fieldMap);
      
      // Permanent required fields should always be required
      expect(result.required.get("title")).toBe(true);
      expect(result.required.get("dateTime")).toBe(true);
      expect(result.required.get("description")).toBe(true);
      
      // And always visible
      expect(result.visibility.get("title")).toBe(true);
      expect(result.visibility.get("dateTime")).toBe(true);
      expect(result.visibility.get("description")).toBe(true);
    });
  });

  describe("setValue actions", () => {
    it("should set values when conditions are met", () => {
      const fields: FieldDef[] = [
        { id: "type", label: "Type", type: "dropdown" },
        { id: "defaultLocation", label: "Default Location", type: "text" },
      ];

      const rules: LogicRule[] = [
        {
          id: "setValueRule",
          when: [{ fieldId: "type", op: "eq", value: "Injury" }],
          then: [{ action: "setValue", targetId: "defaultLocation", value: "Plant A" }],
        },
      ];

      const fieldMap = createFieldMap(fields);
      
      // When type is Injury
      const resultInjury = evaluateLogic(rules, { type: "Injury" }, fieldMap);
      expect(resultInjury.setValues.get("defaultLocation")).toBe("Plant A");

      // When type is not Injury
      const resultOther = evaluateLogic(rules, { type: "Near Miss" }, fieldMap);
      expect(resultOther.setValues.has("defaultLocation")).toBe(false);
    });
  });
});









