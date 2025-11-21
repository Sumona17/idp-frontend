//import Login from "../pages/Login/index.jsx";
import UploadFileScreen from "./../pages/DocumentIngestExtract/UploadFileScreen";

// export const LoginRoute = {
//   component: Login,
//   path: "/",
//   restricted: false, // public route
// };

export const AdminDashboardRoute = {
  component: UploadFileScreen,
  path: "/",
  restricted: false,
};

const routes = [AdminDashboardRoute];

export default routes;
