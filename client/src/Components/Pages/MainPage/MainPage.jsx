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
          <li>Register or log in to personalize your experience</li>
          <li>Start a new game or continue your journey</li>
        </ul>
      </section>

      <section className="story-description">
        <h2 className="defaultstoriestitle">Default stories</h2>
        <h3>The Floating Tower</h3>
        <p>
          Embark on the mystical journey of "The Floating Tower", where every
          decision shapes your destiny. Discover secrets, solve puzzles, and
          face challenges in a world crafted by cutting-edge AI.
        </p>
        <h3>Galaxy Quest</h3>
        <p>
          Captain Eira Solis discovers a hidden doorway beneath the Martian
          dunes, leading her to a starship filled with alien beings. Chosen as
          the navigator of the Nexus, she must unite the galaxy to stop a
          looming threat known as the Void.
        </p>
        <h3>The Great Couch Caper</h3>
        <p>
          Follow your roommate Dave on a side-splitting adventure to recover his
          lost couch. From crashing high-society galas to outwitting a gang of
          thieving squirrels, every moment is a whirlwind of chaos and laughter.
        </p>
        <h3>The Silent Witness</h3>
        <p>
          A famous author is found dead in his study, with only his cat,
          Whiskers, as a witness. As the investigator digs deeper, cryptic
          letters lead to a hidden room, revealing long-buried secrets and the
          truth about the author's final moments.
        </p>
        <h3>Operation Shadow Strike</h3>
        <p>
          A high-stakes military mission behind enemy lines turns into a
          desperate fight for survival. As the team uncovers a deadly plot,
          their courage and strategy will decide the fate of millions.
        </p>
      </section>
    </div>
  );
};

export default MainPage;
