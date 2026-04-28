import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, 
  Search, Bell, HelpCircle, Plus, Filter, ChevronLeft, ChevronRight,
  Lightbulb, ArrowRight, Code, Globe, Database, BellRing,
  Menu, X
} from 'lucide-react';

const WorkflowsPage = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'error'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const navigate = useNavigate();

  const [workflowsList, setWorkflowsList] = useState([
    { id: "WF-9921-X", name: "Customer Onboarding Sync", time: "2 mins ago", duration: "1.4s", rate: 100, active: true, isError: false, icon: <Code size={18} className="text-blue-600" /> },
    { id: "WF-2104-Y", name: "Stripe Transaction Webhook", time: "14 mins ago", duration: "0.8s", rate: 98.4, active: true, isError: false, icon: <Globe size={18} className="text-blue-600" /> },
    { id: "WF-0023-A", name: "Data Warehouse Export", time: "Failed 2h ago", duration: "42s", rate: 45.2, active: false, isError: true, icon: <Database size={18} className="text-red-600" /> },
    { id: "WF-1188-C", name: "Slack Alerting Router", time: "Just now", duration: "0.2s", rate: 100, active: true, isError: false, icon: <BellRing size={18} className="text-blue-600" /> },
  ]);

  const filteredWorkflows = useMemo(() => {
    return workflowsList.filter(wf => {
      const matchesSearch = wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           wf.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && !wf.isError) || 
                           (statusFilter === 'error' && wf.isError);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, workflowsList]);

  const toggleActive = useCallback((id) => {
    setWorkflowsList(prev => prev.map(wf => 
      wf.id === id ? { ...wf, active: !wf.active } : wf
    ));
  }, []);

  const paginatedWorkflows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWorkflows.slice(start, start + itemsPerPage);
  }, [filteredWorkflows, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const toggleFilter = () => {
    const modes = ['all', 'active', 'error'];
    const nextIndex = (modes.indexOf(statusFilter) + 1) % modes.length;
    setStatusFilter(modes[nextIndex]);
  };

  const handleCreateWorkflow = (e) => {
    e.preventDefault();
    if (!newWorkflow.name.trim()) return;
    setIsModalOpen(false);
    navigate('/builder', { state: { ...newWorkflow } });
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar - Consistent with previous screens */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-10">
            <h1 className="text-xl font-black tracking-tight text-[#001b71]">{t("sidebar.core")}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.4.0</p>
          </div>
          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} active onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/account" icon={<Settings size={18} />} label={t("sidebar.account")} onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-6">
          <Link to="/settings" className="flex items-center gap-3 text-slate-500 text-sm cursor-pointer hover:text-slate-800">
            <Settings size={18} /> {t("sidebar.settings")}
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
            </div>
            <div>
              <p className="text-xs font-bold">{t("common.userName")}</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{t("common.adminAccess")}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white px-8 flex items-center justify-between border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t("workflows.searchPlaceholder")} 
              className="w-full bg-[#f1f5f9] border-none rounded-lg py-2 pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setShowNotifications(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
            </button>
            <button onClick={() => setShowSupport(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-[#0061E0] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 min-w-[100px]"
            >
              {isDeploying ? t("common.processing") : t("header.deploy")}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("workflows.title")}</h2>
              <p className="text-slate-500 mt-1">{t("workflows.subtitle")}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={toggleFilter}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold shadow-sm transition-colors ${statusFilter !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                <Filter size={16} /> {t("workflows.filter")}: {statusFilter === 'all' ? t("workflows.all") : statusFilter === 'active' ? t("workflows.active") : t("workflows.errors")}
              </button>
              <button 
                onClick={() => {
                  setNewWorkflow({ name: '', description: '' });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0061E0] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100"
              >
                <Plus size={18} /> {t("workflows.newWorkflow")}
              </button>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            <AccentCard 
              label={t("workflows.stats.totalExecutions")} 
              value="1.2M" 
              sub="+12%" 
              borderColor="border-blue-600" 
              onClick={() => setStatusFilter('all')}
              active={statusFilter === 'all'}
            />
            <AccentCard 
              label={t("workflows.stats.successRate")} 
              value="99.98%" 
              sub={t("workflows.stats.performance")} 
              borderColor="border-green-600" 
              subColor="text-green-600" 
              onClick={() => setStatusFilter('active')}
              active={statusFilter === 'active'}
            />
            <AccentCard label={t("workflows.stats.activeNodes")} value="412" sub="v2.4.0" borderColor="border-slate-800" />
            <AccentCard 
              label={t("workflows.stats.failedRuns")} 
              value="14" 
              sub={t("workflows.stats.attention")} 
              borderColor="border-red-600" 
              subColor="text-red-600" 
              onClick={() => setStatusFilter('error')}
              active={statusFilter === 'error'}
            />
          </div>

          {/* Workflow List Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <div className="col-span-4">{t("workflows.table.name")}</div>
              <div className="col-span-2">{t("workflows.table.lastRun")}</div>
              <div className="col-span-3">{t("workflows.table.successRate")}</div>
              <div className="col-span-2">{t("workflows.table.status")}</div>
              <div className="col-span-1 text-right">{t("workflows.table.actions")}</div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {paginatedWorkflows.length > 0 ? (
                paginatedWorkflows.map((wf) => (
                  <WorkflowRow key={wf.id} {...wf} onToggle={() => toggleActive(wf.id)} />
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium text-sm">{t("workflows.noWorkflows")}</div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 flex justify-between items-center border-t border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <span>
                  {Math.min((currentPage - 1) * itemsPerPage + 1, filteredWorkflows.length)} - {Math.min(currentPage * itemsPerPage, filteredWorkflows.length)} / {filteredWorkflows.length}
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2 border border-slate-100 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft size={14}/>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg transition-all ${currentPage === i + 1 ? 'bg-blue-700 text-white shadow-md' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-2 border border-slate-100 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 bg-[#eef2ff]/50 border border-blue-100 rounded-2xl p-8 flex gap-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h4 className="text-lg font-black text-slate-900">{t("workflows.tips.title")}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {t("workflows.tips.desc")} 
                        <code className="mx-1 bg-white px-1.5 py-0.5 rounded border border-blue-100 text-blue-600 font-mono text-[10px]">WF-0023-A</code>.
                    </p>
                </div>
            </div>
            
            <div className="col-span-5 relative bg-[#121826] rounded-2xl p-8 overflow-hidden group cursor-pointer">
                {/* Mock Background Image Effect */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000')] bg-cover bg-center"></div>
                <div className="relative z-10 h-full flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("workflows.upcoming.badge")}</p>
                    <h4 className="text-xl font-black text-white mb-4">{t("workflows.upcoming.title")}</h4>
                    <button className="mt-auto flex items-center gap-2 text-xs font-bold text-white group-hover:gap-4 transition-all">
                        {t("common.learnMore")} <ArrowRight size={14} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* New Workflow Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">{t("workflows.modal.createTitle")}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateWorkflow} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("workflows.modal.nameLabel")}</label>
                  <input 
                    autoFocus
                    type="text" 
                    required
                    placeholder={t("workflows.modal.namePlaceholder")}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("workflows.modal.descLabel")}</label>
                  <textarea 
                    placeholder={t("workflows.modal.descPlaceholder")}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#0061E0] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
                  >
                    {t("workflows.modal.submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Panels */}
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </div>
  );
};

/* --- Professional Overlay Components --- */

const NotificationPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
  <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t("notifications.title")}</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{t("notifications.systemUpdate")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.deployed")}</p>
        <p className="text-[10px] text-slate-400 mt-2">{t("notifications.time2h")}</p>
      </div>
      <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
        <p className="text-[10px] font-black text-red-600 uppercase mb-1">{t("notifications.executionError")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.failedMsg")}</p>
        <p className="text-[10px] text-slate-400 mt-2">{t("notifications.timeRecent")}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t("settings.security")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.apiKeyGenerated")}</p>
        <p className="text-[10px] text-slate-400 mt-2">{t("common.yesterday")}</p>
      </div>
    </div>
    <div className="p-4 border-t border-slate-50">
      <button className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">{t("notifications.markRead")}</button>
    </div>
  </div>
);};

const SupportPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
  <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t("support.title")}</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t("support.quickLinks")}</h4>
        <div className="space-y-2">
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
            {t("header.docs")} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
            {t("support.apiReference")} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
            {t("support.community")} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t("support.contactUs")}</h4>
        <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
          <p className="text-sm font-black mb-1">{t("support.needHelp")}</p>
          <p className="text-[10px] opacity-80 mb-4 leading-relaxed">{t("support.supportAvailability")}</p>
          <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">{t("support.chatBtn")}</button>
        </div>
      </div>
      <div className="pt-4 text-center">
        <p className="text-[10px] font-bold text-slate-400">{t("support.systemStatus")}</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-[10px] font-black text-green-600 uppercase">{t("support.nominal")}</span>
        </div>
      </div>
    </div>
  </div>
);};

/* --- Sub-components --- */

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const AccentCard = ({ label, value, sub, borderColor, subColor = "text-slate-400", onClick, active }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor} border-y border-r border-slate-100 transition-all cursor-pointer ${active ? 'ring-2 ring-blue-500/20 scale-[1.02] shadow-md' : 'hover:scale-[1.01] hover:shadow-md'}`}
  >
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <p className="text-2xl font-black text-slate-900 mb-1">{value}</p>
    <p className={`text-[10px] font-bold ${subColor}`}>{sub}</p>
  </div>
);

const WorkflowRow = ({ icon, name, id, time, duration, rate, active, isError, onToggle }) => {
  const { t } = useTranslation();
  return (

  <div className="grid grid-cols-12 px-8 py-5 items-center group hover:bg-slate-50/50 transition-colors">
    <div className="col-span-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isError ? 'bg-red-50' : 'bg-blue-50'}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-slate-800">{t(name)}</p>
            <p className="text-[10px] text-slate-400 font-medium">{t("common.id")}: {id}</p>
        </div>
    </div>
    <div className="col-span-2">
        <p className={`text-xs font-bold ${isError ? 'text-red-600' : 'text-slate-700'}`}>{t(time)}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 italic">{t("dashboard.table.duration")}: {t(duration)}</p>
    </div>
    <div className="col-span-3 flex items-center gap-4 pr-10">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${rate > 90 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${rate}%` }}></div>
        </div>
        <span className="text-xs font-black text-slate-700 min-w-[40px]">{rate}%</span>
    </div>
    <div className="col-span-2">
        <div 
          onClick={onToggle}
          className={`w-10 h-5 rounded-full p-1 relative cursor-pointer transition-colors ${active ? 'bg-green-800' : 'bg-slate-300'}`}
        >
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'ml-5' : 'ml-0'}`}></div>
        </div>
    </div>
    <div className="col-span-1 text-right text-slate-300">
        ⋮
    </div>
  </div>
);};

export default WorkflowsPage;