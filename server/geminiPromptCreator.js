// GEMINI prompt generator

const geminiPromptGenerator = (character, userinput) => {
  let story = "";
  character.fullStories.forEach((element) => {
    story += element;
  });
  let headlines = character.storyheadlines.join();
  const prompt =
    "This is just a starter prompt, I am learning the communication with you. I created a text-adventure game with the starter story: " +
    story +
    "And these are some headlines to help you to create the next part of the story" +
    headlines +
    "After this scene the player give you this action with his/her character: " +
    userinput +
    "Can you give short answer, continue this story? (max 40 words). And the end of your answer give me 4 options to continue the story (these will be the title of the buttons on my website for the user." +
    "PLEASE FOLLOW STRICTLY IN THIS FORMAT (with the yyy and xxxx marks): generated story comes here yyy three keywords about the generated text xxxx option1 : option1, option2 : option2, option3 : option3, option4 : option4  ";

  return prompt;
};

export default geminiPromptGenerator;

// The sheer drop reveals a narrow ledge.  A skeletal hand, clutching a tarnished silver locket, protrudes from the chasm wall.
// new story xxxx option1 : Investigate the Locket, option2 : Climb the Rickety Ladder, option3 : Return to the Chest, option4 : Examine the Blue Light
