import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../LanguageContext';
import { NODE_REGISTRY } from '../../constants/node-registry';
import DynamicForm from './DynamicForm';

const NodeConfigPanel = ({ node, onClose, onUpdate }) => {
  const { t } = useTranslation();
  if (!node) return null;

  const registryEntry = NODE_REGISTRY[node.data.type];
  if (!registryEntry) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${node ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{node.data.label}</h3>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">CONFIGURATION ENGINE</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Parameters</h4>
          <DynamicForm
            schema={registryEntry.schema}
            values={node.data.config}
            onChange={(field, val) => onUpdate(node.id, field, val)}
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <button onClick={onClose} className="w-full bg-[#0061e0] text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;