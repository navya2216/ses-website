require("dotenv").config();

/* ================= IMPORTS ================= */
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");
const mysql = require("mysql2");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4005;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: "deny",
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  }),
);

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many contact requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(
  cors({
    origin: [
      "https://softelectronicsolutions.com",
      "https://www.softelectronicsolutions.com",
      "http://localhost:3000",
      "http://localhost:4005",
    ],

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "build")));

/* ================= MYSQL ================= */
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "career_portal",
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
    console.error(
      "Make sure MySQL is running and credentials are correct in .env",
    );
  } else {
    console.log("✓ MySQL Connected");
  }
});

const createTransporter = () => {
  try {
    const user = "anukomire81@gmail.com";
    const pass = "fydu hbms jnsg tdyh";

    console.log("Creating transporter with:", {
      user: user,
      passLength: pass ? pass.length : 0,
      passFirst4: pass ? pass.substring(0, 4) + "..." : "none",
      passHasSpaces: pass ? pass.includes(" ") : false,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    console.log("Transporter created successfully");
    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

// Validate email function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate form data
const validateFormData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return errors;
};

// Test email connection endpoint
app.get("/api/test-email", async (req, res) => {
  try {
    console.log("\n=== EMAIL TEST ===");
    console.log("GMAIL_USER:", process.env.GMAIL_USER);
    console.log(
      "GMAIL_APP_PASSWORD length:",
      process.env.GMAIL_APP_PASSWORD
        ? process.env.GMAIL_APP_PASSWORD.length
        : 0,
    );
    console.log(
      "GMAIL_APP_PASSWORD first 4 chars:",
      process.env.GMAIL_APP_PASSWORD
        ? process.env.GMAIL_APP_PASSWORD.substring(0, 4) + "..."
        : "NOT SET",
    );

    const transporter = createTransporter();

    // Verify connection configuration
    console.log("Verifying transporter...");
    await transporter.verify();

    console.log(" Email verification successful");
    res.status(200).json({
      success: true,
      message: "Email server is ready to send messages",
      email: process.env.GMAIL_USER ? "Configured" : "Not configured",
    });
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    res.status(500).json({
      success: false,
      message: "Email configuration error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Check server configuration",
      code: error.code,
    });
  }
});
// Contact form endpoint with rate limiting
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    console.log("Contact form submission received:", req.body);

    const { name, email, company, phone, message } = req.body;

    // Validate required fields
    const validationErrors = validateFormData({ name, email, message });
    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Create email transporter
    const transporter = createTransporter();

    // Test connection
    await transporter.verify();
    console.log("Email server connection verified");

    // Email options for company
    const mailOptionsToCompany = {
      from: `"Website Contact Form" <${process.env.GMAIL_USER || "anukomire81@gmail.com"}>`,
      to: process.env.GMAIL_USER || "anukomire81@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission: ${name}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2C3E50;">New Contact Form Submission</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid #FF6B35;">
                        <h3 style="color: #2C3E50;">Contact Information:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
                        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #3498DB;">
                        <h3 style="color: #2C3E50;">Message:</h3>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f4fc; border-radius: 5px;">
                        <p style="margin: 0; color: #2C3E50;">
                            <strong>Submitted:</strong> ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n${company ? `Company: ${company}\n` : ""}${phone ? `Phone: ${phone}\n` : ""}\nMessage:\n${message}\n\nSubmitted: ${new Date().toLocaleString()}`,
    };

    // Email options for user (confirmation)
    const mailOptionsToUser = {
      from: `"Soft Electronic Solutions" <${process.env.GMAIL_USER || "anukomire81@gmail.com"}>`,
      to: email,
      subject: "Thank you for contacting Soft Electronic Solutions",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; padding: 20px 0;">
                        <h1 style="color: #2C3E50;">Thank You!</h1>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #2C3E50;">Dear ${name},</h2>
                        
                        <p>Thank you for reaching out to Soft Electronic Solutions. We have received your message and one of our representatives will get back to you within 24-48 hours.</p>
                        
                        <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 5px; border: 1px solid #ddd;">
                            <p><strong>Your Message:</strong></p>
                            <p style="color: #555; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"</p>
                        </div>
                        
                        <p><strong>Our Contact Information:</strong></p>
                        <ul style="color: #555;">
                            <li>Email: anukomire81@gmail.com</li>
                            <li>Phone: +91 8415796558</li>
                            <li>Business Hours: Monday - Saturday, 10:00 AM - 7:00 PM</li>
                        </ul>
                        
                        <p>Best regards,<br>
                        <strong>Soft Electronic Solutions Team</strong></p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; text-align: center; background: #2C3E50; color: white; border-radius: 5px;">
                        <p style="margin: 0;">© ${new Date().getFullYear()} Soft Electronic Solutions. All rights reserved.</p>
                    </div>
                </div>
            `,
      text: `Thank you for contacting Soft Electronic Solutions!\n\nDear ${name},\n\nThank you for reaching out to Soft Electronic Solutions. We have received your message and one of our representatives will get back to you within 24-48 hours.\n\nYour Message:\n"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"\n\nOur Contact Information:\n- Email: anukomire81@gmail.com\n- Phone: +91 8415796558\n- Business Hours: Monday - Saturday, 10:00 AM - 7:00 PM\n\nBest regards,\nSoft Electronic Solutions Team\n\n© ${new Date().getFullYear()} Soft Electronic Solutions. All rights reserved.`,
    };

    console.log("Sending emails...");

    // Send email to company
    const companyResult = await transporter.sendMail(mailOptionsToCompany);
    console.log("Email sent to company:", companyResult.messageId);

    // Send confirmation email to user
    const userResult = await transporter.sendMail(mailOptionsToUser);
    console.log("Confirmation email sent to user:", userResult.messageId);

    res.status(200).json({
      success: true,
      message:
        "Thank you for your message! We have sent you a confirmation email and will get back to you soon.",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    let errorMessage = "Failed to send message. Please try again later.";

    if (error.code === "EAUTH") {
      errorMessage =
        "Email authentication failed. Please check your Gmail App Password in the .env file.";
    } else if (error.code === "ESOCKET") {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.message.includes("Invalid login")) {
      errorMessage =
        "Invalid email credentials. Please check GMAIL_USER and GMAIL_APP_PASSWORD in .env file.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// ============================================================
// CAREER PAGE API ROUTES
// ============================================================
const otpStore = new Map();
let hrEmail = "";

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS length:",
      process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
    );
  } else {
    console.log("✅ Email transporter verified and ready");
  }
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

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required",
    });
  }

  const userEmail = normalizeEmail(email);

  try {
    const otp = generateOTP();

    otpStore.set(userEmail, {
      otp,
      verified: false,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    console.log(`\n=== OTP GENERATED ===`);
    console.log(`Email: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(
      `Expiry: ${new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString()}`,
    );
    console.log(`=== USE THIS OTP FOR TESTING ===\n`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "OTP Verification - SES Career Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2C3E50;">OTP Verification</h2>
          <p>Your One-Time Password (OTP) for SES Career Portal is:</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #FF6B35; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color: #999; font-size: 12px;">SES Career Portal - Soft Electronic Solutions</p>
        </div>
      `,
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 5 minutes.`,
    });

    console.log(`✅ OTP sent successfully to ${email}`);
    res.json({
      success: true,
      message: "OTP sent",
    });
  } catch (err) {
    console.error("❌ OTP send error:", err.message);
    console.log(`\n⚠️  EMAIL SENDING FAILED`);
    console.log(`Error Details: ${err.message}`);
    console.log(`\nTo fix email sending:`);
    console.log(
      `1. Generate Gmail App Password at: https://myaccount.google.com/apppasswords`,
    );
    console.log(`2. Update EMAIL_PASS in .env file`);
    console.log(`3. Restart server\n`);

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
// Serve React app for all non-API routes (MUST be last, before listen)
// Serve React app for all non-API routes (MUST be last, before listen)
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(__dirname, "build", "index.html");
    console.log(`Serving React app for: ${req.path} from ${indexPath}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(404).send("Build folder not found. Run: npm run build");
      }
    });
  } else {
    next();
  }
});

app.listen(PORT, "0.0.0.0", () => {
  const domain = process.env.CLOUDFLARE_DOMAIN || "localhost";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  console.log(`\n✅ Server running on ${protocol}://${domain}`);
  console.log(
    `📍 API Base URL: ${process.env.REACT_APP_API_URL || `http://localhost:${PORT}`}`,
  );
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
