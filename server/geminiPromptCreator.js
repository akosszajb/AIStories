// GEMINI prompt generator

const geminiPromptGenerator = (character, userinput) => {
  const story = character.fullStories.join(" ");
  let keywords = character.storykeywords.join(", ");
  const prompt = {
    intro:
      "This is just a starter prompt, I am learning the communication with you. I created a text-adventure game with the starter story.",
    starterStory: story,
    keywords:
      "And these are some keywords to help you to create the next part of the story" +
      keywords,
    playerAction:
      "After this scene the player give you this action with his/her character: " +
      userinput,
    instructions:
      "Continue the story based on the provided details. " +
      "Return the response in the following structured JSON format: " +
      `{
        "generatedStory": "The continuation of the story goes here. (max 40 words)",
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "options": [
          "Option 1 text",
          "Option 2 text",
          "Option 3 text",
          "Option 4 text"
        ]
      }`,
  };

  return JSON.stringify(prompt);
};

export default geminiPromptGenerator;
