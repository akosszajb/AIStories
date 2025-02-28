import GameClassModel from "../models/gameClass.model.js";

export const getAllGameClasses = async (req, res) => {
  try {
    const gameClasses = await GameClassModel.find().sort({ created: "desc" });
    return res.status(200).json(gameClasses);
  } catch (error) {
    console.error("Error with class GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createGameClass = async (req, res) => {
  const newGameClass = req.body;
  try {
    const saved = await GameClassModel.create(newGameClass);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating new class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateGameClass = async (req, res) => {
  const id = req.params.id;
  try {
    const { gameclassname, attackType, attack, defense, created } = req.body;
    if (!gameclassname && !attackType && !attack && !defense) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update!" });
    }
    const updatedGameClass = await GameClassModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          gameclassname: gameclassname,
          attackType: attackType,
          attack: attack,
          defense: defense,
          created: created,
        },
      },
      { new: true }
    );
    return res.status(200).json(updatedGameClass);
  } catch (error) {
    console.error(`Error with /api/class/${id} PATCH endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGameClass = async (req, res) => {
  try {
    const id = req.params.id;

    const gameClass = await GameClassModel.findById(id);
    if (!gameClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const deleted = await GameClassModel.deleteOne({ _id: id });
    return res.status(410).json(deleted);
  } catch (error) {
    console.error(`Error with /api/class/${id} DELETE endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
