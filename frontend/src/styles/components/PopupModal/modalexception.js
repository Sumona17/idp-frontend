import styled from "styled-components";

export const StyledModal = styled.div`
 /* custom-select border */
.custom-select .ant-select-selector {
  border-color: #00837A !important;
  border-radius: 6px; /* optional */
}

/* option colors */
.ant-select-item-option {
  color: #4A4A4B; /* default */
}
.ant-select-item-option[aria-selected="true"] {
  background-color: #E6F7F5; /* highlight selected */
  color: #00837A; /* brand color */
}
  

`;