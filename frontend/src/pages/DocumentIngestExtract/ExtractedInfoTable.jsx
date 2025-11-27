import React from "react";
import {
  ExtractedInfoContainer,
  HeaderText,
  SectionHeader,
  StyledTable,
  FirstCol,
  SecondColValue,
  RightLabelCol,
  RightValueCol,
  SignatureValueCol
} from "../../styles/pages/ExtractedInfoTable";

const normalizeExtractedData = (data) => {
  if (!data) return [];

  try {
    if (Array.isArray(data)) return data;

    if (typeof data === "object" && data.results) {
      let parsed = data.results;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed); 
      }

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (err) {
    console.error("normalizeExtractedData parse error:", err);
    return [];
  }

  return [data];
};

const ExtractedInfoTable = ({ extractedData }) => {
  const pages = normalizeExtractedData(extractedData);

  const getValueByPath = (path) => {
    try {
      if (!pages || pages.length === 0) return "";

      for (const page of pages) {
        let value = null;

        switch (path) {
          case "producer.name":
            // Map from producer_information.producer_name or company_name
            value = findInPage(page, ["producer_information", "producer_name"]) ||
                    findInPage(page, ["producer_information", "company_name"]);
            break;
          
          case "agency_customer_id":
            // Map from producer_information.producer_code or agency_customer_id
            value = 
                    findInPage(page, ["producer_information", "agency_customer_id"]);
            break;
          
          case "contact.name":
            // Map from producer_information.policy_or_program_name
            value = findInPage(page, ["producer_information", "producer_contact_name"]);
            break;
          
          case "carrier.name":
            // Map from producer_information.policy_number
            value = findInPage(page, ["producer_information", "carrier_name"]) ||
                    findInPage(page, ["producer_information", "carrier_name"]);
            break;
          
          case "underwriter.name":
           
            value = findInPage(page, ["producer_information", "underwriter_name"]);
            break;
          
          case "naic.code":
            // Map from header.date_mm_dd_yyyy
            value = findInPage(page, ["producer_information", "naic_code"]);
            break;
          
          case "producer.code":
            // Map from header.form_title or form_identifier
            value = findInPage(page, ["producer_information", "producer_code"]);
            break;
          
          case "plan_product":
            // Map from producer_information.policy_or_program_name
            value = findInPage(page, ["producer_information", "policy_or_program_name"]) ||
                    "Insurance Policy";
            break;
          
          case "doc_category":
            // Map from header.form_identifier
            value = findInPage(page, ["header", "form_identifier"]) ;
            break;
          
          case "doc_title":
            // Map from header.form_title
            value = findInPage(page, ["header", "form_title"]) ;
            break;
             case "date": // Map from header.form_title
            value = findInPage(page, ["header", "date_mm_dd_yyyy"]) ;
            break;
          
          // case "template_id":
           
          //   value = findInPage(page, ["producer_information", "program_code"]) ||
          //           findInPage(page, ["producer_information", "producer_code"]);
          //   break;
          
          // case "template_name": // Map from header.form_title
          //   value = findInPage(page, ["header", "form_title"]) ||
          //           findInPage(page, ["header", "applicant_information_section_label"]);
          //   break;
          
          case "proposed_effective_date":
            // Map from header.date_mm_dd_yyyy
            value = findInPage(page, ["policy_information", "proposed_effective_date"]);
            break;
          
          case "billing_plan":
            // Map from producer_information.producer_contact_name or underwriter_name
            value = findInPage(page, ["policy_information", "billing_plan"]);
            break;
             case "policy_premium":
           
            value = findInPage(page, ["policy_information", "policy_premium"]);
            break;
          
          case "proposed_expiration_date":
     
            value = findInPage(page, ["policy_information", "proposed_expiration_date"]);
            break;
          
          default:
            const pathArray = path.split(".");
            value = findInPage(page, pathArray);
        }

        if (value && value !== "") {
          return value;
        }
      }
      return "";
    } catch (err) {
      console.error("getValueByPath error:", err);
      return "";
    }
  };

  const findInPage = (pageData, pathArray) => {
    try {
      let current = pageData;

      for (const key of pathArray) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          return null;
        }
      }

      if (current) {
        // Handle nested value objects
        if (typeof current === "object") {
          if ("value" in current) return current.value || null;
          if ("checked" in current) return current.checked ? "Yes" : "No";
          if ("line" in current) return current.line;
          return null;
        }

        return typeof current === "string" || typeof current === "number" ? current : null;
      }

      return null;
    } catch {
      return null;
    }
  };

  const getLabelByKey = (key) => {
    const labelMapping = {
      "producer.name": "Producer",
      "carrier.name": "Carrier",
      "contact.name": "Contact Name",
      "naic.code": "NAIC Code",
      "producer.code": "Producer Code",
      plan_product: "Company Policy or Program Name",
      "agency_customer_id": "Agency Customer ID",
      "underwriter.name": "Underwriter",
      doc_category: "Document Category",
      doc_title: "Document Title",
      template_id: "Template ID",
      template_name: "Template Name",
      "date": "Document Date",
      "proposed_effective_date": "Proposed Effective Date",
      "billing_plan": "Billing Plan",
      "proposed_expiration_date": "Proposed Expiration Date",
      "policy_premium": "Policy Premium",
    };

    return (
      labelMapping[key] ||
      key.replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <ExtractedInfoContainer>
      <HeaderText>
        Please review the key information from the document before committing
        the data to the IDP feedback system.
      </HeaderText>
      <SectionHeader>Applicant Information Section</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("producer.name")}</FirstCol>
            <SecondColValue>{getValueByPath("producer.name")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("carrier.name")}</RightLabelCol>
            <RightValueCol>{getValueByPath("carrier.name")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("contact.name")}</FirstCol>
            <SecondColValue>{getValueByPath("contact.name")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("naic.code")}</RightLabelCol>
            <RightValueCol>{getValueByPath("naic.code")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>
              {getLabelByKey("producer.code")}
            </FirstCol>
            <SecondColValue>
              {getValueByPath("producer.code")}
            </SecondColValue>
            <RightLabelCol>{getLabelByKey("plan_product")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan_product")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("agency_customer_id")}</FirstCol>
            <SecondColValue>{getValueByPath("agency_customer_id")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("underwriter.name")}</RightLabelCol>
            <RightValueCol>{getValueByPath("underwriter.name")}</RightValueCol>
          </tr>
        </tbody>
      </StyledTable>
      <SectionHeader>Document Identification</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("doc_category")}</FirstCol>
            <SecondColValue>{getValueByPath("doc_category")}</SecondColValue>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("doc_title")}</FirstCol>
            <SecondColValue>{getValueByPath("doc_title")}</SecondColValue>
            <td></td>
            <td></td>
          </tr>
          {/* <tr>
            <FirstCol>{getLabelByKey("template_id")}</FirstCol>
            <SecondColValue>{getValueByPath("template_id")}</SecondColValue>
            <td></td>
            <td></td>
          </tr> */}
          {/* <tr>
            <FirstCol>{getLabelByKey("template_name")}</FirstCol>
            <SecondColValue>{getValueByPath("template_name")}</SecondColValue>
            <td></td>
            <td></td>
          </tr> */}
           <tr>
            <FirstCol>{getLabelByKey("date")}</FirstCol>
            <SecondColValue>{getValueByPath("date")}</SecondColValue>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </StyledTable>

      <SectionHeader>Policy Information</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("proposed_effective_date")}</FirstCol>
            <SecondColValue>{getValueByPath("proposed_effective_date")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("billing_plan")}</RightLabelCol>
            <SignatureValueCol>{getValueByPath("billing_plan")}</SignatureValueCol>
          </tr>
          <tr>
            <FirstCol>
              {getLabelByKey("proposed_expiration_date")}
            </FirstCol>
            <SecondColValue>
              {getValueByPath("proposed_expiration_date")}
            </SecondColValue>
             <RightLabelCol>{getLabelByKey("policy_premium")}</RightLabelCol>
            <SignatureValueCol>{getValueByPath("policy_premium")}</SignatureValueCol>
          </tr>
        </tbody>
      </StyledTable>
    </ExtractedInfoContainer>
  );
};

export default ExtractedInfoTable;