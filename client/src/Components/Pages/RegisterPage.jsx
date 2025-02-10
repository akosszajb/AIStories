import React, { useState } from "react";
import PageTitle from "../Common/PageTitle/PageTitle";
import "../../globals.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // jelszó láthatóság állapot

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

      if (formData.email.length < 1 || formData.email.length > 100) {
        setMessage("email length must be between 1 and 100.");
        return;
      }
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
      } else {
        setMessage(result.message || "Registration failed!");
      }
    } catch (error) {
      setMessage(
        error.response.data.message ||
          "Error with registration! (This is the handleSubmit function error message)"
      );
    }
  };

  return (
    <div className="container">
      <PageTitle title="This is the register page" />
      <h3> Registration form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          type="email"
          name="email"
          placeholder="example@xyz.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"} // itt változik a type
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
        <button type="submit">Registration</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
