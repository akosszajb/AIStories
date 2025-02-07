import UserModel from "../models/user.model.js";
import PlotCharacterModel from "../models/plotCharacter.model.js";
import PlotStoryModel from "../models/plotStory.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { imageCreator } from "../utils/imageCreator.js";
import geminiPlotPromptGenerator from "../utils/geminiPlotPromptCreator.js";
import pkg from "gridfs-stream";

const { GEMINIKEY } = process.env;

const genAI = new GoogleGenerativeAI(GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getPlotStoryList = async (req, res) => {
  try {
    const plotStories = await PlotStoryModel.find({}, "title _id");
    res.status(200).json(plotStories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSelectedPlotStory = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const { plotCharacterID, selectedPlotStoryID } = req.body;
    if (!selectedPlotStoryID) {
      return res.status(400).json({ message: "Plot Story ID is required" });
    }
    const plotStory = await PlotStoryModel.findById(selectedPlotStoryID);
    if (!plotStory) {
      return res.status(404).json({ message: "Plot story not found" });
    }
    const plotStories = plotStory.StarterFullStories.join("");
    const plotCharacter = await PlotCharacterModel.findById(plotCharacterID);

    plotCharacter.fullStories.push(plotStories);

    await plotCharacter.save();

    res.status(200).json({
      plotstories: plotStories,
      buttonText1: plotStory.firstChoiceOptions[0],
      buttonText2: plotStory.firstChoiceOptions[1],
      buttonText3: plotStory.firstChoiceOptions[2],
      buttonText4: plotStory.firstChoiceOptions[3],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const generatePlotStoryAndPicture = async (req, res) => {
  const userId = req.userId;
  const { plotCharacterID, input } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }
    if (!input) {
      return res.status(400).json({ message: "Prompt is missing." });
    }
    const user = await UserModel.findById(userId);
    const plotCharacter = await PlotCharacterModel.findById(plotCharacterID);
    const result = await model.generateContent(
      geminiPlotPromptGenerator(plotCharacter, input)
    );

    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    const generatedText = JSON.parse(cleanedText);
    if (!generatedText) {
      throw new Error("AI did not return any response.");
    }

    plotCharacter.fullStories.push(generatedText.generatedPlotStory);
    plotCharacter.pictureKeywords.push([generatedText.keywords, input]);

    const aiPicureUrl = imageCreator(plotCharacter);
    plotCharacter.aiPictureUrls.push(aiPicureUrl);
    await plotCharacter.save();

    res.status(200).json({
      text: generatedText.generatedPlotStory,
      generatedPicture: aiPicureUrl,
      buttonText1: generatedText.options[0],
      buttonText2: generatedText.options[1],
      buttonText3: generatedText.options[2],
      buttonText4: generatedText.options[3],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPlotStoryTitles = async (req, res) => {
  try {
    const plotStories = await PlotStoryModel.find();
    const titles = [];
    plotStories.forEach((story) =>
      titles.push({ _id: story._id, title: story.title })
    );
    res.status(200).json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const createPlotStory = async (req, res) => {
  try {
    const { title, storyKeywords, StarterFullStories, firstChoiceOptions } =
      req.body;
    if (
      !title ||
      !storyKeywords ||
      !StarterFullStories ||
      !firstChoiceOptions
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newPlotStory = {
      title: title,
      storyKeywords: storyKeywords,
      StarterFullStories: StarterFullStories,
      firstChoiceOptions: firstChoiceOptions,
    };

    const saved = await PlotStoryModel.create(newPlotStory);
    console.log("Saved new plot story:", saved.title);

    return res.status(201).json({
      status: "success",
      message: `${title} plot story is created!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSelectedPlotStoryToModify = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Plot Story _id is required (getSelectedPlotStoryToModify)",
      });
    }
    const plotStory = await PlotStoryModel.findById(_id);
    if (!plotStory) {
      return res.status(404).json({ message: "Plot story not found" });
    }
    res.status(200).json(plotStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updatePlotStory = async (req, res) => {
  try {
    const {
      _id,
      title,
      storyKeywords,
      StarterFullStories,
      firstChoiceOptions,
    } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Plot Story _id is required (updatePlotStory)" });
    }
    if (!title) {
      return res.status(400).json({ message: "Plot Story title is required" });
    }
    if (!storyKeywords) {
      return res
        .status(400)
        .json({ message: "Plot Story storyKeywords are required" });
    }
    if (!StarterFullStories) {
      return res
        .status(400)
        .json({ message: "Plot Story StarterFullStories are required" });
    }
    if (!firstChoiceOptions) {
      return res
        .status(400)
        .json({ message: "Plot Story firstChoiceOptions are required" });
    }

    const updateData = {
      title,
      storyKeywords,
      StarterFullStories,
      firstChoiceOptions,
    };

    const plotStory = await PlotStoryModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(plotStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deletePlotStory = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Plot Story _id is required (deletePlotStory)" });
    }
    const deleted = await PlotStoryModel.findByIdAndDelete(_id);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
