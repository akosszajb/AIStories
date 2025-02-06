import React, { useEffect, useState } from "react";
import PageTitle from "../../Common/PageTitle/PageTitle";
import "../../../globals.css";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedAIpictureURL, setGeneratedPictureUrl] = useState("");
  const [newlyGeneratedPictureUrl, setNewlyGeneratedPictureUrl] = useState("");
  const [
    newlyGeneratedProfilePictureIndex,
    setNewlyGeneratedProfilePictureIndex,
  ] = useState(0);
  const [currentPictureUrl, setCurrentPictureUrl] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [
    isProfilePicutureSelectorVisible,
    setIsProfilePicutureSelectorVisible,
  ] = useState(false);

  const [keyword1, setKeyword1] = useState("");
  const [keyword2, setKeyword2] = useState("");
  const [keyword3, setKeyword3] = useState("");
  const [keyword4, setKeyword4] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [currentProfilePictureIndex, setCurrentProfilePictureIndex] =
    useState(0);
  const [selectionProfilePictureIndex, setSelectionProfilePictureIndex] =
    useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
    fetchUserCurrentProfilePicture();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/userdata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
      setUsernameInput(data.username);
      setEmailInput(data.email);
      setGeneratedPictureUrl(data.currentProfilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message || "An error occurred while fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCurrentProfilePicture = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/usercurrentprofilepicture", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCurrentPictureUrl(data);
    } catch (error) {
      console.error("Error with  fetchUserCurrentProfilePicture:", error);
      setError(
        error.message ||
          "An error occurred while fetching user profile picture urls."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNextProfilePictures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/userprofilepictures", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newIndex = data.length - 1;
      setSelectionProfilePictureIndex(newIndex);
      setGeneratedPictureUrl(data[newIndex]);
    } catch (error) {
      console.error("Error with  fetchUserNextProfilePictures:", error);
      setError(
        error.message ||
          "An error occurred while fetching user profile picture urls."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAIProfilePictureGeneration = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const prompt = [keyword1, keyword2, keyword3, keyword4];

    try {
      const response = await fetch("/api/generatenewuserprofilepicture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newIndex = data.length - 1;
      setNewlyGeneratedProfilePictureIndex(newIndex);
      setNewlyGeneratedPictureUrl(data[newIndex]);
    } catch (error) {
      console.error("Error with handleAIProfilePictureGeneration:", error);
      setError(
        error.message ||
          "An error occurred while fetching user profile picture urls."
      );
    } finally {
      setLoading(false);
      setKeyword1("");
      setKeyword2("");
      setKeyword3("");
      setKeyword4("");
    }
  };

  const loadNextUserProfilePicture = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/userprofilepictures", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const nextIndex = (currentProfilePictureIndex + 1) % data.length;
      setCurrentProfilePictureIndex(nextIndex);
      setGeneratedPictureUrl(data[nextIndex]);
    } catch (error) {
      console.error("Error with  loadNextUserProfilePicture:", error);
      setError(
        error.message ||
          "An error occurred while fetching user profile picture urls."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/updateuserdata", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 200) {
        alert("Login successful!");
        setUserData({
          ...userData,
          username: usernameInput,
          email: emailInput,
        });
        setIsFormVisible(false);
        return;
      }
      setUserData(updatedUserData);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message || "An error occurred while updating user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdateClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleProfilePicutureSelectorClick = () => {
    setIsProfilePicutureSelectorVisible(!isProfilePicutureSelectorVisible);
  };

  const cancelPictureToCurrentProfilePicture = () => {
    setIsProfilePicutureSelectorVisible(false);
  };

  const cancelUserDataUpdate = () => {
    setIsFormVisible(false);
  };

  const savePictureToCurrentProfilePicture = async () => {
    setLoading(true);
    setError(null);
    console.log(generatedAIpictureURL);
    try {
      const response = await fetch("/api/updatecurrentprofilepicture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentProfilePicture: generatedAIpictureURL }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (response.status === 200) {
        alert("Profile picture saved successful!");
        setCurrentPictureUrl(data.currentProfilePicture);
        setIsProfilePicutureSelectorVisible(false);
        return;
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message || "An error occurred while updating user data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div>
        <PageTitle title="User Profile Page" />
      </div>

      <div className="profilepicture-container">
        <h3>Current profile picture:</h3>
        <div className="profilepicture">
          <div className="currentprofilepicture">
            <img
              src={currentPictureUrl}
              alt="Current AI Generated Profile Picture"
              width="150"
              height="150"
            />
          </div>
          <div>
            <h3>
              Or you can choose new profile picture from your existing images:
            </h3>
            <div>
              <button onClick={handleProfilePicutureSelectorClick}>
                Click here
              </button>
            </div>
            {isProfilePicutureSelectorVisible && (
              <div>
                <img
                  src={generatedAIpictureURL}
                  alt="AI Generated Profile Picture"
                  width="150"
                  height="150"
                />
                <div>
                  <button onClick={loadNextUserProfilePicture}>
                    Next picture
                  </button>
                  <button onClick={savePictureToCurrentProfilePicture}>
                    Save
                  </button>
                  <button onClick={cancelPictureToCurrentProfilePicture}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2>User Info:</h2>
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(userData.created).toISOString().split("T")[0]}
        </p>
        <button onClick={handleProfileUpdateClick}>
          CLick here to update your profile
        </button>
        {isFormVisible && (
          <form onSubmit={handleProfileUpdate}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">Save Changes</button>
            </div>
            <div>
              <button onClick={cancelUserDataUpdate}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      <div className="aipicturegenerator">
        <h3>Or fill the form to generate unique AI profile picture</h3>

        <div>
          {newlyGeneratedPictureUrl ? (
            <img
              src={newlyGeneratedPictureUrl}
              alt="AI Newly Generated Profile Picture"
              width="150"
              height="150"
            />
          ) : (
            <div></div>
          )}
        </div>
        <form onSubmit={handleAIProfilePictureGeneration}>
          <ul>
            <li>
              <input
                type="text"
                name="keyword1"
                value={keyword1}
                placeholder="1. Keyword for generation"
                onChange={(e) => setKeyword1(e.target.value)}
                autoComplete="keyword1"
              />
            </li>
            <li>
              <input
                type="text"
                name="keyword2"
                value={keyword2}
                placeholder="2. Keyword for generation"
                onChange={(e) => setKeyword2(e.target.value)}
                autoComplete="keyword2"
              />
            </li>
            <li>
              <input
                type="text"
                name="keyword3"
                value={keyword3}
                placeholder="3. Keyword for generation"
                onChange={(e) => setKeyword3(e.target.value)}
                autoComplete="keyword3"
              />
            </li>
            <li>
              <input
                type="text"
                name="keyword3"
                value={keyword4}
                placeholder="4. Keyword for generation"
                onChange={(e) => setKeyword4(e.target.value)}
                autoComplete="keyword3"
              />
            </li>
            <button type="submit">Generate</button>
          </ul>
        </form>
      </div>
    </div>
  );
};
export default UserProfilePage;
