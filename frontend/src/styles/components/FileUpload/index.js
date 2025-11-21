import styled from "styled-components";

export const IngestDocumentsDiv = styled.div`
  background-color: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 16px auto; /* Center horizontally */

  height: 350px;
  width: 100%;
  //max-width: 850px;

  padding: 24px;

  .dragActive {
    background-color: #f0f8ff;
  }

  /* Tablet screens */
  @media (max-width: 1024px) {
    height: auto;
    padding: 20px;
  }

  /* Mobile screens */
  @media (max-width: 768px) {
    height: auto;
    padding: 16px;
    border-radius: 12px;
  }

  /* Small mobile screens */
  @media (max-width: 480px) {
    height: auto;
    padding: 12px;
    border-radius: 10px;
  }
`;

export const Label1 = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  max-width: 100%;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const Label2 = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #666;
  word-wrap: break-word;
  white-space: normal;
  text-align: center;
  max-width: 100%;
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;