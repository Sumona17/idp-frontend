import React, { useState, useEffect } from "react";
import axios from "axios";
import DataExtractionScreen from "./ExtractedData";
import { Row, Col, Card } from "antd";
import ExtractedInfoTable from "./ExtractedInfoTable";
import useLoader from "context/loader";
import { DashboradStyled } from "../../styles/pages/DasboardCM";

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

const UploadDocumentScreen = ({
  documentData,
  // columnType,
  // onClose,
  shouldFetchData = false,
  onApiDataFetched,
  viewMode = false,
}) => {
  const [currentStoredFile, setCurrentStoredFile] = useState(null);
  const [showDataExtraction, setShowDataExtraction] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiExtractedData, setApiExtractedData] = useState(null);
  const [uploadDetails, setUploadDetails] = useState(null);
  const [extractedElementsCount, setExtractedElementsCount] = useState(0);

  // const user = useSelector((state) => state.user);
  // const dataCount = useSelector((state) => state.dataCount);
  // const firstname = useSelector((state) => state.user.firstname);
  // const staticText = getStaticTextConfig(firstname, dataCount);
  // const role = user.role;
  const { setLoader } = useLoader();

  const fetchExtractedDocument = async () => {
    try {
      setIsProcessing(true);
      setLoader(true);

      const submissionId = documentData.submission_id;

      const fileName = documentData.documentName;

      const response = await axios.get(
        `${import.meta.env.VITE_AI_EXTRACT}/api/get_extracted_document`,
        {
          params: {
            submission_id: submissionId,
            file_name: fileName,
          },
        }
      );

      if (response.data) {
        setApiExtractedData(response.data);
        if (onApiDataFetched) {
          onApiDataFetched(response.data);
        }
        const fileId = generateFileId();
        let pdfUrl = null;

        if (response.data.pdf_data?.startsWith("data:")) {
          pdfUrl = response.data.pdf_data;
        } else if (response.data.pdf_data) {
          pdfUrl = `data:application/pdf;base64,${response.data.pdf_data}`;
        }
        const fileData = {
          id: fileId,
          name: response.data.filename || fileName,
          type: "application/pdf",
          size: null,
          data: pdfUrl,
          uploadCompleted: true,
          extractedData: response.data,
          submissionId: submissionId,
        };

        const detailsResponse = {
          pages: response.data.pages || 0,
          anomalies: 0,
          extractedElements: 0,
          missingElements: 0,
          successMessage:
            "Document data successfully retrieved from the server.",
        };

        fileData.uploadDetails = detailsResponse;
        setUploadDetails(detailsResponse);
        fileStorage.storeFile(fileId, fileData);
        setCurrentStoredFile(fileData);
        window.fileStorage = fileStorage;

        setShowDataExtraction(true);
      }
    } catch (error) {
      console.error("Error fetching extracted document:", error);
      alert("Failed to fetch document data. Please try again.");
    } finally {
      setIsProcessing(false);
      setLoader(false);
    }
  };

  const generateFileId = () => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleDataFieldsCountChange = (count) => {
    setExtractedElementsCount(count);
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
  };

  useEffect(() => {
    if (shouldFetchData || viewMode) {
      fetchExtractedDocument();
    }
  }, [documentData, shouldFetchData, viewMode]);

  useEffect(() => {
    if (extractedElementsCount > 0 && uploadDetails) {
      const updatedDetails = {
        ...uploadDetails,
        extractedElements: extractedElementsCount,
      };
      setUploadDetails(updatedDetails);
    }
  }, [extractedElementsCount]);

  return (
    <div style={{ marginTop: "20px" }}>
      <DashboradStyled>
        {!viewMode && (
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} xl={24} lg={24} md={24}>
              <Card className="dashboard-card">
                <div style={{ position: "relative", minHeight: "150px" }}>
                  {isProcessing && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "150px",
                      }}
                    >
                      <p>Loading document data...</p>
                    </div>
                  )}

                  {showDataExtraction && currentStoredFile && (
                    <div style={{ marginTop: "20px" }}>
                      <ExtractedInfoTable extractedData={apiExtractedData} />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {showDataExtraction && currentStoredFile && (
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} xl={24} lg={24} md={24}>
              <Card className="dashboard-card">
                <div style={{ marginTop: "20px" }}>
                  <DataExtractionScreen
                    uploadedFile={null}
                    uploadedFileName={currentStoredFile.name}
                    uploadedFileUrl={currentStoredFile.data}
                    storedFileData={currentStoredFile}
                    apiExtractedData={apiExtractedData}
                    onDataFieldsCountChange={handleDataFieldsCountChange}
                    hideActionButtons={true}
                    viewMode={viewMode}
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

export default UploadDocumentScreen;
