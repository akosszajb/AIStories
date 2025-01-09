import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    checkLoginStatus();
    const interval = setInterval(() => checkLoginStatus(), 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Navbar">
      <nav>
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <button type="button">
              <img src="images/home.png" />
            </button>
          </Link>
          <Link to="/game" className="nav-item">
            <button type="button">Game</button>
          </Link>
          <Link to="/charactercreator" className="nav-item">
            <button type="button">Character Creator</button>
          </Link>
          {loggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/register" className="nav-item">
                <button type="button">Register</button>
              </Link>
              <Link to="/login" className="nav-item">
                <button type="button">Login</button>
              </Link>
            </>
          )}
          <Link to="/aitools" className="nav-item">
            <button type="button">AI Tools</button>
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
