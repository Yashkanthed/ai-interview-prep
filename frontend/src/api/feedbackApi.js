import axiosClient from './axiosClient';

// Trigger AI feedback generation for a given answer.
export const generateFeedbackApi = (answerId) =>
  axiosClient.post(`/feedback/${answerId}/generate`);

// Fetch feedback for a given answer.
export const getFeedbackApi = (answerId) => axiosClient.get(`/feedback/${answerId}`);

// Fetch aggregated dashboard stats (scores/trends) for the logged-in user.
export const getDashboardStatsApi = () => axiosClient.get('/feedback/dashboard');
