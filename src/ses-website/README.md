# SES Website

This folder contains the Soft Electronic Solutions website frontend. The project keeps the existing URLs and page behavior; files are grouped by purpose so public pages, authentication, and role-specific areas are easy to find.

## Source layout

```text
src/
  index.js                       React entry point, browser router, global CSS
  App.js                         Starts the SES route tree
  ses-website/
    api.js                       Shared Axios client
    assets/
      css/                       Site and page stylesheets
      images/                    Logos and page imagery
    components/                  Shared visual components
      superadmin/                Super-admin navigation components
    layouts/
      MainLayout.jsx             Shared public-site shell
    pages/
      public/                    Home, About, Services, Projects, Careers, Contact
      Login.jsx                  Shared login and OTP verification screen
      careers/                   Careers-page sections and application form
      admin/                     Admin dashboard and job/application pages
      superadmin/                Super-admin dashboard and administration pages
    routes/
      AppRoutes.jsx              URL-to-page mapping
```

## Request and navigation flow

1. `src/index.js` mounts React, enables browser history routing, and loads global styles.
2. `src/App.js` renders the SES route tree from `routes/AppRoutes.jsx`.
3. `AppRoutes.jsx` maps URLs to page components. Public URLs use `MainLayout`; login and admin URLs render their pages directly. Moving a page file does not change its URL.
4. Public pages compose shared components and page sections. For example, Careers loads jobs from the API and contains the application form.
5. Login sends email and password to `/api/login`. Admin accounts continue to the admin dashboard. Super-admin accounts verify an emailed OTP through `/api/verify-otp` before continuing to the super-admin dashboard.
6. Pages make HTTP requests through `api.js` or their local Axios calls. `REACT_APP_API_URL` is the frontend API override where supported; retain the endpoint-specific defaults when configuring deployments.

## Naming and ownership

- Keep URL-level screens in `pages/`; group public pages and role-specific areas. Keep the shared Login screen directly under `pages/` because it is a single screen used by both roles.
- Keep reusable site UI in `components/`; keep shared page framing in `layouts/`.
- Keep styles and images under `assets/` and use lowercase, hyphen-separated names for new files.
- Keep route definitions in `routes/AppRoutes.jsx`; feature pages should not change routes implicitly.
- Put careers-only sections in `pages/careers/` because they belong to the Careers screen rather than the site-wide component library.

## Run and verify

From the repository root, use `npm start` to build the frontend and serve it with the Express API on one port. Open `http://localhost:4006` on this computer or `http://192.168.88.2:4006` on the local network. Use `npm run build` to build the frontend without starting the server.
