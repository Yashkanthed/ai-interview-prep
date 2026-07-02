import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import InterviewSetupForm from '../components/interview/InterviewSetupForm.jsx';

export default function InterviewSetupPage() {
  return (
    <div>
      <Navbar />
      <div className="page-container">
        <InterviewSetupForm />
      </div>
    </div>
  );
}
