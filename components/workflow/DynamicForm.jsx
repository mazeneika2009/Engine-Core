import React from 'react';

const DynamicForm = ({ schema, values, onChange }) => {
  if (!schema || schema.length === 0) {
    return <p className="text-sm text-slate-400 italic">No configurable parameters for this node.</p>;
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: values[field.name] || '',
      onChange: (e) => onChange(field.name, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: "w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
    };

    switch (field.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'password':
        return <input type="password" {...commonProps} />;
      case 'textarea':
        return <textarea {...commonProps} rows={4}></textarea>;
      case 'select':
        return (
          <select {...commonProps}>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={values[field.name] || false}
                onChange={(e) => onChange(field.name, e.target.checked)}
              />
              <div className="block bg-slate-200 w-10 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
            </div>
            <div className="ml-3 text-sm font-medium text-slate-700">{field.label}</div>
          </label>
        );
      case 'range':
        return (
          <input
            type="range"
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            value={values[field.name] || field.default || 0}
            onChange={(e) => onChange(field.name, parseFloat(e.target.value))}
          />
        );
      case 'code':
      case 'json':
        // For 'code' and 'json', a textarea is used. In a real app, this would be a code editor.
        return (
          <textarea
            {...commonProps}
            rows={6}
            className="font-mono text-xs bg-slate-800 text-emerald-300 border-slate-700"
          ></textarea>
        );
      // Add more cases for other field types (checkbox, radio, file upload, etc.)
      default:
        return <p className="text-red-500">Unknown field type: {field.type}</p>;
    }
  };

  return (
    <form className="space-y-6">
      {schema.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
          {field.type === 'range' && (
            <span className="text-xs text-slate-500 mt-1 block">{values[field.name] || field.default}</span>
          )}
        </div>
      ))}
    </form>
  );
};

export default DynamicForm;