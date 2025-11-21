import "./App.css";
import AppRoutes from "./routes/index";
import { BrowserRouter } from "react-router-dom";
//import ScrollToTop from "./ScrollToTop";
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <ScrollToTop /> */}

        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
