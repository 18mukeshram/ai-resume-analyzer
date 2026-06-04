const { GoogleGenerativeAI } = require('@google/generative-ai');

const PROMPT_TEMPLATE = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume against the job description provided.

RESUME TEXT:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "improvements": [
    "<specific actionable improvement suggestion 1>",
    "<specific actionable improvement suggestion 2>",
    "<specific actionable improvement suggestion 3>"
  ],
  "interviewQuestions": [
    "<tailored interview question based on resume and JD 1>",
    "<tailored interview question based on resume and JD 2>",
    "<tailored interview question based on resume and JD 3>",
    "<tailored interview question based on resume and JD 4>",
    "<tailored interview question based on resume and JD 5>"
  ]
}

Rules:
- matchScore should reflect how well the resume matches the JD (0=no match, 100=perfect match)
- matchedSkills: skills found in BOTH the resume and JD
- missingSkills: skills required by JD but NOT found in resume
- improvements: 3-5 specific, actionable suggestions to improve the resume for this role
- interviewQuestions: 5 interview questions the candidate should prepare for based on their resume gaps and the JD requirements`;

async function analyzeResume(resumeText, jobDescription) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️  No Gemini API key configured. Returning mock analysis.');
    return getMockAnalysis(resumeText, jobDescription);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const prompt = PROMPT_TEMPLATE
      .replace('{resumeText}', resumeText)
      .replace('{jobDescription}', jobDescription);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown fences if present
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    const parsed = JSON.parse(text);

    return {
      matchScore: Math.min(100, Math.max(0, parseInt(parsed.matchScore) || 0)),
      summary: parsed.summary || 'Analysis complete.',
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      improvements: parsed.improvements || [],
      interviewQuestions: parsed.interviewQuestions || [],
    };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return getMockAnalysis(resumeText, jobDescription);
  }
}

function getMockAnalysis(resumeText, jobDescription) {
  // Extract some keywords for a semi-realistic mock
  const resumeWords = resumeText.toLowerCase().split(/\W+/);
  const jdWords = jobDescription.toLowerCase().split(/\W+/);
  const techKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'git', 'html', 'css', 'typescript', 'java', 'mongodb', 'express', 'angular', 'vue', 'kubernetes', 'linux', 'api', 'rest', 'graphql', 'redis', 'postgresql', 'firebase', 'tailwind', 'nextjs', 'django', 'flask'];

  const resumeSkills = techKeywords.filter(k => resumeWords.includes(k));
  const jdSkills = techKeywords.filter(k => jdWords.includes(k));
  const matched = resumeSkills.filter(s => jdSkills.includes(s));
  const missing = jdSkills.filter(s => !resumeSkills.includes(s));
  const score = jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 50;

  return {
    matchScore: score,
    summary: `[Mock Analysis] The resume matches ${matched.length} out of ${jdSkills.length} key technical skills from the job description. Configure GEMINI_API_KEY in .env for real AI-powered analysis.`,
    matchedSkills: matched.length > 0 ? matched : ['communication', 'teamwork'],
    missingSkills: missing.length > 0 ? missing : ['specific skills not detected - add API key for real analysis'],
    improvements: [
      'Add quantifiable achievements (e.g., "Improved load time by 40%")',
      'Include relevant keywords from the job description throughout your resume',
      'Add a professional summary section tailored to this specific role',
      'List relevant certifications or training programs',
    ],
    interviewQuestions: [
      'Can you walk me through a challenging project and how you handled it?',
      'How do you stay updated with the latest industry trends?',
      'Describe a situation where you had to learn a new technology quickly.',
      'How do you handle disagreements within a team?',
      'What interests you most about this role and our company?',
    ],
  };
}

module.exports = { analyzeResume };
