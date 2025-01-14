import React, { useEffect, useState } from "react";
import "./GamePage.css";
import { v4 as uuidv4 } from "uuid";

const GamePage = () => {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [character, setCharacter] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [generatedPictureUrl, setGeneratedPictureUrl] = useState(null);
  const [basicStories, setBasicStories] = useState("");
  const [buttonTexts, setButtonTexts] = useState({
    buttonText1: "",
    buttonText2: "",
    buttonText3: "",
    buttonText4: "",
  });

  const token = localStorage.getItem("token");

  const fetchCharacterList = async () => {
    try {
      const response = await fetch("/api/characterlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharacter(data);
      } else {
        setError("Failed to load characters");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching characters.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBasicStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/basicstories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBasicStories(data.basicstories);
      setButtonTexts({
        buttonText1: data.buttonText1,
        buttonText2: data.buttonText2,
        buttonText3: data.buttonText3,
        buttonText4: data.buttonText4,
      });
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching characters.");
    } finally {
      setLoading(false);
    }
  };

  const handleCharacterSelection = (character) => {
    setSelectedCharacter(character);
    fetchBasicStory();
  };

  const fetchNewStoryandPictureUrl = async (input) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (!data.text) {
        throw new Error("No text found in the response.");
      }

      const newParagraphs = data.text
        .split("\n\n")
        .map((paragraph, index) => <p key={uuidv4()}>{paragraph}</p>);
      setStory((prevStory) => [
        ...prevStory,
        <p key={uuidv4()}>Your choice: {input}</p>,
        ...newParagraphs,
      ]);

      setButtonTexts({
        buttonText1: data.buttonText1,
        buttonText2: data.buttonText2,
        buttonText3: data.buttonText3,
        buttonText4: data.buttonText4,
      });

      const generatedPicureUrl = data.generatedPicture;
      if (generatedPicureUrl) {
        setGeneratedPictureUrl(generatedPicureUrl);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterList();
  }, []);

  return (
    <div>
      <h2>Game</h2>
      <h3>The Floating Tower</h3>
      <h4>
        Become an adventurer in the The Floating Tower Story. Be a wizard, rogue
        or fighter! IDE KELL MÉG STORY!!!!!!!!!!!!!!!
      </h4>
      <h4>Choose your character to play:</h4>
      {loading && <p>Loading characters...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {character.map((char) => (
          <li key={char._id}>
            <button onClick={() => handleCharacterSelection(char)}>
              {char.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedCharacter && (
        <div>
          <h5>Character selected: {selectedCharacter.name}</h5>{" "}
          <div>
            <h5>Basic Story:</h5>
            <h6>{basicStories}</h6>
          </div>
          <button
            onClick={() => fetchNewStoryandPictureUrl(buttonTexts.buttonText1)}
          >
            {buttonTexts.buttonText1}
          </button>
          <button
            onClick={() => fetchNewStoryandPictureUrl(buttonTexts.buttonText2)}
          >
            {buttonTexts.buttonText2}
          </button>
          <button
            onClick={() => fetchNewStoryandPictureUrl(buttonTexts.buttonText3)}
          >
            {buttonTexts.buttonText3}
          </button>
          <button
            onClick={() => fetchNewStoryandPictureUrl(buttonTexts.buttonText4)}
          >
            {buttonTexts.buttonText4}
          </button>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {story && <div className="story-box">{story}</div>}
      {generatedPictureUrl && (
        <div
          className="generated-image-container"
          style={{ backgroundImage: `url(${generatedPictureUrl})` }}
        ></div>
      )}
    </div>
  );
};

export default GamePage;
