# DRMed Security + Data Privacy Checklist (RA 10173 Baseline)

This is a practical baseline checklist for production deployment.  
Legal compliance still requires review by your Data Protection Officer (DPO)/legal counsel.

## 1) Access control

- [ ] Backend is private (no directory listing, no file manager exposed).
- [ ] `ALLOWED_ORIGIN` contains only `https://drmed.ph,https://www.drmed.ph`.
- [ ] Staff access uses `/api/staff/auth/login` with user/password.
- [ ] Staff credentials are rotated on schedule (e.g., every 90 days).
- [ ] Service account has least privilege (Sheet editor only for required file; no public sharing).

## 2) Authentication + anti-abuse

- [ ] `REQUIRE_PORTAL_CONSENT=true`.
- [ ] `REQUIRE_PORTAL_CAPTCHA=true`.
- [ ] `TURNSTILE_SECRET_KEY` is configured in backend host env vars.
- [ ] Portal token TTL is short (`PORTAL_ACCESS_TOKEN_TTL_SECONDS=900`).
- [ ] Staff session TTL is limited (`STAFF_SESSION_TTL_SECONDS=28800` or lower).
- [ ] Rate limiting is active (already configured in backend).

## 3) Data protection

- [ ] All traffic is HTTPS only for `drmed.ph` and `api.drmed.ph`.
- [ ] Result storage uses persistent encrypted disk (`LOCAL_RESULTS_DIR` on encrypted volume).
- [ ] Server backups are encrypted and access-restricted.
- [ ] Sensitive secrets are set only in backend host env vars (never in frontend).
- [ ] No service-account key committed to GitHub.

## 4) Logging + audit trail

- [ ] `ENABLE_CONSENT_AUDIT_LOG=true`.
- [ ] `CONSENT_LOG_TO_SHEETS=true` and sheet `ConsentLogs` exists.
- [ ] `ENABLE_STAFF_AUDIT_LOG=true`.
- [ ] Logs are retained under policy and access-limited to authorized personnel.
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
