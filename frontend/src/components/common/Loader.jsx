import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
