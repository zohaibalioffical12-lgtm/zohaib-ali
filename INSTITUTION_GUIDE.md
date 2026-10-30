# Muslim School & College Management System — Institutional Guide

## Overview
**Muslim School & College Management System** is a production-oriented web platform combining a public website with an administrative portal for Islamic schools and colleges.

### Core Architecture & Highlights
1. **Academic Spectrum (Playgroup through Class 12)**:
   - Early Childhood: Playgroup, Nursery, KG
   - Primary School: Classes 1 to 5
   - Middle School: Classes 6 to 8
   - Secondary / Matriculation: Classes 9 & 10 (Science & Computer Science, FBISE/BISE affiliated)
   - Higher Secondary / College: Classes 11 & 12 (F.Sc Pre-Engineering, F.Sc Pre-Medical, ICS Computer Science)
   - Integrated Tahfeez-ul-Quran & Tajweed Department

2. **Campus Segregation**:
   - **Ibn Al-Haytham Boys Campus (Wing 1)**: Independent building, science & robotics laboratories, sports arena, and male faculty.
   - **Fatima Al-Fihri Girls Campus (Wing 2)**: Gated, purdah-compliant perimeter, female faculty, medical laboratories, and speech auditorium.

3. **Role-Based Portals**:
   - **CEO / Super Admin**: Complete institutional control, aggregated stats, student SIS, class management, fee analytics, announcements, and database seed initializer.
   - **Principal**: Academic quality monitoring, boys vs girls wing comparative metrics, attendance approvals, and teacher workload assignments.
   - **Teacher**: Section selection, interactive daily attendance sheet with one-click status (Present, Absent, Late, Leave), examination marks entry with automated grade calculations.
   - **Student**: Student ID profile card, attendance rate meter, class timetable, and printable official Report Cards.
   - **Parent / Guardian**: Multi-child switcher, live daily attendance, fee ledger, and printable fee payment vouchers.
   - **Accountant**: Billing ledgers, fee structures, collections, defaulter tracking, and payment receipts.
   - **Admissions Officer**: Candidate review pipeline, interview scheduling, and 1-click student enrollment.
   - **Librarian**: Islamic repository catalog, science and mathematics texts, copy circulation and availability tracking.

4. **Firebase Integration**:
   - **Authentication**: Google Sign-In with popup.
   - **Firestore Database**: Provisioned with intermediate representation (`firebase-blueprint.json`) and deployed `firestore.rules`.
   - **Data Access & Fallback**: `dataService.ts` with error handling conforming to `FirestoreErrorInfo`.
   - **Seed Initializer**: One-click database seeding populating complete 15-class rosters, sections, faculty, students, attendance, exams, fees, and announcements.
