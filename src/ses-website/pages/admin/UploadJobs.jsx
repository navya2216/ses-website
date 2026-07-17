import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileExcel, FaUpload, FaTimes } from "react-icons/fa";
import api from "../../api";
import "../../asset/css/upload-jobs.css";

function UploadJobs() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const admin = localStorage.getItem("adminEmail");
    const superAdmin = localStorage.getItem("superAdminEmail");

    if (!admin && !superAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    if (extension !== "xlsx" && extension !== "xls") {
      alert("Please select a valid Excel file (.xlsx or .xls)");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);

      const res = await api.post("/api/upload-jobs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      setSelectedFile(null);
    } catch (err) {
      if (err.response) {
        const data = err.response.data;

        if (data.missingFields) {
          alert("Missing Fields:\n" + data.missingFields.join("\n"));
        } else {
          alert(data.message);
        }
      } else {
        alert("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);

    document.getElementById("excelFile").value = "";
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <button
          className="back-btn"
          onClick={() => {
            const superAdmin = localStorage.getItem("superAdminEmail");

            if (superAdmin) {
              navigate("/superadmin/dashboard");
            } else {
              navigate("/admin/dashboard");
            }
          }}
        >
          <FaArrowLeft />
          Back
        </button>

        <h2>Upload Career Jobs</h2>
      </div>

      <div className="upload-card">
        <FaFileExcel className="excel-icon" />

        <h3>Upload Excel File</h3>

        <p>Select the Career Excel Template and upload the completed file.</p>

        <input
          id="excelFile"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div className="selected-file">
            <strong>Selected File:</strong>
            <br />
            {selectedFile.name}
          </div>
        )}

        <div className="button-group">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            <FaUpload />

            {uploading ? "Uploading..." : "Upload Excel"}
          </button>

          <button className="clear-btn" onClick={clearFile}>
            <FaTimes />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadJobs;
