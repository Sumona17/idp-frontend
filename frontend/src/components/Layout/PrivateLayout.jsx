import React from "react";
//import { Navigate } from "react-router-dom";
import PublicHeader from "../Header/PublicHeader";
import PublicFooter from "../Footer/PublicFooter";

const PrivateLayout = ({ children }) => {
 
  return (
    <div className="private-layout">
      {/* Example: your navbar/sidebar */}
      <PublicHeader/>
      {children}
      {/* <PublicFooter /> */}
    </div>
  );
};

export default PrivateLayout;
