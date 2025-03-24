import React from "react";

import "./header.css";
import { Link } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/utils/authContext";


const CommonHeader = (props) => {
  // const { isLoggedIn, currentUser, logout } = {true,true,true}
  const isLoggedIn=false;
  const currentUser=true;
  const logout=false;

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src="data:image/png;base64,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" alt="IntegraMinds Logo" />
          My Manager
        </Link>
        <ul className="nav-links">
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Register</Link>
              </li>
              <li>
                <Link to="/login">Logout</Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/profile">
                  <img
                    src={"/avatar.png"}
                    alt="Profile Avatar"
                    className="avatar"
                  />
                  {/* {currentUser?.fullName} */}
                </Link>
              </li>
              <li>
                <Link to="#">
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default CommonHeader;
