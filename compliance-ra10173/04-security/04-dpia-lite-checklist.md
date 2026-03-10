# DPIA (Lite) Checklist for DRMed Portal

Last updated: March 10, 2026

This is a practical, lightweight DPIA checklist for a small clinic portal.  
Use this with the DPO to document risks and mitigations.

## A) Processing overview

- [ ] Purpose of processing:
- [ ] Data categories (e.g., name, control number, tests, PDF results):
- [ ] Data subjects (patients, guardians):
- [ ] Systems involved (Sheets, Drive, Portal, Backend):
- [ ] Locations/storage (PH, cloud regions if known):
- [ ] Data retention period:

## B) Legal basis and transparency

- [ ] Privacy notice is published and up to date.
- [ ] Consent text is clear and versioned.
- [ ] Consent audit logs are retained.

## C) Necessity and proportionality

- [ ] Only required fields are collected.
- [ ] Access is limited to staff roles.
- [ ] Token TTL is short (15 mins).

## D) Risk identification

Mark risks that apply:
- [ ] Unauthorized access (weak staff credentials)
- [ ] Accidental release of results
- [ ] Over-retention of data
- [ ] Misconfiguration of public links
- [ ] Credential leakage
- [ ] Inadequate incident response

## E) Mitigations in place

- [ ] Staff gate + MFA (if required)
- [ ] Lockout on failed attempts
- [ ] CAPTCHA on portal
- [ ] Audit logs for consent + staff actions
- [ ] CORS allowlist
- [ ] HTTPS enforced

## F) Residual risk assessment

Risk level after mitigations:
- [ ] Low
- [ ] Medium
- [ ] High

Notes:

## G) DPO signoff

Name: ______________________
Signature: _________________
Date: ______________________

