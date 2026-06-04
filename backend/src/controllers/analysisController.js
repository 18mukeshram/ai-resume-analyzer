const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Analysis = require('../models/Analysis');
const { analyzeResume } = require('../services/aiService');

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed.'));
    }
  },
}).single('resume');

// Extract text from uploaded file buffer
async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
}

exports.analyze = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const file = req.file;
      const { jobDescription } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'Please upload a resume file (PDF or DOCX).' });
      }
      if (!jobDescription || jobDescription.trim().length < 10) {
        return res.status(400).json({ error: 'Please provide a valid job description (min 10 chars).' });
      }

      // Extract resume text
      const resumeText = await extractText(file.buffer, file.mimetype);

      if (!resumeText || resumeText.trim().length < 20) {
        return res.status(400).json({ error: 'Could not extract enough text from the resume. Please try a different file.' });
      }

      // Call AI service
      const aiResult = await analyzeResume(resumeText, jobDescription);

      // Save to database
      const analysis = await Analysis.create({
        userId: req.userId,
        resumeName: file.originalname,
        jobDescription,
        resumeText,
        matchScore: aiResult.matchScore,
        matchedSkills: aiResult.matchedSkills,
        missingSkills: aiResult.missingSkills,
        improvements: aiResult.improvements,
        interviewQuestions: aiResult.interviewQuestions,
        summary: aiResult.summary,
      });

      res.json({
        id: analysis.id,
        resumeName: analysis.resumeName,
        matchScore: aiResult.matchScore,
        summary: aiResult.summary,
        matchedSkills: aiResult.matchedSkills,
        missingSkills: aiResult.missingSkills,
        improvements: aiResult.improvements,
        interviewQuestions: aiResult.interviewQuestions,
        createdAt: analysis.createdAt,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }
  });
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'resumeName', 'matchScore', 'summary', 'matchedSkills', 'missingSkills', 'improvements', 'interviewQuestions', 'jobDescription', 'createdAt'],
    });
    res.json(analyses);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findOne({ where: { id, userId: req.userId } });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }
    await analysis.destroy();
    res.json({ message: 'Analysis deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete analysis.' });
  }
};
