import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newDocuments: [],
};

const documentInventorySlice = createSlice({
  name: "documentInventory",
  initialState,
  reducers: {
    addNewDocument: (state, action) => {
      const submissionId =
        action.payload.submission_id || action.payload.submissionId;

      if (!submissionId) {
        console.error("No submission ID provided for new document");
        return;
      }

      const numericalDigits = submissionId.replace(/[^0-9]/g, "");
      const first6Numbers = numericalDigits.padStart(6, "0").slice(0, 6);
      const existingIndex = state.newDocuments.findIndex(
        (doc) => doc.submissionId === submissionId
      );

      if (existingIndex !== -1) {
        state.newDocuments[existingIndex] = {
          ...state.newDocuments[existingIndex],
          ...action.payload,
          "Last Modified": new Date().toISOString().split("T")[0],
        };
        return;
      }

      const uniqueDocId = `doc_${submissionId}_${Date.now()}`;
      const newDocument = {
        "Document ID": `${first6Numbers}`,
        "Document Short Name": action.payload.documentName,
        Template: "5-3245778",
        Class: "Required",
        Status: "Active",
        "Client Signed": "01/01/2022",
        Type: "Adoption Agreement",
        "Effective Date": "01/01/2023",
        Category: action.payload.category || "Extracted",
        "Upload Date": new Date().toISOString().split("T")[0],
        "Last Modified": new Date().toISOString().split("T")[0],
        "File Size": action.payload.fileSize || "N/A",
        Version: "1.0",
        "Compliance Status": "Pending Review",
        Tags: action.payload.tags || ["Extracted", "New"],
        Description:
          action.payload.description ||
          "Document extracted from data extraction process",
        id: uniqueDocId,
        submissionId: submissionId,
        createdAt: new Date().toISOString(),
        extractedData: action.payload.extractedData || null,
      };

      state.newDocuments.unshift(newDocument);
    },

    setNewDocuments: (state, action) => {
      state.newDocuments = action.payload || [];
    },

    clearNewDocuments: (state) => {
      state.newDocuments = [];
    },

    removeNewDocument: (state, action) => {
      state.newDocuments = state.newDocuments.filter(
        (doc) => doc.id !== action.payload.id
      );
    },

    updateNewDocument: (state, action) => {
      const index = state.newDocuments.findIndex(
        (doc) => doc.id === action.payload.id
      );
      if (index !== -1) {
        state.newDocuments[index] = {
          ...state.newDocuments[index],
          ...action.payload.updates,
          "Last Modified": new Date().toISOString().split("T")[0],
        };
      }
    },
  },
});

export const {
  addNewDocument,
  setNewDocuments,
  clearNewDocuments,
  removeNewDocument,
  updateNewDocument,
} = documentInventorySlice.actions;

export default documentInventorySlice.reducer;
