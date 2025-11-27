import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Spin, Modal, Select, Collapse, Checkbox, Input } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DownloadOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import * as pdfjsLib from "pdfjs-dist";
//import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  StyledContainer,
  PDFScrollContainer,
  PDFContainer,
  PDFCanvasWrapper,
  HighlightBox,
  ZoomControls,
  ZoomButton,
  ZoomSlider,
  ZoomPercentage,
  PageIndicator,
  ExtractedDataContainer,
  ExtractedDataContent,
  LoadingContainer,
  LoadingText,
  SectionCard,
  SectionHeader,
  SectionContent,
  DataItem,
  CardHeaderStyle,
  CardTitleStyle,
  HeaderButton,
  CardBodyStyle,
  ExtractedDataBodyStyle,
  DataFieldContainer,
  FieldLabel,
  ConfidenceLabel,
  FieldValue,
  RejectModalContainer,
  RejectIcon,
  RejectTitle,
  RejectMessage,
  RejectButton,
  SubFieldsContainer,
  SubFieldItem,
  SubFieldLabel,
  SubFieldConfidence,
  SubFieldValue,
  ContributionFlagsContainer,
  ContributionFlag,
  ActionButtonsSection,
  ActionButtonsRow,
  PrimaryActionButton,
  SecondaryActionButton,
  PDFTitleSection,
  PDFPageInfo,
  SuccessModalContainer,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
  SuccessButton,
} from "../../styles/pages/DataExtractionStyle";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { addNewDocument } from "../../redux/document-inventory/documentInventorySlice";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const DataExtractionScreen = ({
  uploadedFile,
  uploadedFileName,
  uploadedFileUrl,
  storedFileData,
  apiExtractedData,
  onDataFieldsCountChange,
  hideActionButtons = false,
  viewMode = false,
}) => {
  const [currentPdfPath, setCurrentPdfPath] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataFields, setTotalDataFields] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [naturalPageSize, setNaturalPageSize] = useState({
    width: 0,
    height: 0,
  });
  const [highlightBox, setHighlightBox] = useState(null);
  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [renderedPages, setRenderedPages] = useState({});
  const [isDataExtracting, setIsDataExtracting] = useState(false);
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDataNotAccurateModal, setShowDataNotAccurateModal] = useState(false);
  const [textractData, setTextractData] = useState([]);
  const { Panel } = Collapse;
  const { Option } = Select;
  const pageRefs = useRef({});
  const containerRef = useRef(null);
  const pdfScrollRef = useRef(null);
  const extractedDataScrollRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTasksRef = useRef({});
  const pagesContainerRef = useRef(null); // const dispatch = useDispatch();
  const DPI_SCALE = 2;
  const CONFIDENCE_THRESHOLD = 70;
  const navigate = useNavigate();
  const formatConfidenceScore = (score) => {
    if (score === null || score === undefined) return null;
    return Math.round(score);
  };
  const renderDataField = (label, item, confidenceScore, hasHighlight = false) => {
    const formattedScore = formatConfidenceScore(confidenceScore);

    // ✅ Detect checkbox: boolean, yes/no, checked/unchecked, true/false, etc.
    //    OR if value is null but key contains "check"
    const isCheckboxLike = (key, value) => {
      if (value === null) {
        return key.toLowerCase().includes("check"); // NEW RULE
      }

      if (typeof value === "boolean") return true;

      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return (
          normalized === "yes" ||
          // normalized === "no" ||
          normalized === "checked" ||
          normalized === "unchecked" ||
          normalized === "true" ||
          normalized === "false" ||
          normalized === "n/a" ||
          normalized === "na"
        );
      }

      return false;
    };

    // ✅ Identify all checkbox keys
    const checkboxKeys = Object.keys(item).filter((key) => {
      if (["confidence_score", "bounding_box", "line"].includes(key)) return false;
      return isCheckboxLike(key, item[key]);
    });

    // ✅ Identify all input keys (null included)
    const valueKeys = Object.keys(item).filter(
      (key) =>
        !checkboxKeys.includes(key) &&
        key !== "confidence_score" &&
        key !== "bounding_box" &&
        key !== "line" &&
        typeof item[key] !== "object" // null becomes input automatically
    );

    // Handlers
    const handleCheckboxChange = (key, e) => {
      item[key] = e.target.checked;
    };

    const handleInputChange = (key, e) => {
      item[key] = e.target.value;
    };

    const getDisplayValue = (key) => {
      const value = item[key];
      if (Array.isArray(value)) return `Contains ${value.length} items`;
      if (typeof value === "object" && value !== null) {
        return value.text || value.value || JSON.stringify(value);
      }
      return String(value ?? "").trim();
    };

    // ☑ Converts string/null/boolean to checkbox checked/unchecked
    const toCheckedValue = (val) => {
      if (val === null) return false; // NEW RULE: null checkbox → unchecked
      if (typeof val === "boolean") return val;

      const normalized = String(val ?? "").trim().toLowerCase();
      return (
        normalized === "yes" ||
        normalized === "checked" ||
        normalized === "true"
      );
    };

    return (
      <DataFieldContainer hasHighlight={hasHighlight}>
        {/* Header Row */}
        <Row gutter={[16, 4]}>
          <Col span={14}>
            <FieldLabel>{label}</FieldLabel>
          </Col>
          <Col span={10}>
            {formattedScore !== null && (
              <ConfidenceLabel>
                Confidence Score: {formattedScore}%
              </ConfidenceLabel>
            )}
          </Col>
        </Row>

        {/* Content Rows */}
        <Row gutter={[16, 4]} align="middle" wrap>
          {/* Render Checkboxes */}
          {checkboxKeys.map((key) => (
            <Col key={key} flex="none">
              <Checkbox
                checked={toCheckedValue(item[key])}
                onChange={(e) => handleCheckboxChange(key, e)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Checkbox>
            </Col>
          ))}

          {/* Render Input Fields */}
          {valueKeys.map((key) => (
            <Col key={key} flex="auto">
              <Input
                defaultValue={getDisplayValue(key)}
                onChange={(e) => handleInputChange(key, e)}
                placeholder={`Enter ${key}`}
              />
            </Col>
          ))}
        </Row>
      </DataFieldContainer>
    );
  };


  //   const renderDataField = (label, item, confidenceScore, hasHighlight = false) => {
  //   const formattedScore = formatConfidenceScore(confidenceScore);

  //   // Identify all boolean flags (potential checkboxes)
  //   const checkboxKeys = Object.keys(item).filter(
  //     (key) => typeof item[key] === "boolean"
  //   );

  //   // Identify value fields (strings, numbers, nested objects)
  //   const valueKeys = Object.keys(item).filter(
  //     (key) =>
  //       !checkboxKeys.includes(key) &&
  //       key !== "confidence_score" &&
  //       key !== "bounding_box" &&
  //       key !== "line" &&
  //       typeof item[key] !== "object"
  //   );

  //   const handleCheckboxChange = (key, e) => {
  //     item[key] = e.target.checked;
  //   };

  //   const handleInputChange = (key, e) => {
  //     item[key] = e.target.value;
  //   };

  //   const getDisplayValue = (key) => {
  //     const value = item[key];
  //     if (Array.isArray(value)) return `Contains ${value.length} items`;
  //     if (typeof value === "object" && value !== null) {
  //       return value.text || value.value || JSON.stringify(value);
  //     }
  //     return String(value ?? "").trim();
  //   };

  //   return (
  //     <DataFieldContainer hasHighlight={hasHighlight}>
  //       {/* Header Row */}
  //       <Row gutter={[16, 4]}>
  //         <Col span={14}>
  //           <FieldLabel>{label}</FieldLabel>
  //         </Col>
  //         <Col span={10}>
  //           {formattedScore !== null && (
  //             <ConfidenceLabel>
  //               Confidence Score: {formattedScore}%
  //             </ConfidenceLabel>
  //           )}
  //         </Col>
  //       </Row>

  //       {/* Content Rows */}
  //       <Row gutter={[16, 4]} align="middle" wrap>
  //         {/* Render all checkboxes */}
  //         {checkboxKeys.map((key) => (
  //           <Col key={key} flex="none">
  //             <Checkbox
  //               checked={!!item[key]}
  //               onChange={(e) => handleCheckboxChange(key, e)}
  //             >
  //               {key.charAt(0).toUpperCase() + key.slice(1)}
  //             </Checkbox>
  //           </Col>
  //         ))}

  //         {/* Render all input fields */}
  //         {valueKeys.map((key) => (
  //           <Col key={key} flex="auto">
  //             <Input
  //               defaultValue={getDisplayValue(key)}
  //               onChange={(e) => handleInputChange(key, e)}
  //               placeholder={`Enter ${key}`}
  //             />
  //           </Col>
  //         ))}
  //       </Row>
  //     </DataFieldContainer>
  //   );
  // };

  const getHighlightColor = (confidenceScore) => {
    if (!confidenceScore || confidenceScore < CONFIDENCE_THRESHOLD) {
      return "#FF0000";
    }
    return "#1890ff";
  };

  const countDataFields = (data) => {
    let count = 0;
    const countDetails = {
      mainFields: 0,
      subFields: 0,
      arrayItems: 0,
      totalProcessed: 0,
    };

    if (!data || !Array.isArray(data)) {
      return 0;
    }
    const countFieldsRecursively = (
      obj,
      path = "",
      depth = 0,
      parentType = "root"
    ) => {
      if (!obj || typeof obj !== "object") {
        return;
      }

      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (key === "page") {
          return;
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
          const hasValue = Object.prototype.hasOwnProperty.call(value, "value");
          const hasChecked = Object.prototype.hasOwnProperty.call(
            value,
            "checked"
          );
          const hasConfidence = Object.prototype.hasOwnProperty.call(
            value,
            "confidence_score"
          );
          const hasBoundingBox = Object.prototype.hasOwnProperty.call(
            value,
            "bounding_box"
          );
          const hasLine = Object.prototype.hasOwnProperty.call(value, "line");
          if (
            hasValue ||
            hasChecked ||
            hasConfidence ||
            hasBoundingBox ||
            hasLine
          ) {
            count++;
            countDetails.totalProcessed++;
            if (depth === 1 || (depth === 2 && parentType === "section")) {
              countDetails.mainFields++;
            } else {
              countDetails.subFields++;
            }
            if (hasValue && Array.isArray(value.value)) {
              value.value.forEach((arrayItem, arrayIndex) => {
                if (arrayItem && typeof arrayItem === "object") {
                  countFieldsRecursively(
                    arrayItem,
                    `${currentPath}[${arrayIndex}]`,
                    depth + 1,
                    "array_item"
                  );
                  countDetails.arrayItems++;
                }
              });
            }
            const standardProps = [
              "value",
              "checked",
              "confidence_score",
              "bounding_box",
              "line",
            ];
            const nestedFields = Object.entries(value).filter(
              ([nestedKey]) => !standardProps.includes(nestedKey)
            );

            if (nestedFields.length > 0) {
              nestedFields.forEach(([nestedKey, nestedValue]) => {
                if (nestedValue && typeof nestedValue === "object") {
                  countFieldsRecursively(
                    { [nestedKey]: nestedValue },
                    currentPath,
                    depth + 1,
                    "nested"
                  );
                }
              });
            }
          } else {
            countFieldsRecursively(value, currentPath, depth + 1, "container");
          }
        } else if (Array.isArray(value)) {
          value.forEach((arrayItem, arrayIndex) => {
            if (arrayItem && typeof arrayItem === "object") {
              countFieldsRecursively(
                arrayItem,
                `${currentPath}[${arrayIndex}]`,
                depth + 1,
                "direct_array_item"
              );
            }
          });
        }
      });
    };
    data.forEach((pageData, pageIndex) => {
      if (!pageData || typeof pageData !== "object") {
        return;
      }

      countFieldsRecursively(pageData, `page${pageIndex + 1}`, 0, "page");
    });
    return count;
  };
  // const getFieldMarker = (fieldKey, parentKey = '', depth = 0, index = 0) => {
  //   const markerPatterns = [
  //     /\(([a-z])\)/i,
  //     /\((\d+)\)/,
  //     /^[a-z]\.?$/i,
  //     /^\d+\.?$/
  //   ];

  //   for (let pattern of markerPatterns) {
  //     const match = fieldKey.match(pattern);
  //     if (match) {
  //       return match[1];
  //     }
  //   }
  //   if (depth <= 1) {

  //   } else {

  //     return `(${index + 1})`;
  //   }
  // };

  const parseApiResponse = (apiData) => {
    try {
      if (apiData && typeof apiData === "object" && apiData.results) {
        let parsedResults;
        if (typeof apiData.results === "string") {
          try {
            let jsonString = apiData.results;
            if (jsonString.includes('\\"')) {
              const firstParse = JSON.parse(jsonString);
              if (typeof firstParse === "string") {
                parsedResults = JSON.parse(firstParse);
              } else {
                parsedResults = firstParse;
              }
            } else {
              parsedResults = JSON.parse(jsonString);
            }
          } catch (parseError) {
            console.error("Error parsing JSON string:", parseError);
            return [];
          }
        } else {
          parsedResults = apiData.results;
        }

        if (Array.isArray(parsedResults)) {
          return parsedResults.filter(
            (item) => item !== null && item !== undefined
          );
        } else if (
          typeof parsedResults === "object" &&
          parsedResults !== null
        ) {
          return [parsedResults];
        }
      }

      if (Array.isArray(apiData)) {
        return apiData.filter((item) => item !== null && item !== undefined);
      }

      if (typeof apiData === "object" && apiData !== null && !apiData.results) {
        return [apiData];
      }
      return [];
    } catch (error) {
      console.error("Error parsing API response:", error);
      return [];
    }
  };

  const getPdfMapping = () => {
    const mapping = {};
    if (typeof window !== "undefined" && window.fileStorage) {
      const allFiles = window.fileStorage.getAllFiles();
      allFiles.forEach((file) => {
        if (file.name && file.data && file.type === "application/pdf") {
          mapping[file.name] = file.data;
        }
      });
    }
    return mapping;
  };

  const getPdfSource = () => {
    if (storedFileData && storedFileData.data) {
      return storedFileData.data;
    }
    if (uploadedFileUrl) {
      return uploadedFileUrl;
    }
    if (uploadedFile) {
      return URL.createObjectURL(uploadedFile);
    }
    if (uploadedFileName) {
      const pdfMapping = getPdfMapping();
      if (pdfMapping[uploadedFileName]) {
        return pdfMapping[uploadedFileName];
      }
    }
    if (
      typeof window !== "undefined" &&
      window.fileStorage &&
      uploadedFileName
    ) {
      const allFiles = window.fileStorage.getAllFiles();
      const matchingFile = allFiles.find(
        (file) => file.name === uploadedFileName
      );
      if (matchingFile && matchingFile.data) {
        return matchingFile.data;
      }
    }
    return null;
  };

  const formatSectionName = (sectionKey) => {
    return sectionKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatFieldName = (fieldKey) => {
    return fieldKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getDisplayValue = (item) => {
    const hasValue = item.value !== null && item.value !== undefined;
    const hasChecked = Object.prototype.hasOwnProperty.call(item, "checked");
    const hasSelectedFlag = Object.prototype.hasOwnProperty.call(item, "selected");
    let displayValue = "";

    // 🧩 Skip for any checkbox/selected field (nested or top-level)
    if (
      hasSelectedFlag ||
      (item.label && item.label.toLowerCase().includes("selected"))
    ) {
      return ""; // ✅ Don't show "[X]" or any text below checkbox
    }

    if (hasValue) {
      if (Array.isArray(item.value)) {
        return ""; // skip arrays — handled separately
      } else {
        let cleanedValue;
        if (typeof item.value === "object" && item.value !== null) {
          if (item.value.text) {
            cleanedValue = cleanText(item.value.text);
          } else if (item.value.value) {
            cleanedValue = cleanText(item.value.value);
          } else {
            cleanedValue = JSON.stringify(item.value);
          }
        } else {
          cleanedValue = cleanText(item.value);
        }

        if (cleanedValue === "0" || cleanedValue.trim() === "") {
          displayValue = "";
        } else {
          displayValue = cleanedValue;
        }
      }
    }

    return displayValue;
  };


  const handleCheckboxChange = (checked) => {
    // Update your state/data with the new checked value
    // e.g., updateField(fieldKey, { ...item, checked });
  };

  const handleValueChange = (newValue) => {
    // Update your state/data with the new value
    // e.g., updateField(fieldKey, { ...item, value: newValue });
  };
  // const getDisplayValue = (item) => {
  //   const hasValue = item.value !== null && item.value !== undefined;
  //   const hasChecked = Object.prototype.hasOwnProperty.call(item, "checked");
  //   let displayValue = "";

  //   if (hasChecked) {
  //     if (item.checked === true && item.value !== "[X]") {
  //       displayValue = "[X]";
  //     } else if (item.checked === false && item.value !== "[ ]") {
  //       displayValue = "[ ]";
  //     }
  //   }

  //   if (hasValue) {
  //     if (Array.isArray(item.value)) {
  //       displayValue = hasChecked
  //         ? `${displayValue} Contains ${item.value.length} items`
  //         : `Contains ${item.value.length} items`;
  //     } else {
  //       let cleanedValue;
  //       if (typeof item.value === "object" && item.value !== null) {
  //         if (item.value.text) {
  //           cleanedValue = cleanText(item.value.text);
  //         } else if (item.value.value) {
  //           cleanedValue = cleanText(item.value.value);
  //         } else {
  //           cleanedValue = JSON.stringify(item.value);
  //         }
  //       } else {
  //         cleanedValue = cleanText(item.value);
  //       }

  //       if (cleanedValue === "0" || cleanedValue.trim() === "") {
  //         displayValue = hasChecked ? displayValue : " ";
  //       } else if (hasChecked) {
  //         displayValue = `${displayValue}  ${cleanedValue}`;
  //       } else {
  //         displayValue = cleanedValue;
  //       }
  //     }
  //   }

  //   if (!hasValue && !hasChecked) {
  //     displayValue = " ";
  //   }

  //   return displayValue;
  // };

  useEffect(() => {
    if (
      onDataFieldsCountChange &&
      typeof onDataFieldsCountChange === "function"
    ) {
      onDataFieldsCountChange(totalDataFields);
    }
  }, [totalDataFields, onDataFieldsCountChange]);

  const cleanText = (text) => {
    if (text === null || text === undefined) return "";
    const stringText = typeof text === "string" ? text : String(text);
    if (!stringText) return "";
    return stringText.trim().replace(/\s+/g, " ");
  };

  const hasValidBoundingBox = (bbox) => {
    return (
      bbox &&
      typeof bbox === "object" &&
      (bbox.left !== undefined || bbox.Left !== undefined) &&
      (bbox.top !== undefined || bbox.Top !== undefined) &&
      (bbox.width !== undefined || bbox.Width !== undefined) &&
      (bbox.height !== undefined || bbox.Height !== undefined) &&
      (bbox.width > 0 || bbox.Width > 0) &&
      (bbox.height > 0 || bbox.Height > 0)
    );
  };

  const normalizeBoundingBox = (bbox) => {
    if (!bbox) return null;
    return {
      Left: bbox.Left || bbox.left || 0,
      Top: bbox.Top || bbox.top || 0,
      Width: bbox.Width || bbox.width || 0,
      Height: bbox.Height || bbox.height || 0,
    };
  };

  useEffect(() => {
    const pdfSource = getPdfSource();

    if (pdfSource) {
      setCurrentPdfPath(pdfSource);
      setIsDataExtracting(true);
      setShowExtractedData(false);

      let dataToUse = [];
      if (apiExtractedData) {
        dataToUse = parseApiResponse(apiExtractedData);
      }

      setTextractData(dataToUse);

      const totalFields = countDataFields(dataToUse);
      setTotalDataFields(totalFields);
      if (dataToUse.length > 0) {
        setTimeout(() => {
          setIsDataExtracting(false);
          setShowExtractedData(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setIsDataExtracting(false);
          setShowExtractedData(true);
        }, 3000);
      }
    } else {
      //console.warn('No PDF source available');
    }
  }, [
    uploadedFileName,
    uploadedFileUrl,
    uploadedFile,
    storedFileData,
    apiExtractedData,
  ]);

  useEffect(() => {
    if (apiExtractedData) {
      const normalizedData = parseApiResponse(apiExtractedData);
      setTextractData(normalizedData);
      const totalFields = countDataFields(normalizedData);
      setTotalDataFields(totalFields);

      if (onDataFieldsCountChange && totalFields > 0) {
        onDataFieldsCountChange(totalFields);
      }

      if (normalizedData.length > 0) {
        setIsDataExtracting(false);
        setShowExtractedData(true);
      }
    }
  }, [apiExtractedData, onDataFieldsCountChange]);

  const renderAllPDFPages = async () => {
    if (!pdfDocRef.current || !containerRef.current) return;
    Object.values(renderTasksRef.current).forEach((task) => {
      if (task && task.cancel) {
        task.cancel();
      }
    });
    renderTasksRef.current = {};

    try {
      const currentScale = baseScale * zoomLevel;
      const newRenderedPages = {};

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDocRef.current.getPage(pageNum);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });
        const viewport = page.getViewport({ scale: currentScale * DPI_SCALE });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const displayWidth = viewport.width / DPI_SCALE;
        const displayHeight = viewport.height / DPI_SCALE;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        canvas.style.display = "block";
        canvas.style.marginBottom = "10px";
        canvas.style.border = "1px solid #e8e8e8";
        canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        canvas.style.backgroundColor = "white";
        canvas.style.imageRendering = "auto";
        canvas.dataset.pageNumber = pageNum;

        const renderTask = page.render({
          canvasContext: context,
          viewport,
          intent: "display",
        });
        renderTasksRef.current[pageNum] = renderTask;

        try {
          await renderTask.promise;
          newRenderedPages[pageNum] = {
            canvas,
            viewport,
            pageHeight: displayHeight,
            pageWidth: displayWidth,
            displayScale: currentScale,
          };
        } catch (error) {
          console.log("error", error)
          // if (error.name !== "RenderingCancelledException") {
          // }
        }
      }

      setRenderedPages(newRenderedPages);
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
  };

  useEffect(() => {
    const loadPdf = async () => {
      if (!currentPdfPath) return;
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: currentPdfPath,
          cMapUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/cmaps/",
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        const page = await pdf.getPage(1);
        const naturalWidth = page.view[2];
        const naturalHeight = page.view[3];
        setNaturalPageSize({ width: naturalWidth, height: naturalHeight });
        const container = containerRef.current;
        if (!container) return;
        const { width: clientWidth } = container.getBoundingClientRect();
        const availableWidth = clientWidth - 20;
        const calculatedBaseScale = availableWidth / naturalWidth;
        setBaseScale(calculatedBaseScale);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [currentPdfPath]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !naturalPageSize.width) return;
      const { width: clientWidth } =
        containerRef.current.getBoundingClientRect();
      const availableWidth = clientWidth - 20;
      const calculatedBaseScale = availableWidth / naturalPageSize.width;
      setBaseScale(calculatedBaseScale);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      Object.values(renderTasksRef.current).forEach((task) => {
        if (task && task.cancel) {
          task.cancel();
        }
      });
      renderTasksRef.current = {};
    };
  }, [naturalPageSize.width]);

  useEffect(() => {
    if (baseScale && pdfDocRef.current && totalPages > 0) {
      const timeoutId = setTimeout(() => {
        renderAllPDFPages();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [zoomLevel, baseScale, totalPages]);

  useEffect(() => {
    if (pagesContainerRef.current && Object.keys(renderedPages).length > 0) {
      pagesContainerRef.current.innerHTML = "";

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageData = renderedPages[pageNum];
        if (pageData) {
          pagesContainerRef.current.appendChild(pageData.canvas);
        }
      }
    }
  }, [renderedPages, totalPages]);

  const scrollToHighlight = (bbox, targetPage) => {
    const normalizedBbox = normalizeBoundingBox(bbox);
    if (!normalizedBbox || !pdfScrollRef.current || !renderedPages[targetPage])
      return;
    const currentScale = baseScale * zoomLevel;
    const pageData = renderedPages[targetPage];
    if (!pageData) return;
    let cumulativeHeight = 0;
    for (let i = 1; i < targetPage; i++) {
      const prevPageData = renderedPages[i];
      if (prevPageData) {
        cumulativeHeight += prevPageData.pageHeight + 20;
      }
    }
    const canvasWidth = naturalPageSize.width * currentScale;
    const canvasHeight = naturalPageSize.height * currentScale;
    const left = normalizedBbox.Left * canvasWidth;
    const top = normalizedBbox.Top * canvasHeight;
    const boxWidth = normalizedBbox.Width * canvasWidth;
    const boxHeight = normalizedBbox.Height * canvasHeight;
    const highlightCenterX = left + boxWidth / 2;
    const highlightCenterY = top + boxHeight / 2;
    const absoluteHighlightY = cumulativeHeight + highlightCenterY;
    const scrollContainer = pdfScrollRef.current;
    const containerRect = scrollContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const scrollLeft = Math.max(0, highlightCenterX + 10 - containerWidth / 2);
    const scrollTop = Math.max(
      0,
      absoluteHighlightY + 10 - containerHeight / 2
    );
    scrollContainer.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: "smooth",
    });
  };

  const getContributionTypeFlags = (value) => {
    const flags = [];
    const allKeys = Object.keys(value);
    const metadataFields = [
      "checked",
      "confidence_score",
      "bounding_box",
      "line",
      "value",
    ];
    const contributionTypeKeys = allKeys.filter(
      (key) => !metadataFields.includes(key)
    );

    contributionTypeKeys.forEach(() => {
      //const flagValue = value[type];

      // if (flagValue === true) {
      //   flags.push(`${formatFieldName(type)}: [X]`);
      // } else if (flagValue === false) {
      //   flags.push(`${formatFieldName(type)}: [ ]`);
      // } else if (flagValue === "N/A") {
      //   flags.push(`${formatFieldName(type)}: N/A`);
      // }
      // else if (typeof flagValue === 'string' && flagValue.trim() !== '') {
      //   flags.push(`${formatFieldName(type)}: ${flagValue}`);
      // } else if (flagValue !== null && flagValue !== undefined) {
      //   flags.push(`${formatFieldName(type)}: ${flagValue}`);
      // }
    });

    return flags;
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleZoomSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setZoomLevel(value);
  };

  const handleExportData = () => { };

  const handleDownload = () => {
    // Create the download data object
    const downloadData = {
      fileName: uploadedFileName || "extracted_data",
      extractedData: apiExtractedData || textractData,
      timestamp: new Date().toISOString(),
      totalPages: totalPages,
      totalDataFields: totalDataFields
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(downloadData, null, 2);

    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${downloadData.fileName}_extracted_data.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveToDocumentInventory = () => {
    setShowSuccessModal(true);
  };

  const handleViewTestAccuracy = () => {
    setShowSuccessModal(false);
  };
  const handleDataNotAccurateClose = () => {
    setShowDataNotAccurateModal(false);
  };
   const handleDataNotAccurate = () => {
    setShowDataNotAccurateModal(true);
  };

  const handleDataNotAccurateContinue = () => {
    setShowDataNotAccurateModal(false);

  };
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setShowDataNotAccurateModal(false);
  };

  useEffect(() => {
    const detectCurrentPage = () => {
      if (!pdfScrollRef.current || Object.keys(renderedPages).length === 0)
        return;
      const scrollContainer = pdfScrollRef.current;
      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const centerPoint = scrollTop + containerHeight / 2;
      let cumulativeHeight = 0;
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageData = renderedPages[pageNum];
        if (pageData) {
          const pageHeight = pageData.pageHeight + 10;

          if (
            centerPoint >= cumulativeHeight &&
            centerPoint < cumulativeHeight + pageHeight
          ) {
            setCurrentPage(pageNum);
            break;
          }
          cumulativeHeight += pageHeight;
        }
      }
    };

    const scrollContainer = pdfScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", detectCurrentPage);
      detectCurrentPage();
      return () => {
        scrollContainer.removeEventListener("scroll", detectCurrentPage);
      };
    }
  }, [renderedPages, totalPages]);

  const renderHighlightBox = () => {
    if (
      !highlightBox ||
      Object.keys(renderedPages).length === 0 ||
      !highlightBox.page
    )
      return null;

    const targetPage = highlightBox.page;
    const pageData = renderedPages[targetPage];

    if (!pageData) return null;

    let cumulativeHeight = 0;
    for (let i = 1; i < targetPage; i++) {
      const prevPageData = renderedPages[i];
      if (prevPageData) {
        cumulativeHeight += prevPageData.pageHeight + 10;
      }
    }

    const currentScale = baseScale * zoomLevel;
    const canvasWidth = naturalPageSize.width * currentScale;
    const canvasHeight = naturalPageSize.height * currentScale;

    const left = highlightBox.Left * canvasWidth;
    const top = highlightBox.Top * canvasHeight;
    const boxWidth = highlightBox.Width * canvasWidth;
    const boxHeight = highlightBox.Height * canvasHeight;
    const absoluteTop = cumulativeHeight + top;

    const highlightColor = getHighlightColor(highlightBox.confidenceScore);

    const dynamicStyle = {
      left: `${left - 4}px`,
      top: `${absoluteTop - 4}px`,
      width: `${boxWidth + 8}px`,
      height: `${boxHeight + 8}px`,
      borderColor: highlightColor,
      backgroundColor: `${highlightColor}20`,
    };

    return <HighlightBox style={dynamicStyle} />;
  };

  const handleClickHighlight = (
    itemKey,
    boundingBox,
    page,
    confidenceScore
  ) => {
    setSelectedItemKey(itemKey);

    const normalizedBbox = normalizeBoundingBox(boundingBox);

    if (hasValidBoundingBox(normalizedBbox)) {
      setHighlightBox({
        ...normalizedBbox,
        page: page,
        confidenceScore: confidenceScore,
      });
      setTimeout(() => scrollToHighlight(normalizedBbox, page), 200);
    } else {
      setHighlightBox(null);
    }
  };

  // const collectSubFieldsWithBoundingBoxes = (data, path = '') => {
  //   const subFields = [];

  //   Object.entries(data).forEach(([key, value]) => {
  //     const currentPath = path ? `${path}.${key}` : key;

  //     if (value && typeof value === 'object' && !Array.isArray(value)) {
  //       const hasValue = Object.prototype.hasOwnProperty.call(value, 'value');
  //       const hasChecked = Object.prototype.hasOwnProperty.call(value, 'checked');
  //       const hasConfidence = Object.prototype.hasOwnProperty.call(value, 'confidence_score');
  //       const hasBoundingBox = Object.prototype.hasOwnProperty.call(value, 'bounding_box');

  //       if ((hasValue || hasChecked || hasConfidence) && hasBoundingBox && hasValidBoundingBox(value.bounding_box)) {
  //         const displayValue = getDisplayValue(value);
  //         if (displayValue && displayValue.trim() !== '') {
  //           subFields.push({
  //             key: currentPath,
  //             value: value,
  //             label: formatFieldName(key),
  //             displayValue: displayValue,
  //             confidenceScore: value.confidence_score
  //           });
  //         }
  //       } else if (!hasValue && !hasChecked && !hasConfidence && !hasBoundingBox) {
  //         subFields.push(...collectSubFieldsWithBoundingBoxes(value, currentPath));
  //       }
  //     }
  //   });

  //   return subFields;
  // };
  const renderArraySubFields = (arrayValue, parentKey, page) => {
    if (!Array.isArray(arrayValue) || arrayValue.length === 0) {
      return null;
    }

    return arrayValue
      .map((arrayItem, arrayIndex) => {
        if (!arrayItem || typeof arrayItem !== "object") {
          return null;
        }

        const arrayItemFields = [];
        let subFieldIndex = 0;
        Object.entries(arrayItem).forEach(([fieldKey, fieldValue]) => {
          if (
            fieldValue &&
            typeof fieldValue === "object" &&
            !Array.isArray(fieldValue)
          ) {
            const hasValue = Object.prototype.hasOwnProperty.call(
              fieldValue,
              "value"
            );
            const hasChecked = Object.prototype.hasOwnProperty.call(
              fieldValue,
              "checked"
            );
            const hasConfidence = Object.prototype.hasOwnProperty.call(
              fieldValue,
              "confidence_score"
            );
            const hasBoundingBox = Object.prototype.hasOwnProperty.call(
              fieldValue,
              "bounding_box"
            );
            const hasLine = Object.prototype.hasOwnProperty.call(
              fieldValue,
              "line"
            );
            if (
              hasValue ||
              hasChecked ||
              hasConfidence ||
              hasBoundingBox ||
              hasLine
            ) {
              const fieldKey_unique = `${page}-${parentKey}-${arrayIndex}-${fieldKey}`;
              const hasHighlight = hasValidBoundingBox(fieldValue.bounding_box);
              const displayValue = getDisplayValue(fieldValue) || " ";
              const subFieldMarker = `(${subFieldIndex + 1})`;

              arrayItemFields.push(
                <SubFieldItem
                  key={fieldKey_unique}
                  hasHighlight={hasHighlight}
                  isSelected={selectedItemKey === fieldKey_unique}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickHighlight(
                      fieldKey_unique,
                      fieldValue.bounding_box,
                      page,
                      fieldValue.confidence_score
                    );
                  }}
                  style={{
                    marginLeft: "16px",
                    marginBottom: "6px",
                    backgroundColor:
                      selectedItemKey === fieldKey_unique
                        ? "#e6f7ff"
                        : hasHighlight
                          ? "#f8f9fa"
                          : "#fafafa",
                    border:
                      selectedItemKey === fieldKey_unique
                        ? "2px solid #1890ff"
                        : "1px solid #e8e8e8",
                    borderRadius: "4px",
                    padding: "8px",
                    cursor: hasHighlight ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    ":hover": hasHighlight
                      ? {
                        backgroundColor: "#e6f7ff",
                        borderColor: "#1890ff",
                      }
                      : {},
                  }}
                >
                  <Row gutter={[16, 4]}>
                    <Col span={14}>
                      <SubFieldLabel
                        style={{
                          fontSize: "12px",
                          color: hasHighlight ? "#1890ff" : "#555",
                          fontWeight: hasHighlight ? "600" : "500",
                        }}
                      >
                        {subFieldMarker} {formatFieldName(fieldKey)}
                      </SubFieldLabel>
                    </Col>
                    <Col span={10}>
                      {fieldValue.confidence_score && (
                        <SubFieldConfidence style={{ fontSize: "11px" }}>
                          Confidence Score:{" "}
                          {formatConfidenceScore(fieldValue.confidence_score)}%
                        </SubFieldConfidence>
                      )}
                    </Col>
                  </Row>
                  <Row gutter={[16, 4]}>
                    <Col span={12}>
                      <SubFieldValue
                        hasHighlight={hasHighlight}
                        style={{
                          fontSize: "12px",
                          color: hasHighlight ? "#1890ff" : "#333",
                          fontWeight: hasHighlight ? "500" : "400",
                        }}
                      >
                        {displayValue}
                      </SubFieldValue>
                    </Col>
                  </Row>
                </SubFieldItem>
              );

              subFieldIndex++;
            }
          }
        });

        if (arrayItemFields.length > 0) {
          return (
            <div
              key={`array-item-${arrayIndex}`}
              style={{ marginBottom: "12px" }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "6px",
                  paddingLeft: "12px",
                  borderLeft: "3px solid #1890ff",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  backgroundColor: "#f0f8ff",
                  borderRadius: "3px",
                }}
              >
                {arrayItem.title || `Item ${arrayIndex + 1}`}
              </div>
              {arrayItemFields}
            </div>
          );
        }

        return null;
      })
      .filter((item) => item !== null);
  };
  const toSafeString = (v) => {
    try {
      if (v === null || v === undefined) return "";
      if (typeof v === "object") return "";
      const s = String(v);
      return s
        .replace(/\[object Object\]/gi, "")
        .replace(/object\.object/gi, "")
        .trim();
    } catch (err) {
      return "";
    }
  };

  const isSubSectionHeader = (key, value) => {
    const sectionPattern = /^(Section|Part|Chapter|Article)\s+[\d\w\.]+$/i;

    // Also check if the value contains nested objects that look like options or subsections
    const hasNestedStructure =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).some(
        (nestedKey) =>
          typeof value[nestedKey] === "object" &&
          value[nestedKey] !== null &&
          (nestedKey.toLowerCase().includes("option") ||
            nestedKey.toLowerCase().includes("choice") ||
            /^[A-Z]$/.test(nestedKey) || // Single letter keys like "A", "B"
            /^\d+$/.test(nestedKey)) // Numeric keys
      );

    return sectionPattern.test(key) || hasNestedStructure;
  };

  // Update the renderDataStructure function to handle subsections
  // const renderDataStructure = (data, path = "", page = null, depth = 0) => {
  //   const items = [];
  //   let fieldIndex = 0;

  //   Object.entries(data).forEach(([key, value], entryIndex) => {
  //     const currentPath = path ? `${path}.${key}` : key;

  //     if (value && typeof value === "object" && !Array.isArray(value)) {
  //       const hasValue = Object.prototype.hasOwnProperty.call(value, "value");
  //       const hasChecked = Object.prototype.hasOwnProperty.call(
  //         value,
  //         "checked"
  //       );
  //       const hasConfidence = Object.prototype.hasOwnProperty.call(
  //         value,
  //         "confidence_score"
  //       );
  //       const hasBoundingBox = Object.prototype.hasOwnProperty.call(
  //         value,
  //         "bounding_box"
  //       );
  //       const hasLine = Object.prototype.hasOwnProperty.call(value, "line");

  //       // Check if this is a subsection header
  //       const isSubSection = isSubSectionHeader(key, value);

  //       if (
  //         hasValue ||
  //         hasChecked ||
  //         hasConfidence ||
  //         hasBoundingBox ||
  //         hasLine
  //       ) {
  //         // This is a data field - render as before
  //         const hasHighlight = hasValidBoundingBox(value.bounding_box);
  //         //console.log("value.bounding_box",value.bounding_box)
  //         const itemKey = `${page}-${currentPath}`;
  //         const displayValue = getDisplayValue(value);
  //         const contributionFlags = getContributionTypeFlags(value);
  //         const confidenceScore = value.confidence_score;
  //         const fieldMarker =
  //           depth === 0 || depth === 1 ? " " : `(${fieldIndex + 1})`;
  //         const shouldRender =
  //           displayValue ||
  //           contributionFlags.length > 0 ||
  //           hasChecked ||
  //           hasConfidence ||
  //           hasBoundingBox;

  //         if (shouldRender) {
  //           const isArrayValue =
  //             hasValue && Array.isArray(value.value) && value.value.length > 0;
  //           const standardProps = [
  //             "value",
  //             "checked",
  //             "confidence_score",
  //             "bounding_box",
  //             "line",
  //           ];
  //           const nestedFieldEntries = Object.entries(value).filter(
  //             ([nestedKey]) => !standardProps.includes(nestedKey)
  //           );

  //           const itemStyle = {
  //             cursor: hasHighlight ? "pointer" : "default",
  //             opacity: hasHighlight ? 1 : 0.8,
  //             padding: "8px",
  //             marginBottom: "8px",

  //             marginLeft: depth > 0 ? "12px" : "0px",
  //             backgroundColor:
  //               selectedItemKey === itemKey
  //                 ? confidenceScore !== null &&
  //                   confidenceScore !== undefined &&
  //                   confidenceScore < CONFIDENCE_THRESHOLD
  //                   ? "#fedfddff"
  //                   : "#e6f7ff"
  //                 : "transparent",
  //             border:
  //               selectedItemKey === itemKey
  //                 ? confidenceScore !== null &&
  //                   confidenceScore !== undefined &&
  //                   confidenceScore < CONFIDENCE_THRESHOLD
  //                   ? "2px solid #FF0000"
  //                   : "2px solid #1890ff"
  //                 : "none",
  //             borderRadius: selectedItemKey === itemKey ? "4px" : "0px",
  //             transition: "all 0.2s ease",
  //           };

  //           const fieldLabel = `${fieldMarker} ${formatFieldName(key)}`;
  //           const renderedField = renderDataField(
  //             value,
  //             displayValue || " ",
  //             confidenceScore,
  //             hasHighlight
  //           );

  //           items.push(
  //             <DataItem
  //               key={itemKey}
  //               isSelected={selectedItemKey === itemKey}
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 handleClickHighlight(
  //                   itemKey,
  //                   value.bounding_box,
  //                   page,
  //                   confidenceScore
  //                 );
  //               }}
  //               style={itemStyle}
  //             >
  //               {renderedField}

  //               {isArrayValue && (
  //                 <SubFieldsContainer>
  //                   <div
  //                     style={{
  //                       fontSize: "13px",
  //                       fontWeight: "500",
  //                       color: "#333",
  //                       marginBottom: "8px",

  //                       paddingTop: "4px",
  //                     }}
  //                   >
  //                     Array Items ({value.value.length} items):
  //                   </div>
  //                   {renderArraySubFields(
  //                     value.value,
  //                     currentPath,
  //                     page,
  //                     fieldIndex
  //                   )}
  //                 </SubFieldsContainer>
  //               )}

  //               {!isArrayValue && nestedFieldEntries.length > 0 && (
  //                 <SubFieldsContainer style={{ marginTop: "8px" }}>
  //                   {nestedFieldEntries.map(
  //                     ([nestedKey, nestedValue], nestedIndex) => {
  //                       if (nestedValue && typeof nestedValue === "object") {
  //                         const nestedItems = renderDataStructure(
  //                           { [nestedKey]: nestedValue },
  //                           currentPath,
  //                           page,
  //                           depth + 1,
  //                           nestedIndex
  //                         );
  //                         return (
  //                           <div
  //                             key={`nested-${nestedIndex}`}
  //                             style={{
  //                               marginBottom: "4px",
  //                             }}
  //                           >
  //                             {nestedItems}
  //                           </div>
  //                         );
  //                       }
  //                       return null;
  //                     }
  //                   )}
  //                 </SubFieldsContainer>
  //               )}

  //               {contributionFlags.length > 0 && (
  //                 <ContributionFlagsContainer>
  //                   {contributionFlags.map((flag, flagIndex) => (
  //                     <ContributionFlag key={flagIndex}>
  //                       {toSafeString(flag)}
  //                     </ContributionFlag>
  //                   ))}
  //                 </ContributionFlagsContainer>
  //               )}
  //             </DataItem>
  //           );

  //           fieldIndex++;
  //         }
  //       } else if (isSubSection) {
  //         // This is a subsection header - render it with special styling
  //         const subSectionKey = `${page}-${currentPath}-subsection`;
  //         const subSectionItems = renderDataStructure(
  //           value,
  //           currentPath,
  //           page,
  //           depth + 1
  //         );

  //         if (subSectionItems.length > 0) {
  //           items.push(
  //             <div key={subSectionKey} style={{ marginBottom: "16px" }}>
  //               {/* Subsection Header */}
  //               <div
  //                 style={{
  //                   fontSize: "13px",
  //                   fontWeight: "700",
  //                   marginBottom: "8px",
  //                   color: "#212121",
  //                   paddingTop: "8px",
  //                   paddingBottom: "8px",
  //                   borderRadius: "4px",
  //                   marginLeft: depth > 0 ? "12px" : "0px",
  //                 }}
  //               >
  //                 {formatFieldName(key)}
  //               </div>

  //               {/* Subsection Content */}
  //               <div
  //                 style={{
  //                   marginLeft: depth > 0 ? "24px" : "12px",
  //                   paddingLeft: "2px",
  //                 }}
  //               >
  //                 {subSectionItems}
  //               </div>
  //             </div>
  //           );
  //         }
  //       } else {
  //         // Regular nested object - render recursively
  //         const nestedItems = renderDataStructure(
  //           value,
  //           currentPath,
  //           page,
  //           depth,
  //           entryIndex
  //         );
  //         items.push(...nestedItems);
  //       }
  //     } else if (Array.isArray(value)) {
  //       // Handle arrays as before
  //       const fieldMarker =
  //         depth === 0 || depth === 1
  //           ? `(${String.fromCharCode(97 + fieldIndex)})`
  //           : `(${fieldIndex + 1})`;

  //       items.push(
  //         <DataItem
  //           key={`${page}-${currentPath}-array`}
  //           style={{
  //             padding: "8px",
  //             marginBottom: "8px",
  //             borderLeft: depth > 0 ? "3px solid #e8e8e8" : "none",
  //             marginLeft: depth > 0 ? "12px" : "0px",
  //           }}
  //         >
  //           <DataFieldContainer>
  //             <Row gutter={[16, 4]}>
  //               <Col span={14}>
  //                 <FieldLabel>
  //                   {fieldMarker} {formatFieldName(key)}
  //                 </FieldLabel>
  //               </Col>
  //               <Col span={10}>
  //                 <ConfidenceLabel>
  //                   Array with {value.length} items
  //                 </ConfidenceLabel>
  //               </Col>
  //             </Row>
  //           </DataFieldContainer>

  //           <SubFieldsContainer>
  //             {value.map((arrayItem, arrayIndex) => {
  //               if (arrayItem && typeof arrayItem === "object") {
  //                 const arrayItems = renderDataStructure(
  //                   arrayItem,
  //                   `${currentPath}[${arrayIndex}]`,
  //                   page,
  //                   depth + 1,
  //                   arrayIndex
  //                 );
  //                 return (
  //                   <div
  //                     key={`array-item-${arrayIndex}`}
  //                     style={{
  //                       marginBottom: "8px",

  //                       padding: "6px",
  //                     }}
  //                   >
  //                     <div
  //                       style={{
  //                         fontSize: "12px",
  //                         fontWeight: "600",

  //                         marginBottom: "4px",
  //                       }}
  //                     >
  //                       Item {arrayIndex + 1}
  //                     </div>
  //                     {arrayItems}
  //                   </div>
  //                 );
  //               }
  //               return null;
  //             })}
  //           </SubFieldsContainer>
  //         </DataItem>
  //       );

  //       fieldIndex++;
  //     }
  //   });

  //   return items;
  // };
  // Update the renderDataStructure function
  const renderDataStructure = (data, path = "", page = null, depth = 0) => {
    const items = [];
    let fieldIndex = 0;

    Object.entries(data).forEach(([key, value], entryIndex) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        const hasValue = Object.prototype.hasOwnProperty.call(value, "value");
        const hasChecked = Object.prototype.hasOwnProperty.call(value, "checked");
        const hasConfidence = Object.prototype.hasOwnProperty.call(
          value,
          "confidence_score"
        );
        const hasBoundingBox = Object.prototype.hasOwnProperty.call(
          value,
          "bounding_box"
        );
        const hasLine = Object.prototype.hasOwnProperty.call(value, "line");

        // NEW: detect nested format: { subtitle: { value }, premium: { value } }
        const isNestedValueField = Object.values(value).some(
          (v) =>
            v &&
            typeof v === "object" &&
            !Array.isArray(v) &&
            Object.prototype.hasOwnProperty.call(v, "value")
        );

        const isDirectField =
          hasValue || hasChecked || hasConfidence || hasBoundingBox || hasLine;

        const isSubSection = isSubSectionHeader(key, value);

        // --- FIELD RENDERING (DIRECT OR NESTED) ---
        if (isDirectField || isNestedValueField) {
          const hasHighlight = hasValidBoundingBox(value.bounding_box);
          const itemKey = `${page}-${currentPath}`;
          const displayValue = getDisplayValue(value);
          const contributionFlags = getContributionTypeFlags(value);
          const confidenceScore = value.confidence_score;
          const fieldMarker =
            depth === 0 || depth === 1 ? " " : `(${fieldIndex + 1})`;

          const shouldRender =
            displayValue ||
            contributionFlags.length > 0 ||
            hasChecked ||
            hasConfidence ||
            hasBoundingBox ||
            isNestedValueField;

          if (shouldRender) {
            const isArrayValue =
              hasValue && Array.isArray(value.value) && value.value.length > 0;

            const standardProps = [
              "value",
              "checked",
              "confidence_score",
              "bounding_box",
              "line",
            ];

            const nestedFieldEntries = Object.entries(value).filter(
              ([nestedKey]) => !standardProps.includes(nestedKey)
            );

            const itemStyle = {
              cursor: hasHighlight ? "pointer" : "default",
              opacity: hasHighlight ? 1 : 0.8,
              padding: "8px",
              marginBottom: "8px",
              marginLeft: depth > 0 ? "12px" : "0px",
              backgroundColor:
                selectedItemKey === itemKey
                  ? confidenceScore !== null &&
                    confidenceScore !== undefined &&
                    confidenceScore < CONFIDENCE_THRESHOLD
                    ? "#fedfddff"
                    : "#e6f7ff"
                  : "transparent",
              border:
                selectedItemKey === itemKey
                  ? confidenceScore !== null &&
                    confidenceScore !== undefined &&
                    confidenceScore < CONFIDENCE_THRESHOLD
                    ? "2px solid #FF0000"
                    : "2px solid #1890ff"
                  : "none",
              borderRadius: selectedItemKey === itemKey ? "4px" : "0px",
              transition: "all 0.2s ease",
            };

            const fieldLabel = `${fieldMarker} ${formatFieldName(key)}`;

            const renderedField = renderDataField(
              fieldLabel,
              value,
              confidenceScore,
              hasHighlight
            );

            items.push(
              <DataItem
                key={itemKey}
                isSelected={selectedItemKey === itemKey}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickHighlight(
                    itemKey,
                    value.bounding_box,
                    page,
                    confidenceScore
                  );
                }}
                style={itemStyle}
              >
                {renderedField}

                {/* Render Arrays */}
                {isArrayValue && (
                  <SubFieldsContainer>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                        marginBottom: "8px",
                        paddingTop: "4px",
                      }}
                    >
                      Array Items ({value.value.length}):
                    </div>
                    {renderArraySubFields(
                      value.value,
                      currentPath,
                      page,
                      fieldIndex
                    )}
                  </SubFieldsContainer>
                )}

                {/* Render nested key-value fields */}
                {!isArrayValue && nestedFieldEntries.length > 0 && (
                  <SubFieldsContainer style={{ marginTop: "8px" }}>
                    {nestedFieldEntries.map(
                      ([nestedKey, nestedValue], nestedIndex) => {
                        if (nestedValue && typeof nestedValue === "object") {
                          const nestedItems = renderDataStructure(
                            { [nestedKey]: nestedValue },
                            currentPath,
                            page,
                            depth + 1,
                            nestedIndex
                          );
                          return (
                            <div
                              key={`nested-${nestedIndex}`}
                              style={{ marginBottom: "4px" }}
                            >
                              {nestedItems}
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  </SubFieldsContainer>
                )}

                {/* Contribution flags */}
                {contributionFlags.length > 0 && (
                  <ContributionFlagsContainer>
                    {contributionFlags.map((flag, flagIndex) => (
                      <ContributionFlag key={flagIndex}>
                        {toSafeString(flag)}
                      </ContributionFlag>
                    ))}
                  </ContributionFlagsContainer>
                )}
              </DataItem>
            );

            fieldIndex++;
          }
        }

        // --- SUBSECTION HANDLING ---
        else if (isSubSection) {
          const subSectionKey = `${page}-${currentPath}-subsection`;
          const subSectionItems = renderDataStructure(
            value,
            currentPath,
            page,
            depth + 1
          );

          if (subSectionItems.length > 0) {
            items.push(
              <div key={subSectionKey} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    color: "#212121",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    borderRadius: "4px",
                    marginLeft: depth > 0 ? "12px" : "0px",
                  }}
                >
                  {formatFieldName(key)}
                </div>

                <div
                  style={{
                    marginLeft: depth > 0 ? "24px" : "12px",
                    paddingLeft: "2px",
                  }}
                >
                  {subSectionItems}
                </div>
              </div>
            );
          }
        }

        // --- REGULAR NESTED OBJECT ---
        else {
          const nestedItems = renderDataStructure(
            value,
            currentPath,
            page,
            depth,
            entryIndex
          );
          items.push(...nestedItems);
        }
      }

      // --- ARRAY HANDLING ---
      else if (Array.isArray(value)) {
        const fieldMarker =
          depth === 0 || depth === 1
            ? `(${String.fromCharCode(97 + fieldIndex)})`
            : `(${fieldIndex + 1})`;

        items.push(
          <DataItem
            key={`${page}-${currentPath}-array`}
            style={{
              padding: "8px",
              marginBottom: "8px",
              borderLeft: depth > 0 ? "3px solid #e8e8e8" : "none",
              marginLeft: depth > 0 ? "12px" : "0px",
            }}
          >
            <DataFieldContainer>
              <Row gutter={[16, 4]}>
                <Col span={14}>
                  <FieldLabel>
                    {fieldMarker} {formatFieldName(key)}
                  </FieldLabel>
                </Col>
                <Col span={10}>
                  <ConfidenceLabel>Array with {value.length} items</ConfidenceLabel>
                </Col>
              </Row>
            </DataFieldContainer>

            <SubFieldsContainer>
              {value.map((arrayItem, arrayIndex) => {
                if (arrayItem && typeof arrayItem === "object") {
                  const arrayItems = renderDataStructure(
                    arrayItem,
                    `${currentPath}[${arrayIndex}]`,
                    page,
                    depth + 1,
                    arrayIndex
                  );
                  return (
                    <div
                      key={`array-item-${arrayIndex}`}
                      style={{
                        marginBottom: "8px",
                        padding: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "4px",
                        }}
                      >
                        Item {arrayIndex + 1}
                      </div>
                      {arrayItems}
                    </div>
                  );
                }
                return null;
              })}
            </SubFieldsContainer>
          </DataItem>
        );

        fieldIndex++;
      }
    });

    return items;
  };

  const renderZoomControls = () => (
    <ZoomControls>
      <PageIndicator>
        {currentPage}/{totalPages}
      </PageIndicator>
      <ZoomButton
        onClick={handleZoomOut}
        disabled={zoomLevel <= 0.25}
        title="Zoom Out"
      >
        <MinusOutlined />
      </ZoomButton>
      <ZoomSlider
        type="range"
        min="0.25"
        max="4"
        step="0.25"
        value={zoomLevel}
        onChange={handleZoomSliderChange}
        title={`Zoom: ${Math.round(zoomLevel * 100)}%`}
      />
      <ZoomButton
        onClick={handleZoomIn}
        disabled={zoomLevel >= 4}
        title="Zoom In"
      >
        <PlusOutlined />
      </ZoomButton>
      <ZoomPercentage>{Math.round(zoomLevel * 100)}%</ZoomPercentage>
    </ZoomControls>
  );

  const renderPDFPreview = () => (
    <PDFScrollContainer ref={pdfScrollRef} className="pdf-scroll-container">
      <PDFContainer ref={containerRef}>
        <PDFCanvasWrapper>
          <div ref={pagesContainerRef} />
          {renderHighlightBox()}
        </PDFCanvasWrapper>
      </PDFContainer>
    </PDFScrollContainer>
  );

  const renderExtractedDataContent = () => {
    if (isDataExtracting) {
      return (
        <LoadingContainer>
          <Spin size="large" />
          <LoadingText>Extracting data...</LoadingText>
        </LoadingContainer>
      );
    }

    if (!showExtractedData) {
      return <div />;
    }

    if (!textractData || textractData.length === 0) {
      return (
        <LoadingContainer>
          <LoadingText>No data available to display</LoadingText>
        </LoadingContainer>
      );
    }
    return (
      <ExtractedDataContainer
        ref={extractedDataScrollRef}
        className="extracted-data-scroll-container"
      >
        <ExtractedDataContent>
          <Collapse
            accordion={false}
            bordered={false}
            defaultActiveKey={textractData.map(
              (_, i) => `page-${_.page || i + 1}`
            )}
          >
            {textractData.map((pageData, pageIndex) => {
              if (!pageData || typeof pageData !== "object") {
                return null;
              }

              const pageNumber = pageData.page || pageIndex + 1;

              const sections = Object.entries(pageData).filter(
                ([key, value]) => {
                  const isValidSection =
                    key !== "page" && value && typeof value === "object";

                  return isValidSection;
                }
              );

              return (
                <Panel
                  key={`page-${pageNumber}`}
                  header={
                    <div style={{ textAlign: "left", fontWeight: 600 }}>
                      Page {pageNumber}
                    </div>
                  }
                  style={{
                    marginBottom: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    background: "#fff",
                    overflow: "hidden",
                  }}
                >
                  <div
                    ref={(el) => {
                      pageRefs.current[pageNumber] = el;
                    }}
                  >
                    {sections.length === 0 ? (
                      <div>
                        <SectionCard>
                          <SectionHeader>
                            {formatSectionName("page_" + pageNumber)}
                          </SectionHeader>
                          <SectionContent>
                            <LoadingText>
                              No extractable data found on this page
                            </LoadingText>
                          </SectionContent>
                        </SectionCard>
                      </div>
                    ) : (
                      <div>
                        {sections.map(([sectionKey, sectionData]) => {
                          const sectionItems = renderDataStructure(
                            sectionData,
                            sectionKey,
                            pageNumber,
                            0
                          );

                          if (sectionItems.length === 0) {
                            return null;
                          }

                          return (
                            <SectionCard key={`${pageNumber}-${sectionKey}`}>
                              <SectionHeader>
                                {formatSectionName(sectionKey)}
                              </SectionHeader>
                              <SectionContent>{sectionItems}</SectionContent>
                            </SectionCard>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Panel>
              );
            })}
          </Collapse>
        </ExtractedDataContent>
      </ExtractedDataContainer>
    );
  };

  const handlePageSelect = (pageNum) => {
    const container = extractedDataScrollRef.current;
    const target = pageRefs.current[pageNum];

    if (container && target) {
      const top = target.offsetTop - container.offsetTop; // exact top of that page section
      container.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const renderExtractedDataCard = () => (
    <Card
      title={
        <Row justify="space-between" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={24} lg={20}>
            <CardTitleStyle>Extracted Data</CardTitleStyle>
            {/* <PDFPageInfo>Total data extracted: {totalDataFields}</PDFPageInfo> */}
          </Col>
          <Col
            xs={24}
            sm={12}
            md={24}
            lg={4}
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <HeaderButton style={{ padding: 0 }}>
              <Select
                placeholder="Go to Page"
                onChange={handlePageSelect}
                bordered={false}
                style={{
                  width: "110px",
                  fontWeight: 500,
                  color: "#006172",
                }}
              >
                {textractData.map((pageData, index) => {
                  const pageNum = pageData.page || index + 1;
                  return (
                    <Option key={pageNum} value={pageNum}>
                      Page {pageNum}
                    </Option>
                  );
                })}
              </Select>
            </HeaderButton>

            <HeaderButton onClick={handleExportData}>
              <ExportOutlined /> Export Data
            </HeaderButton>
          </Col>
        </Row>
      }
      headStyle={CardHeaderStyle}
      bodyStyle={{
        ...ExtractedDataBodyStyle,
        paddingBottom: "0px",
      }}
    >
      {renderExtractedDataContent()}
    </Card>
  );

  // Success Modal Component
  const renderSuccessModal = () => (
    <Modal
      open={showSuccessModal}
      onCancel={handleModalClose}
      footer={null}
      centered
      width={490}
      height={227}
      closable={false}
      bodyStyle={{
        textAlign: "center",
      }}
      style={{
        borderRadius: "12px",
      }}
    >
      <SuccessModalContainer>
        <SuccessIcon>
          <CheckCircleOutlined
            style={{
              fontSize: "42px",
              color: "#006172",
            }}
          />
        </SuccessIcon>

        <SuccessTitle>Success!</SuccessTitle>

        <SuccessMessage>
          The document has been approved and is sent to the
          <br />
          IDP feedback system
        </SuccessMessage>

        <SuccessButton onClick={handleViewTestAccuracy}>Continue</SuccessButton>
      </SuccessModalContainer>
    </Modal>
  );
  //Reject Modal
const renderDataNotAccurateModal = () => (
  <Modal
    open={showDataNotAccurateModal}
    onCancel={handleDataNotAccurateClose}
    footer={null}
    centered
    width={490}
    closable={false}
    bodyStyle={{
      textAlign: "center",
    }}
    style={{
      borderRadius: "12px",
    }}
  >
    <RejectModalContainer>
      <RejectIcon>
        <CloseCircleOutlined
          style={{
            fontSize: "42px",
            color: "#d32f2f",
          }}
        />
      </RejectIcon>

      <RejectTitle>Rejected!</RejectTitle>

      <RejectMessage>
        The document has been flagged as inaccurate 
        <br />
        
      </RejectMessage>

      <RejectButton onClick={handleDataNotAccurateContinue}>
        Continue
      </RejectButton>
    </RejectModalContainer>
  </Modal>
);
  // New component to render action buttons in separate rows
  // New component to render action buttons in separate rows
  const renderActionButtons = () => {
    if (hideActionButtons) {
      return null; // Add this condition
    }

    return (
      <ActionButtonsSection>
        {/* Primary Action Buttons Row */}
        <ActionButtonsRow>
          <Col xs={12} sm={12} md={12} lg={12}>
            <PrimaryActionButton onClick={handleSaveToDocumentInventory}>
              Submit to Document Inventory
            </PrimaryActionButton>
          </Col>
        </ActionButtonsRow>
        <ActionButtonsRow>
          <Col xs={12} sm={12} md={12} lg={12}>
            <SecondaryActionButton onClick={handleDataNotAccurate}>
              Data Not Accurate
            </SecondaryActionButton>
          </Col>
        </ActionButtonsRow>
      </ActionButtonsSection>
    );
  };

  const renderPDFCard = () => (
    <Card
      title={
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={6} sm={6} md={8} lg={2}>
            <PDFTitleSection>
              <CardTitleStyle>Documents</CardTitleStyle>
              <PDFPageInfo>Total Pages: {totalPages || 0}</PDFPageInfo>
            </PDFTitleSection>
          </Col>
          <Col xs={10} sm={10} md={24} lg={8}>
            {/* Zoom Controls with responsive width */}
            <div>{renderZoomControls()}</div>
          </Col>
          <Col xs={8} sm={8} md={24} lg={6}>
            {/* Download button */}
            <HeaderButton onClick={handleDownload}>
              <DownloadOutlined /> Download
            </HeaderButton>
          </Col>
        </Row>
      }
      headStyle={CardHeaderStyle}
      bodyStyle={CardBodyStyle}
    >
      {renderPDFPreview()}
    </Card>
  );
  // if (viewMode) {
  //   return (
  //     <StyledContainer>
  //       <Row
  //         gutter={[16, 8]}
  //         align="middle"
  //         justify="space-between"
  //         style={{ paddingRight: 16 }}
  //       >
  //         {/* Title for view mode */}
  //         <Col span={24}>
  //           <div style={{ textAlign: "left" }}>
  //             <div style={{ fontSize: 16, fontWeight: 600, color: "#212121", marginBottom: 20 }}>
  //               Document Preview
  //             </div>
  //           </div>
  //         </Col>
  //       </Row>
  //       <Row gutter={[8, 8]}>
  //         {/* Show only PDF in view mode */}
  //         <Col xs={24} xl={24} lg={24} md={24}>
  //           {renderPDFCard()}
  //         </Col>
  //       </Row>
  //     </StyledContainer>
  //   );
  // }

  // Original layout for extraction mode
  // In view mode, show only the PDF preview without extracted data
  if (viewMode) {
    return (
      <StyledContainer>
        <Row
          gutter={[16, 8]}
          align="middle"
          justify="space-between"
          style={{ paddingRight: 16 }}
        >
          {/* Title for view mode */}
          <Col span={24}>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#212121",
                  marginBottom: 20,
                }}
              >
                Document Preview
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          {/* Show only PDF in view mode */}
          <Col xs={24} xl={24} lg={24} md={24}>
            {renderPDFCard()}
          </Col>
        </Row>
      </StyledContainer>
    );
  }
  return (
    <StyledContainer>
      <Row
        gutter={[16, 8]}
        align="middle"
        justify="space-between"
        style={{ paddingRight: 16 }}
      >
        {/* Title & Subtitle */}
        <Col span={24}>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#212121",
                marginBottom: 20,
              }}
            >
              Extracted data comparison with PDF document
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col xs={24} xl={10} lg={10} md={10}>
          {renderExtractedDataCard()}
        </Col>
        <Col xs={24} xl={14} lg={14} md={14}>
          {renderPDFCard()}
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col xs={24} xl={10} lg={10} md={10}>
          {renderActionButtons()}
        </Col>
      </Row>
      {renderSuccessModal()}
      {renderDataNotAccurateModal()}
    </StyledContainer>
  );
};

export default DataExtractionScreen;
