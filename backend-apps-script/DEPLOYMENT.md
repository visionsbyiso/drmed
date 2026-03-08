# DRMed Portal Backend (Google Apps Script)

## 1) Open Apps Script
1. Go to [script.new](https://script.new).
2. Replace `Code.gs` with the content of `Code.gs` in this folder.

## 2) Verify Sheet Columns
The backend expects these headers (row 1):
- `Control No`
- `Birthday` (or `Secure PIN` / `Claim Password`)
- `Patient Name`
- `Test Name`
- `Test Date`
- `Pdf Link`
- `Status`

Your current sheet format is supported.

## 3) Deploy Web App
1. Click `Deploy` -> `New deployment`.
2. Type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone` (or `Anyone with link`).
5. Deploy and copy the `/exec` URL.

## 4) Drive PDF Permissions
For each PDF link in the sheet:
- Set file access to `Anyone with the link` -> `Viewer`.

If links are not public, users cannot open PDFs from the portal.

## 5) Quick Tests
Replace values with real data:

- Health check:
`.../exec?ping=1`

- Login check:
`.../exec?control=2026-0001&bday=01012026`

Expected success shape:
```json
{
  "status": "success",
  "name": "Patient Name",
  "reports": [
    {
      "testName": "Complete Blood Count",
      "testDate": "2026-02-18T16:00:00.000Z",
      "pdfLink": "https://drive.google.com/file/d/FILE_ID/view?usp=drive_link",
      "testStatus": "Complete"
    }
  ]
}
```

If credentials don't match:
```json
{"status":"error"}
```

## 6) Frontend URL
Use the deployed `/exec` URL in:
- `/Users/coleen/Desktop/drmed-v6.html`
- `/Users/coleen/Desktop/DRMED Website/DRMED Portal.html`

Both files are already configured to use:
`https://script.google.com/macros/s/AKfycbwXnHhdgQXP95cgmtfbRBPFt_6_KYaUyqpO4KVRfAAHRMF-RShS6xdqEtcczijiRAgD0g/exec`

