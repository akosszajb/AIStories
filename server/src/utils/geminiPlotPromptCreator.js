// GEMINI PLOT prompt generator

const geminiPlotPromptGenerator = (plotCharacter, userinput) => {
  const plotStory = plotCharacter.fullStories.join(" ");
  let keywords = plotCharacter.charStoryKeywords.join(", ");
  const plotPrompt = {
    intro: "I created a text-adventure game with the starter story.",
    starterStory: plotStory,
    keywords:
      "And these are some keywords to help you to create the next part of the story" +
      keywords,
    playerAction:
      "After this scene the player give you this action with his/her character: " +
      userinput,
    instructions:
      "Continue the story based on the provided details. " +
      "Consider the character's past choices, personality, and previous actions. " +
      "Return the response in the following structured JSON format: " +
      `{
        "generatedPlotStory": "The continuation of the story goes here. (min 15 max 23 words), each option max 10 words",
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "options": [
          "Option 1 text",
          "Option 2 text",
          "Option 3 text",
          "Option 4 text"
        ]
      }`,
  };

  return JSON.stringify(plotPrompt);
};

export default geminiPlotPromptGenerator;
