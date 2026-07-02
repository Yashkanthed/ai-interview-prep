const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {

    questionCount: { type: Number, default: 5, min: 1, max: 20 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: { type: String, required: true, trim: true },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['fresher', '0-1', '1-3', '3-5', '5-8', '8+']
    },
    topic: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    },
    // Computed and cached when session is completed
    averageScore: { type: Number, default: null },
    totalQuestions: { type: Number, default: 0 },
    completedAt: { type: Date }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }

  
);

// Virtual to populate questions and answers together
interviewSessionSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'session'
});

interviewSessionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'session'
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
