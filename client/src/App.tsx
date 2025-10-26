import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "./App.css";
import Auth from "./pages/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
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
