import aiTextCorrection from '../utils/aiTextCorrection.js';

export const analyzeAudio = async (req, res) => {
  const { transcript } = req.body;
  const feedback = await aiTextCorrection(transcript);
  res.json(feedback);
};

