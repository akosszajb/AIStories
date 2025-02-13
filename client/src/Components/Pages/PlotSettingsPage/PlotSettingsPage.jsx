import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";
import "./PlotsettingsPage.css";

const PlotSettingsPage = () => {
  const [plotStoryTitles, setPlotStoryTitles] = useState([""]);
  const [message, setMessage] = useState("");
  const [isSelectedPlotStory, setIsSelectedPlotStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [isCreatorFormFilled, setIsCreatorFormFilled] = useState(false);
  const [inputError, setInputError] = useState("");
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    storyKeywords: ["", "", "", ""],
    StarterFullStories: ["", ""],
    firstChoiceOptions: ["", "", "", ""],
  });
  const [updateFormData, setUpdateFormData] = useState({
    _id: "",
    title: "",
    storyKeywords: ["", "", "", ""],
    StarterFullStories: ["", ""],
    firstChoiceOptions: ["", "", "", ""],
  });
  //-----------------------------------------------------------

  const handleChange = (event) => {
    setIsCreatorFormFilled(true);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateFormChange = (event) => {
    if (!isSelectedPlotStory) {
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

  const handleFormArrayChange = (fieldName, index, event) => {
    setIsCreatorFormFilled(true);
    const { value } = event.target;
    setFormData((prevFormData) => {
      const updatedArray = [...prevFormData[fieldName]];
      updatedArray[index] = value;
      return {
        ...prevFormData,
        [fieldName]: updatedArray,
      };
    });
  };

  const handleUpdateFormArrayChange = (event, fieldName, index) => {
    if (!isSelectedPlotStory) {
      setInputError("Please select a plot story first.");
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

  const handleClearFormData = () => {
    setFormData({
      _id: "",
      title: "",
      storyKeywords: ["", "", "", ""],
      StarterFullStories: ["", ""],
      firstChoiceOptions: ["", "", "", ""],
    });
    setIsCreatorFormFilled(false);
  };

  const handleClearUpdateFormData = () => {
    setIsSelectedPlotStory(false);
    setUpdateFormData({
      _id: "",
      title: "",
      storyKeywords: ["", "", "", ""],
      StarterFullStories: ["", ""],
      firstChoiceOptions: ["", "", "", ""],
    });
  };

  const fetchPlotStoryTitles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/plotstorytitles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPlotStoryTitles(data);
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
  const handleSubmitPlotCreator = async (event) => {
    event.preventDefault();
    const form = event.target;
    const newPlotStory = {
      title: form.title.value,
      storyKeywords: [
        form.storykeyword1.value,
        form.storykeyword2.value,
        form.storykeyword3.value,
        form.storykeyword4.value,
      ],
      StarterFullStories: [form.fullstory1.value, form.fullstory2.value],
      firstChoiceOptions: [
        form.choiceoption1.value,
        form.choiceoption2.value,
        form.choiceoption3.value,
        form.choiceoption4.value,
      ],
    };
    try {
      const response = await fetch("/api/createplotstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlotStory),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Success: Story created!");
        setFormData({
          _id: "",
          title: "",
          storyKeywords: [],
          StarterFullStories: [],
          firstChoiceOptions: [],
        });
        setIsCreatorFormFilled(false);
        fetchPlotStoryTitles();
      } else {
        setMessage(result.message || "Story creation failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Story Creating! (This is the handleSubmitPlotCreator function error message)"
      );
    }
  };

  const handlePlotStorySelectionToModify = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/selectedplotstorytomodify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });
      const data = await response.json();
      if (response.ok) {
        setUpdateFormData({
          _id: id,
          title: data.title,
          storyKeywords: data.storyKeywords,
          StarterFullStories: data.StarterFullStories,
          firstChoiceOptions: data.firstChoiceOptions,
        });
        setIsSelectedPlotStory(true);
      } else {
        setError("Failed to load plot story");
        setIsSelectedPlotStory(false);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching story details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlotStoryModification = async (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedPlotStory = {
      _id: updateFormData._id,
      title: form.title.value,
      storyKeywords: [
        form.storykeyword1.value,
        form.storykeyword2.value,
        form.storykeyword3.value,
        form.storykeyword4.value,
      ],
      StarterFullStories: [form.fullstory1.value, form.fullstory2.value],
      firstChoiceOptions: [
        form.choiceoption1.value,
        form.choiceoption2.value,
        form.choiceoption3.value,
        form.choiceoption4.value,
      ],
    };
    try {
      const response = await fetch("/api/updateselectedplotstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPlotStory),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Success: Story updated!");
        setUpdateFormData({
          _id: "",
          title: "",
          storyKeywords: [],
          StarterFullStories: [],
          firstChoiceOptions: [],
        });
        setIsSelectedPlotStory(false);
        fetchPlotStoryTitles();
      } else {
        setIsSelectedPlotStory(false);
        setMessage(result.message || "Story update failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Story Updating! (This is the handlePlotStoryModification function error message)"
      );
    }
  };

  const handleSelectedPlotStoryDelete = async (event) => {
    event.preventDefault();
    const _id = updateFormData._id;
    try {
      const response = await fetch("/api/deleteselectedplotstory", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: _id }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Success: Story deleted!");
        setUpdateFormData({
          _id: "",
          title: "",
          storyKeywords: [],
          StarterFullStories: [],
          firstChoiceOptions: [],
        });
        setIsSelectedPlotStory(false);
        fetchPlotStoryTitles();
      } else {
        setIsSelectedPlotStory(false);
        setMessage(result.message || "Story delete failed!");
      }
    } catch (error) {
      setMessage(
        "Error with Story Updating! (This is the handleSelectedPlotStoryDelete function error message)"
      );
    }
  };

  useEffect(() => {
    fetchPlotStoryTitles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <PageTitle title="Plot Settings Page" />
      {message && <p>{message}</p>}
      <div className="form-container">
        <div className="plotstorysettingsform">
          <h3 className="subtitle">Click on a story to modify/update it</h3>
          {plotStoryTitles.map((story) => (
            <button
              key={story._id}
              onClick={() => handlePlotStorySelectionToModify(story._id)}
            >
              {story.title}
            </button>
          ))}
          {isSelectedPlotStory && (
            <form onSubmit={handlePlotStoryModification}>
              <ul>
                <li>
                  <label htmlFor="title">Story title:</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title of the story"
                    value={updateFormData.title}
                    onChange={handleUpdateFormChange}
                    autoComplete="title"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <h3>Story keywords:</h3>
                  <label htmlFor="storykeyword1">1. Keyword:</label>
                  <input
                    type="text"
                    name="storykeyword1"
                    placeholder="1. Keyword"
                    value={updateFormData.storyKeywords[0]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "storyKeywords", 0)
                    }
                    autoComplete="storykeyword1"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="storykeyword2">2. Keyword:</label>
                  <input
                    type="text"
                    name="storykeyword2"
                    placeholder="2. Keyword"
                    value={updateFormData.storyKeywords[1]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "storyKeywords", 1)
                    }
                    autoComplete="storykeyword2"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="storykeyword3">3. Keyword:</label>
                  <input
                    type="text"
                    name="storykeyword3"
                    placeholder="3. Keyword"
                    value={updateFormData.storyKeywords[2]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "storyKeywords", 2)
                    }
                    autoComplete="storykeyword3"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="storykeyword4">4. Keyword:</label>
                  <input
                    type="text"
                    name="storykeyword4"
                    placeholder="4. Keyword"
                    value={updateFormData.storyKeywords[3]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "storyKeywords", 3)
                    }
                    autoComplete="storykeyword4"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <h3>Starter story:</h3>
                <li>
                  <label htmlFor="fullstory1">Starter story - 1. part</label>
                  <textarea
                    name="fullstory1"
                    placeholder="Starter story - 1. part"
                    value={updateFormData.StarterFullStories[0]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "StarterFullStories", 0)
                    }
                    autoComplete="fullstory1"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="fullstory2">Starter story - 2. part</label>
                  <textarea
                    name="fullstory2"
                    placeholder="Starter story - 2. part"
                    value={updateFormData.StarterFullStories[1]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "StarterFullStories", 1)
                    }
                    autoComplete="fullstory2"
                    disabled={!isSelectedPlotStory}
                  />
                </li>

                <h3>Choice options for the opening scene:</h3>
                <li>
                  <label htmlFor="choiceoption1">Choice option 1.</label>
                  <input
                    type="text"
                    name="choiceoption1"
                    placeholder="Choice option 1."
                    value={updateFormData.firstChoiceOptions[0]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "firstChoiceOptions", 0)
                    }
                    autoComplete="choiceoption1"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="choiceoption2">Choice option 2.</label>
                  <input
                    type="text"
                    name="choiceoption2"
                    placeholder="Choice option 2."
                    value={updateFormData.firstChoiceOptions[1]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "firstChoiceOptions", 1)
                    }
                    autoComplete="choiceoption2"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="choiceoption3">Choice option 3.</label>
                  <input
                    type="text"
                    name="choiceoption3"
                    placeholder="Choice option 3."
                    value={updateFormData.firstChoiceOptions[2]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "firstChoiceOptions", 2)
                    }
                    autoComplete="choiceoption3"
                    disabled={!isSelectedPlotStory}
                  />
                </li>
                <li>
                  <label htmlFor="choiceoption4">Choice option 4.</label>
                  <input
                    type="text"
                    name="choiceoption4"
                    placeholder="Choice option 4."
                    value={updateFormData.firstChoiceOptions[3]}
                    onChange={(e) =>
                      handleUpdateFormArrayChange(e, "firstChoiceOptions", 3)
                    }
                    autoComplete="choiceoption4"
                    disabled={!isSelectedPlotStory}
                  />
                </li>

                <button type="submit">Modify this story</button>

                <div>
                  <button type="button" onClick={handleClearUpdateFormData}>
                    Clear update form
                  </button>
                  <button type="button" onClick={handleSelectedPlotStoryDelete}>
                    Delete this plot story
                  </button>
                </div>
              </ul>
            </form>
          )}
        </div>

        <div className="plotstorycreatingform">
          <h3 className="subtitle">Fill the form to create a new plot story</h3>

          <form onSubmit={handleSubmitPlotCreator}>
            <ul>
              <li>
                <label htmlFor="title">Story title:</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title of the story"
                  value={formData.title}
                  onChange={handleChange}
                  autoComplete="title"
                />
              </li>
              <li>
                <h3>Story keywords:</h3>
                <label htmlFor="storykeyword1">1. Keyword:</label>
                <input
                  type="text"
                  name="storykeyword1"
                  placeholder="1. Keyword"
                  value={formData.storyKeywords[0]}
                  onChange={(e) => handleFormArrayChange("storyKeywords", 0, e)}
                  autoComplete="storykeyword1"
                />
              </li>
              <li>
                <label htmlFor="storykeyword2">2. Keyword:</label>
                <input
                  type="text"
                  name="storykeyword2"
                  placeholder="2. Keyword"
                  value={formData.storyKeywords[1]}
                  onChange={(e) => handleFormArrayChange("storyKeywords", 1, e)}
                  autoComplete="storykeyword2"
                />
              </li>
              <li>
                <label htmlFor="storykeyword3">3. Keyword:</label>
                <input
                  type="text"
                  name="storykeyword3"
                  placeholder="3. Keyword"
                  value={formData.storyKeywords[2]}
                  onChange={(e) => handleFormArrayChange("storyKeywords", 2, e)}
                  autoComplete="storykeyword3"
                />
              </li>
              <li>
                <label htmlFor="storykeyword4">4. Keyword:</label>
                <input
                  type="text"
                  name="storykeyword4"
                  placeholder="4. Keyword"
                  value={formData.storyKeywords[3]}
                  onChange={(e) => handleFormArrayChange("storyKeywords", 3, e)}
                  autoComplete="storykeyword4"
                />
              </li>
              <li>
                <label htmlFor="fullstory1">Starter story - 1. part</label>
                <textarea
                  name="fullstory1"
                  placeholder="Starter story - 1. part"
                  value={formData.StarterFullStories[0]}
                  onChange={(e) =>
                    handleFormArrayChange("StarterFullStories", 0, e)
                  }
                  autoComplete="fullstory1"
                />
              </li>
              <li>
                <label htmlFor="fullstory2">Starter story - 2. part</label>
                <textarea
                  name="fullstory2"
                  placeholder="Starter story - 2. part"
                  value={formData.StarterFullStories[1]}
                  onChange={(e) =>
                    handleFormArrayChange("StarterFullStories", 1, e)
                  }
                  autoComplete="fullstory2"
                />
              </li>
              <li>
                <h3>First choice options:</h3>
                <label htmlFor="choiceoption1">Choice option 1.</label>
                <input
                  type="text"
                  name="choiceoption1"
                  placeholder="Choice option 1."
                  value={formData.firstChoiceOptions[0]}
                  onChange={(e) =>
                    handleFormArrayChange("firstChoiceOptions", 0, e)
                  }
                  autoComplete="choiceoption1"
                />
              </li>
              <li>
                <label htmlFor="choiceoption2">Choice option 2.</label>
                <input
                  type="text"
                  name="choiceoption2"
                  placeholder="Choice option 2."
                  value={formData.firstChoiceOptions[1]}
                  onChange={(e) =>
                    handleFormArrayChange("firstChoiceOptions", 1, e)
                  }
                  autoComplete="choiceoption2"
                />
              </li>
              <li>
                <label htmlFor="choiceoption3">Choice option 3.</label>
                <input
                  type="text"
                  name="choiceoption3"
                  placeholder="Choice option 3."
                  value={formData.firstChoiceOptions[2]}
                  onChange={(e) =>
                    handleFormArrayChange("firstChoiceOptions", 2, e)
                  }
                  autoComplete="choiceoption3"
                />
              </li>
              <li>
                <label htmlFor="choiceoption4">Choice option 4.</label>
                <input
                  type="text"
                  name="choiceoption4"
                  placeholder="Choice option 4."
                  value={formData.firstChoiceOptions[3]}
                  onChange={(e) =>
                    handleFormArrayChange("firstChoiceOptions", 3, e)
                  }
                  autoComplete="choiceoption4"
                />
              </li>
              <button type="submit">Create story</button>
              {isCreatorFormFilled && (
                <button type="button" onClick={handleClearFormData}>
                  Cancel
                </button>
              )}
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlotSettingsPage;
