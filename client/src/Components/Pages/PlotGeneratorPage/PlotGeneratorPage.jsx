import React, { useEffect, useState } from "react";
import "./PlotGeneratorPage.css";
import { v4 as uuidv4 } from "uuid";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";
import { set } from "mongoose";

const PlotGeneratorPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [story, setStory] = useState("");
  const [plotStoriesList, setPlotStoriesList] = useState([]);
  const [selectedPlotStory, setSelectedPlotStory] = useState(null);
  const [plotCharacterList, setPlotCharacterList] = useState([]);
  const [selectedPlotCharacter, setSelectedPlotCharacter] = useState(null);
  const [generatedPictureUrl, setGeneratedPictureUrl] = useState(null);
  const [plotStories, setPlotStories] = useState("");
  const [isButtonsVisible, setIsButtonVisible] = useState(true);
  const [buttonTexts, setButtonTexts] = useState({
    buttonText1: "",
    buttonText2: "",
    buttonText3: "",
    buttonText4: "",
  });
  const [stepCount, setStepCount] = useState(0);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPlotStoriesList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/plotstorieslist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPlotStoriesList(data);
        setStepCount(0);
      } else {
        setError("Failed to load plot stories");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching stories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlotCharacterList = async () => {
    try {
      const response = await fetch("/api/plotcharacterlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPlotCharacterList(data);
      } else {
        setError("Failed to load characters");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching plot characters.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedPlotStory = async (
    plotCharacterID,
    selectedPlotStoryID
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/selectedplotstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plotCharacterID: plotCharacterID,
          selectedPlotStoryID: selectedPlotStoryID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedPlotStory(data.plotstories);
      setPlotStories(data.plotstories);
      setButtonTexts({
        buttonText1: data.buttonText1,
        buttonText2: data.buttonText2,
        buttonText3: data.buttonText3,
        buttonText4: data.buttonText4,
      });
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching plot characters.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlotStorySelection = (selectedPlotStory) => {
    setSelectedPlotStory(selectedPlotStory);
    setIsButtonVisible(true);
    fetchPlotCharacterList();
  };

  const handlePlotCharacterSelection = (plotCharacter) => {
    setSelectedPlotCharacter(plotCharacter);
    fetchSelectedPlotStory(plotCharacter._id, selectedPlotStory._id);
    setIsButtonVisible(true);
  };

  const restart = () => {
    setSelectedPlotStory(null);
    setSelectedPlotCharacter(null);
    setStory("");
    setGeneratedPictureUrl(null);
    setIsButtonVisible(true);
    setButtonTexts({
      buttonText1: "",
      buttonText2: "",
      buttonText3: "",
      buttonText4: "",
    });
    setStepCount(0);
    setShowEmailPrompt(false);
    fetchPlotStoriesList();
  };
  const handleEmailSend = async () => {
    try {
      const response = await fetch(
        `/api/send-email/${selectedPlotCharacter._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Email sent successfully");
        rebootSelectedPlotCharacterData();
        setSelectedPlotStory(false);
        setSelectedPlotCharacter(false);
        setIsButtonVisible(true);
        fetchPlotStoriesList();
      } else {
        setError("Failed to load characters");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching plot characters.");
    } finally {
      setLoading(false);
    }
  };

  const rebootSelectedPlotCharacterData = async () => {
    try {
      const rebootedCharacter = {
        _id: selectedPlotCharacter._id,
        plotcharactername: selectedPlotCharacter.plotcharactername,
        personality: selectedPlotCharacter.personality,
        charStoryKeywords: [
          selectedPlotCharacter.charStoryKeywords[0],
          selectedPlotCharacter.charStoryKeywords[1],
          selectedPlotCharacter.charStoryKeywords[2],
          selectedPlotCharacter.charStoryKeywords[4],
          selectedPlotCharacter.charStoryKeywords[5],
        ],
        pictureKeywords: [
          selectedPlotCharacter.pictureKeywords[0],
          selectedPlotCharacter.pictureKeywords[1],
          selectedPlotCharacter.pictureKeywords[2],
          selectedPlotCharacter.pictureKeywords[3],
        ],
        aiPictureUrls: [],
        fullStories: [],
        selectedUserOptions: [],
      };
      const response = await fetch(
        `/api/rebootcharacter/${rebootedCharacter._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rebootedCharacter),
        }
      );
      const result = await response.json();
      restart();
      if (response.ok) {
        alert("Success: Character rebooted!");
      } else {
        setMessage(result.message || "Character reboot failed!");
      }
    } catch (error) {
      setMessage(
        "Error with character reboot! (This is the rebootSelectedPlotCharacterData function error message)"
      );
    }
  };

  useEffect(() => {
    fetchPlotStoriesList();
  }, []);

  const fetchNewPlotStoryandPictureUrl = async (plotCharacterID, input) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-plotstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plotCharacterID: plotCharacterID,
          input: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newParagraphs = data.text
        .split("\n\n")
        .map((paragraph, index) => <p key={uuidv4()}>{paragraph}</p>);
      setStory((prevPlot) => [
        ...prevPlot,
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

      setStepCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 5) {
          setShowEmailPrompt(true);
          setIsButtonVisible(false);
        }
        return newCount;
      });
    } catch (error) {
      console.error(error);
      setError("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <PageTitle title="Plot Story Generator" />
      <div className="plot-generator-page">
        {!selectedPlotStory && !selectedPlotCharacter && isButtonsVisible && (
          <div>
            <h3>Choose your story to play with:</h3>
            <div className="buttons-container">
              {plotStoriesList.map((plot) => (
                <button
                  key={plot._id}
                  onClick={() => handlePlotStorySelection(plot)}
                >
                  {plot.title}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedPlotStory && !selectedPlotCharacter && isButtonsVisible && (
          <div>
            <h4>Plot Story selected: {selectedPlotStory.title}</h4>
            <h4>Choose your character</h4>
            {loading && <p>Loading characters...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="buttons-container">
              {plotCharacterList.map((char) => (
                <div key={char._id}>
                  <button onClick={() => handlePlotCharacterSelection(char)}>
                    {char.plotcharactername}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedPlotStory && selectedPlotCharacter && (
          <div className="content-container">
            <div className="story-left">
              <h4>
                Character selected: {selectedPlotCharacter.plotcharactername}
              </h4>
              <div>
                <h4 className="subtitle">Plot Story:</h4>
                <h5>{plotStories}</h5>
              </div>

              {loading && <p>Loading...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {story && (
                <div className="story-box">
                  {story}
                  <div className="picture-box">
                    {generatedPictureUrl && (
                      <div className="generated-image-container">
                        <img
                          src={generatedPictureUrl}
                          alt="AI Generated Story Picture"
                          width="450"
                          height="450"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {isButtonsVisible && (
                <div className="buttons-container">
                  <button
                    onClick={() =>
                      fetchNewPlotStoryandPictureUrl(
                        selectedPlotCharacter._id,
                        buttonTexts.buttonText1
                      )
                    }
                  >
                    {buttonTexts.buttonText1}
                  </button>
                  <button
                    onClick={() =>
                      fetchNewPlotStoryandPictureUrl(
                        selectedPlotCharacter._id,
                        buttonTexts.buttonText2
                      )
                    }
                  >
                    {buttonTexts.buttonText2}
                  </button>
                  <button
                    onClick={() =>
                      fetchNewPlotStoryandPictureUrl(
                        selectedPlotCharacter._id,
                        buttonTexts.buttonText3
                      )
                    }
                  >
                    {buttonTexts.buttonText3}
                  </button>
                  <button
                    onClick={() =>
                      fetchNewPlotStoryandPictureUrl(
                        selectedPlotCharacter._id,
                        buttonTexts.buttonText4
                      )
                    }
                  >
                    {buttonTexts.buttonText4}
                  </button>
                </div>
              )}

              {showEmailPrompt && (
                <div className="email-prompt">
                  <p className="subtitle">THE END</p>
                  <p>
                    Would you like to send this generated story to your email?
                  </p>
                  <button onClick={handleEmailSend}>Yes, and restart</button>
                  <button onClick={restart}>No, just restart</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotGeneratorPage;
