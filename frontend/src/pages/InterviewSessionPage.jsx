import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import InterviewSession from '../components/interview/InterviewSession.jsx';

export default function InterviewSessionPage() {
  const { sessionId } = useParams();
  return (
    <div>
      <Navbar />
      <div className="page-container">
        <InterviewSession sessionId={sessionId} />
      </div>
    </div>
  );
}
