import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import useAuth from '../hooks/useAuth.js';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <Navbar />
      <div className="hero">
        <h1>Ace Your Next Interview with AI</h1>
        <p>Practice role-specific mock interviews, get instant AI feedback, and track your progress over time.</p>
        <Link to={isAuthenticated ? '/interview/setup' : '/register'} className="btn btn-primary">
          {isAuthenticated ? 'Start Practicing' : 'Get Started Free'}
        </Link>
      </div>
    </div>
  );
}
