import React, { useEffect, useState } from "react";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";
import "./PlotCharacterPage.css";

const PlotCharacterPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [plotCharacterList, setPlotCharacterList] = useState([]);
  const [isCreatorFormFilled, setIsCreatorFormFilled] = useState(false);
  const [isSelectedPlotCharacter, setIsSelectedPlotCharacter] = useState(false);
  const [inputError, setInputError] = useState("");
  const [creatorFormData, setCreatorFormData] = useState({
    _id: "",
    plotcharactername: "",
    personality: 0,
    charStoryKeywords: ["", "", "", "", "", ""],
    pictureKeywords: ["", "", "", ""],
  });
  const [updateFormData, setUpdateFormData] = useState({
    _id: "",
    plotcharactername: "",
    personality: 0,
    charStoryKeywords: ["", "", "", "", "", ""],
    pictureKeywords: ["", "", "", ""],
  });

  const token = localStorage.getItem("token");

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

  const handleUpdateFormChange = (event) => {
    if (!isSelectedPlotCharacter) {
      setInputError("Please select a plot story first.");
      return;
    }
    setInputError("");
    const { name, value } = event.target;
    setUpdateFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateFormArrayChange = (event, fieldName, index) => {
    if (!isSelectedPlotCharacter) {
      setInputError("Please select a character first.");
      return;
    }
    setInputError("");
    const { value } = event.target;
    setUpdateFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: prevFormData[fieldName].map((item, idx) =>
        idx === index ? value : item
      ),
    }));
  };

  const handleSelectedPlotCharacterDelete = async (event) => {
    event.preventDefault();
    const _id = updateFormData._id;
    console.log(`/api/plotcharacter/${_id}`);
    try {
      const response = await fetch(`/api/plotcharacter/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.status == 410) {
        alert("Success: Delete plot character!");
        setUpdateFormData({
          _id: "",
          plotcharactername: "",
          personality: 0,
          charStoryKeywords: ["", "", "", "", "", ""],
          pictureKeywords: ["", "", "", ""],
        });
        setIsSelectedPlotCharacter(false);
        fetchPlotCharacterList();
      } else {
        setIsSelectedPlotCharacter(false);
        setMessage(result.message || "Story delete failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Character Deleting! (This is the handleSelectedPlotStoryDelete function error message)"
      );
    }
  };

  const rebootSelectedPlotCharacterData = async (event) => {
    try {
      event.preventDefault();
      console.log(updateFormData);
      const rebootedCharacter = {
        _id: updateFormData._id,
        plotcharactername: updateFormData.plotcharactername,
        personality: updateFormData.personality,
        charStoryKeywords: [
          updateFormData.charStoryKeywords[0],
          updateFormData.charStoryKeywords[1],
          updateFormData.charStoryKeywords[2],
          updateFormData.charStoryKeywords[3],
        ],
        pictureKeywords: [
          updateFormData.pictureKeywords[0],
          updateFormData.pictureKeywords[1],
          updateFormData.pictureKeywords[2],
          updateFormData.pictureKeywords[3],
        ],
        aiPictureUrls: [],
        fullStories: [],
        selectedUserOptions: [],
      };

      if (!rebootedCharacter.plotcharactername) {
        setInputError("Plot character name is required to reboot");
        return;
      }

      if (
        rebootedCharacter.personality < 0 ||
        rebootedCharacter.personality > 100
      ) {
        setInputError("Personality must be between 0 and 100.");
        return;
      }
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
      console.log(result);
      if (response.ok) {
        alert("Success: Character rebooted!");
        setUpdateFormData({
          _id: "",
          plotcharactername: "",
          personality: 0,
          charStoryKeywords: ["", "", "", "", "", ""],
          pictureKeywords: ["", "", "", ""],
        });
        setIsSelectedPlotCharacter(false);
        fetchPlotCharacterList();
      } else {
        setIsSelectedPlotStory(false);
        setMessage(result.message || "Character reboot failed!");
      }
    } catch (error) {
      setMessage(
        "Error with character reboot! (This is the rebootSelectedPlotCharacterData function error message)"
      );
    }
  };

  const handlePlotCharacterUpdate = async (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedCharacter = {
      _id: updateFormData._id,
      personality: form.personality.value,
      plotcharactername: form.plotcharactername.value,
      charStoryKeywords: [
        form.charStoryKeyword1.value,
        form.charStoryKeyword2.value,
        form.charStoryKeyword3.value,
        form.charStoryKeyword4.value,
        form.charStoryKeyword5.value,
        form.charStoryKeyword6.value,
      ],
      pictureKeywords: [
        form.pictureKeywords1.value,
        form.pictureKeywords2.value,
        form.pictureKeywords3.value,
        form.pictureKeywords4.value,
      ],
    };
    console.log(updateFormData);

    if (!updatedCharacter.plotcharactername) {
      setInputError("Plot character name is required.");
      return;
    }

    if (
      updatedCharacter.personality < 0 ||
      updatedCharacter.personality > 100
    ) {
      setInputError("Personality must be between 0 and 100.");
      return;
    }
    try {
      const response = await fetch(
        `/api/plotcharacter/${updatedCharacter._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCharacter),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Success: Character updated!");
        setUpdateFormData({
          _id: "",
          plotcharactername: "",
          personality: 0,
          charStoryKeywords: ["", "", "", "", "", ""],
          pictureKeywords: ["", "", "", ""],
        });
        setIsSelectedPlotCharacter(false);
        fetchPlotCharacterList();
      } else {
        setIsSelectedPlotStory(false);
        setMessage(result.message || "Character update failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Plot Character Updating! (This is the handlePlotCharacterUpdate function error message)"
      );
    }
  };

  const handlePlotCharacterSelectionToModify = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/selectedplotcharacter/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUpdateFormData({
          _id: data._id,
          plotcharactername: data.plotcharactername,
          personality: data.personality,
          charStoryKeywords: data.charStoryKeywords,
          pictureKeywords: data.pictureKeywords,
        });
        setIsSelectedPlotCharacter(true);
      } else {
        setError("Failed to load plot characters");
        setIsSelectedPlotCharacter(false);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching plot character details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFormClear = () => {
    setUpdateFormData({
      _id: "",
      plotcharactername: "",
      personality: 0,
      charStoryKeywords: ["", "", "", "", "", ""],
      pictureKeywords: ["", "", "", ""],
    });
    setIsSelectedPlotCharacter(false);
  };

  const handlePlotCharacterCreation = async (event) => {
    event.preventDefault();
    const newCharacter = {
      plotcharactername: creatorFormData.plotcharactername,
      personality: creatorFormData.personality,
      charStoryKeywords: [
        creatorFormData.charStoryKeywords[0],
        creatorFormData.charStoryKeywords[1],
        creatorFormData.charStoryKeywords[2],
        creatorFormData.charStoryKeywords[3],
        creatorFormData.charStoryKeywords[4],
        creatorFormData.charStoryKeywords[5],
      ],
      pictureKeywords: [
        creatorFormData.pictureKeywords[0],
        creatorFormData.pictureKeywords[1],
        creatorFormData.pictureKeywords[2],
        creatorFormData.pictureKeywords[3],
      ],
      aiPictureUrls: [],
      fullStories: [],
    };
    console.log(newCharacter);
    try {
      const response = await fetch("/api/createplotcharacter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCharacter),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        alert("Success: Plot character created!");
        setCreatorFormData({
          _id: "",
          plotcharactername: "",
          personality: 0,
          charStoryKeywords: ["", "", "", "", "", ""],
          pictureKeywords: ["", "", "", ""],
        });
        setIsCreatorFormFilled(false);
        fetchPlotCharacterList();
      } else {
        setMessage(result.message || "Character creation failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Plot Character Creating! (This is the handlePlotCharacterCreation function error message)"
      );
    }
  };

  const handleCreatorFormChange = (event) => {
    setIsCreatorFormFilled(true);
    const { name, value } = event.target;
    setCreatorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCreatorFormArrayChange = (fieldName, index, event) => {
    setIsCreatorFormFilled(true);
    const { value } = event.target;
    setCreatorFormData((prevFormData) => {
      const updatedArray = [...prevFormData[fieldName]];
      updatedArray[index] = value;
      return {
        ...prevFormData,
        [fieldName]: updatedArray,
      };
    });
  };

  const handleCreatorFormClear = () => {
    setCreatorFormData({
      _id: "",
      plotcharactername: "",
      personality: 0,
      charStoryKeywords: ["", "", "", "", "", ""],
      pictureKeywords: ["", "", "", ""],
    });
    setIsCreatorFormFilled(false);
  };

  useEffect(() => {
    fetchPlotCharacterList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <PageTitle title="Plot Character Page" />
      {message && <p>{message}</p>}
      <div className="form-container">
        <div className="plot-character-updater-form">
          <h3 className="subtitle">Click on a character to modify/update it</h3>
          {plotCharacterList.map((char) => (
            <button
              key={char._id}
              onClick={() => handlePlotCharacterSelectionToModify(char._id)}
            >
              {char.plotcharactername}
            </button>
          ))}
          {isSelectedPlotCharacter && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const submitter = e.nativeEvent.submitter;
                if (submitter.name === "updater") {
                  handlePlotCharacterUpdate();
                } else if (submitter.name === "reboot") {
                  rebootSelectedPlotCharacterData();
                }
              }}
            >
              <ul>
                <li>
                  <label htmlFor="plotcharactername">
                    Plot character name:
                  </label>
                  <input
                    type="text"
                    name="plotcharactername"
                    placeholder="Plot character name"
                    value={updateFormData.plotcharactername || ""}
                    onChange={handleUpdateFormChange}
                    autoComplete="plotcharactername"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="personality">
                    Plot character personality (evil:0 - good:100):
                  </label>
                  <input
                    type="number"
                    name="personality"
                    placeholder="Plot character personality"
                    value={updateFormData.personality || 0}
                    onChange={handleUpdateFormChange}
                    autoComplete="personality"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <h4>Keywords to generate story with this character</h4>
                <li>
                  <label htmlFor="charStoryKeyword1">Keyword1</label>
                  <input
                    type="text"
                    name="charStoryKeyword1"
                    placeholder="keyword1"
                    value={updateFormData.charStoryKeywords[0] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 0)
                    }
                    autoComplete="keyword1"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="charStoryKeyword2">Keyword2</label>
                  <input
                    type="text"
                    name="charStoryKeyword2"
                    placeholder="keyword2"
                    value={updateFormData.charStoryKeywords[1] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 1)
                    }
                    autoComplete="keyword2"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="charStoryKeyword3">Keyword3</label>
                  <input
                    type="text"
                    name="charStoryKeyword3"
                    placeholder="keyword3"
                    value={updateFormData.charStoryKeywords[2] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 2)
                    }
                    autoComplete="keyword3"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="charStoryKeyword4">Keyword4</label>
                  <input
                    type="text"
                    name="charStoryKeyword4"
                    placeholder="keyword4"
                    value={updateFormData.charStoryKeywords[3] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 3)
                    }
                    autoComplete="keyword4"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="charStoryKeyword5">Keyword5</label>
                  <input
                    type="text"
                    name="charStoryKeyword5"
                    placeholder="keyword5"
                    value={updateFormData.charStoryKeywords[4] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 4)
                    }
                    autoComplete="keyword5"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>

                <li>
                  <label htmlFor="charStoryKeyword6">Keyword6</label>
                  <input
                    type="text"
                    name="charStoryKeyword6"
                    placeholder="keyword6"
                    value={updateFormData.charStoryKeywords[5] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "charStoryKeywords", 5)
                    }
                    autoComplete="keyword6"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <h4>Keywords to generate story-picures with this character</h4>
                <li>
                  <label htmlFor="pictureKeywords1">Picture Keyword 1</label>
                  <input
                    type="text"
                    name="pictureKeywords1"
                    placeholder="Picture Keyword 1"
                    value={updateFormData.pictureKeywords[0] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "pictureKeywords", 0)
                    }
                    autoComplete="pictureKeywords1"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="pictureKeywords2">Picture Keyword 2</label>
                  <input
                    type="text"
                    name="pictureKeywords2"
                    placeholder="Picture Keyword 2"
                    value={updateFormData.pictureKeywords[1] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "pictureKeywords", 1)
                    }
                    autoComplete="pictureKeywords2"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="pictureKeywords3">Picture Keyword 3</label>
                  <input
                    type="text"
                    name="pictureKeywords3"
                    placeholder="Picture Keyword 3"
                    value={updateFormData.pictureKeywords[2] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "pictureKeywords", 2)
                    }
                    autoComplete="pictureKeywords3"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>
                <li>
                  <label htmlFor="pictureKeywords4">Picture Keyword 4</label>
                  <input
                    type="text"
                    name="pictureKeywords4"
                    placeholder="Picture Keyword 4"
                    value={updateFormData.pictureKeywords[3] || ""}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "pictureKeywords", 3)
                    }
                    autoComplete="pictureKeywords4"
                    disabled={!isSelectedPlotCharacter}
                  />
                </li>

                <div>
                  <button type="submit" name="updater">
                    Click here to modify this plot character
                  </button>

                  <button onClick={handleUpdateFormClear}>Cancel</button>
                  <button
                    type="button"
                    onClick={handleSelectedPlotCharacterDelete}
                  >
                    Delete this plot character
                  </button>
                  <button
                    type="submit"
                    name="reboot"
                    onClick={rebootSelectedPlotCharacterData}
                  >
                    Reboot this plot character
                  </button>
                </div>
              </ul>
            </form>
          )}
        </div>
        <div className="plot-character-create-form">
          <h3 className="subtitle">Plot character creator form</h3>
          {/* {loading && <p>Loading characters...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>} */}

          <form onSubmit={handlePlotCharacterCreation}>
            <ul>
              <li>
                <label htmlFor="plotcharactername">Plot character name:</label>
                <input
                  type="text"
                  name="plotcharactername"
                  placeholder="Plot character name"
                  value={creatorFormData.plotcharactername || ""}
                  onChange={handleCreatorFormChange}
                  autoComplete="plotcharactername"
                />
              </li>
              <li>
                <label htmlFor="personality">
                  Plot character personality (evil:0 - good:100):
                </label>
                <input
                  type="number"
                  name="personality"
                  placeholder="Plot character personality"
                  value={creatorFormData.personality || 0}
                  onChange={handleCreatorFormChange}
                  autoComplete="personality"
                />
              </li>
              <h4>Keywords to generate story with this character</h4>
              <li>
                <label htmlFor="charStoryKeyword1">Keyword1</label>
                <input
                  type="text"
                  name="charStoryKeyword1"
                  placeholder="keyword1"
                  value={creatorFormData.charStoryKeywords[0] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 0, e)
                  }
                  autoComplete="keyword1"
                />
              </li>
              <li>
                <label htmlFor="charStoryKeyword2">Keyword2</label>
                <input
                  type="text"
                  name="charStoryKeyword2"
                  placeholder="keyword2"
                  value={creatorFormData.charStoryKeywords[1] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 1, e)
                  }
                  autoComplete="keyword2"
                />
              </li>
              <li>
                <label htmlFor="charStoryKeyword3">Keyword3</label>
                <input
                  type="text"
                  name="charStoryKeyword3"
                  placeholder="keyword3"
                  value={creatorFormData.charStoryKeywords[2] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 2, e)
                  }
                  autoComplete="keyword3"
                />
              </li>
              <li>
                <label htmlFor="charStoryKeyword4">Keyword4</label>
                <input
                  type="text"
                  name="charStoryKeyword4"
                  placeholder="keyword4"
                  value={creatorFormData.charStoryKeywords[3] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 3, e)
                  }
                  autoComplete="keyword4"
                />
              </li>
              <li>
                <label htmlFor="charStoryKeyword5">Keyword5</label>
                <input
                  type="text"
                  name="charStoryKeyword5"
                  placeholder="keyword5"
                  value={creatorFormData.charStoryKeywords[4] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 4, e)
                  }
                  autoComplete="keyword5"
                />
              </li>

              <li>
                <label htmlFor="charStoryKeyword6">Keyword6</label>
                <input
                  type="text"
                  name="charStoryKeyword6"
                  placeholder="keyword6"
                  value={creatorFormData.charStoryKeywords[5] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("charStoryKeywords", 5, e)
                  }
                  autoComplete="keyword6"
                />
              </li>
              <h4>Keywords to generate story-picures with this character</h4>
              <li>
                <label htmlFor="pictureKeywords1">Picture Keyword 1</label>
                <input
                  type="text"
                  name="pictureKeywords1"
                  placeholder="Picture Keyword 1"
                  value={creatorFormData.pictureKeywords[0] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("pictureKeywords", 0, e)
                  }
                  autoComplete="pictureKeywords1"
                />
              </li>
              <li>
                <label htmlFor="pictureKeywords2">Picture Keyword 2</label>
                <input
                  type="text"
                  name="pictureKeywords2"
                  placeholder="Picture Keyword 2"
                  value={creatorFormData.pictureKeywords[1] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("pictureKeywords", 1, e)
                  }
                  autoComplete="pictureKeywords2"
                />
              </li>
              <li>
                <label htmlFor="pictureKeywords3">Picture Keyword 3</label>
                <input
                  type="text"
                  name="pictureKeywords3"
                  placeholder="Picture Keyword 3"
                  value={creatorFormData.pictureKeywords[2] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("pictureKeywords", 2, e)
                  }
                  autoComplete="pictureKeywords3"
                />
              </li>
              <li>
                <label htmlFor="pictureKeywords4">Picture Keyword 4</label>
                <input
                  type="text"
                  name="pictureKeywords4"
                  placeholder="Picture Keyword 4"
                  value={creatorFormData.pictureKeywords[3] || ""}
                  onChange={(e) =>
                    handleCreatorFormArrayChange("pictureKeywords", 3, e)
                  }
                  autoComplete="pictureKeywords4"
                />
              </li>
              <div>
                <button type="submit">
                  Click here to creat this character
                </button>
                {isCreatorFormFilled && (
                  <button type="button" onClick={handleCreatorFormClear}>
                    Cancel
                  </button>
                )}
              </div>
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlotCharacterPage;
