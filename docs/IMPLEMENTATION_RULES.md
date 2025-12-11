# Implementation Rules

This document defines the authoritative implementation rules for the Customizable Safety Event Forms prototype.

## Conditional Logic Evaluation

### Evaluation Model
- **Evaluate all rules on every change** (reactive/recompute model)
- **Strict order of operations**:
  1. HIDE/DISABLE
  2. SET_VALUE
  3. SHOW/ENABLE
  4. REQUIRE/OPTIONAL

### Conflict Resolution
- **Visibility**: HIDE wins over SHOW. If any rule hides a field, it's hidden.
- **Requiredness**: REQUIRE wins over OPTIONAL in the last phase. If both REQUIRE and OPTIONAL target the same field, REQUIRE wins.

### Special Rules
- `setValue` actions are allowed on hidden fields (so they can reappear pre-filled later)
- Hidden fields do not block submit—even if schema required—unless they're one of the permanent-required system fields

## Field Requirements

### Permanent Required Fields
The following fields are **permanently, non-negotiable required**:
- `title`
- `dateTime`
- `description`

These fields:
- Cannot be made optional by logic
- Cannot be hidden by logic
- Always block submit if empty

### Other Fields
- Schema `required: true` can be overridden by logic
- If a required field is hidden by logic, it must be made optional by that same logic pass; otherwise validator will error

## Static Overrides (QR Code)

### Locking Behavior
- Values supplied via `?static=<base64JSON>` are **locked (read-only)** at runtime
- Locked fields are visually indicated (🔒 icon) and disabled

### Participation in Logic
- **Locked fields still participate in conditions** (they can trigger rules)
- Locked fields can affect the evaluation of other fields' visibility/requirements

### Conflict Handling
- If logic tries `setValue` on a locked field → **ignore setValue** and display a small "static lock" badge
- If logic requires a locked field that's empty → **validation should fail** (this is a QR/template design error)

### URL Format
```
/?template=<templateId>&static=<base64url-json>
```

Example:
```
/?template=tmpl_injury_v1&static=eyJsb2NhdGlvbiI6IlBsYW50IEEgLSBMaW5lIDMiLCJ0eXBlIjoiSW5qdXJ5In0
```

## File Uploads

### Storage
- **In-memory only** (no persistence)
- Include file metadata in payload: `name`, `size`, `mime`

### Limits
- Maximum **20 files** per file field
- Maximum **100MB** per file
- Allowed types: `image/*`, `video/*`, `application/pdf`

### Validation
- Client-side only
- Virus scan omitted (not in prototype)
- Processed on change (for previews) and serialized on submit (meta only)

## AI Assist

### Implementation Approach
- **Client-side stub** for prototype (no network calls)
- Later: server-side service call

### Behavior
- Simulate **~500ms delay** with a spinner
- Fill fields with **confidence scores** (0-1 range)
- Track **origin** per field: `manual` | `ai` | `static` | `default`
- **Never auto-submit**
- Missing required values must be filled by user (AI suggestions don't satisfy requirements)

### Error Handling
- Show **non-blocking banner** on failure
- User can continue manually

## Validation

### When to Validate
- **On Submit**: Full form validation
- **On Blur**: Per-field validation for required fields

### Error Display
- **Inline errors**: Display first error below each field
- **Error summary**: Display at top of form listing all errors

### Validation Rules
- Hidden fields do not block submit (except permanent-required)
- Locked-but-empty + required fields block submit
- Server-side validation parity deferred to EHS team

## Submissions

### Storage Model
- **In-memory immutable list**
- Treat as immutable once submitted
- Each submission includes full `SubmissionPayload`

### Drafts
- **Drafts are out of scope** for prototype

### Metadata Tracked
- `templateVersionId`
- `timestamp`
- Simple client info (optional)
- `aiConfidence` (per field, if applicable)
- `origin` (per field: `manual` | `ai` | `static` | `default`)

## Template Versioning

### Current Approach
- Keep `templateVersionId` as string
- Submissions reference that ID
- No migrations needed for prototype

### Future Considerations
- Template versioning UX deferred
- Multilingual templates out of scope for v1 prototype

## Performance Envelope

- Up to **60 fields** per template
- Up to **50 rules** per template
- Client-side rendering only

