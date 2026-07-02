import { useContext } from 'react';
import { InterviewContext } from '../context/InterviewContext.jsx';

export default function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within an InterviewProvider');
  return ctx;
}
