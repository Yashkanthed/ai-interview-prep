import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

export default function NotFoundPage() {
  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>This page does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Go Home</Link>
      </div>
    </div>
  );
}
