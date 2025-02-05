import React, { useEffect, useState } from "react";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/userdata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message || "An error occurred while fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <PageTitle title="User Profile Page" />
      <h2>User Info:</h2>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {new Date(userData.created).toISOString().split("T")[0]}
      </p>
      <button>Send my story to me via email!</button>
    </div>
  );
};

export default UserProfilePage;
