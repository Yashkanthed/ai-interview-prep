const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true
    },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    orderIndex: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
