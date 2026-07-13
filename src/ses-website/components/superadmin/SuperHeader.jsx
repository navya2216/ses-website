import React from "react";

import "../../asset/css/super-header.css";

function SuperHeader({ title }) {
  const email = localStorage.getItem("superAdminEmail");

  return (
    <header className="super-header">
      <div>
        <h2>{title}</h2>

        <p>Welcome to SES Career Portal</p>
      </div>

      <div className="header-user">
        <span>{email}</span>
      </div>
    </header>
  );
}

export default SuperHeader;
