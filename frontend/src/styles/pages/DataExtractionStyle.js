import styled from 'styled-components';

export const StyledContainer = styled.div`
  .pdf-scroll-container,
  .extracted-data-scroll-container {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.scrollbarTrackBg || '#f8f9fa'};
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.scrollbarThumbBg || '#D7D7D7'};
      border-radius: 4px;
      border: 1px solid ${({ theme }) => theme.scrollbarThumbBg || '#D7D7D7'};
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.scrollbarThumbHoverBg || '#495057'};
    }
    
    &::-webkit-scrollbar-corner {
      background: ${({ theme }) => theme.scrollbarTrackBg || '#f8f9fa'};
    }
  }
    & > *:first-child {
    margin-top: 0px !important;   /* or set to 8px if you want some spacing */
  }
`;

export const PDFScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  background-color: #f5f5f5;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.scrollbarThumbBg || '#D7D7D7'} ${({ theme }) => theme.scrollbarTrackBg || '#f8f9fa'};
`;

export const HeaderText = styled.div`
  color: black;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  marginTop: 0 !important;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const PDFContainer = styled.div`
  padding: 10px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  width: 100%;
  min-width: 100%;
`;

export const PDFCanvasWrapper = styled.div`
  position: relative;
  display: block;
  width: 100%;
`;

export const PDFCanvas = styled.canvas`
  display: block;
  margin-bottom: 10px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  width: 100%;
  height: auto;
`;

export const HighlightBox = styled.div`
  position: absolute;
  border: 2px solid rgba(0, 162, 255, 0.7);
  background-color: rgba(104, 167, 250, 0.2);
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(109, 155, 253, 0.4);
  pointer-events: none;
  z-index: 20;
`;

export const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* Slightly reduced gap for mobile */
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

export const ZoomButton = styled.button`
  border: 1px solid #006172;
  background: ${({ theme }) => theme.zoomButtonBg || '#F3F5F6'};
  color: #006172;
  width: 20px;   /* Reduced from 26px */
  height: 29px;  /* Reduced from 26px */
  border-radius: 50%; /* Perfect circle */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px; /* Slightly smaller icon text */
  font-weight: bold;

  &:hover:not(:disabled) {
    background: #006172;
    color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #ccc;
    color: #006172;
    background: ${({ theme }) => theme.zoomButtonBg || '#F3F5F6'};
  }
`;

export const ZoomSlider = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  min-width: 80px; /* Minimum width to prevent too small slider */
  max-width: 120px; /* Maximum width to prevent too large slider */
  height: 4px;
  border-radius: 2px;
  outline: none;

  /* Dynamic track color (webkit browsers) */
  background: ${({ value, min, max }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #006172 ${percentage}%, #D9D9D9 ${percentage}%)`;
  }};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #006172;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  &::-moz-range-track {
    background: transparent;
  }

  /* Firefox thumb */
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #006172;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  /* Firefox track color */
  &::-moz-range-progress {
    background-color: #006172;
    height: 4px;
  }
  &::-moz-range-track {
    background-color: #D9D9D9;
    height: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    max-width: 100px;
    min-width: 60px;
  }
  
  @media (max-width: 480px) {
    max-width: 80px;
    min-width: 50px;
  }
`;

export const ZoomPercentage = styled.div`
  font-size: 13px;
  color: #4B4B4B;
  font-weight: 600;
  text-align: center;
`;

export const PageIndicator = styled.div`
  font-size: 12px;
  color: #333;
  font-weight: 500;
  margin-right: 8px;
`;

export const PDFInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

export const PDFSize = styled.span`
  font-size: 12px;
  color: #999;
`;

export const ExtractedDataContainer = styled.div`
  height: 100%;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.scrollbarThumbBg || '#D7D7D7'} ${({ theme }) => theme.scrollbarTrackBg || '#f8f9fa'};
`;

export const ExtractedDataContent = styled.div`
  padding: 16px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`;

export const LoadingText = styled.p`
  color: #595959;
  font-size: 14px;
`;

export const SectionCard = styled.div`
  background-color: #fff;
  padding: 0;
  border: none;
`;

export const SectionHeader = styled.div`
  color: #212121;
  font-weight: 700;
  text-align: left;
  margin-bottom: 0;
  font-size: 13px;
  letter-spacing: 0.5px;
`;

export const SectionContent = styled.div`
  padding: 1px;
  text-align: left;
`;

export const DataItem = styled.div`
  cursor: pointer;
  padding: 2px;
  border-radius: 6px;
  background-color: ${props => props.isSelected ? '#e6f7ff' : 'transparent'};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isSelected ? '#1890ff' : 'transparent'};
  margin-bottom: 8px;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#e6f7ff' : '#f8f9fa'};
    border-color: ${props => props.isSelected ? '#1890ff' : '#dee2e6'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const DataRow = styled.div`
  margin-bottom: 4px;
`;

export const DataLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #4B4B4B;
  text-align: left;
  margin-bottom: 4px;
  line-height: 1.3;
`;

export const DataValue = styled.div`
  font-size: 12px;
  color: #4B4B4B;
  text-align: left;
  line-height: 1.4;
`;

// Data field styles
export const DataFieldContainer = styled.div`
  margin-bottom: 12px;
`;

export const LabelsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

export const ConfidenceLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-align: right;
  flex-shrink: 0;
`;

export const ValuesRow = styled.div`
  display: flex;
`;

export const FieldValue = styled.div`
  font-size: 12px;
  color: ${props => props.hasHighlight ? '#333' : '#6c757d'};
  word-break: break-word;
  flex: 1;
`;

// Sub-field styles
export const SubFieldsContainer = styled.div`
  margin-top: 8px;
  padding-left: 8px;
`;

export const SubFieldItem = styled.div`
  cursor: ${props => (props.hasHighlight ? 'pointer' : 'default')};
  padding: 2px 0;
  border-radius: 4px;
  background-color: ${({ isSelected }) => (isSelected ? '#e6f7ff' : 'transparent')};
  transition: background-color 0.2s ease;
`;

export const SubFieldLabelsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const SubFieldLabel = styled.div`
  font-size: 11px;
  color: #666;
  font-weight: 500;
  flex: 1;
`;

export const SubFieldConfidence = styled.div`

  color: #666;
  text-align: right;
  flex-shrink: 0;
`;

export const SubFieldValuesRow = styled.div`
  display: flex;
`;

export const SubFieldValue = styled.div`
  font-size: 11px;
  color: ${props => props.hasHighlight ? '#333' : '#6c757d'};
  margin-left: 12px;
  word-break: break-word;
  flex: 1;
`;

// Contribution flags styles
export const ContributionFlagsContainer = styled.div`
  margin-top: 8px;
  padding-left: 8px;
`;

export const ContributionFlag = styled.div`
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 2px;
  font-style: normal;
  text-align: left;
  font-weight: 400;
`;

export const CardHeaderStyle = {
  background: '#F3F5F6',
  borderBottom: '2px solid #e9ecef',
  padding: '16px 20px',
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

export const CardTitleStyle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #006172;
  margin: 0;
  text-align: left;
`;

export const CardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderButton = styled.button`
  border: 1px solid #006172;
  background: ${({ theme }) => theme.headerButtonBg || '#F3F5F6'};
  color: #006172;
  height: 35px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
   &:hover {
    border-color: #004d56;        /* darker teal border */
    box-shadow: 0 0 4px rgba(0, 97, 114, 0.6);  /* glow effect */
  }

  &:active {
    border-color: #003840;        /* even darker on click */
    box-shadow: none;
  }
`;

export const DataSummary = styled.div`
  font-size: 12px;
  color: #4B4B4B;
  font-weight: 400;
  text-align: left;
`;

export const CardBodyStyle = {
  height: '600px',
  padding: 0,
  overflow: 'hidden'
};

export const ExtractedDataBodyStyle = {
  ...CardBodyStyle,
};

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  justify-content: flex-start;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
    
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
  }
`;

export const ExtraActionButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 20px 16px 20px;
  justify-content: flex-start;
`;

export const ExtraActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #495057;
  
  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Action buttons section styles
export const ActionButtonsSection = styled.div`
  margin-top: 16px;
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const PrimaryActionButton = styled(ActionButton)`
  width: 270px;
  height: 35px;
  border: none;
  outline: none;
  box-shadow: none;
    display: flex;
  align-items: left;
  justify-content: left;
  transition: transform 0.1s ease-in-out;
  background-color: #006172;
  color: #FFFFFF;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SecondaryActionButton = styled(ActionButton)`
  width: 157px;
  height: 35px;
  background-color: #F15B5B;
  color: #FFFFFF;
  display: flex;
  align-items: left;
  justify-content: left;
  outline: none;
  box-shadow: none;
  white-space: nowrap;
  transition: transform 0.1s ease-in-out;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// PDF info styles
export const PDFTitleSection = styled.div``;

export const PDFPageInfo = styled.div`
  font-size: 13px;
  color: #4B4B4B;
  margin-top: 2px;
  text-align: left;
  font-weight: normal;
`;

// Success modal styles
export const SuccessModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SuccessIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

export const SuccessTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #006172;
  margin-bottom: 14px;
`;

export const SuccessMessage = styled.div`
  font-size: 14px;
  color: #4A4A4B;
  font-weight: 600;
  margin-bottom: 14px;
  line-height: 100%;
  text-align: center;
`;

export const SuccessButton = styled.button`
  background-color: #006172;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #004d5a;
  }
`;

// ============================================
// REJECT MODAL STYLES (RED THEMED)
// ============================================

export const RejectModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RejectIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

export const RejectTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #d32f2f;
  margin-bottom: 14px;
`;

export const RejectMessage = styled.div`
  font-size: 14px;
  color: #4A4A4B;
  font-weight: 600;
  margin-bottom: 14px;
  line-height: 100%;
  text-align: center;
`;

export const RejectButton = styled.button`
  background-color: #006172;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #004d5a;
  }
`;