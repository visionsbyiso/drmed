# Security Operations SOP (DRMed Portal)

Last updated: March 10, 2026

This SOP defines the minimum operational controls for handling patient data in the DRMed portal.  
It complements technical controls implemented in code.

## 1) Scope

- Systems: DRMed website, portal backend, Google Sheets, Google Drive.
- Data: patient identifiers, test metadata, PDFs, audit logs.
- Roles: Front desk, lab staff, IT/admin, DPO.

## 2) Access provisioning (staff)

1. Manager requests access for staff.
2. IT creates staff user and password (or scrypt hash).
3. If MFA is required, generate a TOTP secret and enroll device.
4. Record who approved access and the role.
5. Staff signs the Staff Security Policy.

## 3) Daily operations

- Staff login uses staff user + password (and MFA if enabled).
- Never share staff credentials.
- Use the staff console to upload results or mark pending.
- Do not upload files with patient data to personal devices.

## 4) Result release workflow

1. Verify patient record in sheet.
2. Upload PDF with correct naming and patient ID mapping.
3. Confirm status = Released only when PDF is uploaded.
4. If no PDF, leave status = Pending.

## 5) Audit logs

- Consent log is enabled (portal consent).
- Staff audit log is enabled (staff actions).
- Log retention controlled by:
  - AUDIT_LOG_MAX_BYTES
  - AUDIT_LOG_MAX_DAYS
- DPO reviews logs monthly for anomalies.

## 6) Incident response

- Any suspected breach is reported to DPO within 24 hours.
- Follow the breach SOP for containment, assessment, and notification timelines.
- Preserve logs and evidence.

## 7) Password and MFA policy

- Minimum 12 chars for staff passwords.
- Rotate every 90 days or on staff offboarding.
- MFA required for staff with upload privileges.

## 8) Backup and retention

- Google Drive / Sheets are primary storage.
- Periodic backups (if used) must be encrypted and access-restricted.
- Follow retention schedule in 08-retention.

## 9) Change management

- Any change to portal/auth/consent flows requires:
  - DPO signoff
  - regression testing
  - updated privacy notice if data use changes

## 10) Offboarding

- Disable staff user immediately.
- Rotate shared secrets if applicable.
- Remove access from Google Drive/Sheets.

## 11) Evidence to keep

- Access request approvals
- Staff security policy signoff
- Audit log review notes
- Incident reports (if any)

