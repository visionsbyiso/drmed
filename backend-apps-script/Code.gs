/**
 * DRMed Patient Portal backend (Google Apps Script Web App)
 *
 * Expected frontend query params:
 *   control=<control-number>
 *   pin=<secure-pin>            // preferred
 *   bday=<secure-pin>           // backward-compatible param name
 *
 * Expected JSON response:
 *   { status: "success", name: "...", reports: [...] }
 *   { status: "error" }
 */

var CONFIG = {
  SPREADSHEET_ID: "1O09S6_hRv-c7irI_HJtbYraWSXQs08IET0-bqQIWQh4",
  SHEET_NAME: "Sheet1",
  HEADER_ALIASES: {
    control: ["Control No", "Control No.", "Control Number", "Control"],
    pin: ["Secure PIN", "Claim Password", "PIN", "Birthday", "Bday"],
    patientName: ["Patient Name", "Name"],
    testName: ["Test Name", "Test"],
    testDate: ["Test Date", "Date"],
    pdfLink: ["Pdf Link", "PDF Link", "Pdf", "PDF"],
    status: ["Status", "Test Status"]
  }
};

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};

    if (params.ping === "1") {
      return asJson_({
        status: "ok",
        message: "Portal backend is running",
        timestamp: new Date().toISOString()
      });
    }

    var control = normalizeControl_(pickFirst_(params.control, params.controlNo, params.control_no));
    var pinInput = pickFirst_(params.pin, params.bday, params.password, params.claimPassword);

    if (!control || !pinInput) {
      return asJson_({ status: "error" });
    }

    var pinCandidates = buildPinCandidates_(pinInput);
    var loaded = loadSheetRows_();

    var matched = loaded.rows.filter(function (row) {
      var rowControl = normalizeControl_(row[loaded.idx.control]);
      var rowPin = normalizePin_(row[loaded.idx.pin]);
      return rowControl === control && pinCandidates.indexOf(rowPin) !== -1;
    });

    if (!matched.length) {
      return asJson_({ status: "error" });
    }

    var patientName = safeString_(matched[0][loaded.idx.patientName]) || "Patient";
    var reports = matched
      .map(function (row) {
        return {
          testName: safeString_(row[loaded.idx.testName]) || "Laboratory Test",
          testDate: normalizeDateToISO_(row[loaded.idx.testDate]),
          pdfLink: normalizePdfLink_(row[loaded.idx.pdfLink]),
          testStatus: safeString_(row[loaded.idx.status]) || "Pending"
        };
      })
      .sort(function (a, b) {
        return new Date(b.testDate || 0).getTime() - new Date(a.testDate || 0).getTime();
      });

    return asJson_({
      status: "success",
      name: patientName,
      reports: reports
    });
  } catch (err) {
    // Keep public errors generic; details in executions log.
    console.error("doGet failed:", err);
    return asJson_({ status: "error" });
  }
}

function loadSheetRows_() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
  if (!sh) throw new Error("No sheet found");

  var values = sh.getDataRange().getValues();
  if (!values || values.length < 2) {
    return {
      idx: {},
      rows: []
    };
  }

  var headers = values[0].map(function (h) { return normalizeHeader_(h); });
  var idx = {
    control: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.control),
    pin: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.pin),
    patientName: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.patientName),
    testName: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.testName),
    testDate: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.testDate),
    pdfLink: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.pdfLink),
    status: findHeaderIndex_(headers, CONFIG.HEADER_ALIASES.status)
  };

  if (idx.control < 0 || idx.pin < 0) {
    throw new Error("Required headers missing: Control + PIN/Birthday");
  }

  var rows = values.slice(1).filter(function (r) {
    return safeString_(r[idx.control]) && safeString_(r[idx.pin]);
  });

  return {
    idx: idx,
    rows: rows
  };
}

function normalizeControl_(value) {
  return safeString_(value).toUpperCase().replace(/\s+/g, "");
}

function buildPinCandidates_(input) {
  var raw = safeString_(input);
  var out = [];

  // raw input as-is
  if (raw) out.push(raw);

  // ISO date input from <input type="date"> -> MMDDYYYY
  var iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    out.push(iso[2] + iso[3] + iso[1]); // MMDDYYYY preferred
    out.push(iso[1] + iso[2] + iso[3]); // YYYYMMDD fallback
  }

  // 8-digit forms
  var digits = raw.replace(/\D/g, "");
  if (digits.length === 8) {
    out.push(digits);
    var ymd = digits.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (ymd) out.push(ymd[2] + ymd[3] + ymd[1]); // MMDDYYYY from YYYYMMDD
  }

  // Uppercase normalized fallback for alphanumeric claim passwords
  out.push(raw.toUpperCase());

  // Unique + normalized
  var unique = {};
  out.forEach(function (v) {
    var n = normalizePin_(v);
    if (n) unique[n] = true;
  });
  return Object.keys(unique);
}

function normalizePin_(value) {
  var raw = safeString_(value);
  if (!raw) return "";

  var iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return iso[2] + iso[3] + iso[1];

  var digits = raw.replace(/\D/g, "");
  if (digits.length === 8) return digits;

  return raw.toUpperCase();
}

function normalizeDateToISO_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return value.toISOString();
  }

  var raw = safeString_(value);
  if (!raw) return "";

  var d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString();

  var compact = raw.match(/^(\d{2})(\d{2})(\d{4})$/); // MMDDYYYY
  if (compact) {
    var d2 = new Date(compact[3] + "-" + compact[1] + "-" + compact[2] + "T00:00:00");
    if (!isNaN(d2.getTime())) return d2.toISOString();
  }

  return raw;
}

function normalizePdfLink_(value) {
  var raw = safeString_(value);
  if (!raw) return "";

  // If already a URL, try extracting file id then normalize.
  var idFromUrl = extractDriveFileId_(raw);
  if (idFromUrl) {
    return "https://drive.google.com/file/d/" + idFromUrl + "/view?usp=drive_link";
  }

  // If plain Drive file ID in cell.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(raw)) {
    return "https://drive.google.com/file/d/" + raw + "/view?usp=drive_link";
  }

  // Keep non-Drive links as-is.
  return raw;
}

function extractDriveFileId_(url) {
  if (!url) return "";
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  if (m && m[1]) return m[1];

  var m2 = url.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (m2 && m2[1]) return m2[1];

  return "";
}

function findHeaderIndex_(headersNormalized, aliases) {
  var normalizedAliases = aliases.map(function (a) { return normalizeHeader_(a); });
  for (var i = 0; i < headersNormalized.length; i++) {
    if (normalizedAliases.indexOf(headersNormalized[i]) !== -1) return i;
  }
  return -1;
}

function normalizeHeader_(value) {
  return safeString_(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function pickFirst_() {
  for (var i = 0; i < arguments.length; i++) {
    if (safeString_(arguments[i])) return arguments[i];
  }
  return "";
}

function safeString_(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function asJson_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

