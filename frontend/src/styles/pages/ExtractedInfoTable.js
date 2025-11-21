import styled from "styled-components";

export const ExtractedInfoContainer = styled.div`
  font-size: 14px;
  font-weight: 700;
  width: 100%;
`;

export const HeaderText = styled.div`
  color: #006172;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const SectionHeader = styled.div`
  background-color: #f3f5f6;
  color: #006172;
  padding: 6px 10px;
  text-align: left;
  width: 100%;
  height: 40px;
  opacity: 1;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  @media (max-width: 768px) {
    font-size: 14px;
    height: auto;
    padding: 8px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
  table-layout: auto; /* let columns auto-adjust */

  td {
    padding: 8px 10px;
    vertical-align: top;
    text-align: left;
    word-wrap: break-word; /* wrap long words */
    white-space: normal;   /* allow wrapping */
  }

  @media (max-width: 768px) {
    font-size: 12px;
    td {
      padding: 6px;
    }
  }
`;

export const FirstCol = styled.td`
  background-color: #fafafab2;
  color: #212121;
  width: 25%;
`;

export const SecondColValue = styled.td`
  background-color: white;
  font-size: 14px;
  font-weight: 400;
  color: black;
  width: 25%;
`;

export const RightLabelCol = styled.td`
  background-color: #fafafab2;

  color: #212121;
  width: 25%;
`;

export const RightValueCol = styled.td`
  background-color: white;
  font-weight: 400;
  color: #212121;
  width: 25%;
`;

export const SignatureValueCol = styled.td`
  background-color: #ffffff;
  color: #212121;
  font-weight: 400;
  width: 25%;
`;
