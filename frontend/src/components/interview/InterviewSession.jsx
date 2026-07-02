import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import QuestionCard from './QuestionCard.jsx';
import Timer from './Timer.jsx';
import AnswerInput from './AnswerInput.jsx';
import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';
import useTimer from '../../hooks/useTimer.js';
import { getSessionApi, submitAnswerApi, completeSessionApi } from '../../api/interviewApi.js';
import { QUESTION_TIMER_SECONDS } from '../../utils/constants.js';

export default function InterviewSession({ sessionId }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const { data } = await getSessionApi(sessionId);
      setSession(data.session);
    } catch (err) {
      toast.error('Could not load interview session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleExpire = () => {
    toast('Time is up! Auto-submitting your answer.', { icon: '⏰' });
    handleSubmit();
  };

  const { secondsLeft, reset } = useTimer(QUESTION_TIMER_SECONDS, handleExpire);

  const handleSubmit = async () => {
    if (!session) return;
    const question = session.questions[currentIndex];
    setSubmitting(true);
    try {
      await submitAnswerApi(sessionId, question._id, {
        text: answerText,
        timeTakenSeconds: QUESTION_TIMER_SECONDS - secondsLeft
      });
      toast.success('Answer submitted!');
      setAnswerText('');

      if (currentIndex + 1 < session.questions.length) {
        setCurrentIndex((prev) => prev + 1);
        reset(QUESTION_TIMER_SECONDS);
      } else {
        await completeSessionApi(sessionId);
        toast.success('Interview complete! Generating feedback...');
        navigate(`/feedback/${sessionId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading interview..." />;
  if (!session) return <p>Session not found.</p>;

  const question = session.questions[currentIndex];

  return (
    <div className="interview-session">
      <div className="session-header">
        <Timer secondsLeft={secondsLeft} />
      </div>
      <QuestionCard question={question} index={currentIndex} total={session.questions.length} />
      <AnswerInput value={answerText} onChange={setAnswerText} disabled={submitting} />
      <Button onClick={handleSubmit} loading={submitting} fullWidth>
        {currentIndex + 1 === session.questions.length ? 'Submit & Finish' : 'Submit & Next'}
      </Button>
    </div>
  );
}
