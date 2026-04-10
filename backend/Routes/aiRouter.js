const express = require('express');
const router = express.Router();
const { chatWithAI, summarizeReviews } = require('../Controllers/aiController');

// @route   POST /api/ai/chat
// @desc    Chat with LocalLink AI
router.post('/chat', chatWithAI);

// @route   GET /api/ai/summarize-reviews/:serviceId
// @desc    Get AI summary of service reviews
router.get('/summarize-reviews/:serviceId', summarizeReviews);

module.exports = router;
