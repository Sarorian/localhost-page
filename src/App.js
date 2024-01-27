import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Change to HashRouter
import React, { useState } from "react";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import axios from "axios";
import common from "./helpers/common";
import SwissBracket from "./pages/SwissBracket";
import PlayoffBracket from "./pages/PlayoffBracket";
import ConsolationBracket from "./pages/ConsolationBracket";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const apiUrl = "https://localhost-api-1c3554ca2868.herokuapp.com/profiles/";

  const handleAdmin = async (password, logout) => {
    try {
      if (logout) {
        setIsAdmin(false);
        return;
      }
      const {
        data: { message },
      } = await axios.get(`${apiUrl}${password}`);
      setIsAdmin(message);
    } catch (error) {
      console.error(error);
      common.displayMessage("error", error.message || "Error");
    }
  };

  const highlight = (e, color) => {
    [...document.getElementsByClassName("teamName")]
      .filter(
        (a) => a.innerHTML !== "TBD" && a.innerHTML === e.target.innerHTML
      )
      .forEach((a) => {
        a.style.backgroundColor = color;
        a.style.cursor = "pointer";
      });
  };

  return (
    <>
      <Router>
        <Header handleAdmin={handleAdmin} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/teams" element={<Teams isAdmin={isAdmin} />} />
            <Route
              path="/swissBracket"
              element={<SwissBracket isAdmin={isAdmin} highlight={highlight} />}
            />
            <Route
              path="/playoffBracket"
              element={
                <PlayoffBracket isAdmin={isAdmin} highlight={highlight} />
              }
            />
            <Route
              path="/consolationBracket"
              element={
                <ConsolationBracket isAdmin={isAdmin} highlight={highlight} />
              }
            />
            <Route
              path="/localhost-page"
              element={<Home isAdmin={isAdmin} />}
            />
            <Route path="*" element={<NotFound />} />
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
      />
    </>
  );
}

export default App;
