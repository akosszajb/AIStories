import React, { useEffect, useState } from "react";
import PageTitle from "../Common/PageTitle/PageTitle";
import "../../globals.css";

const fetchGameClasses = async () => {
  return fetch("/api/gameclass").then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }
    return res.json();
  });
};

const GameCharacterCreatorPage = () => {
  const [gameClasses, setGameClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGameClasses()
      .then((gameClasses) => {
        setGameClasses(gameClasses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching game classes:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameClasses || gameClasses.length === 0) {
    return <div>No game classes available</div>;
  }

  return (
    <div className="container">
      <PageTitle title="Game Character Creator Page" />

      <h3>Click on a classname to see the stats</h3>
      <ul>
        {gameClasses.map((cls) => (
          <li key={cls.name}>{cls.name}</li>
        ))}
      </ul>

      <h2>Info:</h2>
    </div>
  );
};

export default GameCharacterCreatorPage;
