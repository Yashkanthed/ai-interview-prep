import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar.jsx';
import FeedbackCard from '../components/feedback/FeedbackCard.jsx';
import FeedbackSummary from '../components/feedback/FeedbackSummary.jsx';
import Loader from '../components/common/Loader.jsx';
import { getSessionApi } from '../api/interviewApi.js';

export default function FeedbackPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getSessionApi(sessionId);
        setSession(data.session);
      } catch (err) {
        toast.error('Could not load feedback');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  if (loading) return <><Navbar /><Loader message="Loading feedback..." /></>;
  if (!session) return <><Navbar /><p className="page-container">Session not found.</p></>;

  const averageScore =
    session.answers?.length
      ? session.answers.reduce((sum, a) => sum + (a.feedback?.score || 0), 0) / session.answers.length
      : null;

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <FeedbackSummary session={session} averageScore={averageScore} />
        <div className="feedback-list">
          {session.questions?.map((q) => {
            const answer = session.answers?.find(
              (a) => a.question?.toString() === q._id?.toString()
            );
            return (
              <FeedbackCard
                key={q._id}
                question={q}
                answer={answer}
                feedback={answer?.feedback}
              />
            );
          })}
        </div>
        <div className="feedback-actions">
          <Link to="/interview/setup" className="btn btn-primary">New Interview</Link>
          <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
