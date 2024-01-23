import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header({ handleAdmin }) {
  const [password, setPassword] = useState("");

  return (
    <>
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
            <NavLink to="/bracket">Bracket</NavLink>
          </li>
          <li className="admin">
            {/* {isAdmin && (
              <span style={{ color: "red" }}>Logged in as Admin</span>
            )} */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button onClick={() => handleAdmin(password)}>Login</button>
          </li>
        </ul>
      </nav>

      {/* <select name="pets" id="pet-select" disabled={isAdmin ? false : true}>
        <option value="">--Please choose an option--</option>
        <option value="dog">Dog</option>
        <option selected value="cat">
          Cat
        </option>
        <option value="hamster">Hamster</option>
        <option value="parrot">Parrot</option>
        <option value="spider">Spider</option>
        <option value="goldfish">Goldfish</option>
      </select> */}
    </>
  );
}

export default Header;
