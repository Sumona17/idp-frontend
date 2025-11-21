import styled from "styled-components";

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-size: 100%;
  background-repeat: no-repeat;

  .page-content {
    flex: 1;
    // padding-top: 60px;
    // margin-bottom: 2%;
  }

  .ant-layout {
    background: transparent;
  }
`;

export const PublicHeaderstyled = styled.header`
  width: 100%;
  background-color: #31aab7;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .public-header {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 70px;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .public-logo {
    width: 120px;
    object-fit: contain;
  }
`;

export const PrivateHeaderstyled = styled.header`
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .public-header {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 30px;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    justify-content: space-between;
  }

  .public-logo {
    object-fit: contain;
    margin-top: 10px;
  }

  .search-section {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 40px;

    .search-input {
      max-width: 340px;
      width: 100%;
      background: #f6f9fcff;
      border-radius: 12px;
      border: none;
    }
  }

  .profile-section {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;

    .notification-icon {
      font-size: 20px;
      color: #ffa412;
    }

    .bell-wrapper {
      position: relative;
      display: inline-block;
    }

    .notification-dot {
      position: absolute;
      top: 15px;
      right: -2px;
      width: 8px;
      height: 8px;
      background-color: red;
      border-radius: 50%;
      border: 2px solid white;
    }

    .avatar {
      border-radius: 12px;
      width: 45px;
      height: 45px;
      object-fit: cover;
    }

    .custom-dropdown {
      position: absolute;
      top: 60px;
      right: 10px;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 300px;
      height: 170px;
      padding: 20px 16px;
      text-align: center;
      line-height: 2.2;
      z-index: 1000;
    }

    .dropdown-header {
      height: 40px;
      background-color: #3BABAB;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      margin: -20px -16px 4px -16px;
    }

    .dropdown-avatar {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      margin-top: -30px;
      object-fit: cover;
    }

    .dropdown-role {
      font-weight: 600;
      color: #002b5b;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .signout-btn {
      background-color: #31aab7;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
    }

    .signout-btn:hover {
      background-color: #31aab7;
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .text-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.6;
        text-align: left;
        margin-top: 4px;
      }

      .name {
        font-weight: 600;
        font-size: 14px;
        color: #4a4a4b;
      }

      .role {
        font-size: 12px;
        color: #4a4a4b;
        font-weight: 400;
        margin-top: 1px;
      }

      .down-icon {
        font-size: 10px;
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
`;

export const Container = styled.div`
  //  max-width: 1220px;
  // padding: 18px 20px;
  margin: 0 auto;
`;

export const PublicFooterStyled = styled.div`
  width: 100vh;
  background-color: #2ca8b0;
  height: 40px;
  display: flex;
  align-items: center;

  .footersection {
   //display: flex;
 // justify-content: space-between; /* left stays left, right stays right */
  a//lign-items: center;
  width: 100%;
  //padding: 0 16px; /* optional padding */
  //box-sizing: border-box;
  }

  .left-section {
  margin-left:50px;
      display: flex;
  align-items: center;
  gap: 10px;

    .public-logo {
      height: auto;
      align-items: center;
      object-fit: contain;
    }

    .footer-text {
      color: #ffffff;
      font-size: 12px;
      margin: 0;
      font-weight: 400;
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .footer-link {
      color: #ffffff;
      font-size: 12px;
      text-decoration: none;
      font-weight: 400;

      &:hover {
        text-decoration: underline;
      }
    }

    .separator {
      color: #ffffff80;
      font-size: 14px;
    }
  }
`;
export const PrivateFooterStyled = styled.div`
  width: 100%;
  background-color: #FFFFFF;
   box-shadow: 0 4px 12px rgba(7, 128, 119, 0.12);
  height: 40px;
  display: flex;
  align-items: center;

  .footersection {
   display: flex;
  justify-content: space-between; /* left stays left, right stays right */
  align-items: center;
  width: 100%;
  padding: 0 16px; /* optional padding */
  box-sizing: border-box;
  }

  .left-section {
  margin-left:10px;
      display: flex;
  align-items: center;
  gap: 10px;

    .public-logo {
      height: auto;
      align-items: center;
      object-fit: contain;
    }

    .footer-text {
      color: #4A4A4B;
      font-size: 12px;
      margin: 0;
      font-weight: 400;
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .footer-link {
      color: #006172;
      font-size: 12px;
      text-decoration: none;
      font-weight: 400;

      &:hover {
        text-decoration: underline;
      }
    }

    .separator {
      color: #ffffff80;
      font-size: 14px;
    }
  }
`;
