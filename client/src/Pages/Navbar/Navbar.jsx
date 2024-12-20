import React from "react";
import { Outlet, Link } from "react-router-dom";

const Navbar = () => (
  <div className="Navbar">
    <nav>
      <div className="nav-links">
        <Link to="/" className="nav-item">
          <button type="button">Home</button>
        </Link>
        <Link to="/classlist" className="nav-item">
          <button type="button">Let's play - see the ClassList</button>
        </Link>
        <Link to="/login" className="nav-item">
          <button type="button">Login</button>
        </Link>
        <Link to="/register" className="nav-item">
          <button type="button">Register</button>
        </Link>
        <Link to="/aitools" className="nav-item">
          <button type="button">AI Tools</button>
        </Link>
      </div>
    </nav>
    <Outlet />
  </div>
);

export default Navbar;
