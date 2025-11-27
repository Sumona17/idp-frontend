import React, { useState, useEffect, useRef } from "react";
import FileUploadContainer from "../../components/FileUploadContainer";
import DataExtractionScreen from "./ExtractedData";
import { Row, Col, Card } from "antd";
import pdfIcon from "../../assets/images/pdf-icon.png";
import * as pdfjsLib from "pdfjs-dist";
import ExtractedInfoTable from "./ExtractedInfoTable";
import useLoader from "../../context/loader";
import { DashboradStyled } from "../../styles/pages/DasboardCM";
import {
  UploadHeader,
  UploadTitle,
  ProgressText,
} from "../../styles/pages/UploadFile";

// Import your local JSON
import extractedDataJson from "../../assets/responseData5.json";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UPLOAD_CONFIG = {
  enableFileTypeRestriction: true,
  allowedExtensions: [".pdf"],
  allowedMimeTypes: ["application/pdf"],
  restrictionErrorMessage:
    "Only PDF files are allowed. Please select a PDF file.",
  getUploadLabels: function () {
    if (
      this.enableFileTypeRestriction &&
      this.allowedExtensions.length === 1 &&
      this.allowedExtensions[0] === ".pdf"
    ) {
      return {
        formats: [".pdf"],
        label1: "Drag & Drop your PDF file here",
        label2: "or click to browse and select a PDF file",
      };
    }
    return {
      formats: this.allowedExtensions,
      label1: "Drag & Drop your file here",
      label2: "or click to browse and select a file",
    };
  },
};

const fileStorage = {
  files: new Map(),

  storeFile: function (fileId, fileData) {
    this.files.set(fileId, fileData);
  },

  getFile: function (fileId) {
    return this.files.get(fileId);
  },

  getAllFiles: function () {
    return Array.from(this.files.values());
  },

  removeFile: function (fileId) {
    this.files.delete(fileId);
  },
};

// Correct function to count only fields with actual extracted values
const countExtractedDataElements = (extractedData) => {
  if (!extractedData || !extractedData.results) {
    console.log("No extractedData or results found");
    return 0;
  }

  let totalCount = 0;

  extractedData.results.forEach((page, pageIndex) => {
    console.log(`Processing page ${pageIndex + 1}`);
    
    Object.keys(page).forEach((sectionKey) => {
      // Skip the 'page' key as it's not a data field
      if (sectionKey === 'page') {
        return;
      }

      const section = page[sectionKey];
      let sectionCount = 0;
      
      if (typeof section === 'object' && section !== null) {
        Object.keys(section).forEach((fieldKey) => {
          const field = section[fieldKey];
          
          // Only count fields that have actual extracted data
          if (field && typeof field === 'object') {
            // For checkbox fields (checked property exists)
            if ('checked' in field) {
              sectionCount++;
              totalCount++;
            }
            // For text fields - only count if value exists and is not empty
            else if ('value' in field) {
              const value = field.value;
              // Count only if value is not empty string, not null, and not undefined
              if (value !== '' && value !== null && value !== undefined) {
                sectionCount++;
                totalCount++;
              }
            }
          }
        });
      }
      
      console.log(`  Section "${sectionKey}": ${sectionCount} fields`);
    });
  });

  console.log(`Total extracted elements: ${totalCount}`);
  return totalCount;
};

const UploadFileScreen = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDetails, setUploadDetails] = useState(null);
  const [currentStoredFile, setCurrentStoredFile] = useState(null);
  const [showDataExtraction, setShowDataExtraction] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiExtractedData, setApiExtractedData] = useState(null);
  const { setLoader } = useLoader();
  const [extractedElementsCount, setExtractedElementsCount] = useState(0);
  
  // Use ref to store the initial count and prevent recalculation
  const initialCountRef = useRef(null);

  const validateFile = (fileToValidate) => {
    if (!UPLOAD_CONFIG.enableFileTypeRestriction) {
      return { isValid: true, error: null };
    }

    const fileName = fileToValidate.name.toLowerCase();
    const fileType = fileToValidate.type.toLowerCase();

    const hasValidExtension = UPLOAD_CONFIG.allowedExtensions.some((ext) =>
      fileName.endsWith(ext.toLowerCase())
    );

    const hasValidMimeType = UPLOAD_CONFIG.allowedMimeTypes.some(
      (mimeType) => fileType === mimeType.toLowerCase()
    );

    if (!hasValidExtension || !hasValidMimeType) {
      return {
        isValid: false,
        error: UPLOAD_CONFIG.restrictionErrorMessage,
      };
    }

    return { isValid: true, error: null };
  };

  const resetComponentState = () => {
    setFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadDetails(null);
    setCurrentStoredFile(null);
    setShowDataExtraction(false);
    setIsProcessing(false);
    setApiExtractedData(null);
    setExtractedElementsCount(0);
    setLoader(false);
    initialCountRef.current = null;
  };

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, []);

  // Load extracted data from local JSON file
  const loadExtractedData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return extractedDataJson;
    } catch (error) {
      console.error("Error loading extracted data:", error);
      alert("Failed to load extracted data. Please try again.");
      setLoader(false);
      setIsProcessing(false);
      return null;
    }
  };

  const handleDataFieldsCountChange = (count) => {
    // Prevent count changes - use the initial count only
    console.log("handleDataFieldsCountChange called with:", count);
    console.log("Initial count stored:", initialCountRef.current);
    
    // Only update if we don't have an initial count set
    if (initialCountRef.current === null) {
      setExtractedElementsCount(count);
      initialCountRef.current = count;
      
      if (currentStoredFile) {
        const updatedFileData = {
          ...currentStoredFile,
          uploadDetails: {
            ...currentStoredFile.uploadDetails,
            extractedElements: count,
          },
        };
        fileStorage.storeFile(currentStoredFile.id, updatedFileData);
        setCurrentStoredFile(updatedFileData);
      }
    }
  };

  const generateFileId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleUpload = async (fileToUpload) => {
    const validation = validateFile(fileToUpload);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const fileId = generateFileId();
    setFile(fileToUpload);
    setUploading(true);
    setUploadProgress(0);
    setUploadDetails(null);
    setShowDataExtraction(false);
    setIsProcessing(false);
    setApiExtractedData(null);
    initialCountRef.current = null; // Reset the ref

    let pageCount = 0;
    if (fileToUpload.type === "application/pdf") {
      try {
        const pdfData = await fileToUpload.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
        pageCount = pdfDoc.numPages;
      } catch (err) {
        console.error("Failed to read PDF pages", err);
      }
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Simulate upload progress
      const simulateUpload = async () => {
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await sleep(100);
        }
      };

      await simulateUpload();

      setUploading(false);
      setIsProcessing(true);
      setLoader(true);
      await sleep(1000);

      // Load extracted data from local JSON
      const extractedApiData = await loadExtractedData();

      if (extractedApiData) {
        // Calculate the correct count of extracted elements ONCE
        const extractedCount = countExtractedDataElements(extractedApiData);
        
        // Store the count in ref to prevent recalculation
        initialCountRef.current = extractedCount;
        
        console.log("=== INITIAL COUNT SET ===");
        console.log("Total extracted elements count:", extractedCount);

        // Set the extracted data in state
        setApiExtractedData(extractedApiData);

        // Convert base64 PDF data to blob URL
        let pdfUrl;
        
        if (extractedApiData.pdf_data) {
          pdfUrl = `data:application/pdf;base64,${extractedApiData.pdf_data}`;
        } else {
          pdfUrl = URL.createObjectURL(fileToUpload);
        }

        const fileData = {
          id: fileId,
          name: extractedApiData.file_name || fileToUpload.name,
          type: "application/pdf",
          size: fileToUpload.size,
          data: pdfUrl,
          uploadCompleted: true,
          extractedData: extractedApiData,
        };

        const detailsResponse = {
          pages: pageCount,
          anomalies: 0,
          extractedElements: extractedCount, // Use the calculated count
          missingElements: 0,
          successMessage:
            "Your file has been identified from the master documents inventory, associated with an active plan and no data anomalies were found.",
        };

        setUploadDetails(detailsResponse);
        fileData.uploadDetails = detailsResponse;
        fileStorage.storeFile(fileId, fileData);
        setCurrentStoredFile(fileData);
        
        // Set the extracted elements count
        setExtractedElementsCount(extractedCount);

        setLoader(false);
        setIsProcessing(false);
        setShowDataExtraction(true);
      } else {
        setLoader(false);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Upload Failed", err);
      alert("Upload Failed");
      setUploading(false);
      setIsProcessing(false);
      setLoader(false);
    }
  };

  // Remove or comment out this useEffect as it's causing the count to change
  // useEffect(() => {
  //   if (extractedElementsCount > 0 && uploadDetails) {
  //     const updatedDetails = {
  //       ...uploadDetails,
  //       extractedElements: extractedElementsCount,
  //     };
  //     setUploadDetails(updatedDetails);
  //   }
  // }, [extractedElementsCount]);

  const renderUploadCard = () => {
    if (!file) return null;

    return (
      <div
        style={{
          border: "1px solid #00837A",
          borderRadius: "8px",
          padding: "12px",
          background: "#FAFBFC",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={pdfIcon} alt="PDF" style={{ width: 24, height: 24 }} />
            <span
              style={{ fontSize: "16px", color: "#000", fontWeight: "600" }}
            >
              {file?.name}
            </span>
          </div>
          <ProgressText>
            {uploadProgress < 100
              ? `${uploadProgress}% Complete`
              : isProcessing
                ? "Processing..."
                : "100% Complete"}
          </ProgressText>
        </div>
        <div
          style={{
            height: "12px",
            marginTop: "8px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${uploadProgress}%`,
              background: "#00796b",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
        {uploadProgress < 100 && (
          <p style={{ fontSize: "14px", color: "#555" }}>
            Uploading file... Please wait.
          </p>
        )}

        {uploadProgress === 100 && isProcessing && (
          <p style={{ fontSize: "14px", color: "#555" }}>
            Processing file data... Please wait.
          </p>
        )}

        {uploadProgress === 100 && !isProcessing && uploadDetails && (
          <>
            <p
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#212121",
                textAlign: "left",
                marginTop: "0",
              }}
            >
              <strong style={{ color: "#006172" }}>Success!</strong>{" "}
              {uploadDetails.successMessage}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: "4px",
                columnGap: "30px",
                fontSize: "14px",
                textAlign: "left",
              }}
            >
              <span>
                Document Pages: <strong>{uploadDetails.pages}</strong>
              </span>
              <span>
                Data Anomalies: <strong>{uploadDetails.anomalies}</strong>
              </span>
              <span>
                Data elements extracted:{" "}
                <strong>{initialCountRef.current || uploadDetails.extractedElements}</strong>
              </span>
              <span>
                Missing Data Elements:{" "}
                <strong>{uploadDetails.missingElements}</strong>
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  const uploadLabels = UPLOAD_CONFIG.getUploadLabels();

  return (
    <div style={{ marginTop: "60px" }}>
      <DashboradStyled>
        <Row gutter={[16, 16]} className="dashboard-row">
          <Col xs={24} xl={24} lg={24} md={24}>
            <Card className="dashboard-card" style={{ width: '1200px', marginLeft: -300 }}>
              <UploadHeader style={{ marginTop: "-20" }}>
                <UploadTitle>upload</UploadTitle>
              </UploadHeader>

              <div style={{ position: "relative", minHeight: "150px" }}>
                {!file && (
                  <div
                    style={{
                      opacity: uploading ? 0 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    <FileUploadContainer
                      onFileUpload={handleUpload}
                      supportedFormats={uploadLabels.formats}
                      label1={uploadLabels.label1}
                      label2={uploadLabels.label2}
                    />
                  </div>
                )}

                {file && (
                  <>
                    {renderUploadCard()}

                    {showDataExtraction && currentStoredFile && apiExtractedData && (
                      <div style={{ marginTop: "20px" }}>
                        <ExtractedInfoTable extractedData={apiExtractedData} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
        {showDataExtraction && currentStoredFile && apiExtractedData && (
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} xl={24} lg={24} md={24}>
              <Card className="dashboard-card" style={{ width: '1200px', marginLeft: -300 }}>
                <div style={{ marginTop: "20px" }}>
                  <DataExtractionScreen
                    key={currentStoredFile.id}
                    uploadedFile={null}
                    uploadedFileName={currentStoredFile.name}
                    uploadedFileUrl={currentStoredFile.data}
                    storedFileData={currentStoredFile}
                    apiExtractedData={apiExtractedData}
                    onDataFieldsCountChange={handleDataFieldsCountChange}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </DashboradStyled>
    </div>
  );
};

export default UploadFileScreen;