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

/* ===================== COMMON LOGIN ===================== */

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const key = normalizeEmail(email);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  /* ==========================================
      STEP 1 : CHECK SUPER ADMIN
  ========================================== */

  db.query(
    "SELECT * FROM super_admin WHERE LOWER(email)=?",
    [key],
    async (err, superRows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      // SUPER ADMIN FOUND
      if (superRows.length > 0) {
        const superAdmin = superRows[0];

        if (superAdmin.password !== password) {
          return res.status(401).json({
            success: false,
            message: "Invalid Password",
          });
        }

        // Remove previous OTP
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
            to: superAdmin.email,
            subject: "Super Admin OTP",
            text: `Your OTP is ${otp}`,
          });

          return res.json({
            success: true,
            role: "SUPER_ADMIN",
            otpRequired: true,
            message: "OTP Sent Successfully",
          });
        } catch (mailErr) {
          console.log(mailErr);

          return res.status(500).json({
            success: false,
            message: "Unable to send OTP",
          });
        }
      }

      /* ==========================================
          STEP 2 : CHECK ADMIN
      ========================================== */

      db.query(
        "SELECT * FROM admins WHERE LOWER(email)=? AND status='Active'",
        [key],
        (err2, adminRows) => {
          if (err2) {
            return res.status(500).json({
              success: false,
              message: "Database Error",
            });
          }

          if (adminRows.length === 0) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          const admin = adminRows[0];

          if (admin.password !== password) {
            return res.status(401).json({
              success: false,
              message: "Invalid Password",
            });
          }

          loginUsers.set(key, {
            role: "ADMIN",
            adminId: admin.id,
            loginTime: Date.now(),
          });

          return res.json({
            success: true,
            role: "ADMIN",
            otpRequired: false,
            message: "Login Successful",

            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
            },
          });
        },
      );
    },
  );
});

/* ================= VERIFY OTP ================= */

app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const key = normalizeEmail(email);

  const data = otpStore.get(key);

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP Not Found",
    });
  }

  // Check OTP Expiry
  if (Date.now() > data.expiry) {
    otpStore.delete(key);

    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  // Check OTP
  if (data.otp !== otp) {
    return res.status(401).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // OTP Verified
  data.verified = true;

  // Fetch Super Admin Details
  db.query(
    "SELECT id, name, email FROM super_admin WHERE LOWER(email)=?",
    [key],
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
          message: "Super Admin not found",
        });
      }

      const superAdmin = rows[0];

      // Store Login Session
      loginUsers.set(key, {
        role: "SUPER_ADMIN",
        superAdminId: superAdmin.id,
        loginTime: Date.now(),
      });

      console.log("SUPER ADMIN LOGIN SUCCESS");
      console.log(loginUsers);

      // Remove OTP after successful verification
      otpStore.delete(key);

      return res.json({
        success: true,
        role: "SUPER_ADMIN",
        message: "Login Successful",

        superAdmin: {
          id: superAdmin.id,
          name: superAdmin.name,
          email: superAdmin.email,
        },
      });
    },
  );
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

    const selectedRoles = jobs.map((job) => job.job_role).join(", ");

    if (jobs.length !== selectedJobs.length) {
      deleteResume();

      return res.status(404).json({
        success: false,
        message: "One or more selected jobs were not found.",
      });
    }

    /* ================= VALIDATE & INSERT ================= */

    for (const job of jobs) {
      /* ================= DUPLICATE APPLICATION CHECK ================= */

      const [alreadyApplied] = await connection.query(
        `SELECT status
         FROM applications
         WHERE job_id = ?
         AND LOWER(applicant_email) = LOWER(?)`,
        [job.id, applicantEmail],
      );

      if (alreadyApplied.length > 0) {
        deleteResume();

        let message;

        switch (alreadyApplied[0].status) {
          case "Pending":
            message = `You have already applied for "${job.job_role}". Your application is currently Pending.`;
            break;

          case "Shortlisted":
            message = `You have already applied for "${job.job_role}". Your application has been Shortlisted.`;
            break;

          case "Rejected":
            message = `You have already applied for "${job.job_role}". Your application was Rejected. You cannot apply again.`;
            break;

          case "Selected":
            message = `You have already applied for "${job.job_role}". Your application has been Selected.`;
            break;

          default:
            message = `You have already applied for "${job.job_role}".`;
        }

        return res.status(400).json({
          success: false,
          message,
        });
      }

      /* ================= MAXIMUM 20 APPLICATIONS ================= */

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

      /* ================= SAVE APPLICATION ================= */
      const selectedRoles = jobs.map((job) => job.job_role).join(", ");
      const firstJobId = jobs[0].id;

      await connection.query(
        `INSERT INTO applications
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
  VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          firstJobId,
          selectedRoles,
          name,
          applicantEmail,
          phone,
          experience_type,
          experience_type === "Experienced" ? current_salary : null,
          expected_salary,
          resumePath,
          "Pending",
        ],
      );
    }

    // ================= SEND SINGLE EMAIL =================

    // Remove duplicate HR email addresses
    const uniqueEmails = [...new Set(jobs.map((job) => job.target_email))];

    let mailText =
      `Selected Job Roles : ${selectedRoles}\n\n` +
      `Applicant Name : ${name}\n` +
      `Email : ${applicantEmail}\n` +
      `Phone : ${phone}\n` +
      `Experience : ${experience_type}\n`;

    if (experience_type === "Experienced") {
      mailText += `Current Salary : ${current_salary}\n`;
    }

    mailText += `Expected Salary : ${expected_salary}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: uniqueEmails.join(","), // Send one email to all unique recipients
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
app.get("/api/applications", (req, res) => {
  db.query(
    `SELECT
      id,
      applicant_name,
      applicant_email,
      applicant_phone,
      selected_roles,
      experience_type,
      current_salary,
      expected_salary,
      resume_path,
      status,
      applied_at
     FROM applications
     ORDER BY applied_at DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      res.json({
        success: true,
        applications: rows,
      });
    },
  );
});
// Update Status API

app.put("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["Pending", "Shortlisted", "Rejected"];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Status",
    });
  }

  db.query(
    "UPDATE applications SET status=? WHERE id=?",
    [status, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }

      res.json({
        success: true,
        message: "Status updated successfully.",
      });
    },
  );
});
// Get Single Application API (Optional)
app.get("/api/applications/:id", (req, res) => {
  db.query(
    `SELECT *
   FROM applications
   WHERE id=?`,
    [req.params.id],
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
          message: "Application not found.",
        });
      }

      res.json({
        success: true,
        application: rows[0],
      });
    },
  );
});

// Delete Application API
app.delete("/api/applications/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM applications WHERE id=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  });
});

/* ================= DASHBOARD STATISTICS ================= */

app.get("/api/dashboard/stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalAdmins FROM admins", (err, adminResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    stats.totalAdmins = adminResult[0].totalAdmins;

    db.query(
      "SELECT COUNT(*) AS totalJobs FROM career_jobs",
      (err, jobResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database Error",
          });
        }

        stats.totalJobs = jobResult[0].totalJobs;

        db.query(
          "SELECT COUNT(*) AS totalApplications FROM applications",
          (err, applicationResult) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Database Error",
              });
            }

            stats.totalApplications = applicationResult[0].totalApplications;

            res.json({
              success: true,
              stats,
            });
          },
        );
      },
    );
  });
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
