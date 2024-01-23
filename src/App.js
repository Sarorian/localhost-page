import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import axios from "axios";
import common from "./helpers/common";
import Bracket from "./pages/Bracket";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const apiUrl = "https://localhost-api-1c3554ca2868.herokuapp.com/profiles/";

  const handleAdmin = async (password) => {
    try {
      const {
        data: { message },
      } = await axios.get(`${apiUrl}${password}`);
      setIsAdmin(message);
    } catch (error) {
      console.error(error);
      common.displayMessage("error", error.message || "Error");
    }
  };
  return (
    <>
      <Router>
        <Header handleAdmin={handleAdmin} />
        <div className="container">
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/teams" element={<Teams isAdmin={isAdmin} />} />
            <Route path="/bracket" element={<Bracket isAdmin={isAdmin} />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        /* Default */
      />
    </>
  );
}

export default App;
