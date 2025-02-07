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
      <header className="navbar-header">
        <h1 className="navbar-title">AI Stories</h1>
      </header>
      <nav>
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <img
              src="/assets/images/home.png"
              alt="Home"
              className="home-icon"
            />
          </Link>

          <Link to="/aitools" className="nav-item">
            <button type="button">AI Tools</button>
          </Link>
          {loggedIn ? (
            <>
              <Link to="/plotgeneratorpage" className="nav-item">
                <button type="button">Plot/Story Generator</button>
              </Link>
              <Link to="/plotsettingspage" className="nav-item">
                <button type="button">Plot Settings</button>
              </Link>
              <Link to="/plotcharacterpage" className="nav-item">
                <button type="button">Plot Character</button>
              </Link>
              <Link to="/gamecharactercreator" className="nav-item">
                <button type="button">Game Character Creator</button>
              </Link>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
              <Link to="/userprofile" className="nav-item">
                <button type="button">Profile</button>
              </Link>
            </>
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
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
