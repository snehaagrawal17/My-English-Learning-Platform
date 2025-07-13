import express from 'express';
const router = express.Router();

// Example route
router.post('/score', (req, res) => {
  // Process pronunciation scoring here
  res.json({ score: 8 }); // Dummy score
});

export default router;
