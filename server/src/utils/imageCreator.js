// pollination img generator
const imageCreator = (plotCharacter) => {
  const allPictureKeywords = plotCharacter.pictureKeywords.flat(Infinity);
  const randomX = Math.floor(Math.random() * 4);
  const lastN = (arr, n = 1) => arr.slice(-n);
  const last5Keyword = lastN(allPictureKeywords, 5).join(",");
  const prompt = allPictureKeywords[randomX] + "," + last5Keyword;
  const width = 500;
  const height = 500;
  const seed = Math.floor(Math.random() * 10000);
  const model = "flux";
  console.log("prompt                    " + prompt);
  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    prompt
  )}?width=${width}&height=${height}&seed=${seed}&enhance=${true}&model=${model}`;
  console.log("Created imgURL");
  return imageUrl;
};

export default imageCreator;
