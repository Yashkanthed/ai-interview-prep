import React from 'react';

export default function Input({ label, type = 'text', name, value, onChange, error, placeholder }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
