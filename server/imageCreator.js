const imageCreator = (character) => {
  const prompt = character.pictureheadlines.flat().join("").replace(/\s+/g, "");
  const last30Chars = prompt.slice(-40);

  const width = 500;
  const height = 500;
  const seed = Math.floor(Math.random() * 10000);
  const model = "flux";
  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    last30Chars
  )}?width=${width}&height=${height}&seed=${seed}&model=${model}`;
  console.log("Created imgURL");
  console.log(prompt);
  return imageUrl;
};

export default imageCreator;
