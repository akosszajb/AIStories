import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
import { userProfilePictureCreator } from "../utils/imageCreator.js";
import PlotCharacterModel from "../models/plotCharacter.model.js";
import { defaultPlotCharacters } from "../models/exampleData/defaultPlotCharacters.js";

dotenv.config({ path: "../.env" });

const { JWTKEY } = process.env;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ message: "All fields are required! - username is missing" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "All fields are required! - email is missing" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "All fields are required! - password is missing" });
    }
    if (username.length < 1 || username.length > 15) {
      return res.status(400).json({
        message: "registerUser: username length must be between 1 and 15.",
      });
    }
    if (password.length < 1 || password.length > 15) {
      return res.status(400).json({
        message: "registerUser: password length must be between 1 and 15.",
      });
    }
    if (email.length < 1 || email.length > 100) {
      return res.status(400).json({
        message: "registerUser: email length must be between 1 and 100.",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "This email address is already associated with another user!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdPlotCharacters = await PlotCharacterModel.insertMany(
      defaultPlotCharacters.map((character) => ({
        ...character,
      }))
    );

    const plotCharacterIds = createdPlotCharacters.map((char) => char._id);

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
      plotCharacter: plotCharacterIds,
    };

    const saved = await UserModel.create(newUser);
    // console.log("Saved user:", saved.username);

    return res.status(201).json({
      status: "success",
      message: `Registration of ${username} is successful!`,
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists!",
      });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required!" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required!" });
  }

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "Username is not found!" });
  }

  const isPswMatch = await bcrypt.compare(password, user.password);

  if (!isPswMatch) {
    return res.status(400).json({ message: "Password is incorrect." });
  }

  try {
    const token = jwt.sign(
      { userid: user._id, username: user.username },
      JWTKEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token: token,
      status: "success",
      message: `Login with ${username} username was successful!`,
    });
  } catch (error) {
    console.error("Error with login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required to delete a user!" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "This user is not registered!",
      });
    }
    const isPswMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPswMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    } else {
      const deleted = await UserModel.findOneAndDelete({ email });
      // console.log("Deleted user:", deleted.username);

      return res.status(200).json({
        status: "success",
        message: `${username} - user is deleted!`,
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserData = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      username: user.username,
      email: user.email,
      currentProfilePicture: user.currentProfilePicture,
      created: user.created,
    });
  } catch (error) {
    console.error("Error with user GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserProfilePictures = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user.profilepictureURL);
  } catch (error) {
    console.error("Error with getUserProfilePictures GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const newUserProfilePictureGenerator = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const newUrl = userProfilePictureCreator(prompt);
    // console.log(newUrl);
    user.profilepictureURL.push(newUrl);
    await user.save();
    return res.status(200).json(user.profilepictureURL);
  } catch (error) {
    console.error(
      "Error with newUserProfilePictureGenerator POST endpoint:",
      error
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { username, email, password } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ message: "All fields are required! - username is missing" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "All fields are required! - email is missing" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "All fields are required! - password is missing" });
    }
    if (username.length < 1 || username.length > 15) {
      return res.status(400).json({
        message: "updateUser: username length must be between 1 and 15.",
      });
    }
    if (password.length < 1 || password.length > 15) {
      return res.status(400).json({
        message: "updateUser: password length must be between 1 and 15.",
      });
    }
    if (email.length < 1 || email.length > 100) {
      return res.status(400).json({
        message: "updateUser: email length must be between 1 and 100.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        username: username,
        email: email,
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error with newUserProfilePictureGenerator POST endpoint:",
      error
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserCurrentProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user.currentProfilePicture);
  } catch (error) {
    console.error("Error with getUserCurrentProfilePicture function:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCurrentProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;

    const { currentProfilePicture } = req.body;

    if (!currentProfilePicture) {
      return res.status(400).json({
        message: "currentProfilePicture required to update a profile picture!",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        currentProfilePicture: currentProfilePicture,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error with updateCurrentProfilePicture function:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteSelectedProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.profilepictureURL.length === 0) {
      return res
        .status(200)
        .json({ message: "This user does not have profile picture!" });
    }

    const { profilePictureToDelete } = req.body;
    if (!profilePictureToDelete) {
      return res.status(400).json({
        message: "profilePictureToDelete required to delete a picture!",
      });
    }

    const newURLs = user.profilepictureURL.filter(
      (element) => element !== profilePictureToDelete
    );

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          profilepictureURL: newURLs,
          currentProfilePicture:
            user.currentProfilePicture === profilePictureToDelete
              ? null
              : user.currentProfilePicture,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(500)
          .json({ message: "Failed to update the user profile." });
      }

      return res.status(200).json(updatedUser);
    } catch (updateError) {
      console.error("Error updating the user profile:", updateError);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(
      "Error deleting profile picture (deleteSelectedProfilePicture):",
      error
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
