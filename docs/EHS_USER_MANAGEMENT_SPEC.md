# EHS User Management & Permissions Architecture (v1)

## 1. Context & Problem Statement
We are building the **EHS (Environmental Health & Safety)** module for UpKeep. 
**Current Problem:** EHS users currently inherit permissions from the core CMMS (Maintenance) system. This causes conflicts:
- **"The Desmoine Scenario":** Safety Directors need Admin rights in EHS but restricted "View-Only" rights in CMMS to prevent data accidents.
- **"The Austin Scenario":** Technicians need to "Edit" safety checklists attached to Work Orders without having full "Edit" rights on the Work Order itself.
- **"The OSHA Gap":** Medical/Injury logs (PII) must be hidden from general "View-Only" users.

## 2. Solution: Decoupled Authorization
We are implementing a **"Unified Identity, Decoupled Authorization"** model.
- **Authentication:** Handled by the core platform (UpKeep Identity).
- **Authorization:** Handled entirely within the EHS Module via **Custom Roles** and **Location Scopes**.

## 3. Core Entities

### A. The User
An EHS User links to a core UpKeep Identity but has two mandatory EHS-specific attributes:
1.  **Assigned EHS Role:** Determines *what* they can do (e.g., "Safety Manager", "Field Tech").
2.  **Assigned Location Node:** Determines *where* they can do it (Data Sovereignty).

### B. The Organizational Tree (Location Hierarchy)
- Structure: A **6-level recursive tree**.
- Logic: Levels are generic (Node > Child Node). Users define them (e.g., Region > Plant > Line).
- Rule: A user assigned to a Node inherits visibility for that Node and all its Children (downstream). They cannot see Siblings or Parents.

### C. Custom Role Builder (Permissions Matrix)
We do not use rigid roles. We use a **Custom Role Builder**.
Admins create roles by toggling the following specific permissions:

| Category | Permission Toggles (Boolean) |
| :--- | :--- |
| **Safety Events** | Create, View All, Edit Own, Edit All, Delete |
| **CAPAs** | Create, Assign, Approve/Close, View All |
| **Compliance** | Access Compliance Engine (OSHA Logs/PII), Export PII, Sign Logs |
| **Documentation** | Create JHA/SOP, Edit Templates, View Only, Approve Documents |
| **CMMS Bridge** | **"Safety Override"**: Grants Edit/Delete rights on CMMS Work Orders *only if* tagged as "Safety". |

## 4. UI/UX Requirements
1.  **User List View:** Table displaying Name, Email, Assigned EHS Role, and Location Path.
2.  **Role Builder UI:** A settings interface allowing the creation of a Role Name and a matrix of checkboxes (as defined above).
3.  **User Provisioning Modal:**
    - Input: First Name, Last Name, Email.
    - Selector: **Role** (Dropdown of custom roles).
    - Selector: **Location** (Tree selector—must allow drilling down 6 levels).