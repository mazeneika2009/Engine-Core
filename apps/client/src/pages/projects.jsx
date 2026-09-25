import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../LanguageContext';
import { api } from '../service/api';
import { Page, SearchInput, SlidePanel, StatusDot } from '../components/shell';

const monogramOf = (s) => (s || 'PR').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'PR';

const ProjectsDashboard = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [health, setHealth] = useState(null);
  const navigate = useNavigate();

  const reload = async () => {
    const list = await api.getWorkflows();
    setWorkflows(list || []);
  };

  useEffect(() => {
    reload();
    api.health().then(setHealth).catch(() => setHealth({ status: 'unknown', database: 'down' }));
  }, []);

  const filtered = useMemo(() => workflows.filter((w) =>
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, workflows]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await api.createWorkflow({ name: newTitle.trim(), nodes: [], connections: [] });
    setIsCreateModalOpen(false);
    setNewTitle('');
    reload();
  };

  const handleDelete = async (id) => {
    await api.deleteWorkflow(id);
    reload();
  };

  return (
    <Page
      active="projects"
      title={t('projects.title')}
      meta={t('projects.subtitle')}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      search={<SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('projects.searchPlaceholder')} />}
      actions={
        <>
          <button onClick={() => setShowStatus(true)} className="btn-quiet hidden sm:block">Status</button>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">{t('projects.createBtn')}</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          [t('projects.stats.nodes'), workflows.reduce((sum, w) => sum + (w.nodes || []).length, 0)],
          [t('projects.stats.activeFlows'), workflows.filter((w) => w.active).length],
          [t('projects.stats.latency'), '0ms'],
          [t('projects.stats.efficiency'), workflows.length === 0 ? '—' : '100%'],
        ].map(([label, value]) => (
          <div key={label} className="card-flat p-4">
            <p className="label-caps !text-[10px]">{label}</p>
            <p className="text-[24px] font-bold tracking-tight mt-1 text-cream">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {filtered.map((project) => (
          <div key={project.id} className="card-flat p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold" style={{ background: 'rgba(212,163,115,0.14)', color: '#D4A373', border: '1px solid rgba(212,163,115,0.3)' }}>
                {monogramOf(project.name)}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-sand">
                <StatusDot tone={project.active ? 'active' : 'idle'} />
                {project.active ? 'Active' : 'Idle'}
              </span>
            </div>
            <h4 className="text-[13px] font-bold tracking-tight text-cream">{project.name}</h4>
            <p className="text-[11px] text-smoke mt-1 font-mono">{(project.nodes || []).length} nodes</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate('/builder')} className="text-[12px] font-semibold text-ochre hover:underline">Open</button>
              <button onClick={() => handleDelete(project.id)} className="text-[12px] font-medium text-smoke hover:text-brick">Delete</button>
            </div>
          </div>
        ))}

        <button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl p-6 text-center transition-colors hover:bg-white/[0.03]" style={{ border: '1px dashed rgba(255,255,255,0.2)' }}>
          <p className="text-[13px] font-bold text-cream">{t('projects.createCard.title')}</p>
          <p className="text-[11px] text-smoke mt-1">Start a new workspace</p>
        </button>
      </div>

      <div className="rounded-xl p-5 font-mono text-[11px] leading-relaxed bg-coal" style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#A8A29E' }}>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-smoke mb-3">{t('projects.terminal.title')}</p>
        <p>$ engine status — {health ? `${health.status} / db ${health.database}` : 'checking…'}</p>
        <p>$ {workflows.length} workflows loaded</p>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-panel rounded-xl w-full max-w-md" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('projects.modal.title')}</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[12px] font-medium text-sand hover:text-cream">Close</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="label-caps block mb-2">{t('projects.modal.name')}</label>
                <input autoFocus required placeholder={t('projects.modal.namePlace')} className="field" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-quiet flex-1">{t('common.cancel')}</button>
                <button type="submit" className="btn-primary flex-1">{t('projects.modal.submit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SlidePanel open={showStatus} onClose={() => setShowStatus(false)} title="System Health">
        <div className="flex justify-between items-center mb-2">
          <span className="label-caps !text-[10px]">Engine API</span>
          <span className="text-[12px] font-bold" style={{ color: health?.database === 'up' ? '#84A98C' : '#D4A373' }}>
            {health ? `${health.status} / db ${health.database}` : 'checking…'}
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/10 mb-5">
          <div className="h-full rounded-full bg-sage" style={{ width: health?.database === 'up' ? '99%' : '40%' }} />
        </div>
        {['US-East', 'EU-West', 'Global CDN'].map((reg) => (
          <div key={reg} className="flex items-center justify-between py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[12px] font-medium text-cream">{reg}</span>
            <StatusDot tone="active" />
          </div>
        ))}
      </SlidePanel>
    </Page>
  );
};

export default ProjectsDashboard;
