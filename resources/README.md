# BeTwin // Clinical Resources Directory

Welcome, Rachel! This directory is designed specifically for you to curate clinical assets, guides, contact helplines, and hospital records. **BeTwin (Axiom Hope)** directly references these data configurations to keep its out-of-appointment conversations, emergency routing, and oncologist briefing sheets accurate and aligned with the Breast Cancer Foundation (BCF) Singapore's standards.

---

## 📂 File Directory

1. **[clinical_resources.json](file:///d:/bookstrap/resources/clinical_resources.json)**:
   - This structured file compiles BCF Singapore URLs, crisis helpline numbers, public/private oncology hospital mappings, and clinical equations.
   - You can edit any value in this JSON file directly! For example, if a helpline number changes or NCCS updates its address, you can update the strings in this file, and the application's secure dispatchers will immediately reflect your updates.

---

## 🔬 How the Voice Agent Uses This File

### 1. Emergency Safety Intercepts
When patients speak keywords indicating mental health crisis or intense distress, Axiom Hope activates the clinical safety shield. It halts the standard dialogue flow and loads the hotlines defined in `emergency_helplines` (such as the Samaritans of Singapore helpline `1767` and IMH `6389 2222`), prompting patients with direct-call links.

### 2. Oncologist Briefing dossiers
When patients compile their diary entries and clinical prep agenda, the BCF portal pulls hospital listings from `oncology_hospital_directories` (public/private sectors) into the dropdown selector, ensuring that NCCS, NCIS, SGH, KKH, and private clinics are correctly pre-filled in their email briefing dispatches.

### 3. Caregiver Support Updates
When patients authorize secure caregiver dispatches, the companion uses the values and guidelines configured in `bcf_guidelines` to generate supportive WhatsApp templates, providing reassurance to their family members.

---

## ✍️ How to Edit This Folder

- **No programming knowledge is needed!**
- Simply open [clinical_resources.json](file:///d:/bookstrap/resources/clinical_resources.json) in your editor.
- Update the text strings inside the quotes (e.g., changing `"phone": "1767"` to a new hotline).
- Save the file. Our build pipelines will automatically ingest your changes!
