import PlotCharacterModel from "../models/plotCharacter.model.js";
import UserModel from "../models/user.model.js";

export const createPlotCharacter = async (req, res) => {
  const newPlotCharacter = req.body;
  try {
    const saved = await PlotCharacterModel.create(newPlotCharacter);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating new character:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePlotCharacter = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedPlotCharacter = await PlotCharacterModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(204).json(updatedPlotCharacter);
  } catch (error) {
    console.error(`Error with /api/plotcharacter/${id} PATCH endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePlotCharacter = async (req, res) => {
  try {
    const deleted = await PlotCharacterModel.deleteOne({ _id: req.params.id });
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
  const userId = req.userId;

  try {
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
