import React, { useRef, useState } from "react";
import { IngestDocumentsDiv } from "../../styles/components/FileUpload";
import FileUploadIcon from "../../assets/images/file-upload.png";

const FileUploadContainer = ({
  onFileUpload,
  supportedFormats,
  style = {},
  label1 = {},
  label2 = {},
}) => {
  const fileInputRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileUpload(selectedFile);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const isValid = supportedFormats.some((format) =>
      file.name.endsWith(format)
    );
    if (!isValid) {
      alert(`Only ${supportedFormats.join(", ")} files are supported`);
    }
    return isValid;
  };

  return (
    <IngestDocumentsDiv
      style={{
        marginTop: "2%",
        border: "2px dashed #898989",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s ease",
        padding: "20px 5px",
        height: "350px",
        ...style,
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleDrop}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          maxWidth: "400px",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={supportedFormats.join(",")}
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <img
          src={FileUploadIcon}
          alt="Upload Icon"
          style={{
            width: "55px",
            height: "55px",
            // marginLeft:"90%"
          }}
        />
        {/* New button below icon */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: "#006172",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            transition: "transform 0.1s ease-in-out",
            height: "42px",
            width: "135px",
          }}
        >
          Upload File
        </button>

        {/* Two-line label */}
        <p style={{ margin: 0, textAlign: "center" }}>
          <span
            style={{
              display: "block",
              fontSize: "18px",
              color: "#212121",
              fontWeight: "600",
              marginBottom: "3px",
              textWrap: "nowrap",
            }}
          >
            {label1}
          </span>
          <span
            style={{
              display: "block",
              fontSize: "14px",
              color: "#4B4B4B",

              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {label2}
          </span>
        </p>
      </div>
    </IngestDocumentsDiv>
  );
};

export default FileUploadContainer;
