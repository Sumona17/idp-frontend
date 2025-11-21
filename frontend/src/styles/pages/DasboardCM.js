import { Card } from "antd";
import styled from "styled-components";

// export const BannerImage = styled.div`
//   height:170px;
//   width: 100vw;
//   background: #006172;
//   border-radius:6px;
//   .title{
//  color: #FFFFFF;
// font-size: 18px;
// font-weight: 600;
// line-height: normal;
// text-align:left;
// margin-left:20px;
//  }
// .sub-title{
// color: #FFFFFF;
// font-size: 14px;
// text-align:left;
// display:block;
// margin-left:20px;
// font-weight: 600;
// `;
export const DashboradStyled = styled.div`
  .sticky-product-header {
    position: sticky;
    top: 64px;
    z-index: 20;
    background: white;
  }

  .product-title {
    display: block;
    width: 100%;
    color: white;
    font-size: 16px;
    font-weight: 600;
    background: #3ba7a3;
    padding: 12px 16px;
    text-align: left;
  }

  .main-card {
    margin-top: 40px;
    //background: linear-gradient(99.17deg, #e8ffff 2.59%);
    box-shadow: 0 4px 12px rgba(7, 128, 119, 0.12);
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
    color: rgba(0, 97, 114, 1);
    text-align: left;
  }
  .sub-title {
    color: rgba(0, 97, 114, 1);
    font-size: 14px;
    text-align: left;
    display: block;
    font-weight: 600;
  }
  .mt-negative {
    margin-top: -80px;
  }
  .metrics-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }
  .card-subtitle {
    background: linear-gradient(90.4deg, #00837a 0.09%, #1b418b 98.92%);
    border: 1px solid rgba(0, 97, 114, 0.5);
  }

  .card-container {
    flex: 1;
    padding: 0 6px;
    display: flex;
    flex-direction: column;
    justify-content: left;
    border-right: 1px solid rgba(171, 230, 226, 0.9);
    gap: 15px;
  }
  .metrics-col {
    display: flex;
    align-items: stretch;
    padding: 0;
  }
  @media (max-width: 576px) {
    .card-container {
      border-right: none;
    }
  }
  .metrics-col:last-child .card-container {
    border-right: none;
  }

  .metrics-header {
    width: 100%;
    text-align: right;
  }

  .metrics-header-text {
    color: rgba(255, 255, 255, 1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: left;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: left;
  }

  /* Header */
  .card-label {
    color: rgba(255, 255, 255, 1);
    font-size: 15px;
    font-style: SemiBold;
    font-weight: 600;
  }

  .card-value {
    color: #006172;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
  }

  .card-desc {
    margin: 0;
    color: rgba(255, 255, 255, 1);
    font-size: 26px;
    font-weight: 400;
    flex: 1;
    text-align: left;
    //white-space: nowrap;
  }

  .card-chip {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    height: 26px;
    width: 80px;
    border: 1px solid rgba(147, 215, 210, 1);
    border-radius: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    white-space: nowrap;
    justify-content: center;
    text-align: center;
  }
  .card-chip-new {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    height: 26px;
    width: 80px;
    border: 1px solid rgba(147, 215, 210, 1);
    border-radius: 16px;
    font-weight: 600;
    color: rgba(255, 175, 4, 1);
    font-size: 14px;
    white-space: nowrap;
    justify-content: center;
    text-align: center;
  }

  .chip-icon {
    font-size: 12px;
    color: rgba(197, 230, 68, 1);
    font-weight: 600;
  }
  .chip-icon-down {
    font-size: 12px;
    color: rgba(255, 175, 4, 1);
    font-weight: 600;
  }
  .custom-tabs-row {
    border-bottom: 2px solid rgba(49, 135, 150, 0.6);
    margin-top: 10px;
    padding-bottom: 10px;
  }

  .custom-tab {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: rgba(0, 97, 114, 1);
    padding-bottom: 6px;
    display: inline-block;
    transition: color 0.3s ease;
    gap: 30px;
  }

  .custom-tab:hover {
    color: #004d4d;
  }

  .custom-tab.active {
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
    border-bottom: 4px solid rgba(0, 97, 114, 1);
  }

  .dashboard-row {
    margin-top: 24px;
    width: 600px;
  }
  .dashboard-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(7, 128, 119, 0.12);
  }
  .dashboard-card .ant-table-thead > tr > th {
    background-color: #f3f5f6;
    font-weight: 600;
    height: 26px;
    color: #212121;
  }
  .dashboard-card .ant-table-tbody > tr > td,
  .ant-table-thead > tr > th {
    padding: 7.7px 12px !important;
  }
  .dashboard-card .ant-table-tbody > tr > td {
    font-size: 13px;
    color: #212121;
    font-weight: 400;
  }

  .risk-tag-high {
    background-color: #f15b5b;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    width: 70px;
    height: 24px;
    display: inline-block;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
  }

  .risk-tag-medium {
    background-color: #db8710;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
    width: 70px;
    height: 24px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
  }

  .risk-tag-low {
    background-color: #848484;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    display: inline-block;
    width: 70px;
    height: 24px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
  }

  .action-items-footer {
    margin-top: 12px;
    text-align: left;
  }

  .action-items-text {
    font-size: 13px;
    font-weight: 400;
    color: #4a4a4b;
    display: block;
    margin-bottom: 8px;
  }

  .action-items-button {
    background-color: #005f68;
    color: #fff;
    border: none;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    cursor: pointer;
  }
`;
export const ActionItemButton = styled.button`
  background-color: #005f68;
  color: #fff;
  border: none;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
`;
export const AlertBanner = styled.div`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
    margin-left: -8px;
    margin-right: -8px;
  }

  .ant-alert {
    border-radius: 8px;
    background-color: #fff5f4;
    border: 1px solid #d97f00;
    padding: 12px 20px;

    @media (max-width: 768px) {
      padding: 10px 16px;
    }

    @media (max-width: 480px) {
      border-radius: 4px;
      padding: 8px 12px;
    }

    .ant-alert-message {
      font-size: 14px;
      color: #d97f00;
      text-align: left;
      font-weight: 600;
      margin: 0;

      @media (max-width: 480px) {
        font-size: 13px;
      }
    }

    .ant-alert-action {
      margin-left: auto;

      @media (max-width: 480px) {
        margin-left: 8px;
      }
    }
  }
`;
export const TableheroSection = styled.div`
  .ant-table-wrapper .ant-table {
    background: none;
  }

  .ant-table-content table .ant-table-thead > tr > th {
    background: transparent;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: inherit !important;
  }
  .ant-table-content table .ant-table-thead > tr > th {
    color: #00837a;
    font-size: 13px;
    font-weight: 600;
    style: SemiBold;
    border-bottom: 1px solid #aaad9b2e;
  }
  .ant-table-tbody > tr > td {
    font-weight: 400;
    font-size: 14px;
    color: #212121;
    border-bottom: 1px solid #aaad9b2e;
  }
`;
export const VerticalScrollContainer = styled.div`
  .force-scrollbar {
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: auto;
    scrollbar-color: #c1c2c2;
    border-radius: 4px;
  }

  .force-scrollbar::-webkit-scrollbar {
    display: block !important;
    width: 8px;
    height: 76px;
  }

  .force-scrollbar::-webkit-scrollbar-track {
    background: #c1c2c2;
    border-radius: 10px;
  }

  .force-scrollbar::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
    cursor: pointer;
  }

  .force-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
    cursor: pointer;
  }

  .force-scrollbar.transparent-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .force-scrollbar.transparent-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

export const RechartStyled = styled.div`
  .recharts-surface:focus,
  .recharts-surface:active {
    outline: none !important;
    stroke: none !important;
  }
`;
export const TealHeaderCard = styled(Card)`
  .ant-card-head {
    // background: #3ba7a3;
    padding: 12px 16px;

    position: sticky;
    top: 0;
    z-index: 10;
  }

  .ant-card-head-title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    justify-content: flex-start;
    display: flex;
  }
`;
export const AllProductsSelector = styled.div`
  .ant-select {
    min-width: 200px;
    border: 2px solid #006172 !important;
    border-radius: 50px !important;
    background: #fff !important;
    font-size: 13px;
    font-weight: 600;
  }

  .ant-select-selector {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 12px !important;
    height: 27px !important;
    display: flex;
    align-items: center;
    padding-top: -10px !important;
    line-height: 0 !important;
  }

  .ant-select-arrow {
    color: #006172 !important;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    color: #006172 !important;
    font-weight: 700 !important;
    padding-top: -10px;
  }

  /* Selector (the box) */
  .kpi-select .ant-select-selector {
    border: 1px solid #006172 !important;
    border-radius: 6px !important;
    background: #006172 !important;
    color: #fff !important;
    font-weight: 700;
    font-size: 15px;
    display: flex;
    align-items: center;
    height: 45px;
    padding: 6px 10px;
  }

  .kpi-select .ant-select-arrow {
    color: #fff !important;
  }

  .kpi-select .ant-select-selection-item {
    color: #fff !important;
    font-size: 15px;
  }

  /* Dropdown */
  .kpi-select-dropdown {
    border-radius: 6px;
    overflow: hidden;
    padding: 10px 20px;
  }

  /* Dropdown items */
  .kpi-select-dropdown .ant-select-item-option {
    color: #00837a !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    padding: 6px 12px;
  }

  /* Hover */
  .kpi-select-dropdown .ant-select-item-option-active {
    background: #e6f4f1 !important;
  }

  /* Selected */
  .kpi-select-dropdown .ant-select-item-option-selected {
    background: #e6f4f1 !important;
    color: #00837a !important;
    font-weight: 600 !important;
  }
`;
