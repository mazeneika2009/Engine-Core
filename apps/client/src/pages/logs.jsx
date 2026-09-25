import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../LanguageContext';
import { api } from '../service/api';
import { Page, SearchInput, SlidePanel, StatusDot } from '../components/shell';

function durationMs(started, finished) {
  if (!started || !finished) return '—';
  const ms = new Date(finished) - new Date(started);
  if (Number.isNaN(ms)) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const ExecutionLogs = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [names, setNames] = useState({});
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const navigate = useNavigate();

  const reload = async () => {
    const [runs, workflows] = await Promise.all([api.getLogs(), api.getWorkflows()]);
    setLogs(runs || []);
    setNames(Object.fromEntries((workflows || []).map((w) => [w.id, w.name])));
    if (runs && runs.length > 0 && !selected) setSelected(runs[0]);
  };

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => logs.filter((log) =>
    (names[log.workflow_id] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, logs, names]);

  const openLog = (log) => { setSelected(log); setPanelOpen(true); };

  const handleRerun = async () => {
    if (!selected) return;
    setRerunning(true);
    try {
      const result = await api.executeWorkflow(selected.workflow_id, {});
      setSelected({ ...selected, status: result.status });
      reload();
    } finally {
      setRerunning(false);
    }
  };

  const successRate = logs.length === 0 ? '—' : `${Math.round(((logs.length - logs.filter((l) => l.status === 'failed').length) / logs.length) * 100)}%`;
  const steps = selected?.execution_data?.outputs ? Object.keys(selected.execution_data.outputs) : [];

  return (
    <Page
      active="logs"
      title={t('logs.title')}
      meta={t('logs.subtitle')}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      search={<SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('logs.table.searchPlaceholder')} />}
      actions={<span className="text-[11px] text-smoke font-mono hidden sm:block">{filtered.length} runs</span>}
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card-flat p-4">
          <p className="label-caps !text-[10px]">{t('logs.stats.rate')}</p>
          <p className="text-[24px] font-bold tracking-tight mt-1 text-cream">{successRate}</p>
        </div>
        <div className="card-flat p-4">
          <p className="label-caps !text-[10px]">{t('logs.stats.total')}</p>
          <p className="text-[24px] font-bold tracking-tight mt-1 text-cream">{logs.length}</p>
        </div>
        <div className="card-flat p-4">
          <p className="label-caps !text-[10px]">{t('logs.stats.duration')}</p>
          <p className="text-[24px] font-bold tracking-tight mt-1 font-mono text-cream">
            {logs.length === 0 ? '—' : durationMs(logs[0].started_at, logs[0].finished_at)}
          </p>
        </div>
      </div>

      <div className="card-flat overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-sand">No executions yet. Run a workflow from the Builder.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-semibold text-smoke uppercase tracking-[0.12em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th className="px-5 py-3 font-semibold">{t('logs.table.id')}</th>
                <th className="px-5 py-3 font-semibold">{t('logs.table.name')}</th>
                <th className="px-5 py-3 font-semibold">{t('logs.table.start')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} onClick={() => openLog(log)} className="cursor-pointer hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-ochre">{log.id.slice(0, 8)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusDot tone={log.status === 'failed' ? 'error' : log.status === 'running' ? 'warm' : 'active'} />
                      <p className="text-[13px] font-semibold text-cream">{names[log.workflow_id] || 'Workflow'}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-sand">{new Date(log.started_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SlidePanel
        open={panelOpen && !!selected}
        onClose={() => setPanelOpen(false)}
        title={t('logs.details.title')}
        meta={selected ? selected.id : ''}
        wide
        footer={
          <div className="flex gap-2">
            <button onClick={handleRerun} disabled={rerunning} className="btn-clay flex-1 disabled:opacity-60">
              {rerunning ? t('common.processing') : t('logs.details.reexecute')}
            </button>
            <button onClick={() => navigate('/builder')} className="btn-quiet flex-1">{t('logs.details.viewBuilder')}</button>
          </div>
        }
      >
        {selected && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                [t('logs.table.name'), names[selected.workflow_id] || '—'],
                [t('logs.table.start'), new Date(selected.started_at).toLocaleString()],
                [t('dashboard.table.status'), selected.status],
                [t('dashboard.table.duration'), durationMs(selected.started_at, selected.finished_at)],
              ].map(([label, value]) => (
                <div key={label} className="card-flat p-3">
                  <p className="text-[10px] font-semibold text-smoke uppercase tracking-[0.1em]">{label}</p>
                  <p className="text-[13px] font-semibold mt-1 text-cream">{value}</p>
                </div>
              ))}
            </div>

            {selected.error_details && (
              <div className="mb-5">
                <p className="label-caps mb-2">{t('logs.details.errorMsg')}</p>
                <p className="rounded-lg p-3.5 font-mono text-[11px] leading-relaxed" style={{ background: 'rgba(201,106,94,0.1)', color: '#E0A49D', border: '1px solid rgba(201,106,94,0.3)' }}>
                  {selected.error_details.message}
                  {selected.error_details.node ? ` — step: ${selected.error_details.node}` : ''}
                </p>
              </div>
            )}

            <p className="label-caps mb-2">{t('logs.details.steps')}</p>
            {steps.length === 0 && <p className="text-[12px] text-sand mb-4">No step outputs recorded.</p>}
            <div className="space-y-0 mb-5">
              {steps.map((name, idx) => (
                <div key={name} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-sage" />
                    {idx !== steps.length - 1 && <span className="w-px flex-1 my-1 bg-white/10" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-[12px] font-semibold text-cream">{name}</p>
                    <p className="text-[11px] text-smoke mt-0.5 font-mono">ok</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="label-caps mb-2">{t('logs.details.payload')}</p>
            <pre className="rounded-lg p-3.5 font-mono text-[11px] leading-relaxed overflow-x-auto" style={{ background: '#1C1917', color: '#E7E0D3', border: '1px solid rgba(255,255,255,0.08)' }}>
              {JSON.stringify(selected.execution_data || {}, null, 2)}
            </pre>
          </>
        )}
      </SlidePanel>
    </Page>
  );
};

export default ExecutionLogs;
