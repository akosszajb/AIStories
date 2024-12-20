import React, { useEffect, useState } from "react";

const fetchClasses = () => {
  return fetch("/api/classes").then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }
    return res.json();
  });
};

const ClassListPage = () => {
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses()
      .then((classes) => {
        setClasses(classes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
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

  if (!classes || classes.length === 0) {
    return <div>No classes available</div>;
  }

  return (
    <div>
      <h2>Classes</h2>

      <ul>
        {classes.map((cls) => (
          <li key={cls.name}>{cls.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassListPage;
