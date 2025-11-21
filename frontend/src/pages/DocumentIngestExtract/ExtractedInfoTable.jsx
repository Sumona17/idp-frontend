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
  const planNameToEmployerMapping = {
    "Tri-State Manufacturing, Inc. 401(k) Savings Plan": "Tri-State Manufacturing, Inc.",
    "Knight Train 401(k) Plan": "Knight Train Railroad Company",
    "Joe Frazier Retirement Plan": "Joe Frazier Corrugated Box Company Inc."
  };

  const getValueByPath = (path) => {
    try {
      if (!pages || pages.length === 0) return "";

      for (const page of pages) {
        let value = null;

        switch (path) {
          case "employer.name":
            
            value = findInPage(page, ["1. EMPLOYER(1.24)", "Name"]);
            if (!value) {
              const planName = findInPage(page, ["2. PLAN(1.42)", "Name"]) || 
                             findInPage(page, ["401(k) Plan Loan Administration Policy", "Plan Name"]);
              
              if (planName && planNameToEmployerMapping[planName]) {
                value = planNameToEmployerMapping[planName];
              }
            }
            break;
          case "employer.tin":
            value = findInPage(page, ["1. EMPLOYER(1.24)", "Taxpayer Identification Number(TIN)"]) ||
              findInPage(page, ["1. EMPLOYER(1.24)", "Taxpayer Identification Number(TIN)"]) ||
              findInPage(page, ["1. EMPLOYER(1.24)", "Taxpayer Identification Number (TIN)"]);
            break;
          case "plan.name":
            value = findInPage(page, ["2. PLAN(1.42)", "Name"]) || findInPage(page, ["401(k) Plan Loan Administration Policy", "Plan Name"]);
            break;
          case "plan.plan_number":
            const planNumber = findInPage(page, ["2. PLAN(1.42)", "Plan number"]) ||
              findInPage(page, ["plan", "plan_number"]) || findInPage(page, ["401(k) Plan Loan Administration Policy", "Plan Number"]);
            
            if (planNumber) {
              const match = planNumber.match(/^(\d+)/);
              value = match ? match[1] : planNumber;
            }
            break;
          case "plan.trust_ein":
            value = findInPage(page, ["2. PLAN(1.42)", "Trust EIN(optional)"]) ||
              findInPage(page, ["2. PLAN(1.42)", "Trust EIN(optional)"]) ||
              findInPage(page, ["plan", "trust_ein"]);
            break;
          case "plan_year_end":
           
            const planYearData = findInPage(page, ["3. PLAN/LIMITATION YEAR(1.44/1.34)", "Plan Year"]) ||
              findInPage(page, ["plan_year"]);
            if (planYearData) {
             
              if (planYearData["(a) December 31"]?.checked ||
                planYearData["(a) December 31"]?.checked ||
                planYearData["(a) December 31"]?.value) {
                value = "December 31";
              } else if (planYearData["(b) Fiscal Plan Year"]?.checked) {
                value = planYearData["(b) Fiscal Plan Year"]?.value || "Fiscal Year";
              }
            }
            
            if (!value) {
              value = findInPage(page, ["1. EMPLOYER(1.24)", "Employer's Taxable Year(optional)"]) ||
                findInPage(page, ["1. EMPLOYER(1.24)", "Employer's Taxable Year(optional)"]);
            }
            break;
          case "execution_page.prototype_plan_sponsor":
          
            value = findInPage(page, ["6. CONTRIBUTION TYPES(1.12) continued", "(g) SIMPLE 401(k) PAGE "]) ||
              findInPage(page, ["plan_type"]) ||
              "401(k)";
            break;
          case "plan_product":
            value = findInPage(page, ["plan_product"]) ||
              findInPage(page, ["product"]);
            break;
          case "doc_category":
            value = findInPage(page, ["doc_category"]) ||
              findInPage(page, ["Document Category"]);
            break;
          case "doc_title":
            value = findInPage(page, ["doc_title"]) ||
              findInPage(page, ["Document Title"]);
            break;
          case "template_id":
            value = findInPage(page, ["template_id"]);
            break;
          case "template_name":
            value = findInPage(page, ["template_name"]);
            break; 
          case "signature_block.date":
         
            value = findInPage(page, ["Signature Block", "Date"]) ||
              findInPage(page, ["Signature Block", "date"]) ||
              findInPage(page, ["signature", "date"]) ||
              findInPage(page, ["trustees_or_custodians", "date"]) || findInPage(page, ["Section 8.01", "Date"]);
            break;
          case "signature_block.signed":
           value = findInPage(page, ["Signature Block", "Print Name/Title"]) ||
              findInPage(page, ["Acceptance by Signatory Employer and Trustee/Custodian", "Signatory Employer", "Print Name/Title"]) ||
              findInPage(page, ["signature_block", "Print Name/Title"]) ||
              findInPage(page, ["signature", "Print Name/Title"]) ||
              findInPage(page, ["signatory_employer", "name"]) || findInPage(page, ["Section 8.01", "Plan Administrator Signature"]);
            break;
 
          case "effective_dates.initial_effective_date_of_plan":
            const effectiveDate = findInPage(page, ["4. EFFECTIVE DATE(1.20)", "(c) Initial Effective Date of Plan"]) ||
              findInPage(page, ["effective_dates", "initial_effective_date_of_plan"]) ||
              findInPage(page, ["effective_date"]) || findInPage(page, ["Section 8.01", "Date"]);
            if (effectiveDate) {
             
              const dateMatch = effectiveDate.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
              value = dateMatch ? dateMatch[1] : effectiveDate;
            }
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
      "employer.name": "Employer Name",
      "plan.plan_number": "Plan Number",
      "plan.name": "Plan Name",
      "plan_year_end": "Plan Year End",
      "execution_page.prototype_plan_sponsor": "Plan Type",
      plan_product: "Product",
      "employer.tin": "Plan EIN",
      "plan.trust_ein": "Trust EIN",
      doc_category: "Document Category",
      doc_title: "Document Title",
      template_id: "Template ID",
      template_name: "Template Name",
      "signature_block.date": "Signature Date",
      "signature_block.signed": "Signature",
      "effective_dates.initial_effective_date_of_plan":
        "Effective / Service Start Date",
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
        the data to the plan documents inventory.
      </HeaderText>
      <SectionHeader>Employer Plan Identification</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("employer.name")}</FirstCol>
            <SecondColValue>{getValueByPath("employer.name")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("plan.plan_number")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan.plan_number")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("plan.name")}</FirstCol>
            <SecondColValue>{getValueByPath("plan.name")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("plan_year_end")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan_year_end")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>
              {getLabelByKey("execution_page.prototype_plan_sponsor")}
            </FirstCol>
            <SecondColValue>
              {getValueByPath("execution_page.prototype_plan_sponsor")}
            </SecondColValue>
            <RightLabelCol>{getLabelByKey("plan_product")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan_product")}</RightValueCol>
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("employer.tin")}</FirstCol>
            <SecondColValue>{getValueByPath("employer.tin")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("plan.trust_ein")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan.trust_ein")}</RightValueCol>
          </tr>
        </tbody>
      </StyledTable>
      <SectionHeader>Document/Template Identification</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("doc_category")}</FirstCol>
            <SecondColValue>{getValueByPath("doc_category")}</SecondColValue>
            {/* <RightLabelCol>{getLabelByKey("plan.plan_number")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan.plan_number")}</RightValueCol> */}
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("doc_title")}</FirstCol>
            <SecondColValue>{getValueByPath("doc_title")}</SecondColValue>
            {/* <RightLabelCol>{getLabelByKey("plan_year_end")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan_year_end")}</RightValueCol> */}
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("template_id")}</FirstCol>
            <SecondColValue>{getValueByPath("template_id")}</SecondColValue>
            {/* <RightLabelCol>{getLabelByKey("plan_product")}</RightLabelCol>
            <RightValueCol>{getValueByPath("plan_product")}</RightValueCol> */}
          </tr>
          <tr>
            <FirstCol>{getLabelByKey("template_name")}</FirstCol>
            <SecondColValue>{getValueByPath("template_name")}</SecondColValue>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </StyledTable>

      <SectionHeader>Document Key Dates</SectionHeader>
      <StyledTable>
        <tbody>
          <tr>
            <FirstCol>{getLabelByKey("signature_block.date")}</FirstCol>
            <SecondColValue>{getValueByPath("signature_block.date")}</SecondColValue>
            <RightLabelCol>{getLabelByKey("signature_block.signed")}</RightLabelCol>
            <SignatureValueCol>{getValueByPath("signature_block.signed")}</SignatureValueCol>
          </tr>
          <tr>
            <FirstCol>
              {getLabelByKey("effective_dates.initial_effective_date_of_plan")}
            </FirstCol>
            <SecondColValue>
              {getValueByPath("effective_dates.initial_effective_date_of_plan")}
            </SecondColValue>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </StyledTable>
    </ExtractedInfoContainer>
  );
};

export default ExtractedInfoTable;