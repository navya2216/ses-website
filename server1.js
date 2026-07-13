require("dotenv").config();

/* ================= IMPORTS ================= */
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= MYSQL ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "career_portal",
});

db.connect((err) => {
  if (err) console.log("DB Error:", err);
  else console.log("MySQL Connected");
});

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 4006;

/* ================= MEMORY ================= */
const otpStore = new Map();
let hrEmail = "";

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= HELPERS ================= */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeEmail(email) {
  return email?.toString().trim().toLowerCase();
}

/* ================= MULTER ================= */
const upload = multer({ dest: "uploads/" });

/* ================= SEND OTP ================= */
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  const adminEmail = normalizeEmail(process.env.EMAIL_USER);
  const userEmail = normalizeEmail(email);

  if (userEmail !== adminEmail) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized email",
    });
  }

  try {
    const otp = generateOTP();

    otpStore.set(userEmail, {
      otp,
      verified: false,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "OTP failed",
    });
  }
});
/* ================= GET ADMIN EMAIL ================= */

app.get("/api/admin-email", (req, res) => {
  const adminEmail = process.env.EMAIL_USER;

  res.json({
    success: true,
    email: adminEmail,
  });
});
/* ================= VERIFY OTP ================= */
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const key = normalizeEmail(email);
  const data = otpStore.get(key);

  if (!data)
    return res.status(400).json({ success: false, message: "OTP not found" });

  if (Date.now() > data.expiry)
    return res.status(400).json({ success: false, message: "OTP expired" });

  if (data.otp !== otp)
    return res.status(401).json({ success: false, message: "Invalid OTP" });

  data.verified = true;
  hrEmail = key;

  res.json({ success: true, message: "OTP verified" });
});

/* ================= UPLOAD JOBS ================= */
app.post("/api/upload-jobs", upload.single("file"), async (req, res) => {
  const fs = require("fs");
  const xlsx = require("xlsx");

  /* ================= DELETE FILE FUNCTION ================= */

  const deleteFile = () => {
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (e) {
      console.log("Delete error:", e);
    }
  };

  /* ================= NORMALIZE FUNCTION ================= */

  const normalize = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  };

  try {
    /* ================= GET EMAIL ================= */

    const { email } = req.body;

    if (!email) {
      deleteFile();
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    /* ================= CHECK OTP ================= */

    const key = normalizeEmail(email);

    const otpData = otpStore.get(key);

    if (!otpData?.verified) {
      deleteFile();

      return res.status(403).json({
        success: false,
        message: "OTP not verified",
      });
    }

    /* ================= CHECK FILE ================= */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    /* ================= READ EXCEL ================= */

    const workbook = xlsx.readFile(req.file.path);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    if (!data.length) {
      deleteFile();

      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    /* ================= FIND TARGET EMAIL ================= */

    let detectedTargetEmail = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      const rowText = row.map(normalize).join("");

      if (
        rowText.includes("targetmailid") ||
        rowText.includes("targetemail") ||
        rowText.includes("targetmail") ||
        rowText.includes("hremail") ||
        rowText.includes("contactemail")
      ) {
        for (let cell of row) {
          const value = String(cell || "").trim();

          if (emailRegex.test(value)) {
            detectedTargetEmail = value.toLowerCase();
            break;
          }
        }

        if (!detectedTargetEmail && data[i + 1]) {
          for (let cell of data[i + 1]) {
            const value = String(cell || "").trim();

            if (emailRegex.test(value)) {
              detectedTargetEmail = value.toLowerCase();
              break;
            }
          }
        }
      }

      if (!detectedTargetEmail) {
        for (let cell of row) {
          const value = String(cell || "").trim();

          if (emailRegex.test(value)) {
            detectedTargetEmail = value.toLowerCase();
            break;
          }
        }
      }

      if (detectedTargetEmail) break;
    }

    /* ================= VALIDATE TARGET EMAIL ================= */

    if (!detectedTargetEmail) {
      deleteFile();

      return res.status(400).json({
        success: false,
        message: "Target Mail Id not found in Excel",
      });
    }

    console.log("Detected Target Email:", detectedTargetEmail);

    /* ================= FIND HEADER ROW ================= */

    let headerIndex = -1;

    for (let i = 0; i < data.length; i++) {
      const rowText = data[i].map(normalize).join("");

      if (
        rowText.includes("role") &&
        rowText.includes("location") &&
        rowText.includes("type") &&
        (rowText.includes("desc") ||
          rowText.includes("description") ||
          rowText.includes("details"))
      ) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      deleteFile();

      return res.status(400).json({
        success: false,
        message: "Job header row not found",
      });
    }

    /* ================= GET HEADERS ================= */

    const headers = data[headerIndex].map(normalize);

    /* ================= FIND COLUMN INDEX ================= */

    const findIndex = (keywords) => {
      return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
    };

    const roleIndex = findIndex(["role"]);
    const locationIndex = findIndex(["location"]);
    const typeIndex = findIndex(["type"]);
    const descIndex = findIndex(["description", "details", "desc"]);

    if (roleIndex < 0 || locationIndex < 0 || typeIndex < 0 || descIndex < 0) {
      deleteFile();

      return res.status(400).json({
        success: false,
        message:
          "Missing required columns: Role / Location / Type / Description",
      });
    }

    /* ================= READ JOB ROWS ================= */

    const jobs = [];

    for (let i = headerIndex + 1; i < data.length; i++) {
      const row = data[i];

      const role = String(row[roleIndex] || "").trim();
      const location = String(row[locationIndex] || "").trim();
      const type = String(row[typeIndex] || "").trim();
      const description = String(row[descIndex] || "").trim();

      if (!role && !location && !type && !description) continue;

      jobs.push([role, location, type, description, detectedTargetEmail]);
    }

    if (jobs.length === 0) {
      deleteFile();

      return res.status(400).json({
        success: false,
        message: "No valid job rows found",
      });
    }

    /* ================= SAFE DATABASE TRANSACTION ================= */

    const sql =
      "INSERT INTO jobs (role, location, type, description, target_email) VALUES ?";

    db.beginTransaction((err) => {
      if (err) {
        deleteFile();

        return res.status(500).json({
          success: false,
          message: "Transaction start failed",
        });
      }

      /* DELETE OLD JOBS */

      db.query("DELETE FROM jobs", (deleteErr) => {
        if (deleteErr) {
          return db.rollback(() => {
            deleteFile();

            res.status(500).json({
              success: false,
              message: "Failed to clear old jobs",
            });
          });
        }

        /* INSERT NEW JOBS */

        db.query(sql, [jobs], (insertErr) => {
          if (insertErr) {
            return db.rollback(() => {
              deleteFile();

              res.status(500).json({
                success: false,
                message: "Database insert failed",
              });
            });
          }

          /* COMMIT */

          db.commit((commitErr) => {
            deleteFile();

            if (commitErr) {
              return db.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: "Commit failed",
                });
              });
            }

            res.json({
              success: true,
              message: "Jobs uploaded successfully",
              count: jobs.length,
            });
          });
        });
      });
    });
  } catch (err) {
    console.log(err);

    deleteFile();

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});
/* ================= APPLY JOB ================= */
app.post("/api/apply", upload.single("resume"), (req, res) => {
  const { name, email, phone, role } = req.body;

  const filePath = req.file?.path;

  const deleteFile = () => {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!name || !email || !phone || !role) {
    deleteFile();
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume file required",
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    deleteFile();
    return res.status(400).json({
      success: false,
      message: "Only PDF resume allowed",
    });
  }

  /* ================= ⭐ FIX START HERE ================= */

  const roles = role.split(",").map((r) => r.trim());

  db.query(
    `SELECT DISTINCT target_email FROM jobs WHERE role IN (?)`,
    [roles],
    (err, result) => {
      if (err) {
        deleteFile();
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!result.length) {
        deleteFile();
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      const targetEmail = result[0].target_email;

      res.json({
        success: true,
        message: "Application received",
      });

      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: targetEmail,
          subject: `New Application - ${role}`,
          text:
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Role: ${role}`,
          attachments: [
            {
              filename: req.file.originalname,
              path: filePath,
            },
          ],
        },
        () => {
          deleteFile();
        },
      );
    },
  );
});
/* ================= GET JOBS ================= */
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, result) => {
    if (err) return res.status(500).json({ success: false, jobs: [] });

    res.json({ success: true, jobs: result });
  });
});

/* ================= ROLES ================= */
app.get("/api/roles", (req, res) => {
  db.query("SELECT id, role FROM jobs", (err, result) => {
    if (err) return res.status(500).json({ success: false, roles: [] });

    res.json({
      success: true,
      roles: result, // now contains id + role
    });
  });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
