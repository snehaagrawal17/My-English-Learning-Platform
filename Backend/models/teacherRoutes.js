// routes/teacherRoutes.js
import express from 'express';
const router = express.Router();

// Sample route (you can add real logic later)
router.get('/dashboard', (req, res) => {
  res.json({ message: "Teacher dashboard route working!" });
});

export default router;
