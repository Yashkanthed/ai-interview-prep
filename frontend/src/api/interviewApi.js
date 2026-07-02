import axiosClient from './axiosClient';

// Create a new interview session for the given role/experience/topic.
export const createSessionApi = (payload) => axiosClient.post('/interviews/sessions', payload);

// Ask backend to generate AI questions for a session.
export const generateQuestionsApi = (sessionId) =>
  axiosClient.post(`/interviews/sessions/${sessionId}/questions`);

// Submit a user's answer to a question within a session.
export const submitAnswerApi = (sessionId, questionId, payload) =>
  axiosClient.post(`/interviews/sessions/${sessionId}/questions/${questionId}/answer`, payload);

// Mark a session complete.
export const completeSessionApi = (sessionId) =>
  axiosClient.put(`/interviews/sessions/${sessionId}/complete`);

// Fetch a single session with its questions/answers/feedback.
export const getSessionApi = (sessionId) => axiosClient.get(`/interviews/sessions/${sessionId}`);

// Fetch the logged-in user's session history.
export const getSessionHistoryApi = () => axiosClient.get('/interviews/sessions');
