# DRMed Deployment Guide (GitHub Pages + Render)

This guide is for:
- Frontend: GitHub Pages (`drmed.visionsbyiso.com`)
- Backend API: Render (`api.drmed.visionsbyiso.com`)
- Storage mode: `RESULT_STORAGE=local` (staff uploads to backend disk)

## Why split hosting

GitHub Pages only hosts static files and does not run Node.js backend code.  
Reference: GitHub Pages docs.

## 1) Create GitHub repo and push code

Run from project root:

```bash
cd "/Users/coleen/Desktop/DRMED Website"
git init
git add .
git commit -m "DRMed website + backend"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

## 2) Configure GitHub Pages (frontend)

1. In GitHub repo, go to **Settings -> Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`.
4. Save.
5. Add file `CNAME` at repo root with:

```text
drmed.visionsbyiso.com
```

6. In DNS provider, create CNAME:
   - Host: `drmed`
   - Target: `<YOUR_USERNAME>.github.io`

## 3) Deploy backend on Render

1. Render -> **New + -> Web Service**.
2. Connect your GitHub repo.
3. Set:
   - Root Directory: `backend-node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add a **persistent disk** mounted to `/var/data`.
5. Add custom domain in Render: `api.drmed.visionsbyiso.com`.
6. In DNS provider, create CNAME:
   - Host: `api.drmed`
   - Target: `<YOUR_RENDER_SERVICE>.onrender.com`

## 4) Render environment variables

Set these in Render:

```env
NODE_ENV=production
STRICT_SECURITY_MODE=true
PORT=8080
ALLOWED_ORIGIN=https://drmed.visionsbyiso.com

SHEET_ID=<YOUR_SHEET_ID>
SHEET_NAME=Sheet1

RESULT_STORAGE=local
LOCAL_RESULTS_DIR=/var/data/results

REQUIRE_PORTAL_CONSENT=true
REQUIRE_PORTAL_CAPTCHA=true
TURNSTILE_SECRET_KEY=<YOUR_TURNSTILE_SECRET>
TURNSTILE_VERIFY_URL=https://challenges.cloudflare.com/turnstile/v0/siteverify

ENABLE_CONSENT_AUDIT_LOG=true
CONSENT_NOTICE_VERSION=2026-03-08
CONSENT_LOG_FILE=./logs/portal-consent.ndjson
CONSENT_LOG_TO_SHEETS=true
CONSENT_LOG_SHEET_NAME=ConsentLogs

PORTAL_ACCESS_TOKEN_SECRET=<LONG_RANDOM_SECRET>
PORTAL_ACCESS_TOKEN_TTL_SECONDS=900

STAFF_GATE_USERS_JSON={"frontdesk-1":"<STRONG_PASSWORD>"}
STAFF_SESSION_TOKEN_SECRET=<LONG_RANDOM_SECRET>
STAFF_SESSION_TTL_SECONDS=28800

ENABLE_STAFF_AUDIT_LOG=true
STAFF_AUDIT_LOG_FILE=./logs/staff-audit.ndjson

GOOGLE_SERVICE_ACCOUNT_JSON=<ONE_LINE_JSON_CONTENT>
```

## 5) Frontend API + CAPTCHA keys

In:
- `/Users/coleen/Desktop/DRMED Website/index.html`
- `/Users/coleen/Desktop/DRMED Website/drmed-v6.html`

Set (before portal script):

```html
<script>
  window.__DRMED_API_BASE__ = 'https://api.drmed.visionsbyiso.com';
  window.__DRMED_TURNSTILE_SITE_KEY__ = '<YOUR_TURNSTILE_SITE_KEY>';
</script>
```

## 6) Google setup

1. Enable Google Sheets API.
2. Share the Sheet with your service account email as **Editor**.
3. Ensure Sheet columns are A-I (expected by backend).
4. Ensure tab `ConsentLogs` exists.

## 7) Go-live checks

1. Backend health:

```bash
curl -s "https://api.drmed.visionsbyiso.com/healthz"
```

2. Staff login:

```bash
curl -s -X POST "https://api.drmed.visionsbyiso.com/api/staff/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"staffUser":"frontdesk-1","password":"<STAFF_PASSWORD>"}'
```

3. Browser test:
   - Open `https://drmed.visionsbyiso.com`
   - Patient portal login works.
   - Released rows download directly.
   - Pending rows show no download.

## 8) Move from staging to production (`drmed.ph`)

Change only:
- `ALLOWED_ORIGIN=https://drmed.ph,https://www.drmed.ph`
- `window.__DRMED_API_BASE__='https://api.drmed.ph'`
- Turnstile allowed hostnames/keys for production domain
- Production sheet/service-account secrets

---

## References

- GitHub Pages Quickstart: <https://docs.github.com/en/pages/quickstart>
- GitHub Pages custom domain: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>
- GitHub Pages static site limitation: <https://docs.github.com/en/enterprise-server@3.16/pages/getting-started-with-github-pages/what-is-github-pages#data-collection>
- Render persistent disks: <https://docs.render.com/disks>
