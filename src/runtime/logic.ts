import type { LogicRule, FieldDef } from "../schemas/types";

export type LogicResult = {
  visibility: Map<string, boolean>;
  required: Map<string, boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValues: Map<string, any>;
};

/**
 * Evaluates a single condition against a field value
 */
function evaluateCondition(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: { fieldId: string; op: "eq" | "ne" | "in" | "gt" | "lt"; value: any },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValue: any
): boolean {
  const { op, value: expectedValue } = condition;

  switch (op) {
    case "eq":
      return fieldValue === expectedValue;
    case "ne":
      return fieldValue !== expectedValue;
    case "in":
      return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
    case "gt":
      return typeof fieldValue === "number" && typeof expectedValue === "number" && fieldValue > expectedValue;
    case "lt":
      return typeof fieldValue === "number" && typeof expectedValue === "number" && fieldValue < expectedValue;
    default:
      return false;
  }
}

/**
 * Evaluates all conditions in a rule's "when" clause
 */
function evaluateWhen(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  when: Array<{ fieldId: string; op: "eq" | "ne" | "in" | "gt" | "lt"; value: any }>,
  whenOp: "AND" | "OR" | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValues: Record<string, any>
): boolean {
  if (when.length === 0) return false;

  const results = when.map((condition) => {
    const fieldValue = fieldValues[condition.fieldId];
    return evaluateCondition(condition, fieldValue);
  });

  const op = whenOp || "AND";
  return op === "AND" ? results.every(Boolean) : results.some(Boolean);
}

/**
 * Checks if a field is permanently required (cannot be overridden)
 */
export function isPermanentlyRequired(fieldId: string): boolean {
  return fieldId === "title" || fieldId === "dateTime" || fieldId === "description";
}

/**
 * Evaluates all logic rules and returns computed field states.
 * 
 * Order of operations (strict):
 * 1. HIDE → 2. SET_VALUE → 3. SHOW → 4. REQUIRE/OPTIONAL
 * 
 * Conflict resolution:
 * - Visibility: HIDE wins over SHOW
 * - Requiredness: REQUIRE wins over OPTIONAL (last phase applies)
 */
export function evaluateLogic(
  rules: LogicRule[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValues: Record<string, any>,
  fieldDefinitions: Map<string, FieldDef>
): LogicResult {
  const visibility = new Map<string, boolean>();
  const required = new Map<string, boolean>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setValues = new Map<string, any>();

  // Initialize visibility from field definitions
  fieldDefinitions.forEach((field, id) => {
    visibility.set(id, field.visible !== false);
  });

  // Initialize requirements from field definitions
  fieldDefinitions.forEach((field, id) => {
    required.set(id, field.required === true);
  });

  // Track which fields were explicitly hidden (vs just initialized as false)
  const explicitlyHidden = new Set<string>();

  // Phase 1: HIDE actions (HIDE wins over SHOW)
  rules.forEach((rule) => {
    if (evaluateWhen(rule.when, rule.whenOp, fieldValues)) {
      rule.then.forEach((action) => {
        if (action.action === "hide") {
          visibility.set(action.targetId, false);
          explicitlyHidden.add(action.targetId);
        }
      });
    }
  });

  // Phase 2: SET_VALUE actions (allowed even on hidden fields)
  rules.forEach((rule) => {
    if (evaluateWhen(rule.when, rule.whenOp, fieldValues)) {
      rule.then.forEach((action) => {
        if (action.action === "setValue" && action.value !== undefined) {
          setValues.set(action.targetId, action.value);
        }
      });
    }
  });

  // Phase 3: SHOW actions (only if not explicitly hidden)
  rules.forEach((rule) => {
    if (evaluateWhen(rule.when, rule.whenOp, fieldValues)) {
      rule.then.forEach((action) => {
        if (action.action === "show") {
          // Only show if not explicitly hidden in Phase 1
          if (!explicitlyHidden.has(action.targetId)) {
            visibility.set(action.targetId, true);
          }
        }
      });
    }
  });

  // Phase 4: REQUIRE/OPTIONAL actions (REQUIRE wins over OPTIONAL)
  const requireActions: Array<{ targetId: string }> = [];
  const optionalActions: Array<{ targetId: string }> = [];

  rules.forEach((rule) => {
    if (evaluateWhen(rule.when, rule.whenOp, fieldValues)) {
      rule.then.forEach((action) => {
        if (action.action === "require") {
          requireActions.push({ targetId: action.targetId });
        } else if (action.action === "optional") {
          optionalActions.push({ targetId: action.targetId });
        }
      });
    }
  });

  // Apply REQUIRE first (wins over OPTIONAL)
  requireActions.forEach(({ targetId }) => {
    required.set(targetId, true);
  });

  // Apply OPTIONAL only if not required
  optionalActions.forEach(({ targetId }) => {
    if (!requireActions.some((a) => a.targetId === targetId)) {
      required.set(targetId, false);
    }
  });

  // Enforce permanent required fields
  fieldDefinitions.forEach((field, id) => {
    if (isPermanentlyRequired(id)) {
      required.set(id, true);
      // Ensure permanent required fields are always visible
      visibility.set(id, true);
    }
  });

  return { visibility, required, setValues };
}

/**
 * Validates that logic rules don't hide permanently required fields
 * Returns array of warnings for admin/rule authors
 */
export function validateLogicRules(
  rules: LogicRule[]
): string[] {
  const warnings: string[] = [];
  const permanentlyRequiredFields = new Set(["title", "dateTime", "description"]);

  rules.forEach((rule) => {
    rule.then.forEach((action) => {
      if (action.action === "hide" && permanentlyRequiredFields.has(action.targetId)) {
        warnings.push(
          `Rule "${rule.id}" attempts to hide permanently required field "${action.targetId}". This will be ignored.`
        );
      }
    });
  });

  return warnings;
}

