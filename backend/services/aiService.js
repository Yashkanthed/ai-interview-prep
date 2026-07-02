const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.AI_MODEL || "gemini-2.5-flash",
});

/**
 * Generate Interview Questions
 */
const generateInterviewQuestions = async ({
  role,
  experienceLevel,
  topic,
  count = 5,
}) => {
  const prompt = `
You are an expert technical interviewer.

Generate exactly ${count} interview questions.

Role:
${role}

Experience Level:
${experienceLevel}

Topic:
${topic}

Difficulty:
- Fresher → Easy
- 1-3 years → Medium
- 3+ years → Hard

Rules:
- Questions must be unique.
- Mix conceptual and coding questions.
- Return ONLY valid JSON.
- No markdown.

Example:

[
  {
    "text":"What is React?",
    "difficulty":"easy"
  }
]
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

/**
 * Evaluate Candidate Answer
 */
const generateAnswerFeedback = async ({
  question,
  answer,
  role,
  experienceLevel,
  topic,
}) => {
  const prompt = `
You are a Senior ${role} interviewer.

Topic:
${topic}

Experience Level:
${experienceLevel}

Question:
${question}

Candidate Answer:
${answer || "No answer provided"}

Evaluate using this rubric.

1-3 = Poor

4-5 = Average

6-7 = Good

8-9 = Excellent

10 = Outstanding

Return ONLY JSON.

{
  "score":8,
  "strengths":[
    "..."
  ],
  "weaknesses":[
    "..."
  ],
  "suggestions":[
    "..."
  ]
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

module.exports = {
  generateInterviewQuestions,
  generateAnswerFeedback,
};