import styled from "styled-components";

export const FormDatePickerBox = styled.div`
  label::after {
    visibility: hidden;
  }
  label {
    height: auto !important;
    padding: 0px 6px;
    white-space: normal;
    text-align: left;
  }

  .ant-picker-outlined {
    box-shadow: 0px 1.5px 4px -1px #9c9c9f;
    font-family: "Inter", sans-serif;
    padding: 12px 6px;
    font-size: 14px;
    width: 100%;
    border: none;
    background: #5a5a5a;
    color: #ffffff;
  }
  label {
    height: auto !important;
    font-size: 13px !important;
    font-weight: 500;
    line-height: 19.5px;
    color: #adacb0 !important;
    font-family: "Inter", sans-serif;
  }
`;

export const RadioBtnBox = styled.div`
  label::after {
    visibility: hidden;
  }
  .ant-radio-group {
    label {
      padding: 0px !important;
    }
  }
  .ant-radio-group {
    display: flex;
  }
  label {
    height: auto !important;
    width: 225px;
    padding: 0px 6px;
    display: flex;
    align-items: center;
    white-space: normal;
    text-align: left;
    height: auto !important;
  }
  .ant-form-item-control-input {
    padding: 12px 6px;
  }

  label {
    height: auto !important;
    font-size: 13px !important;
    font-weight: 400;
    line-height: 19.5px;
    color: #adacb0;
    font-family: "Inter", sans-serif;
  }
`;

export const FormInputFeild = styled.div`
  label::after {
    visibility: hidden;
  }
  label {
    height: auto !important;
    white-space: normal;
    text-align: left;
    padding: 0px 6px;
  }

  input {
    box-shadow: 0px 1.5px 4px -1px #9c9c9f;
    font-family: "Inter", sans-serif;
    padding: 12px 6px;
    font-size: 14px;
    border: none;
    //background: #5A5A5A;
    color: #FFFFFF";
  }

  input[data-has-default="true"] {
    background-color: #e2eff8;
  }

  .ant-input-disabled {
    box-shadow: none;
    background: no-repeat;
    color: #000;
  }
  label {
    height: auto !important;
    min-width: 80px;
    font-size: 14px !important;
    font-weight: 500;
    line-height: 19.5px;
    color: #727272 !important;
    font-family: "Inter", sans-serif;
  }
  .suffix {
    margin-left: 10px;
    cursor: pointer;
  }
`;

export const FormSelect = styled.div`
  label::after {
    visibility: hidden;
  }

  .ant-select-selector {
    display: block;
    padding: 12px 4px !important;
    border: none;
    background: #5a5a5a;
    color: #ffffff;
    height: auto;
    box-shadow: 0px 1.5px 4px -1px #9c9c9f;
    transition: background 0.3s ease;
  }

  .ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector {
    border: none;
  }

  .ant-select-selector:after,
  .ant-select-selection-search,
  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: normal !important;
  }

  .ant-form-item-control-input {
    min-height: auto !important;
  }

  .ant-select {
    width: 100% !important;
    display: ruby;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    border-radius: 8px;
    background: #5a5a5a !important;
    color: #ffffff;
  }

  label {
    height: auto !important;
    font-size: 13px !important;
    font-weight: 500;
    line-height: 19px;
    color: #727272 !important;
    font-family: "Inter", sans-serif;
    padding: 0px 6px;
    white-space: normal;
    text-align: left;
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
    font-weight: 500;
  }

  .ant-select:has(.ant-select-selection-item) .ant-select-selector {
    background-color: #e2eff8 !important;
    color: inherit !important;
    width: 100%;
  }
  .ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector {
    width: 100%;
  }
  .ant-select-selection-placeholder {
    color: #9c9c9c;
  }
`;

export const FormphonenumberFeild = styled.div`
  label::after {
    visibility: hidden;
  }
  label {
    height: auto !important;
    white-space: normal;
    text-align: left;
    padding: 0px 6px;
  }

  input {
    box-shadow: 0px 1.5px 4px -1px #9c9c9f;
    font-family: "Inter", sans-serif;
    padding: 12px 6px;
    font-size: 14px;
    border: none;
    background: #5a5a5a;
    color: #ffffff;
  }
  .ant-input-disabled {
    box-shadow: none;
    background: no-repeat;
    color: #000;
  }
  label {
    height: auto !important;
    min-width: 80px;
    font-size: 13px !important;
    font-weight: 500;
    line-height: 19.5px;
    color: #adacb0 !important;
    font-family: "Inter", sans-serif;
  }
`;
export const FormCheckBoxStyled = styled.div`
  width: 100%;
  .ant-form-item {
    width: 100%;
  }
  .ant-checkbox-group {
    width: 100%;
    label {
      width: 40%;
    }
  }
  .ant-checkbox-disabled .ant-checkbox-inner:after {
    border-color: white;
  }
  .ant-checkbox-checked.ant-checkbox-disabled > .ant-checkbox-inner {
    background: #1677ff;
    border-color: #1677ff;
  }
`;

export const BlueCheckboxStyled = styled.div`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1890ff;
    border-color: #1890ff;
  }

  .ant-checkbox-inner {
    width: 16px;
    height: 16px;
    border-radius: 2px;
  }
`;
export const loginFormStyled = styled.div`
 .login-container {
  max-width: 360px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}
`;
