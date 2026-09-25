import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../LanguageContext';
import { api } from '../service/api';
import { Page, SearchInput, StatusDot } from '../components/shell';

const monogramOf = (name) => (name || 'WF').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'WF';

const WorkflowsPage = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const navigate = useNavigate();

  const reload = async () => {
    try {
      const [list, runs] = await Promise.all([api.getWorkflows(), api.getExecutions()]);
      setWorkflows(list || []);
      setExecutions(runs || []);
    } catch (error) {
      console.error('Failed to fetch workflows', error);
    }
  };

  useEffect(() => { reload(); }, []);

  const statsByWorkflow = useMemo(() => {
    const map = {};
    for (const run of executions) {
      if (!map[run.workflow_id]) map[run.workflow_id] = { total: 0, failed: 0, last: null };
      map[run.workflow_id].total += 1;
      if (run.status === 'failed') map[run.workflow_id].failed += 1;
      if (!map[run.workflow_id].last || run.started_at > map[run.workflow_id].last) {
        map[run.workflow_id].last = run.started_at;
      }
    }
    return map;
  }, [executions]);

  const filtered = useMemo(() => workflows.filter((wf) => {
    const matches = wf.name.toLowerCase().includes(searchQuery.toLowerCase());
    const stats = statsByWorkflow[wf.id];
    const hasFailed = stats && stats.failed > 0;
    const status = statusFilter === 'all'
      || (statusFilter === 'active' && wf.active)
      || (statusFilter === 'failed' && hasFailed);
    return matches && status;
  }), [searchQuery, statusFilter, workflows, statsByWorkflow]);

  const toggleActive = async (wf) => {
    await api.updateWorkflow(wf.id, { active: !wf.active });
    reload();
  };

  const handleDelete = async (id) => {
    await api.deleteWorkflow(id);
    reload();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = await api.createWorkflow({ name: newName.trim(), nodes: [], connections: [] });
    setIsModalOpen(false);
    setNewName('');
    if (created && created.id) navigate('/builder');
    else reload();
  };

  const toggleFilter = () => {
    const modes = ['all', 'active', 'failed'];
    setStatusFilter(modes[(modes.indexOf(statusFilter) + 1) % modes.length]);
  };

  return (
    <Page
      active="workflows"
      title={t('workflows.title')}
      meta={`${workflows.length} workflows on record`}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      search={<SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('workflows.searchPlaceholder')} />}
      actions={
        <>
          <button onClick={toggleFilter} className="btn-quiet">{t('workflows.filter')}: {statusFilter}</button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">{t('workflows.newWorkflow')}</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          [t('workflows.stats.totalExecutions'), executions.length],
          [t('workflows.stats.successRate'), executions.length === 0 ? '—' : `${Math.round(((executions.length - executions.filter((e) => e.status === 'failed').length) / executions.length) * 100)}%`],
          [t('workflows.stats.activeNodes'), workflows.filter((w) => w.active).length],
          [t('workflows.stats.failedRuns'), executions.filter((e) => e.status === 'failed').length],
        ].map(([label, value]) => (
          <div key={label} className="card-flat p-4">
            <p className="label-caps !text-[10px]">{label}</p>
            <p className="text-[24px] font-bold tracking-tight mt-1 text-cream">{value}</p>
          </div>
        ))}
      </div>

      <div className="card-flat overflow-hidden mb-4">
        <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] font-semibold text-smoke uppercase tracking-[0.12em]" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="col-span-4">{t('workflows.table.name')}</div>
          <div className="col-span-2">{t('workflows.table.lastRun')}</div>
          <div className="col-span-3">{t('workflows.table.successRate')}</div>
          <div className="col-span-2">{t('workflows.table.status')}</div>
          <div className="col-span-1 text-right">{t('workflows.table.actions')}</div>
        </div>

        <div>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-[13px] text-sand">No workflows. Create one to get started.</div>
          )}
          {filtered.map((wf) => {
            const stats = statsByWorkflow[wf.id] || { total: 0, failed: 0, last: null };
            const rate = stats.total === 0 ? 0 : Math.round(((stats.total - stats.failed) / stats.total) * 100);
            return (
              <div key={wf.id} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="col-span-12 md:col-span-4 flex items-center gap-3 mb-2 md:mb-0">
                  <span className="w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: 'rgba(212,163,115,0.14)', color: '#D4A373', border: '1px solid rgba(212,163,115,0.3)' }}>
                    {monogramOf(wf.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold truncate text-cream">{wf.name}</p>
                    <p className="text-[10px] text-smoke font-mono">{wf.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-[12px] text-sand">
                  {stats.last ? new Date(stats.last).toLocaleString() : '—'}
                </div>
                <div className="col-span-8 md:col-span-3 flex items-center gap-3 pr-4">
                  <div className="flex-1 h-1 rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${rate}%`, background: rate > 90 || stats.total === 0 ? '#84A98C' : '#C96A5E' }} />
                  </div>
                  <span className="text-[12px] font-semibold font-mono text-cream">{stats.total === 0 ? '—' : `${rate}%`}</span>
                </div>
                <div className="col-span-6 md:col-span-2 flex items-center gap-2 mt-2 md:mt-0">
                  <button onClick={() => toggleActive(wf)} className="flex items-center gap-2">
                    <span className="w-8 h-[18px] rounded-full relative transition-colors" style={{ background: wf.active ? '#84A98C' : 'rgba(255,255,255,0.18)' }}>
                      <span className="absolute top-[2px] w-[14px] h-[14px] rounded-full" style={{ left: wf.active ? '16px' : '2px', transition: 'left 0.15s', background: '#1C1917' }} />
                    </span>
                  </button>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-sand">
                    <StatusDot tone={wf.active ? 'active' : 'idle'} />
                    {wf.active ? t('common.active') : t('common.idle')}
                  </span>
                </div>
                <div className="col-span-6 md:col-span-1 text-right mt-2 md:mt-0 flex md:block justify-end gap-3">
                  <button onClick={() => navigate('/builder')} className="text-[12px] font-semibold text-ochre hover:underline">Open</button>
                  <button onClick={() => handleDelete(wf.id)} className="text-[12px] font-medium text-smoke hover:text-brick md:ml-3">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7 card-flat p-5">
          <p className="label-caps">{t('workflows.tips.title')}</p>
          <p className="text-[13px] text-sand leading-relaxed mt-2">
            {t('workflows.tips.desc')} <span className="font-mono text-[11px] text-cream" style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '1px 5px' }}>WF-0023-A</span>
          </p>
        </div>
        <div className="md:col-span-5 rounded-xl p-5 bg-coal" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-smoke">{t('workflows.upcoming.badge')}</p>
          <p className="text-[15px] font-bold tracking-tight mt-1.5 text-cream">{t('workflows.upcoming.title')}</p>
          <button className="text-[12px] font-semibold mt-4 text-ochre hover:underline">{t('common.learnMore')} →</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-panel rounded-xl w-full max-w-md overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('workflows.modal.createTitle')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[12px] font-medium text-sand hover:text-cream">Close</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="label-caps block mb-2">{t('workflows.modal.nameLabel')}</label>
                <input autoFocus required placeholder={t('workflows.modal.namePlaceholder')} className="field" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-quiet flex-1">{t('common.cancel')}</button>
                <button type="submit" className="btn-primary flex-1">{t('workflows.modal.submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
};

export default WorkflowsPage;
