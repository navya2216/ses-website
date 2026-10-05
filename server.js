require("dotenv").config();

/* =========================================================
   IMPORTS
========================================================= */

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");
const mysql = require("mysql2");
const http = require("http");
const WebSocket = require("ws");

/* =========================================================
   APP CONFIG
========================================================= */

const app = express();

const PORT = process.env.PORT || 4006;

const UPLOAD_DIR = path.join(__dirname, "uploads");
const SECONDARY_UPLOAD_DIR = path.join(__dirname, "public", "uploads");
const RESUME_DIR = path.join(__dirname, "resume");
const BUILD_DIR = path.join(__dirname, "build");

/* =========================================================
   CREATE DIRECTORIES
========================================================= */

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(SECONDARY_UPLOAD_DIR)) {
  fs.mkdirSync(SECONDARY_UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   STATIC UPLOAD FILES
========================================================= */

app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/uploads", express.static(SECONDARY_UPLOAD_DIR));
app.use("/uploads", express.static(RESUME_DIR));
app.use("/resume", express.static(RESUME_DIR));

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  dest: RESUME_DIR,
});

/* =========================================================
   MYSQL CONNECTION
========================================================= */

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "career_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================================================
   DATABASE TEST
========================================================= */

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }

  console.log("✅ MySQL connected successfully");
  connection.release();
});

/* =========================================================
   EMAIL CONFIG
========================================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================================
   OTP / LOGIN STORAGE
========================================================= */

const otpStore = new Map();
const loginUsers = new Map();

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function getResumeFilename(resumePath) {
  if (!resumePath) {
    return null;
  }

  const normalized = String(resumePath).replace(/\\/g, "/").replace(/^\/+/, "");

  const withoutPublic = normalized.startsWith("public/")
    ? normalized.slice("public/".length)
    : normalized;

  const match = withoutPublic.match(/^(?:uploads|resume)\/([^/]+)$/);

  if (!match) {
    return null;
  }

  return match[1];
}

async function deleteFileSafe(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
    console.log("🗑️ Deleted file:", filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("❌ File delete error:", error);
    }
  }
}

async function deleteResume(resumePath) {
  const filename = getResumeFilename(resumePath);

  if (!filename) {
    console.warn("⚠️ Invalid resume path:", resumePath);
    return false;
  }

  const possibleLocations = [
    path.join(RESUME_DIR, filename),
    path.join(UPLOAD_DIR, filename),
    path.join(SECONDARY_UPLOAD_DIR, filename),
  ];

  for (const filePath of possibleLocations) {
    await deleteFileSafe(filePath);
  }

  return true;
}

async function cleanupUploadedFile(filePath) {
  if (!filePath) {
    return;
  }

  await deleteFileSafe(filePath);
}

async function getApplicationResume(id) {
  const [rows] = await db.promise().query(
    `
      SELECT resume_path
      FROM applications
      WHERE id=?
    `,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0].resume_path;
}

async function findResumeFile(resumePath) {
  const filename = getResumeFilename(resumePath);

  if (!filename || path.basename(filename) !== filename) {
    return null;
  }

  const candidatePaths = [RESUME_DIR, UPLOAD_DIR, SECONDARY_UPLOAD_DIR].map(
    (directory) => path.join(directory, filename),
  );

  for (const filePath of candidatePaths) {
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
      return filePath;
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "EACCES") {
        throw error;
      }
    }
  }

  return null;
}

/* =========================================================
   LOGIN API
========================================================= */

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const [superAdmins] = await db.promise().query(
      `
        SELECT id, name, email, password
        FROM super_admin
        WHERE LOWER(email)=?
      `,
      [normalizedEmail],
    );

    if (superAdmins.length > 0) {
      const superAdmin = superAdmins[0];

      if (superAdmin.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpStore.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: superAdmin.email,
          subject: "SES Website Login OTP",
          text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`,
        });

        console.log("✅ OTP sent to:", superAdmin.email);
      } catch (emailError) {
        console.error("❌ OTP email error:", emailError);

        return res.status(500).json({
          success: false,
          message: "Unable to send OTP.",
        });
      }

      return res.json({
        success: true,
        message: "OTP sent successfully.",
        role: "SUPER_ADMIN",
      });
    }

    const [admins] = await db.promise().query(
      `
        SELECT id, name, email, password
        FROM admins
        WHERE LOWER(email)=? AND status='Active'
      `,
      [normalizedEmail],
    );

    if (admins.length === 0 || admins[0].password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const admin = admins[0];
    loginUsers.set(normalizedEmail, {
      role: "ADMIN",
      adminId: admin.id,
      loginTime: Date.now(),
    });

    return res.json({
      success: true,
      role: "ADMIN",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

/* =========================================================
   VERIFY OTP
========================================================= */

app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required.",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);

  if (!stored) {
    return res.status(400).json({
      success: false,
      message: "OTP expired or not found.",
    });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);

    return res.status(400).json({
      success: false,
      message: "OTP expired.",
    });
  }

  if (String(stored.otp) !== String(otp)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP.",
    });
  }

  otpStore.delete(normalizedEmail);

  try {
    const [superAdmins] = await db.promise().query(
      `
        SELECT id, name, email
        FROM super_admin
        WHERE LOWER(email)=?
      `,
      [normalizedEmail],
    );

    if (superAdmins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found.",
      });
    }

    const superAdmin = superAdmins[0];

    loginUsers.set(normalizedEmail, {
      role: "SUPER_ADMIN",
      superAdminId: superAdmin.id,
      loginTime: Date.now(),
    });

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      role: "SUPER_ADMIN",
      superAdmin,
    });
  } catch (error) {
    console.error("❌ OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed.",
    });
  }
});

/* =========================================================
   CREATE ADMIN
========================================================= */

app.post("/api/createadmin", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  try {
    const [existing] = await db.promise().query(
      `
        SELECT id
        FROM users
        WHERE email=?
      `,
      [email],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists.",
      });
    }

    await db.promise().query(
      `
        INSERT INTO users
        (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `,
      [name, email, password, role || "admin"],
    );

    return res.json({
      success: true,
      message: "Admin created successfully.",
    });
  } catch (error) {
    console.error("❌ Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin.",
    });
  }
});

/* =========================================================
   GET ADMINS
========================================================= */

app.get("/api/admins", async (req, res) => {
  try {
    const [admins] = await db.promise().query(
      `
        SELECT id, name, email, role
        FROM users
        ORDER BY id DESC
      `,
    );

    return res.json(admins);
  } catch (error) {
    console.error("❌ Get admins error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admins.",
    });
  }
});

/* =========================================================
   UPDATE ADMIN
========================================================= */

app.put("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    if (password) {
      await db.promise().query(
        `
          UPDATE users
          SET name=?, email=?, password=?, role=?
          WHERE id=?
        `,
        [name, email, password, role, id],
      );
    } else {
      await db.promise().query(
        `
          UPDATE users
          SET name=?, email=?, role=?
          WHERE id=?
        `,
        [name, email, role, id],
      );
    }

    return res.json({
      success: true,
      message: "Admin updated successfully.",
    });
  } catch (error) {
    console.error("❌ Update admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admin.",
    });
  }
});

/* =========================================================
   DELETE ADMIN
========================================================= */

app.delete("/api/admins/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query(
      `
        DELETE FROM users
        WHERE id=?
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    return res.json({
      success: true,
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admin.",
    });
  }
});

/* =========================================================
   LOGOUT
========================================================= */

app.post("/api/admin/logout", (req, res) => {
  const { email } = req.body;

  if (email) {
    loginUsers.delete(email);
  }

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

/* =========================================================
   UPLOAD JOBS EXCEL
========================================================= */

app.post("/api/upload-jobs", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Excel file is required.",
    });
  }

  let connection;

  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    if (!worksheet || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty.",
      });
    }

    const targetEmails = [
      ...new Set(
        rows
          .slice(0, 5)
          .flat()
          .map((value) => String(value).trim().toLowerCase())
          .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
      ),
    ];

    if (targetEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Target email is missing from the Excel template.",
      });
    }

    const normalizeHeader = (value) => String(value).trim().toLowerCase();
    const headerIndex = rows.findIndex((row) =>
      row.some((value) => normalizeHeader(value) === "job role"),
    );

    if (headerIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Job columns header not found.",
      });
    }

    const headers = rows[headerIndex].map(normalizeHeader);
    const requiredHeaders = [
      "job role",
      "location",
      "job type",
      "description",
      "number of vacancies",
    ];
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header),
    );

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required Excel columns are missing.",
        missingFields: missingHeaders,
      });
    }

    const column = Object.fromEntries(
      requiredHeaders.map((header) => [header, headers.indexOf(header)]),
    );
    const jobs = [];

    for (
      let rowIndex = headerIndex + 1;
      rowIndex < rows.length;
      rowIndex += 1
    ) {
      const row = rows[rowIndex];
      const jobRole = String(row[column["job role"]] || "").trim();

      if (!jobRole) {
        continue;
      }

      const vacanciesValue = row[column["number of vacancies"]];
      const vacancies =
        vacanciesValue === "" || vacanciesValue === null
          ? 0
          : Number(vacanciesValue);
      const job = {
        job_role: jobRole,
        location: String(row[column.location] || "").trim(),
        job_type: String(row[column["job type"]] || "").trim(),
        description: String(row[column.description] || "").trim(),
        vacancies,
      };

      const missingFields = [
        ["location", job.location],
        ["job type", job.job_type],
        ["description", job.description],
      ]
        .filter(([, value]) => !value)
        .map(([field]) => field);

      if (
        missingFields.length > 0 ||
        !Number.isInteger(vacancies) ||
        vacancies < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid job data on Excel row ${rowIndex + 1}.`,
          missingFields,
        });
      }

      jobs.push(job);
    }

    if (jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No job records found.",
      });
    }

    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    for (const email of targetEmails) {
      await connection.query("DELETE FROM career_jobs WHERE target_email=?", [
        email,
      ]);

      for (const job of jobs) {
        await connection.query(
          `
            INSERT INTO career_jobs
              (target_email, job_role, location, job_type, description, vacancies)
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            email,
            job.job_role,
            job.location,
            job.job_type,
            job.description,
            job.vacancies,
          ],
        );
      }
    }

    await connection.commit();

    return res.json({
      success: true,
      message: "Jobs uploaded successfully.",
      totalJobs: jobs.length,
    });
  } catch (error) {
    console.error("❌ Job upload error:", error);

    if (connection) {
      await connection.rollback();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload jobs.",
    });
  } finally {
    if (connection) {
      connection.release();
    }

    await cleanupUploadedFile(req.file.path);
  }
});

/* =========================================================
   GET JOBS
========================================================= */

app.get("/api/career/jobs", async (req, res) => {
  try {
    const [jobs] = await db.promise().query(
      `
        SELECT id, job_role, location, job_type, description, vacancies
        FROM career_jobs
        WHERE vacancies > 0
        ORDER BY created_at DESC, id DESC
      `,
    );

    return res.json({ success: true, jobs });
  } catch (error) {
    console.error("❌ Get jobs error:", error);

    return res.status(500).json({
      success: false,
      jobs: [],
      message: "Failed to load jobs.",
    });
  }
});

/* =========================================================
   APPLY FOR JOB
========================================================= */

app.post("/api/apply", upload.single("resume"), async (req, res) => {
  let resumeFilePath = req.file?.path || null;

  try {
    const {
      job_id,
      job_ids,
      selected_roles,
      applicant_name,
      name,
      applicant_email,
      email,
      applicant_phone,
      phone,
      experience_type,
      current_salary,
      expected_salary,
    } = req.body;

    const applicantName = String(applicant_name || name || "").trim();
    const applicantEmail = String(applicant_email || email || "")
      .trim()
      .toLowerCase();
    const applicantPhone = String(applicant_phone || phone || "").trim();
    let selectedJobIds;

    try {
      selectedJobIds = job_ids ? JSON.parse(job_ids) : job_id ? [job_id] : [];
    } catch {
      await cleanupUploadedFile(resumeFilePath);
      return res.status(400).json({
        success: false,
        message: "Selected roles are invalid.",
      });
    }

    if (!Array.isArray(selectedJobIds)) {
      await cleanupUploadedFile(resumeFilePath);
      return res.status(400).json({
        success: false,
        message: "Selected roles are invalid.",
      });
    }

    selectedJobIds = [
      ...new Set(
        selectedJobIds
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    ];

    if (
      selectedJobIds.length === 0 ||
      !applicantName ||
      !applicantEmail ||
      !applicantPhone ||
      !experience_type ||
      !expected_salary ||
      !req.file
    ) {
      if (req.file) {
        await cleanupUploadedFile(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "All required fields and resume are required.",
      });
    }

    const [jobs] = await db.promise().query(
      `
        SELECT id, job_role, target_email
        FROM career_jobs
        WHERE id IN (?) AND vacancies > 0
      `,
      [selectedJobIds],
    );

    const jobsById = new Map(jobs.map((job) => [Number(job.id), job]));
    const selectedJobs = selectedJobIds.map((id) => jobsById.get(id));

    if (selectedJobs.some((job) => !job)) {
      await cleanupUploadedFile(resumeFilePath);

      return res.status(404).json({
        success: false,
        message: "One or more selected roles are no longer available.",
      });
    }

    const [existingApplications] = await db.promise().query(
      `
        SELECT id
        FROM applications
        WHERE applicant_email=? OR applicant_phone=?
        LIMIT 1
      `,
      [applicantEmail, applicantPhone],
    );

    if (existingApplications.length > 0) {
      await cleanupUploadedFile(resumeFilePath);

      return res.status(409).json({
        success: false,
        message:
          "An application with this email or phone number already exists. Contact the administrator if you need to update it.",
      });
    }

    const firstJob = selectedJobs[0];
    const selectedRoles = selectedJobs.map((job) => job.job_role).join(", ");
    const resumePath = path.posix.join("resume", req.file.filename);

    const [result] = await db.promise().query(
      `
        INSERT INTO applications
        (
          job_id,
          selected_roles,
          applicant_name,
          applicant_email,
          applicant_phone,
          experience_type,
          current_salary,
          expected_salary,
          resume_path,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        firstJob.id,
        selected_roles || selectedRoles,
        applicantName,
        applicantEmail,
        applicantPhone,
        experience_type,
        current_salary || null,
        expected_salary,
        resumePath,
        "Pending",
      ],
    );

    console.log("✅ Application created:", result.insertId);
    console.log("📄 Resume stored at:", resumeFilePath);
    console.log("🗂️ Resume DB path:", resumePath);

    sendNotification({
      type: "new_application",
      applicationId: result.insertId,
      name: applicantName,
      email: applicantEmail,
      job_title: selected_roles || selectedRoles,
    });

    return res.json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Application submit error:", error);

    if (resumeFilePath) {
      await cleanupUploadedFile(resumeFilePath);
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "An application with this email or phone number already exists. Contact the administrator if you need to update it.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
});
/* =========================================================
   GET ROLES
========================================================= */

app.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
        SELECT id, job_role AS role, vacancies
        FROM career_jobs
        WHERE vacancies > 0
        ORDER BY job_role ASC
      `,
    );

    return res.json({ success: true, roles: rows });
  } catch (error) {
    console.error("❌ Get roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load roles.",
      roles: [],
    });
  }
});

/* =========================================================
   GET APPLICATIONS
========================================================= */

app.get("/api/applications", async (req, res) => {
  try {
    const [applications] = await db.promise().query(
      `
        SELECT *
        FROM applications
        ORDER BY id DESC
      `,
    );

    return res.json(applications);
  } catch (error) {
    console.error("❌ Get applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load applications.",
    });
  }
});
/* =========================================================
   UPDATE APPLICATION STATUS
========================================================= */

app.put("/api/applications/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const nextStatusesByStatus = {
    Pending: ["Shortlisted", "Rejected"],
    Shortlisted: ["Selected", "Rejected"],
    Selected: [],
    Rejected: [],
  };

  if (!Object.prototype.hasOwnProperty.call(nextStatusesByStatus, status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application status.",
    });
  }

  try {
    const [applications] = await db.promise().query(
      `
        SELECT status, resume_path
        FROM applications
        WHERE id=?
      `,
      [id],
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const currentStatus = applications[0].status;

    if (!nextStatusesByStatus[currentStatus]?.includes(status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot move an application from ${currentStatus} to ${status}.`,
      });
    }

    const [result] =
      status === "Rejected"
        ? await db.promise().query(
            `
              UPDATE applications
              SET status=?, resume_path=NULL
              WHERE id=?
            `,
            [status, id],
          )
        : await db.promise().query(
            `
              UPDATE applications
              SET status=?
              WHERE id=?
            `,
            [status, id],
          );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (status === "Rejected" && applications[0].resume_path) {
      await deleteResume(applications[0].resume_path);
    }

    return res.json({
      success: true,
      message:
        status === "Rejected"
          ? "Application rejected; resume deleted and applicant details retained."
          : "Application status updated successfully.",
    });
  } catch (error) {
    console.error("❌ Update application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application.",
    });
  }
});

/* =========================================================
   GET SINGLE APPLICATION
========================================================= */

app.get("/api/applications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [applications] = await db.promise().query(
      `
        SELECT *
        FROM applications
        WHERE id=?
      `,
      [id],
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json(applications[0]);
  } catch (error) {
    console.error("❌ Get application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load application.",
    });
  }
});
app.get("/api/applications/:id/resume", async (req, res) => {
  try {
    const resumePath = await getApplicationResume(req.params.id);

    if (!resumePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for this application.",
      });
    }

    const filePath = await findResumeFile(resumePath);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume file is missing from server storage.",
      });
    }

    const disposition = req.query.download === "1" ? "attachment" : "inline";

    return res.sendFile(
      filePath,
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${disposition}; filename="candidate-resume.pdf"`,
          "X-Content-Type-Options": "nosniff",
        },
      },
      (error) => {
        if (error && !res.headersSent) {
          console.error("Resume response error:", error);
          res.status(error.statusCode || 500).json({
            success: false,
            message: "Unable to serve this resume.",
          });
        }
      },
    );
  } catch (error) {
    console.error("Get application resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load resume.",
    });
  }
});

/* =========================================================
   DELETE APPLICATION
========================================================= */

app.delete("/api/applications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [applications] = await db
      .promise()
      .query("SELECT resume_path FROM applications WHERE id=?", [id]);

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (applications[0].resume_path) {
      await deleteResume(applications[0].resume_path);
    }

    const [result] = await db.promise().query(
      `
        DELETE FROM applications
        WHERE id=?
      `,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete application.",
    });
  }
});

/* =========================================================
   DASHBOARD STATS
========================================================= */

app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const [[adminResult], [jobsResult], [applicationResult]] =
      await Promise.all([
        db.promise().query("SELECT COUNT(*) AS count FROM admins"),
        db.promise().query("SELECT COUNT(*) AS count FROM career_jobs"),
        db.promise().query(
          `
            SELECT
              COUNT(*) AS total,
              COALESCE(SUM(status='Pending'), 0) AS pending,
              COALESCE(SUM(status='Shortlisted'), 0) AS shortlisted,
              COALESCE(SUM(status='Selected'), 0) AS selected,
              COALESCE(SUM(status='Rejected'), 0) AS rejected
            FROM applications
          `,
        ),
      ]);

    return res.json({
      success: true,
      stats: {
        totalAdmins: Number(adminResult[0].count),
        totalJobs: Number(jobsResult[0].count),
        totalApplications: Number(applicationResult[0].total),
        pendingApplications: Number(applicationResult[0].pending),
        shortlistedApplications: Number(applicationResult[0].shortlisted),
        selectedApplications: Number(applicationResult[0].selected),
        rejectedApplications: Number(applicationResult[0].rejected),
      },
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
});

/* =========================================================
   CONTACT API
========================================================= */

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required.",
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || "Website Contact Form",
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message}
      `,
    });

    return res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("❌ Contact email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

/* =========================================================
   REACT BUILD
========================================================= */

app.use(express.static(BUILD_DIR));

/* =========================================================
   REACT CATCH-ALL
========================================================= */

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
    return next();
  }

  res.sendFile(path.join(BUILD_DIR, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

/* =========================================================
   HTTP SERVER
========================================================= */

const server = http.createServer(app);

/* =========================================================
   WEBSOCKET
========================================================= */

const wss = new WebSocket.Server({
  server,
});

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("✅ WebSocket Connected");

  clients.add(ws);

  ws.on("message", (message) => {
    console.log("Client Message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket Disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket Error:", error);
    clients.delete(ws);
  });
});

function sendNotification(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

global.sendNotification = sendNotification;

/* =========================================================
   SERVER START
========================================================= */

server.listen(PORT, "0.0.0.0", () => {
  console.log("=========================================");
  console.log(`✅ Website and API running on http://localhost:${PORT}`);
  console.log(`✅ WebSocket running on ws://localhost:${PORT}`);
  console.log("=========================================");
});
