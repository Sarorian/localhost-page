import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import common from "../helpers/common";
import axios from "axios";
import logo from "../logo512.png";

function Header({ handleAdmin }) {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const {
        data: { message },
      } = await axios.get(
        `https://localhost-api-1c3554ca2868.herokuapp.com/profiles/${password}`
      );

      // Check if the user is an admin before setting isLoggedIn to true
      if (message) {
        setIsLoggedIn(true);
        setPassword(""); // Clear the password input box on successful login
      } else {
        common.displayMessage("error", "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      common.displayMessage("error", error.message || "Error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword(""); // Clear the password input box on logout
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          width: "100%",
          backgroundColor: "lightgray",
          zIndex: 1000,
          top: 0,
        }}
      >
        <img
          style={{
            position: "absolute",
            width: "32px",
            right: "21px",
            top: "35px",
          }}
          src={logo}
          alt="Localhost Logo"
        />
        <h1 className="title">Localhost March 30th</h1>
        <nav>
          <ul>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "inactive")}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/teams">Teams</NavLink>
            </li>
            <li>
              <NavLink to="/swissBracket">Swiss Stage</NavLink>
            </li>
            <li>
              <NavLink to="/playoffBracket">Playoffs</NavLink>
            </li>
            <li>
              <NavLink to="/consolationBracket">Consolation</NavLink>
            </li>
            <li className="admin">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    handleAdmin(password, true);
                  }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    handleAdmin(password);
                  }}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
