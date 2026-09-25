import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const EngineDashboard = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, executions: 0, errors: 0 });
  const [executions, setExecutions] = useState([]);
  const [names, setNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, logs, workflows] = await Promise.all([
          api.getDashboardStats(), api.getLogs(), api.getWorkflows(),
        ]);
        setStats(statsData);
        setExecutions(logs.slice(0, 6));
        setNames(Object.fromEntries((workflows || []).map((w) => [w.id, w.name])));
      } catch (e) { console.error('Dashboard loading failed', e); }
    };
    load();
  }, []);

  const filtered = useMemo(() => executions.filter((ex) =>
    (names[ex.workflow_id] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, executions, names]);

  return (
    <Page
      active="dashboard"
      title={t('dashboard.title')}
      meta={t('dashboard.subtitle')}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      search={<SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('header.search')} />}
      actions={
        <>
          <button onClick={() => setShowNotifications(true)} className="btn-quiet">Updates</button>
          <button onClick={() => navigate('/builder')} className="btn-primary">{t('sidebar.newWorkflow')}</button>
        </>
      }
    >
      <div className="flex items-center gap-2 mb-5">
        <StatusDot tone="active" />
        <p className="text-[11px] font-medium text-sand">{t('dashboard.uptime')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="card-flat p-5">
          <p className="label-caps">{t('dashboard.stats.workflows')}</p>
          <p className="text-[32px] font-bold tracking-tight mt-2 leading-none text-cream">{stats.workflows}</p>
          <p className="text-[11px] text-sage font-medium mt-2">{t('dashboard.trends.workflows')}</p>
        </div>
        <div className="card-flat p-5">
          <p className="label-caps">{t('dashboard.stats.executions')}</p>
          <p className="text-[32px] font-bold tracking-tight mt-2 leading-none text-cream">{stats.executions}</p>
          <p className="text-[11px] text-sand font-medium mt-2">{t('dashboard.trends.executions')}</p>
        </div>
        <div className="card-flat p-5">
          <p className="label-caps">{t('dashboard.stats.errors')}</p>
          <p className="text-[32px] font-bold tracking-tight mt-2 leading-none text-cream">{stats.errors}</p>
          <p className="text-[11px] text-sand font-medium mt-2">{t('dashboard.trends.errors')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-4">
        <div className="lg:col-span-3 card-flat p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('dashboard.successRateTitle')}</h3>
            <div className="flex gap-1 text-[11px] font-medium">
              {['week', 'month', 'all'].map((f, i) => (
                <span
                  key={f}
                  className={`px-2.5 py-1 rounded-md ${i === 0 ? 'text-cream' : 'text-smoke'}`}
                  style={i === 0 ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                >
                  {t(`dashboard.chartFilters.${f}`)}
                </span>
              ))}
            </div>
          </div>
          <svg className="w-full h-44 overflow-visible" viewBox="0 0 800 180" preserveAspectRatio="none">
            <path d="M0,120 C100,110 180,60 280,70 C380,80 420,110 520,90 C620,70 700,40 800,50 L800,180 L0,180 Z" fill="rgba(132,169,140,0.12)" />
            <path d="M0,120 C100,110 180,60 280,70 C380,80 420,110 520,90 C620,70 700,40 800,50" fill="none" stroke="#84A98C" strokeWidth="2" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
          <div className="flex justify-between mt-4 text-[10px] font-medium text-smoke uppercase tracking-widest">
            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => <span key={d}>{t(`dashboard.days.${d}`)}</span>)}
          </div>
        </div>

        <div className="rounded-xl p-6 flex flex-col bg-coal" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke">{t('dashboard.integrity')}</p>
          <p className="text-[36px] font-bold tracking-tight mt-1 text-cream">
            {stats.executions === 0 ? '—' : `${Math.round(((stats.executions - stats.errors) / stats.executions) * 100)}%`}
          </p>
          <div className="space-y-5 mt-6">
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-2">
                <span className="text-smoke">{t('dashboard.latency')}</span>
                <span className="font-mono text-cream">0ms</span>
              </div>
              <div className="h-1 rounded-full bg-white/10"><div className="h-full w-0 bg-sage rounded-full" /></div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-2">
                <span className="text-smoke">{t('dashboard.cpu')}</span>
                <span className="font-mono text-cream">0%</span>
              </div>
              <div className="h-1 rounded-full bg-white/10"><div className="h-full w-0 bg-ochre rounded-full" /></div>
            </div>
          </div>
          <p className="text-[11px] text-smoke leading-relaxed mt-auto pt-6">{t('dashboard.nodesOptimal')}</p>
        </div>
      </div>

      <div className="card-flat overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('dashboard.recentExecutions')}</h3>
          <Link to="/logs" className="text-[12px] font-semibold text-ochre hover:underline">{t('dashboard.viewLogs')}</Link>
        </div>
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-[13px] text-sand">No executions yet. Run a workflow from the Builder.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-semibold text-smoke uppercase tracking-[0.12em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th className="px-5 py-3 font-semibold">{t('dashboard.table.identity')}</th>
                <th className="px-5 py-3 font-semibold">{t('dashboard.table.timestamp')}</th>
                <th className="px-5 py-3 font-semibold">{t('dashboard.table.status')}</th>
                <th className="px-5 py-3 font-semibold text-right">{t('dashboard.table.duration')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ex) => (
                <tr key={ex.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <StatusDot tone={ex.status === 'failed' ? 'error' : ex.status === 'running' ? 'warm' : 'active'} />
                      <div>
                        <p className="text-[13px] font-semibold text-cream">{names[ex.workflow_id] || 'Workflow'}</p>
                        <p className="text-[10px] text-smoke font-mono mt-0.5">{ex.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-sand">{new Date(ex.started_at).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[12px] font-medium text-cream/90">{ex.status}</td>
                  <td className="px-5 py-3.5 text-[12px] text-sand text-right font-mono">{durationMs(ex.started_at, ex.finished_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SlidePanel open={showNotifications} onClose={() => setShowNotifications(false)} title={t('notifications.title')}>
        <div className="space-y-2">
          <div className="card-flat p-3.5">
            <p className="label-caps !text-[10px]">{t('notifications.systemUpdate')}</p>
            <p className="text-[13px] font-medium mt-1.5 text-cream">{t('notifications.deployed')}</p>
            <p className="text-[11px] text-smoke mt-1">{t('notifications.time2h')}</p>
          </div>
          <div className="card-flat p-3.5">
            <p className="label-caps !text-[10px]">{t('notifications.executionError')}</p>
            <p className="text-[13px] font-medium mt-1.5 text-cream">{stats.errors} failed execution(s) on record.</p>
          </div>
        </div>
      </SlidePanel>
    </Page>
  );
};

export default EngineDashboard;
