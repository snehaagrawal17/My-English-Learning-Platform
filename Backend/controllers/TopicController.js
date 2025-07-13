const topics = {
  beginner: ["Introduce yourself", "Talk about your family"],
  intermediate: ["Pros and cons of social media"],
  advanced: ["Is AI a threat or a tool?"]
};

export const getTopics = (req, res) => {
  const { level } = req.query;
  res.json({ topics: topics[level] || topics.beginner });
};
