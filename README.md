# Soft Electronic Solutions Website

This repository contains the React website and its Express API. The built website and API run together from one server on port `4006`.

## Requirements

- Node.js and npm
- MySQL running locally
- A `career_portal` database with `super_admin` and `admins` tables
- Email credentials configured for Super Admin OTP delivery

The backend database connection is configured in `server.js`. Match it to your local MySQL account and database before starting the API. Do not commit database or email credentials.

> **Database warning:** Do not run the repository's extensionless `db` file as-is. It contains `DROP DATABASE` and `DROP TABLE` statements that can delete existing data. It also drops `super_admin` before its seed insert. Create or repair the schema safely first.

For login testing, these are the minimum account tables expected by the API:

```sql
CREATE DATABASE IF NOT EXISTS career_portal;
USE career_portal;

CREATE TABLE IF NOT EXISTS super_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  super_admin_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (super_admin_id) REFERENCES super_admin(id) ON DELETE CASCADE
);
```

Create one Super Admin account using your own reachable email and a local test password. Replace the example values before running this statement:

```sql
INSERT INTO super_admin (name, email, password)
VALUES ('Local Super Admin', 'you@example.com', 'replace-with-a-local-test-password');
```

The current login implementation stores and compares passwords as plain text. Use only throwaway local test credentials; this is not suitable for production.

## Configure Email OTP

The API reads `EMAIL_USER` and `EMAIL_PASS` from the root `.env` file. Configure a Gmail account and an app password if you want to test Super Admin OTP delivery:

```text
EMAIL_USER=your-address@gmail.com
EMAIL_PASS=your-gmail-app-password
```

Keep `.env` private and never paste the app password into source control or chat. Without valid email settings, Admin login can be tested, but Super Admin login cannot send its OTP.

## Start the Application

Start MySQL, then open one PowerShell terminal in the repository root and run:

```powershell
npm start
```

`npm start` builds the React website and starts Express. When the terminal prints `Website and API running on http://localhost:4006`, open `http://localhost:4006`. Keep the terminal open while using the application. The website and its API requests use the same origin and port.

If port `4006` is already in use, stop the existing process using that port and run `npm start` again. For the temporary Cloudflare Tunnel, forward traffic to `http://localhost:4006`.

## Test Login

Open `http://localhost:4006/login`.

**Admin:** Sign in with the email and password of an account in `admins` whose `status` is `Active`. Admin login uses email and password only and should navigate to `/admin/dashboard`. A Super Admin can create Admin accounts at `/superadmin/create-admin` after signing in.

**Super Admin:** Sign in with the email and password of an account in `super_admin`. The API sends a one-time code to that account's email. Enter the code on the login page within five minutes. Successful verification should navigate to `/superadmin/dashboard`. The account must have a reachable email address, and the API must have valid email settings.

## Validate and Troubleshoot

- Run `npm run build` from the repository root to check frontend compilation.
- If `npm start` fails, read its terminal output. Verify dependencies are installed with `npm install` and port `4006` is available.
- If login shows a network error, make sure the `npm start` terminal is still running.
- If the API reports a database error, check MySQL is running, the database connection settings in `server.js` are correct, and the `career_portal` tables exist.
- If Admin login says the user was not found, confirm the email exists in `admins` and its status is `Active`.
- If Super Admin login cannot send an OTP, verify `EMAIL_USER` and `EMAIL_PASS` in `.env`, then restart `node server.js`.

For source layout and navigation details, see [src/ses-website/README.md](src/ses-website/README.md).
