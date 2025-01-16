import React, { useEffect, useState } from "react";
import "./StoryGeneratorPage.css";
import { v4 as uuidv4 } from "uuid";

const StoryGeneratorPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [story, setStory] = useState("");
  const [basicStoriesList, setBasicStoriesList] = useState([]);
  const [selectedBasicStory, setSelectedBasicStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [characterList, setCharacterList] = useState([]);
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

  const fetchBasicStoriesList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/basicstorieslist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBasicStoriesList(data);
      } else {
        setError("Failed to load stories");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching stories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacterList = async () => {
    try {
      const response = await fetch("/api/characterlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharacterList(data);
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

  const fetchSelectedBasicStory = async (characterID, selectedStoryID) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/selectedbasicstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          characterID: characterID,
          selectedStoryID: selectedStoryID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedBasicStory(data.basicstories);
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

  const handleBasicStorySelection = (selectedBasicStory) => {
    setSelectedBasicStory(selectedBasicStory);
    fetchCharacterList();
  };

  const handleCharacterSelection = (character) => {
    setSelectedCharacter(character);
    fetchSelectedBasicStory(character._id, selectedBasicStory._id);
  };

  useEffect(() => {
    fetchBasicStoriesList();
  }, []);

  useEffect(() => {
    console.log("Image URL updated:", generatedPictureUrl);
  }, [generatedPictureUrl]);

  const fetchNewStoryandPictureUrl = async (characterID, input) => {
    console.log(characterID);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characterID: characterID, input: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.text) {
        throw new Error("No text found in the response.");
      }

      const newParagraphs = data.text
        .split("\n\n")
        .map((paragraph, index) => <p key={uuidv4()}>{paragraph}</p>);
      setStory((prevStory) => [
        ...prevStory,
        <p className="userchoice" key={uuidv4()}>
          Your choice: {input}
        </p>,
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

  return (
    <div>
      <h2>Story generator</h2>

      {!selectedBasicStory && !selectedCharacter && (
        <div>
          <h3>Choose your story to play with:</h3>
          {basicStoriesList.map((story) => (
            <button
              key={story._id}
              onClick={() => handleBasicStorySelection(story)}
            >
              {story.name}
            </button>
          ))}
        </div>
      )}
      {selectedBasicStory && !selectedCharacter && (
        <div>
          <h4>Story selected: {selectedBasicStory.name}</h4>
          <h4>Choose your character</h4>
          {loading && <p>Loading characters...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ul>
            {characterList.map((char) => (
              <li key={char._id}>
                <button onClick={() => handleCharacterSelection(char)}>
                  {char.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedBasicStory && selectedCharacter && (
        <div>
          <h4>Character selected: {selectedCharacter.name}</h4>
          <div>
            <h4>Basic Story:</h4>
            <h5>{basicStories}</h5>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {story && <div className="story-box">{story}</div>}
          <div className="buttons-container">
            <button
              onClick={() =>
                fetchNewStoryandPictureUrl(
                  selectedCharacter._id,
                  buttonTexts.buttonText1
                )
              }
            >
              {buttonTexts.buttonText1}
            </button>
            <button
              onClick={() =>
                fetchNewStoryandPictureUrl(
                  selectedCharacter._id,
                  buttonTexts.buttonText2
                )
              }
            >
              {buttonTexts.buttonText2}
            </button>
            <button
              onClick={() =>
                fetchNewStoryandPictureUrl(
                  selectedCharacter._id,
                  buttonTexts.buttonText3
                )
              }
            >
              {buttonTexts.buttonText3}
            </button>
            <button
              onClick={() =>
                fetchNewStoryandPictureUrl(
                  selectedCharacter._id,
                  buttonTexts.buttonText4
                )
              }
            >
              {buttonTexts.buttonText4}
            </button>
          </div>
        </div>
      )}
      {generatedPictureUrl && (
        <div
          className="generated-image-container"
          style={{ backgroundImage: `url(${generatedPictureUrl})` }}
        ></div>
      )}
    </div>
  );
};

export default StoryGeneratorPage;
