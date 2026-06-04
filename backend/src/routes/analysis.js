const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { analyze, getHistory, deleteAnalysis } = require('../controllers/analysisController');

router.post('/analyze', auth, analyze);
router.get('/history', auth, getHistory);
router.delete('/:id', auth, deleteAnalysis);

module.exports = router;
