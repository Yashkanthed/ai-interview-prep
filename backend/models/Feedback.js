const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      required: true,
      unique: true   // one feedback document per answer
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    // Raw AI response preserved for debugging / auditing
    rawAiResponse: { type: String, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
