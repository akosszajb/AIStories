import React, { useEffect, useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/register", {
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
    <div>
      <h2>THIS IS THE REGISTER PAGE</h2>
      <h3> Registration form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="example@xyz.com"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Registration</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
