import React, { useRef, useState } from "react";
import { IngestDocumentsDiv } from "../../styles/components/FileUpload";
import FileUploadIcon from "../../assets/images/file-upload-icon.png";

const FileUploadContainer = ({
  onFileUpload,
  supportedFormats,
  style = {},
  label = "Drag and drop a file, or Browse",
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!browsing) {
      if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
      else if (e.type === "dragleave") setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!browsing) {
      setDragActive(false);
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        onFileUpload(droppedFile);
      }
    }
  };

  const handleBrowseClick = () => {
    setBrowsing(true);
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    setBrowsing(false);
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
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
      className={dragActive ? "dragActive" : ""}
      style={{
        marginTop: "9%",
        border: "2px dashed rgb(15, 124, 219)",
        justifyContent: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s ease",
        ...style,
      }}
    >
      <input
        type="file"
        ref={inputRef}
        accept={supportedFormats.join(",")}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div style={{ marginTop: "15%" }}>
        <img
          src={FileUploadIcon}
          alt="Upload Icon"
          style={{
            width: "68.78px",
            height: "58.59px",
            marginBottom: "10px",
          }}
        />
        <p style={{ color: "#676767" }}>
          <strong style={{ fontSize: "15px", color: "#333", display: "block" }}>
            {label.split("Browse")[0]}
            <span
              style={{
                color: "#007bff",
                textDecoration: "underline",
                fontSize: "15px",
              }}
            >
              Browse
            </span>
          </strong>
          Supported format: {supportedFormats.join(", ")}
        </p>
      </div>
    </IngestDocumentsDiv>
  );
};

export default FileUploadContainer;
