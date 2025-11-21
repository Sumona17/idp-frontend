// src/styles/UploadFile.js
import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 30px 20px;
`;

export const UploadCard = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UploadCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FileName = styled.span`
  font-size: 14px;
  color: #000;
`;
export const ProgressText = styled.span`
  font-size: 16px;
  color: #00837a;
  font-weight: 600;

  /* 📱 Responsive font size */
  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
export const ProgressWrapper = styled.div`
  height: 6px;
  background: #d9d9d9;
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) => props.percent || 0}%;
  background: #00796b;
  transition: width 0.3s ease;
`;

export const SuccessText = styled.p`
  font-size: 14px;
  color: #555;
  strong {
    color: green;
  }
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 4px;
  font-size: 14px;
`;

export const FileUploadSection = styled.div`
  position: relative;
  min-height: 150px;
  opacity: ${(props) => (props.uploading ? 0 : 1)};
  transition: opacity 0.5s ease;
`;

export const ExtractionWrapper = styled.div`
  margin-top: 20px;
`;

export const FileUploadingContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 10px 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatusText = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 8px;
`;

// Add at the bottom of UploadFile.js

export const UploadHeader = styled.div`
  text-align: left;
  margin-bottom: 10px;
  margin-top:-20px;
`;

export const UploadTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: -10px;
  color: #212121;
`;

export const UploadSubtext = styled.p`
  font-size: 12px;
  color: #212121;
`;

export const UploadBox = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background-color: #fafafa;
`;

export const UploadInfo = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #4b5563;
`;

export const UploadLimit = styled.p`
  font-size: 13px;
  color: #6b7280;
`;
