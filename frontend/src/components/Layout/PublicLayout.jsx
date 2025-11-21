import React from "react";
import PublicHeader from "../Header/PublicHeader";
import PublicFooter from "../Footer/PublicFooter";
import { MainSection } from "../../styles/components/Header";

const PublicLayout = ({ children }) => {
  return (
    <MainSection className="page-wrapper">
      <PublicHeader />
      <main className="page-content">{children}</main>
      {/* <PublicFooter /> */}
    </MainSection>
  );
};

export default PublicLayout;
