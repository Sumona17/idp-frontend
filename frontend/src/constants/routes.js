//import Login from "../pages/Login/index.jsx";
import UploadFileScreen from "./../pages/DocumentIngestExtract/UploadFileScreen";
import Login from "../pages/Login/Login.jsx";

export const LoginRoute = {
  component: Login,
  path: "/",
  restricted: false, // public route
};

export const AdminDashboardRoute = {
  component: UploadFileScreen,
  path: "/upload",
  restricted: false,
};

const routes = [LoginRoute,AdminDashboardRoute];

export default routes;
