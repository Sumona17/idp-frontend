import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: "#373636";
    color: #ffffff;
    .ant-modal-close-x {
      color: #ffffff;
    }
  }
`;

export const ModalCard = styled.div`
  box-sizing: border-box;

  position: relative;
  max-width: 1220px;
  //height: 450px;
  background: #373636;
  padding: 0px 20px;
  margin: 0 auto;
  border: 1px solid #373636;
  box-shadow: 0px 0px 10px 0.5px rgba(24, 24, 28, 0.02),
    0px 6px 18px -2px rgba(24, 24, 28, 0.1);
  border-radius: 10px;

  .card-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    margin: 0px;
    padding-top: 15px;
    padding-bottom: 20px;
    letter-spacing: -0.03em;
    color: #ffffff;
  }
  .fieldheaders {
    color: #adacb0;
  }
  .grid3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    margin-top: 30px;
  }
  .grid2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }

  .radio {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 2px;
    margin-left: 20px;
    font-weight: 500 !important;
    color: black !important;
  }
`;
export const Container = styled.div`
.stepperbutton {
    width: 140px;
    height: 41px;
    // background-color: #E4F0FF;
    background: #36AFFA;

    border-radius: 10px;
    color: white;
    font-weight: bold;
    border-top: 1px solid #1169A0
    margin:500px;
}
`;

export const CustomModalContent = styled.div`
  text-align: center;
  .sigin-title {
    font-size: 20px;
    font-weight: 600;
    margin: 50px;
  }
  .sigintext {
    margin: 0px;
    font-size: 16px;
  }
  .logo-button {
    border: 0px;
    background: none;
    margin-bottom: 5px;
  }
  .modal-heading {
    margin: 10px;
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: 600;
  }

  .printButton {
    width: 90px;
    height: 41px;
    background: #36affa;
    border-radius: 10px;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }
`;

export const CustomDrawerContent = styled.div`
  text-align: left;
  // border-radius: 16px;
  // background: #fafafa;
  // padding: 16px;
  // box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);

  .sigin-title {
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0;
    color: #003c4d;
  }

  .sigintext {
    margin: 0;
    font-size: 15px;
    color: #333;
  }

  .logo-button {
    border: none;
    background: none;
    margin-bottom: 5px;
  }

  .modal-heading {
    margin: 10px 0 20px;
    font-size: 18px;
    font-weight: 600;
    color: #005f6b;
  }

  .printButton {
    width: 90px;
    height: 38px;
    background: #36affa;
    border-radius: 12px;
    color: white;
    font-weight: 700;
    font-size: 14px;
    border: none;
    transition: all 0.3s ease;

    &:hover {
      background: #1e97df;
    }
  }
`;

