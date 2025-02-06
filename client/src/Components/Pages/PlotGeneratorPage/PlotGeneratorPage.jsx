import React, { useEffect, useState } from "react";
import "./PlotGeneratorPage.css";
import { v4 as uuidv4 } from "uuid";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";

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
  const [buttonTexts, setButtonTexts] = useState({
    buttonText1: "",
    buttonText2: "",
    buttonText3: "",
    buttonText4: "",
  });

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
    fetchPlotCharacterList();
  };

  const handlePlotCharacterSelection = (plotCharacter) => {
    setSelectedPlotCharacter(plotCharacter);
    fetchSelectedPlotStory(plotCharacter._id, selectedPlotStory._id);
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
        {!selectedPlotStory && !selectedPlotCharacter && (
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
        {selectedPlotStory && !selectedPlotCharacter && (
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
                <h4>Plot Story:</h4>
                <h5>{plotStories}</h5>
              </div>

              {loading && <p>Loading...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {story && (
                <div className="story-box">
                  {story}
                  <div className="picture-box">
                    {generatedPictureUrl && (
                      <div
                        className="generated-image-container"
                        style={{
                          backgroundImage: `url(${generatedPictureUrl})`,
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotGeneratorPage;
