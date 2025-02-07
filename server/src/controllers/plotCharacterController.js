import PlotCharacterModel from "../models/plotCharacter.model.js";
import UserModel from "../models/user.model.js";

export const createPlotCharacter = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "createPlotCharacter: User not found." });
    }
    const newPlotCharacter = req.body;

    const saved = await PlotCharacterModel.create(newPlotCharacter);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { plotCharacter: saved._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Plot character not found" });
    }
    updatedUser.save();

    return res.status(201).json(updatedUser);
  } catch (error) {
    console.error("Error creating new character:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePlotCharacter = async (req, res) => {
  const id = req.params.id;
  const { plotcharactername, charStoryKeywords, personality, pictureKeywords } =
    req.body;
  if (
    !plotcharactername ||
    !personality ||
    !Array.isArray(charStoryKeywords) ||
    !Array.isArray(pictureKeywords)
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const updatedPlotCharacter = await PlotCharacterModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          plotcharactername,
          personality,
          charStoryKeywords,
          pictureKeywords,
        },
      },
      { new: true }
    );

    if (!updatedPlotCharacter) {
      return res.status(404).json({ error: "Plot character not found" });
    }

    return res.status(200).json(updatedPlotCharacter);
  } catch (error) {
    console.error(`Error with /api/plotcharacter/${id} POST endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePlotCharacter = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PlotCharacterModel.deleteOne(id);
    return res.status(410).json(deleted);
  } catch (error) {
    console.error(
      `Error with /api/plotcharacter/${id} DELETE endpoint:`,
      error
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAllPlotCharacters = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const plotCharacters = await PlotCharacterModel.find({
      _id: { $in: user.plotCharacter },
    });
    return res.status(200).json(plotCharacters);
  } catch (error) {
    console.error("Error with character GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPlotCharacter = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const id = req.params.id;
    const plotCharacter = await PlotCharacterModel.findById(id);
    if (!plotCharacter) {
      return res.status(404).json({ message: "plotCharacter not found." });
    }
    return res.status(200).json(plotCharacter);
  } catch (error) {
    console.error("Error with character GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const rebootPlotCharacter = async (req, res) => {
  const id = req.params.id;
  const {
    plotcharactername,
    charStoryKeywords,
    personality,
    pictureKeywords,
    aiPictureUrls,
    fullStories,
  } = req.body;
  if (
    !plotcharactername ||
    !fullStories ||
    !personality ||
    !aiPictureUrls ||
    !Array.isArray(charStoryKeywords) ||
    !Array.isArray(pictureKeywords)
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const rebootedPlotCharacter = await PlotCharacterModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          plotcharactername,
          personality,
          charStoryKeywords,
          pictureKeywords,
          aiPictureUrls,
          fullStories,
        },
      },
      { new: true }
    );

    if (!rebootedPlotCharacter) {
      return res.status(404).json({ error: "Plot character not found" });
    }

    return res.status(200).json(rebootedPlotCharacter);
  } catch (error) {
    console.error(
      `Error with /api/rebootcharacter/${id} POST endpoint:`,
      error
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};
