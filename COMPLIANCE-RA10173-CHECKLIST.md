# DRMed Security + Data Privacy Checklist (RA 10173 Baseline)

This is a practical baseline checklist for production deployment.  
Legal compliance still requires review by your Data Protection Officer (DPO)/legal counsel.

## 0) Data inventory (fill these in)

- [ ] Estimated patients/month: __________
- [ ] Average tests per patient: __________
- [ ] Retention period for results (months/years): __________
- [ ] Storage locations:
  - Google Sheets (patient metadata + status)
  - Google Drive (PDF results) OR local encrypted storage
  - Audit logs (consent + staff actions)
- [ ] Authorized roles with access: __________

## 1) Access control

- [ ] Backend is private (no directory listing, no file manager exposed).
- [ ] `ALLOWED_ORIGIN` contains only approved public domains (no localhost).
- [ ] Staff access uses `/api/staff/auth/login` with user/password.
- [ ] Staff passwords are hashed (scrypt) in `STAFF_GATE_USERS_JSON`.
- [ ] MFA is enabled for staff (`STAFF_MFA_REQUIRED=true` + secrets).
- [ ] Staff credentials are rotated on schedule (e.g., every 90 days).
- [ ] Service account has least privilege (Sheet editor only for required file; no public sharing).

## 2) Authentication + anti-abuse

- [ ] `REQUIRE_PORTAL_CONSENT=true`.
- [ ] `REQUIRE_PORTAL_CAPTCHA=true`.
- [ ] `TURNSTILE_SECRET_KEY` is configured in backend host env vars.
- [ ] Portal token TTL is short (`PORTAL_ACCESS_TOKEN_TTL_SECONDS=900`).
- [ ] Staff session TTL is limited (`STAFF_SESSION_TTL_SECONDS=28800` or lower).
- [ ] Rate limiting is active (already configured in backend).
- [ ] Staff lockout enabled (`STAFF_LOCKOUT_MAX_ATTEMPTS`, `STAFF_LOCKOUT_DURATION_MS`).

## 3) Data protection

- [ ] All traffic is HTTPS only for `drmed.ph` and `api.drmed.ph`.
- [ ] Result storage uses private Google Drive folder (recommended) or encrypted local disk.
- [ ] Server backups are encrypted and access-restricted.
- [ ] Sensitive secrets are set only in backend host env vars (never in frontend).
- [ ] No service-account key committed to GitHub.

## 4) Logging + audit trail

- [ ] `ENABLE_CONSENT_AUDIT_LOG=true`.
- [ ] `CONSENT_LOG_TO_SHEETS=true` and sheet `ConsentLogs` exists.
- [ ] `ENABLE_STAFF_AUDIT_LOG=true`.
- [ ] Logs have retention controls (`AUDIT_LOG_MAX_BYTES`, `AUDIT_LOG_MAX_DAYS`).
- [ ] Logs are access-limited to authorized personnel.
- [ ] Incident logbook process exists (who, when, what, action taken).

## 5) Privacy notice + consent transparency

- [ ] Privacy Notice page is live and linked from portal.
- [ ] Terms of Use page is live and linked from portal.
- [ ] Consent text clearly states purpose (release of lab results).
- [ ] Consent versioning is maintained via `CONSENT_NOTICE_VERSION`.

## 6) Data lifecycle governance

- [ ] Retention period for lab result files is documented.
- [ ] Disposal/deletion process is documented and tested.
- [ ] Procedure exists for data subject rights requests (access/correction/deletion where applicable).
- [ ] Procedure exists for breach response and notification timelines.
- [ ] Data processing registration or sworn declaration completed (if required by NPC thresholds).

## 7) Deployment hardening

- [ ] Deploy frontend and backend separately (GitHub Pages + backend host).
- [ ] Backend deployed behind managed TLS endpoint.
- [ ] Backend filesystem paths are writable only where needed (`LOCAL_RESULTS_DIR`, logs).
- [ ] Monitoring/alerts enabled for server errors and high 401/429 rates.
- [ ] Smoke tests pass before go-live.

## 8) Smoke test (minimum)

- [ ] `GET /healthz` returns 200.
- [ ] Portal verify with valid Patient ID + PIN returns success.
- [ ] Pending test appears as pending with no download.
- [ ] Released test downloads directly.
- [ ] Consent row appears in `ConsentLogs`.
- [ ] Staff action appears in staff audit log.

---

Recommended file to start from:

- `/Users/coleen/Desktop/DRMED Website/backend-node/.env.production.example`
