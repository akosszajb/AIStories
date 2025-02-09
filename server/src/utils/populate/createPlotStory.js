import PlotStoryModel from "../../models/plotStory.model.js";

export const createPlotStoryMedieval = async () => {
  await PlotStoryModel.deleteMany({});
  const plotStory = {
    title: "1. The Floating Tower",
    storyKeywords: [
      "text adventure",
      "The Floating Tower",
      "Forgotten Realms",
      "DandD",
      "Dungeon and Dragons",
      "Baldur's Gate",
      "Tower of Ondil",
    ],
    StarterFullStories: [
      `Embark on an epic adventure in The Floating Tower—a tale of mystery, danger, and boundless imagination. Will you master the arcane arts as a wizard, strike from the shadows as a rogue, or wield unyielding strength as a fearless fighter?  You are a newly appointed member in the "The Blades". With the power of GEMINI and POLLINATION AI, you can craft a story uniquely your own. Every choice you make shapes the journey ahead—step into a world where your imagination knows no limits!`,
      `It was a cold, clear day still early in Marpenoth, in the Year of Many Brews.
      All around, the trees' leaves had already been touched by golden and fiery-orange hues when the Brave Blades arrived at the place they had sought for so long.
      Their goal loomed dark and silent above them: the Floating Tower, the lifeless fortress of the long-dead Ondil, hidden deep within a chasm somewhere west of the Horn Hills.`,
    ],
    firstChoiceOptions: [
      "Teleport to the tower",
      "Sing a song with the Blades",
      "Drink a big glass of beer",
      "Build a campfire",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Medieval created!");
};

export const createPlotStoryScifi = async () => {
  const plotStory = {
    title: "2. Galaxy Quest",
    storyKeywords: [
      "Galaxy Quest",
      "sci-fi",
      "space",
      "Black Hole",
      "Interstellar Travel",
      "Mars Colony",
      "Alien Life",
    ],
    StarterFullStories: [
      "Your ship drifts through space when suddenly, the engines fail. A loud bang echoes from the engine room, and alarms start blaring. The AI, Iris, warns that the propulsion system is critically damaged and the energy core is unstable.",
      "With no communication to command, you must act fast to either repair the engine or find a nearby station for help.",
    ],
    firstChoiceOptions: [
      "Attempt to repair the engine using emergency tools.",
      "Search for a nearby space station to get help.",
      "Try to stabilize the ship's energy core manually.",
      "Override the ship’s AI to reroute power to the engines.",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Scifi created!");
};

export const createPlotStoryCrime = async () => {
  const plotStory = {
    title: "3. The Silent Witness",
    storyKeywords: [
      "The Silent Witness",
      "crime",
      "mystery",
      "detective",
      "secrets",
      "suspense",
      "noir",
    ],
    StarterFullStories: [
      "In the heart of the city, a famous author is found dead in his study. The only witness: his loyal cat, Whiskers. . You, as an investigator, is called to the scene, but nothing is as it seems. Was it a simple accident, or is there something far more sinister at play?",
      "As you delve deeper into the author's life, she uncovers a tangled web of secrets. A series of cryptic letters lead her to a hidden room in the author's mansion, where she finds more than just clues - she finds the truth about the man’s past and his final moments.",
    ],
    firstChoiceOptions: [
      "Interview the author's estranged wife, who has a mysterious connection to the deceased.",
      "Investigate the hidden room and try to decipher the cryptic letters found in the study.",
      "Examine the security footage from the night of the murder, hoping to catch a glimpse of the killer.",
      "Seek help from a former detective who worked with the victim on an old, unsolved case.",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Crime story created!");
};

export const createPlotStoryComedy = async () => {
  const plotStory = {
    title: "4. The Great Couch Caper",
    storyKeywords: [
      "The Great Couch Caper",
      "comedy",
      "friendship",
      "chaos",
      "ridiculous plans",
      "talking animals",
      "funny",
    ],
    StarterFullStories: [
      "When Your roommate –Dave - accidentally sells their beloved vintage couch at a garage sale, the two embark on a hilariously chaotic mission to get it back. From sneaking into a high-society gala to chasing a moving truck across town, every step is a comedic disaster.",
      "As their journey unfolds, you and Dave uncover that the couch holds an unexpected secret: a hidden stash of money stuffed inside one of the cushions. Suddenly, your simple retrieval mission turns into a battle against quirky buyers, con artists, and a neighborhood squirrel who won't let go of the loot.",
    ],
    firstChoiceOptions: [
      "Attempt to break into the gala where the buyer is flaunting the couch as an 'art piece.'",
      "Team up with a local conspiracy theorist who insists the couch is part of a government plot.",
      "Follow the trail of the delivery truck and disguise yourselves as furniture movers.",
      "Confront the neighborhood squirrel gang to recover the stash they’ve stolen from the couch.",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Comedy created!");
};

export const createPlotStoryMilitary = async () => {
  const plotStory = {
    title: "5. Operation Shadow Strike",
    storyKeywords: [
      "Operation Shadow Strike",
      "military",
      "action",
      "covert mission",
      "high stakes",
      "No man's land",
      "special ops",
    ],
    StarterFullStories: [
      "A special ops team is tasked with infiltrating an enemy-controlled city to extract a double agent with critical intel. The mission quickly escalates when the extraction point is ambushed, leaving the team stranded behind enemy lines and forced to fight their way out.",
      "As the squad navigates the hostile territory, they uncover a sinister plot involving a rogue faction planning to unleash a devastating weapon. With time running out, your  team must decide whether to prioritize their mission or risk everything to stop the imminent attack.",
    ],
    firstChoiceOptions: [
      "Secure a hidden safehouse and plan your next move while evading enemy patrols.",
      "Attempt to sabotage the enemy's weapon supply chain to weaken their forces.",
      "Send one team member undercover to gather intelligence from the enemy base.",
      "Push forward to intercept the rogue faction's leader before the weapon is deployed.",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Military created!");
};
