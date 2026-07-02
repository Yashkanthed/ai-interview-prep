import React, { createContext, useState } from 'react';

// Holds the state of the interview session currently in progress,
// so the timer/question/answer components can share it without prop drilling.
export const InterviewContext = createContext(null);

export function InterviewProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const resetInterview = () => {
    setSession(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const recordAnswer = (questionId, answerData) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerData }));
  };

  const value = {
    session,
    setSession,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    recordAnswer,
    resetInterview
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}
