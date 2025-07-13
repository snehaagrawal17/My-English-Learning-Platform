import generatePronunciationScore from '../utils/generatePronunciationScore.js';

export const scorePronunciation = async (req, res) => {
  const { words } = req.body;
  const result = generatePronunciationScore(words);
  res.json(result);
};
