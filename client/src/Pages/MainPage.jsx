import React, { useEffect, useState } from "react";

const fetchClasses = () => {
  return fetch("/api/classes").then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }
    return res.json();
  });
};

const MainPage = () => {
  return (
    <div>
      <h2>THIS IS THE MAIN PAGE - SOME TEXT TO HERE</h2>
    </div>
  );
};

export default MainPage;
