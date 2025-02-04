import React from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";
import "../../../globals.css";
import PageTitle from "../../Common/PageTitle/PageTitle";

const MainPage = () => {
  return (
    <div className="main-container">
      <header className="main-header">
        <h1 className="welcome">Welcome to AIStories</h1>
        <p>
          Dive into a world where artificial intelligence brings your story to
          life. Join us and embark on an unforgettable adventure!
        </p>
      </header>

      <section className="features">
        <PageTitle title="What You Can Do" />
        <ul>
          <li>Discover the fascinating world of AI-driven storytelling</li>
          <li>Learn about the project and its educational purpose</li>
          <li>
            Read about the game rules and the adventure behind "The Floating
            Tower" or "Galaxy Quest" stories
          </li>
          <li>Register or log in to personalize your experience</li>
          <li>Start a new game or continue your journey</li>
        </ul>
      </section>

      <section className="story-description">
        <h2>The Floating Tower</h2>
        <p>
          Embark on the mystical journey of "The Floating Tower", where every
          decision shapes your destiny. Discover secrets, solve puzzles, and
          face challenges in a world crafted by cutting-edge AI.
        </p>
        <h2>Galaxy Quest</h2>
        <p>
          Deep beneath the crimson dunes of Mars, Captain Eira Solis uncovered
          an ancient doorway glowing with unearthly symbols.As she pressed her
          hand to the cold metal, it hummed and opened, revealing a vast chamber
          filled with floating, crystalline orbs.Her AI companion, Delta, warned
          of an energy surge, but curiosity drove her forward, reaching for the
          largest orbIn an instant, she was transported to a starship brimming
          with alien lifeforms, all staring at her with a mix of awe and
          suspicionTheir leader, a towering figure of light, declared, “You are
          the chosen navigator of the lost Nexus, destined to save our galaxy
          from the Void.
        </p>
      </section>
    </div>
  );
};

export default MainPage;
