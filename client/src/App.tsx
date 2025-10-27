import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Auth from "./pages/Auth/Auth";
import CompaniesList from "./pages/CompaniesList/CompaniesList";
import FieldLIst from "./pages/FieldsList/FieldLIst";
import FretesSystem from "./pages/FretesSystem/FretesSystem";
import ShippingList from "./pages/ShippingList/ShippingList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/sistema"
          element={
            <PrivateRoute>
              <FretesSystem />
            </PrivateRoute>
          }
        >
          <Route path="empresas" element={<CompaniesList />} />
          <Route path="campos" element={<FieldLIst />} />
          <Route path="fretes" element={<ShippingList />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Zoom}
      />
    </BrowserRouter>
  );
}

export default App;
