import UserModel from "../models/user.model.js";
import PlotCharacterModel from "../models/plotCharacter.model.js";
import PlotStoryModel from "../models/plotStory.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AIImageCreator from "../utils/imageCreator.js";
import geminiPlotPromptGenerator from "../utils/geminiPlotPromptCreator.js";
import pkg from "gridfs-stream";

const { GEMINIKEY } = process.env;

const genAI = new GoogleGenerativeAI(GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getPlotStoryList = async (req, res) => {
  try {
    const plotStories = await PlotStoryModel.find({}, "name _id");
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

    const aiPicureUrl = AIImageCreator(plotCharacter);
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
