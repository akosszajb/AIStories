import PlotCharacterModel from "../models/plotCharacter.model.js";
import UserModel from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  generatedStoryPictureList,
  welcomeTextCreator,
  generatedStoryTextCreator,
} from "../utils/emailTextCreator.js";

dotenv.config({ path: "../.env" });

const { EMAIL, EMAILPSW } = process.env;

if (!EMAIL) {
  console.error(
    "plotCharacterController.js: Missing EMAIL environment varible!"
  );
  process.exit(1);
}

if (!EMAILPSW) {
  console.error("Missing EMAILPSW (password) environment varible!");
  process.exit(1);
}

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
    return res.status(400).json({ message: "Invalid input data" });
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
      return res.status(404).json({ message: "Plot character not found" });
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

    const deleted = await PlotCharacterModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Plot character is not found!" });
    }
    return res.status(410).json(deleted);
  } catch (error) {
    console.error(`Error with /api/plotcharacter/:id DELETE endpoint:`, error);
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
    selectedUserOptions,
  } = req.body;
  if (
    !plotcharactername ||
    !selectedUserOptions ||
    !fullStories ||
    !personality ||
    !aiPictureUrls ||
    !Array.isArray(charStoryKeywords) ||
    !Array.isArray(pictureKeywords)
  ) {
    return res.status(400).json({ message: "Invalid input data" });
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
          selectedUserOptions,
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAILPSW,
  },
});

export const sendPlotCharacterStoryViaEmail = async (req, res) => {
  const characterId = req.params.id;

  const userId = req.userId;
  const user = await UserModel.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ message: "sendPlotCharacterStoryViaEmail: User not found." });
  }

  const plotCharacter = await PlotCharacterModel.findById(characterId);
  if (!plotCharacter) {
    return res.status(404).json({
      message: "sendPlotCharacterStoryViaEmail: Character not found.",
    });
  }

  const mailOptions = {
    from: EMAIL,
    to: user.email,
    subject: "Generated story by AI Stories",
    html: `
      <html>
        <head>
          <style>
            :root {
              --bg-primary: #333;
              --bg-secondary: #1e1e1e;
              --accent-color: #bb86fc;
              --accent-hover: #9a6ed8;
              --text-color: #e0e0e0;
              --link-color: #03dac6;
              --link-hover: #02c5b3;
            }
  
            body {
              margin: 0;
              font-family: 'Roboto Mono', monospace;
              background-color: var(--bg-primary);
              color: var(--text-color);
              padding: 20px;
             text-align:justify;
            }

            p {
            
              margin: 0;
              font-family: 'Roboto Mono', monospace;
              background-color: var(--bg-primary);
              color: var(--text-color);
              padding: 20px;
             text-align:justify;
            }
  
            a {
              color: var(--link-color);
              text-decoration: none;
              transition: color 0.3s ease;
            }
  
            a:hover {
              color: var(--link-hover);
            }
  
            h1 {
              font-family: 'Orbitron', sans-serif;
              color: chartreuse;
              text-align: center;
            }

            h2 {
            font-family: 'Orbitron', sans-serif;
            color: chartreuse;
            text-align: left;
            }

              h3 {
            font-family: 'Orbitron', sans-serif;
            color: #e0e0e0;
            text-align: left;
            }

              h4 {
            font-family: 'Orbitron', sans-serif;
            color: #e0e0e0;
            text-align: left;
            }
  
            .story-content {
              background-color: #2d2d2d;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              color: chartreuse;
            }
          </style>
        </head>
        <body>
          <h1>Your AI Story</h1>
          <div class="informations">
          <p> ${welcomeTextCreator(user)}</p>
          </div>
          <div class="story-content">
            ${generatedStoryTextCreator(plotCharacter)}
          </div>
          <div class="picture-list">
          <p> Here are some images generated by AI related to the story:
          <ul>
           ${generatedStoryPictureList(plotCharacter)}
          </ul>
          </div>
          <div>
          <p>
          We hope you enjoyed your story! Don't hesitate to choose another character again and explore new possibilities in the story!"
          If you have any questions, feel free to contact us.
          </p>
          <p>The AI Stories Team</p>
          </div>
          <br/>
        </body>
      </html>
    `,
  };

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(`Error with the sendPlotCharacterStoryViaEmail:`, error);
    return res
      .status(500)
      .json({ error: "sendPlotCharacterStoryViaEmail: Internal server error" });
  }
};
