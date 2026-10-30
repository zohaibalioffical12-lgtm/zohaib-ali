# Security Specification: Muslim School & College Management System

## 1. Data Invariants
- Only verified, authenticated users or CEO/SuperAdmin can access or modify restricted records.
- Super admin / CEO is verified against `/databases/$(database)/documents/admins/$(request.auth.uid)` or authenticated email `zohaibalioffical12@gmail.com`.
- Students, examination marks, invoices, and attendance can only be modified by authorized staff (CEO, Principal, Teacher, Accountant).
- Public admission forms can be created by unauthenticated visitors (with status strictly set to 'pending') but can only be read/updated by admissions staff and administrators.
- Announcements are readable by all authenticated users or public guests for general announcements; only staff/admins can publish.
- Immutable identity fields (`id`, `studentId`, `createdAt`) cannot be altered post-creation.

## 2. The Dirty Dozen Payloads
1. **CEO Privilege Escalation**: Non-admin user attempts to write to `/admins/{uid}` to grant themselves CEO powers. (Denied)
2. **Ghost Field Poisoning**: Client attempts to inject `isSuperAdmin: true` or hidden flags into user profile. (Denied via strict schema validation)
3. **Student Record Forgery**: Arbitrary user writes a new student record with bogus admission number. (Denied)
4. **Attendance Spoofing**: Student attempts to mark themselves or peers as 'present'. (Denied, only assigned teacher or admin)
5. **Mark Injection**: Student updates their examination marks to 100/100. (Denied)
6. **Invoice Balance Forgery**: Student attempts to change invoice `balance` to 0 or `status: 'paid'`. (Denied, only accountant or CEO)
7. **Admission Status Hijack**: Public applicant submits an admission form with `status: 'approved'`. (Denied, create must enforce `status == 'pending'`)
8. **Malicious ID Injection**: Path parameter injection with 2KB payload into `{studentId}`. (Denied via `isValidId()`)
9. **Announcement Overwrite**: Unauthorized user overwrites institutional announcements. (Denied)
10. **Orphan Attendance Write**: Attendance record created referencing non-existent student session. (Denied)
11. **Email Spoofing**: Attempt to act as admin using unverified email token. (Denied, requires `token.email_verified == true`)
12. **Class & Section Tampering**: Non-principal / non-admin attempts to delete or rename academic classes or sections. (Denied)
