import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "../api";

function RequireAdminSession() {
  const location = useLocation();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/admin/session")
      .then((response) => {
        const session = response.data;
        if (session.role !== "ADMIN") {
          throw new Error("This account is not authorized for this page.");
        }

        localStorage.setItem("userRole", session.role);
        localStorage.setItem("adminEmail", session.email);
        localStorage.setItem("adminName", session.name);
        localStorage.removeItem("superAdminEmail");
        localStorage.removeItem("superAdminName");

        if (mounted) setAuthorized(true);
      })
      .catch((error) => {
        if (error.response?.status !== 401) {
          console.error("Admin session check failed:", error);
        }
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("adminName");
        localStorage.removeItem("superAdminEmail");
        localStorage.removeItem("superAdminName");
        localStorage.removeItem("userRole");
      })
      .finally(() => {
        if (mounted) setChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (authorized) return <Outlet />;
  if (!checked) return <p role="status">Verifying admin session…</p>;

  return (
    <Navigate
      to="/admin/login"
      replace
      state={{ from: location.pathname }}
    />
  );
}

export default RequireAdminSession;
