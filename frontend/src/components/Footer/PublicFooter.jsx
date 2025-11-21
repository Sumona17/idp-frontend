import React from "react";
import { PublicFooterStyled } from "../../styles/components/Header";
//import strfooterlogo from "../../assets/svg/strfooterlogo.svg";
//import feedbackicon from "../../assets/images/feedbackicon.png"
const PublicFooter = () => {
  return (
    <PublicFooterStyled>
      <div className="footersection">
        <div className="left-section">
          {/* <img src={strfooterlogo} alt="STR Logo" className="public-logo" /> */}
          {/* <p className="footer-text">
            © 2025 My Corporate Ally, LLC &nbsp;
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>
              *STRSolutions* &nbsp;
            </span>
            All Rights Reserved
          </p> */}
        </div>
        <div className="right-section">
          {/* <a className="footer-link"> <img
            src={feedbackicon}
            alt="Feedback"
            style={{
              width: 16,
              height: 16,
              marginRight: 6,
              verticalAlign: "middle",
              filter: "brightness(0) invert(1)",
            }}
          /> Share Feedback</a> */}
          <a href="/" className="footer-link">
            Terms & Conditions
          </a>
          <span className="separator">|</span>
          <a href="/" className="footer-link">
            Privacy Policy
          </a>
        </div>
      </div>
    </PublicFooterStyled>
  );
};

export default PublicFooter;
