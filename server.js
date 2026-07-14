require("dotenv").config();

/* ================= IMPORTS ================= */
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4007"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "career_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 4006;

/* ================= MEMORY ================= */
const otpStore = new Map();
const loginUsers = new Map();

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

app.post("/api/superadmin/send-otp", async (req, res) => {
  const { email, password } = req.body;

  const key = normalizeEmail(email);

  db.query(
    "SELECT * FROM super_admin WHERE LOWER(email)=?",
    [key],
    async (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Super Admin not found",
        });
      }

      // Check Password
      if (rows[0].password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

      otpStore.delete(key);

      const otp = generateOTP();

      otpStore.set(key, {
        otp,
        role: "SUPER_ADMIN",
        verified: false,
        expiry: Date.now() + 5 * 60 * 1000,
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: rows[0].email,
          subject: "Super Admin OTP",
          text: `Your OTP is ${otp}`,
        });

        res.json({
          success: true,
          message: "OTP Sent",
        });
      } catch (e) {
        console.log(e);

        res.status(500).json({
          success: false,
          message: "Mail Failed",
        });
      }
    },
  );
});
app.post("/api/superadmin/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const key = normalizeEmail(email);

  const data = otpStore.get(key);

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP Not Found",
    });
  }

  if (Date.now() > data.expiry) {
    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  if (data.otp !== otp) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  data.verified = true;

  loginUsers.set(key, {
    role: "SUPER_ADMIN",
    loginTime: Date.now(),
  });

  console.log("SUPER ADMIN LOGIN SUCCESS");
  console.log(loginUsers);

  res.json({
    success: true,
    message: "Login Successful",
  });
});

/* ================= CREATE ADMIN ================= */

app.post("/api/createadmin", (req, res) => {
  const { superAdminEmail, name, email, password } = req.body;

  const superKey = normalizeEmail(superAdminEmail);

  console.log("Create Admin Request Email:", superKey);

  console.log("Current Login Users:", loginUsers);

  // Check Super Admin Login
  if (loginUsers.get(superKey)?.role !== "SUPER_ADMIN") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Super Admin",
    });
  }

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Password are required",
    });
  }

  // Get Super Admin ID

  db.query(
    "SELECT id FROM super_admin WHERE LOWER(email)=?",
    [superKey],

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Super Admin not found",
        });
      }

      const superAdminId = result[0].id;

      // Insert Admin

      db.query(
        `
        INSERT INTO admins
        (
          super_admin_id,
          name,
          email,
          password
        )
        VALUES(?,?,?,?)
        `,

        [superAdminId, name, email.toLowerCase(), password],

        (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Admin email already exists",
            });
          }

          // websocket notification

          if (global.sendNotification) {
            global.sendNotification({
              type: "ADMIN_CREATED",

              message: `New Admin ${name} created`,
            });
          }

          res.json({
            success: true,

            message: "Admin Created Successfully",
          });
        },
      );
    },
  );
});

/* ================= GET ALL ADMINS ================= */

app.get("/api/admins", (req, res) => {
  db.query(
    `
    SELECT
      id,
      name,
      email,
      password,
      phone,
      status,
      created_at
    FROM admins
    ORDER BY id DESC
    `,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      res.json({
        success: true,
        admins: result,
      });
    },
  );
});

/* ================= ADMIN LOGIN ================= */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE LOWER(email)=LOWER(?) AND status='Active'",
    [email],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Admin Not Found",
        });
      }

      const admin = rows[0];

      if (admin.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

      loginUsers.set(admin.email.toLowerCase(), {
        role: "ADMIN",
        adminId: admin.id,
        loginTime: Date.now(),
      });

      res.json({
        success: true,
        message: "Login Successful",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    },
  );
});

app.put("/api/admins/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone } = req.body;

  db.query(
    `UPDATE admins
     SET
       name=?,
       email=?,
       password=?,
       phone=?
     WHERE id=?`,
    [name, email, password, phone, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Update failed",
        });
      }

      res.json({
        success: true,
        message: "Admin updated successfully",
      });
    },
  );
});
/* ================= DELETE ADMIN BY SUPER ADMIN ================= */

app.delete("/api/admins/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM admins WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Delete failed",
      });
    }

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  });
});

/* ================= ADMIN LOGOUT ================= */

app.post("/api/admin/logout", (req, res) => {
  const { email } = req.body;

  if (email) {
    loginUsers.delete(email.toLowerCase());
  }

  res.json({
    success: true,

    message: "Logout Successful",
  });
});
/* ================= UPLOAD JOBS ================= */

// ================= FILE UPLOAD =================

// ================= UPLOAD JOB EXCEL API =================

app.post("/api/upload-jobs", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }
    const workbook = xlsx.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
    });

    /*
==============================
GET TARGET EMAIL
==============================
*/

    let targetEmails = [];

    for (let i = 0; i < 5; i++) {
      let row = sheet[i];

      if (row) {
        row.forEach((cell) => {
          if (typeof cell === "string" && cell.includes("@")) {
            targetEmails.push(cell.trim());
          }
        });
      }
    }

    if (targetEmails.length === 0) {
      return res.status(400).json({
        success: false,

        message: "Target Email missing in Excel",
      });
    }

    /*
==============================
FIND HEADER ROW
==============================
*/

    /*
==============================
FIND HEADER ROW
==============================
*/

    let headerIndex = -1;

    for (let i = 0; i < sheet.length; i++) {
      let row = sheet[i];

      if (
        row.some((cell) => String(cell).trim().toLowerCase() === "job role")
      ) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      return res.status(400).json({
        success: false,

        message: "Job columns header not found",
      });
    }

    const headers = sheet[headerIndex];

    const requiredFields = [
      "S.No",
      "Job Role",
      "Location",
      "Job Type",
      "Description",
      "Number of Vacancies",
    ];

    let missingHeaders = [];

    requiredFields.forEach((field) => {
      if (!headers.includes(field)) {
        missingHeaders.push(field);
      }
    });

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        success: false,

        message: "Missing Excel columns",
        missingFields: missingHeaders,
      });
    }

    /*
==============================
READ JOB DATA
==============================
*/

    let jobs = [];

    for (let i = headerIndex + 1; i < sheet.length; i++) {
      let row = sheet[i];

      if (!row[1]) continue;

      let job = {
        job_role: row[1],
        location: row[2],
        job_type: row[3],
        description: row[4],
        vacancies: row[5] || 0,
      };

      let missing = [];

      Object.entries(job).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          missing.push(key);
        }
      });

      if (missing.length) {
        return res.status(400).json({
          success: false,

          message: `Row ${i + 1} missing fields`,

          missingFields: missing,
        });
      }

      jobs.push(job);
    }

    if (jobs.length === 0) {
      return res.status(400).json({
        success: false,

        message: "No job records found",
      });
    }

    /*
==============================
DELETE OLD JOBS
==============================
*/

    for (let email of targetEmails) {
      await db
        .promise()
        .query("DELETE FROM career_jobs WHERE target_email=?", [email]);
    }

    /*
==============================
INSERT NEW JOBS
==============================
*/

    for (let email of targetEmails) {
      for (let job of jobs) {
        await db.promise().query(
          `
INSERT INTO career_jobs
(
target_email,
job_role,
location,
job_type,
description,
vacancies
)
VALUES(?,?,?,?,?,?)
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

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,

      message: "Jobs uploaded successfully",

      totalJobs: jobs.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
});
/* ================= APPLY JOB ================= */

app.get("/api/career/jobs", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
SELECT *
FROM career_jobs
ORDER BY id DESC
`,
    );

    res.json({
      success: true,
      jobs: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/api/apply", upload.single("resume"), async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const {
      job_ids,
      name,
      email,
      phone,
      experience_type,
      current_salary,
      expected_salary,
    } = req.body;

    const applicantEmail = email?.trim().toLowerCase();

    let selectedJobs = [];

    try {
      selectedJobs = JSON.parse(job_ids || "[]");
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid job selection.",
      });
    }

    const resumePath = req.file?.path;

    const deleteResume = () => {
      try {
        if (resumePath && fs.existsSync(resumePath)) {
          fs.unlinkSync(resumePath);
        }
      } catch (err) {
        console.log(err);
      }
    };

    /* ================= REQUIRED FIELDS ================= */

    if (
      !Array.isArray(selectedJobs) ||
      selectedJobs.length === 0 ||
      !name ||
      !applicantEmail ||
      !phone ||
      !experience_type ||
      !expected_salary
    ) {
      deleteResume();

      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    /* ================= RESUME VALIDATION ================= */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      deleteResume();

      return res.status(400).json({
        success: false,
        message: "Only PDF resumes are allowed.",
      });
    }

    /* ================= FETCH JOBS ================= */

    const [jobs] = await connection.query(
      `SELECT * FROM career_jobs WHERE id IN (?)`,
      [selectedJobs],
    );

    if (jobs.length !== selectedJobs.length) {
      deleteResume();

      return res.status(404).json({
        success: false,
        message: "One or more selected jobs were not found.",
      });
    }

    /* ================= VALIDATE & INSERT ================= */

    for (const job of jobs) {
      // Duplicate check
      const [alreadyApplied] = await connection.query(
        `SELECT id
         FROM applications
         WHERE job_id = ?
         AND applicant_email = ?`,
        [job.id, applicantEmail],
      );

      if (alreadyApplied.length > 0) {
        deleteResume();

        return res.status(400).json({
          success: false,
          message: `You have already applied for "${job.job_role}".`,
        });
      }

      // Maximum 20 applications
      const [count] = await connection.query(
        `SELECT COUNT(*) AS total
         FROM applications
         WHERE job_id = ?`,
        [job.id],
      );

      if (count[0].total >= 20) {
        deleteResume();

        return res.status(400).json({
          success: false,
          message: `"${job.job_role}" already received 20 applications.`,
        });
      }

      // Save application
      await connection.query(
        `INSERT INTO applications
        (
          job_id,
          applicant_name,
          applicant_email,
          applicant_phone,
          experience_type,
          current_salary,
          expected_salary,
          resume_path,
          status
        )
        VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          job.id,
          name,
          applicantEmail,
          phone,
          experience_type,
          current_salary || null,
          expected_salary,
          resumePath,
          "Pending",
        ],
      );
    }

    /* ================= SEND EMAIL ================= */
    // All selected job roles
    const selectedRoles = jobs.map((job) => job.job_role).join(", ");

    for (const job of jobs) {
      try {
        let mailText =
          `Selected Job Roles : ${selectedRoles}\n\n` +
          `Applicant Name : ${name}\n` +
          `Email : ${applicantEmail}\n` +
          `Phone : ${phone}\n` +
          `Experience : ${experience_type}\n`;

        // Show current salary only for experienced candidates
        if (experience_type === "Experienced") {
          mailText += `Current Salary : ${current_salary}\n`;
        }

        mailText += `Expected Salary : ${expected_salary}`;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: job.target_email,
          subject: `New Application - ${name}`,
          text: mailText,
          attachments: [
            {
              filename: req.file.originalname,
              path: resumePath,
            },
          ],
        });
      } catch (mailErr) {
        console.log("Mail Error:", mailErr);
      }
    }

    deleteResume();

    return res.json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (err) {
    console.log("Apply Error:", err);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  } finally {
    connection.release();
  }
});

/* ================= ROLES ================= */
app.get("/api/roles", (req, res) => {
  db.query(
    `
    SELECT
      id,
      job_role AS role
    FROM career_jobs
    ORDER BY job_role ASC
    `,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          roles: [],
        });
      }

      res.json({
        success: true,
        roles: result,
      });
    },
  );
});

/* ================= GET APPLICATIONS ================= */

/* ================= GET APPLICATIONS ================= */

app.get("/api/applications", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
        a.id,
        a.job_id,
        a.applicant_name,
        a.applicant_email,
        a.applicant_phone,
        a.experience_type,
        a.current_salary,
        a.expected_salary,
        a.status,
        a.applied_at,
        c.job_role
      FROM applications a
      INNER JOIN career_jobs c
        ON a.job_id = c.id
      ORDER BY a.applied_at DESC
    `);

    res.json({
      success: true,
      applications: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
/* ================= UPDATE APPLICATION STATUS ================= */

app.put("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.promise().query(
      `
      UPDATE applications
      SET status=?
      WHERE id=?
      `,
      [status, id],
    );

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});
/* ================= DELETE APPLICATION ================= */

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query(
      `
      DELETE FROM applications
      WHERE id=?
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});
/* ================= WEBSOCKET ================= */

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
});

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("WebSocket Connected");

  clients.add(ws);

  ws.on("message", (message) => {
    console.log("Client Message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket Disconnected");

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

// Export function available for APIs
global.sendNotification = sendNotification;

/* ================= START ================= */

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log(`WebSocket running on ws://localhost:${PORT}`);
});
