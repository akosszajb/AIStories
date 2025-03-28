import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../Common/PageTitle/PageTitle";
import "../../globals.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formData.username.length < 1 || formData.username.length > 15) {
        setMessage("username length must be between 1 and 15.");
        return;
      }

      if (formData.password.length < 1 || formData.password.length > 15) {
        setMessage("password length must be between 1 and 15.");
        return;
      }
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        alert("Login successful!");
        navigate("/");
      } else {
        setMessage(result.message || "Login failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Login! (This is the Login - handleSubmit function error message)"
      );
    }
  };

  return (
    <div className="container">
      <PageTitle title="This is the login page" />

      <h3>Login form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)} // kattintásra vált
            style={{ cursor: "pointer" }}
          >
            👁️
          </span>
        </div>
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
