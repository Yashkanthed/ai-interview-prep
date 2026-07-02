const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: { type: String, default: '' },
    timeTakenSeconds: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to attach the related feedback document
answerSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'answer',
  justOne: true
});

module.exports = mongoose.model('Answer', answerSchema);
