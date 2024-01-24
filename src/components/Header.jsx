import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ handleAdmin }) {
  const [password, setPassword] = useState("");

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
        <h1>Localhost January 27th</h1>
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
              <button onClick={() => handleAdmin(password)}>Login</button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
