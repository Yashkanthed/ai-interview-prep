import React from 'react';

export default function Select({ label, name, value, onChange, options, error, placeholder }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={value} onChange={onChange} className={error ? 'input-error' : ''}>
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
