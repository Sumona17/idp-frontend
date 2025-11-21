import React, { useState } from "react";
import axios from "axios";
import { Progress } from "antd";
import FileUploadContainer from "./FileUploadContainer";
import PopupModal from "../../components/PopupModal";

//import { useSelector } from "react-redux";

import { CenteredDiv } from "../../style/pages/DashboardAdmin";

const DashboardAdmin = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess,setShowSuccess] = useState(false);

  const handleUpload = async (fileToUpload) => {
    setFile(fileToUpload);
    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AWS_API_GATEWAY}/excel-s3-uploader`,
        {
          fileName: fileToUpload.name,
          fileType: fileToUpload.type,
        }
      );
      const uploadURL = res.data.uploadURL;

      await axios
        .put(uploadURL, fileToUpload, {
          headers: { "Content-Type": fileToUpload.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        })
        .then((res) => {
          console.log("file upload response", res.data);
        })
        .catch((e) => {
          console.log("file upload failed", e);
        });

      setTimeout(() => {
        setFile(null);
        setUploading(false);
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 1500);
      }, 1000);
    } catch (err) {
      console.error("Upload URL Fetch Failed", err);
      alert("Upload URL Fetch Failed");
      setUploading(false);
    }
  };

  const fileUploadingModalContent = (
    <div style={{ padding: "10px 0", marginTop: "10px" }}>
      <h4 style={{ fontSize: "16px", marginBottom: "10px" }}>
        Uploading: {file?.name}
      </h4>
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "6px 12px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <span>{file?.name}</span>
          <span style={{ color: "#999", fontSize: "12px" }}>
            {(file?.size / 1024).toFixed(1)} KB
          </span>
        </div>
        <Progress percent={uploadProgress} status="active" showInfo={false} />
      </div>
    </div>
  );

  const successModalContent = (
    <div style={{ padding: "10px 0", marginTop: "10px", textAlign: "center" }}>
      <h3 style={{ color: "green" }}>✅ Upload Successful!</h3>
      <p style={{ fontSize: "14px" }}>{file?.name} was uploaded to S3.</p>
    </div>
  );

  return (
    <div style={{ marginTop: "5%" }}>
      
      <CenteredDiv style={{ marginLeft: "0%" }}>
        <FileUploadContainer
          onFileUpload={handleUpload}
          supportedFormats={[".pdf"]}
          //label={staticTextConfig[role].widgets.uploadContainer.title}
        />
      </CenteredDiv>
      {uploading && (
        <PopupModal open={uploading} content={fileUploadingModalContent} />
      )}
      {showSuccess && (
        <PopupModal open={showSuccess} content={successModalContent} />
      )}
    </div>
  );
};

export default DashboardAdmin;
