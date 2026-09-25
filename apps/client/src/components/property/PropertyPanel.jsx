import React, { useEffect, useState } from 'react';
import { isPropertyVisible } from 'shared';
import { NODE_MAP } from '../../nodes/index.js';
import { api } from '../../service/api.js';
import { DynamicInput } from './DynamicInputs.jsx';

/**
 * Dynamic PropertyPanel — renders every field from the selected node's
 * declarative `properties` schema. Supports displayOptions conditions,
 * credential selects (loaded from /api/credentials), and live {{ }}
 * expression highlighting (see DynamicInputs).
 */
export default function PropertyPanel({ node, onClose, onUpdate, onRename, onDelete, onTest }) {
  const [credentials, setCredentials] = useState([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    api.getCredentials().then(setCredentials).catch(() => setCredentials([]));
  }, []);

  if (!node) return null;
  const def = NODE_MAP[node.data.nodeType];
  if (!def) return null;

  const values = node.data.params || {};
  const visible = (def.properties || []).filter((property) => isPropertyVisible(property, values));

  const handleTest = async () => {
    if (!onTest) return;
    setTesting(true);
    try {
      await onTest();
    } finally {
      setTesting(false);
    }
  };

  return (
    <div
      className="fixed inset-y-0 right-0 w-[340px] bg-panel z-[150] flex flex-col"
      style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="px-5 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-9 h-9 rounded-md flex items-center justify-center text-[12px] font-bold shrink-0"
            style={{ background: def.tone.bg, color: def.tone.fg, border: `1px solid ${def.tone.edge}` }}
          >
            {def.monogram}
          </span>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold tracking-tight text-cream truncate">{def.displayName}</h3>
            <p className="text-[10px] text-smoke font-mono mt-0.5 truncate">{def.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-[12px] font-medium text-sand hover:text-cream px-2 py-1 shrink-0">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke mb-2">
            Step Name
          </label>
          <input
            value={node.data.name || ''}
            onChange={(e) => onRename && onRename(node.id, e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-[13px] font-mono text-cream outline-none"
            style={{ background: '#1C1917', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <p className="text-[11px] text-smoke mt-1.5 font-mono">$node["{node.data.name}"]</p>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke mb-4">Parameters</p>
        {visible.length === 0 && (
          <p className="text-[13px] text-sand">No parameters. This step runs on trigger.</p>
        )}
        <div className="space-y-5">
          {visible.map((property) => (
            <div key={property.name}>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke mb-2">
                {property.displayName}
                {property.required && <span className="text-brick ml-1">*</span>}
              </label>
              <DynamicInput
                property={property}
                value={values[property.name] ?? property.default ?? ''}
                onChange={(value) => onUpdate(node.id, property.name, value)}
                credentials={credentials}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {onTest && (
          <button onClick={handleTest} disabled={testing} className="w-full btn-quiet disabled:opacity-60">
            {testing ? 'Running…' : 'Test Step'}
          </button>
        )}
        <div className="flex gap-2">
          <button onClick={() => onDelete && onDelete(node.id)} className="flex-1 btn-danger-quiet">
            Delete
          </button>
          <button onClick={onClose} className="flex-[2] btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
