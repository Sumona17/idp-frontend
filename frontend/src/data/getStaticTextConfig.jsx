
const getEndOfLastMonth = () => {
  const today = new Date();
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  return endOfLastMonth.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export const getStaticTextConfig = () => {
  const formattedDate = getEndOfLastMonth();

  return {
    admin: {
      scopes: [],
      dashboard: {
        welcomeMessage: "Welcome back, Admin",
        overviewTitle: `Upload Mock Data as of ${formattedDate}`,
        overviewSubheading:
          "Use this page to upload your excel data file. Please follow required format (.xlsx) to avoid validation error",
      },
      widgets: {
        uploadContainer: {
          title: "Drag and Drop a File or Browse",
        },
        productOfferTable: {
          title: "Product Offers",
        },
        productPlanTable: {
          title: "Proposal",
        },
      },
    },
  };
};
