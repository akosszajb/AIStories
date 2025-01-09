import React, { useEffect, useState } from "react";
import "./GamePage.css";

const GamePage = () => {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [character, setCharacter] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  let generatedText = "";
  const token = localStorage.getItem("token");

  const basicStory = `It was a cold, clear day still early in Marpenoth, in the Year of Many Brews.
    All around, the trees' leaves had already been touched by golden and fiery-orange hues when the Brave Blades arrived at the place they had sought for so long.
    Their goal loomed dark and silent above them: the Floating Tower, the lifeless fortress of the long-dead Ondil, hidden deep within a chasm somewhere west of the Horn Hills. Ondil's tower hovered patiently, as it had for centuries, under the protection of a dreaded wizard.
    \n
    The Blades looked up, then away into the distance — except for "player's name," who stood with a "first item - weapon" raised defiantly and sized up the silently waiting tower from beneath their "second item (e.g., hat).`;

  const fetchCharacterList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/characterlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Data    " + JSON.stringify(data, null, 2));
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

  useEffect(() => {
    fetchCharacterList();
  }, []);

  const handleCharacterSelection = (character) => {
    setSelectedCharacter(character);
    console.log(`Selected character: ${character.name}`);
  };

  const fetchStory = async (input) => {
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

      const data = await response.json();

      if (!data.text) {
        throw new Error("No text found in the response.");
      }

      console.log(data);

      const newParagraphs = data.text
        .split("\n\n")
        .map((paragraph, index) => <p key={index}>{paragraph}</p>);
      setStory((prevStory) => [...prevStory, "-----------", ...newParagraphs]);
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

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
        <li key={character._id}>
          <button onClick={() => handleCharacterSelection(character)}>
            {character.name}
          </button>
        </li>
      </ul>

      {selectedCharacter && (
        <div>
          <h5>Character selected: {selectedCharacter.name}</h5>{" "}
          <button
            onClick={() =>
              fetchStory(
                "The player character wants to go to the right direction!"
              )
            }
          >
            Right
          </button>
          <button
            onClick={() =>
              fetchStory(
                "The player character wants to go to the left direction!"
              )
            }
          >
            Left
          </button>
          <button
            onClick={() =>
              fetchStory(
                "The player character wants to go to fly to happy place!"
              )
            }
          >
            Fly to happy place
          </button>
          <button
            onClick={() =>
              fetchStory(
                `The player character say: "F.ck this I go to the next bar!"`
              )
            }
          >
            F.ck this I go to the next bar!
          </button>
        </div>
      )}
      <div>{basicStory}</div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {story && <div className="story-box">{story}</div>}
    </div>
  );
};

export default GamePage;
