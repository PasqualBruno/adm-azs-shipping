import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
