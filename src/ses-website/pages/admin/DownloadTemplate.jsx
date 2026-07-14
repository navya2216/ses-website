import React from "react";
import { useNavigate } from "react-router-dom";

import { FaArrowLeft, FaFileExcel, FaDownload } from "react-icons/fa";

import "../../asset/css/download-template.css";

function DownloadTemplate() {
  const navigate = useNavigate();

  const isSuperAdmin = localStorage.getItem("superAdminEmail");

  const backPage = isSuperAdmin ? "/superadmin/dashboard" : "/admin/dashboard";

  const downloadExcel = () => {
    const confirmDownload = window.confirm(
      "Do you want to download the Career Excel Template?",
    );

    if (!confirmDownload) {
      return;
    }

    const link = document.createElement("a");

    link.href = "/templates/Career_Template.xlsx";

    link.download = "Career_Template.xlsx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    alert("Career Excel Template downloaded successfully.");
  };

  return (
    <div className="download-page">
      {/* Header */}

      <div className="download-header">
        <button className="back-btn" onClick={() => navigate(backPage)}>
          <FaArrowLeft />
          Back
        </button>

        <h2>Download Excel Template</h2>
      </div>

      {/* Card */}

      <div className="download-card">
        <FaFileExcel className="excel-icon" />

        <h3>Career Job Upload Template</h3>

        <p>
          Download the Career Excel Template before uploading jobs. Fill all
          mandatory columns and upload the same Excel file from the Upload Jobs
          page.
        </p>

        <button className="download-btn" onClick={downloadExcel}>
          <FaDownload />
          Download Template
        </button>
      </div>
    </div>
  );
}

export default DownloadTemplate;
