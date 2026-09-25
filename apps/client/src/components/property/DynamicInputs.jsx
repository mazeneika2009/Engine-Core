import React, { useState } from 'react';
import { hasExpressions } from '../../utils/expressions.js';

const inputStyle = {
  background: '#1C1917',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#F5F1EA',
};

function StringInput({ property, value, onChange }) {
  const expressive = hasExpressions(value || '');
  if (property.multiline) {
    return (
      <textarea
        rows={3}
        value={value || ''}
        placeholder={property.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none placeholder:text-smoke ${expressive ? 'font-mono !text-[12px]' : 'font-medium'}`}
        style={{ ...inputStyle, borderColor: expressive ? 'rgba(132,169,140,0.45)' : inputStyle.border }}
      />
    );
  }
  return (
    <input
      type={property.secret ? 'password' : 'text'}
      value={value || ''}
      placeholder={property.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none placeholder:text-smoke ${expressive ? 'font-mono !text-[12px]' : 'font-medium'}`}
      style={{ ...inputStyle, borderColor: expressive ? 'rgba(132,169,140,0.45)' : inputStyle.border }}
    />
  );
}

function NumberInput({ property, value, onChange }) {
  return (
    <input
      type="number"
      value={value ?? ''}
      min={property.min}
      max={property.max}
      step={property.step || 'any'}
      placeholder={property.placeholder}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      className="w-full rounded-lg px-3 py-2 text-[13px] font-mono outline-none placeholder:text-smoke"
      style={inputStyle}
    />
  );
}

function BooleanInput({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex items-center gap-2.5">
      <span
        className="w-9 h-5 rounded-full relative transition-colors shrink-0"
        style={{ background: value ? '#84A98C' : 'rgba(255,255,255,0.16)' }}
      >
        <span
          className="absolute top-[2px] w-4 h-4 rounded-full transition-all"
          style={{ left: value ? '18px' : '2px', background: '#1C1917' }}
        />
      </span>
      <span className="text-[12px] font-medium text-sand">{value ? 'On' : 'Off'}</span>
    </button>
  );
}

function SelectInput({ property, value, onChange }) {
  const options = (property.options || []).map((option) =>
    typeof option === 'object' ? option : { label: String(option), value: option }
  );
  return (
    <select
      value={value ?? property.default ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg px-3 py-2 text-[13px] font-medium outline-none appearance-none"
      style={{ ...inputStyle, cursor: 'pointer' }}
    >
      {options.map((option) => (
        <option key={String(option.value)} value={option.value} style={{ background: '#232120' }}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function JsonInput({ property, value, onChange }) {
  const [error, setError] = useState(null);
  const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || '');
  return (
    <div>
      <textarea
        rows={5}
        value={text}
        placeholder={property.placeholder}
        spellCheck={false}
        onChange={(e) => {
          const next = e.target.value;
          const trimmed = next.trim();
          if (trimmed === '' || trimmed.startsWith('{') === false && trimmed.startsWith('[') === false) {
            // Expression templates ({{ }}) are valid here — keep raw text.
            setError(null);
            onChange(next);
            return;
          }
          try {
            JSON.parse(next);
            setError(null);
          } catch {
            setError('Invalid JSON');
          }
          onChange(next);
        }}
        className="w-full rounded-lg px-3 py-2 font-mono text-[12px] leading-relaxed outline-none placeholder:text-smoke"
        style={{ ...inputStyle, borderColor: error ? 'rgba(201,106,94,0.5)' : inputStyle.border }}
      />
      {error && <p className="text-[11px] text-brick mt-1">{error}</p>}
    </div>
  );
}

function CredentialsInput({ property, value, onChange, credentials }) {
  const matching = (credentials || []).filter(
    (credential) => !property.credentialType || credential.type === property.credentialType
  );
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || '')}
      className="w-full rounded-lg px-3 py-2 text-[13px] font-medium outline-none appearance-none"
      style={{ ...inputStyle, cursor: 'pointer' }}
    >
      <option value="" style={{ background: '#232120' }}>None</option>
      {matching.map((credential) => (
        <option key={credential.id} value={credential.id} style={{ background: '#232120' }}>
          {credential.name} — {credential.type}
        </option>
      ))}
    </select>
  );
}

/** Render one property field by its declared type. */
export function DynamicInput({ property, value, onChange, credentials }) {
  switch (property.type) {
    case 'string':
      return <StringInput property={property} value={value} onChange={onChange} />;
    case 'number':
      return <NumberInput property={property} value={value} onChange={onChange} />;
    case 'boolean':
      return <BooleanInput value={value} onChange={onChange} />;
    case 'select':
      return <SelectInput property={property} value={value} onChange={onChange} />;
    case 'json':
      return <JsonInput property={property} value={value} onChange={onChange} />;
    case 'credentials':
      return <CredentialsInput property={property} value={value} onChange={onChange} credentials={credentials} />;
    default:
      return <p className="text-[12px] text-brick">Unsupported type: {property.type}</p>;
  }
}
