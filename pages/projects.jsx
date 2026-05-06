import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { api } from "../service/api";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, User, 
  Plus, Monitor, Shield, Cloud, CheckCircle, ChevronRight,
  Search, Bell, HelpCircle, ExternalLink, MoreHorizontal,
  Menu, X
} from 'lucide-react';

const ProjectsDashboard = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', tag: t("projects.defaultTag") });
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects()
      .then(setProjects)
      .catch(err => console.error("Failed to fetch projects", err));
  }, []);

  const featuredProject = useMemo(() => projects.find(p => p.isFeatured), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projects]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    
    setIsCreating(true);
    // Simulate API delay
    setTimeout(() => {
      const projectToAdd = {
        ...newProject,
        id: Date.now(),
        color: "text-blue-600",
        isFeatured: false
      };
      setProjects(prev => [...prev, projectToAdd]);
      setIsCreating(false);
      setIsCreateModalOpen(false);
      setNewProject({ title: '', description: '', tag: t("projects.defaultTag") });
    }, 800);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar - Shared Design System */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#0052cc] rounded flex items-center justify-center text-white font-bold text-xs shadow-inner">A</div>
            <div>
              <h1 className="text-xs font-black leading-tight uppercase tracking-tighter">{t("sidebar.core")}</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">v2.4.0-stable</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} active onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/account" icon={<User size={18} />} label={t("sidebar.account")} onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => navigate('/builder')}
            className="w-full bg-[#0061e0] hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            {t("sidebar.newWorkflow")}
          </button>
          <div className="pt-4 border-t border-slate-100 space-y-3">
             <div onClick={() => setShowSupport(true)} className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
                <HelpCircle size={16} /> {t("sidebar.support")}
             </div>
             <div onClick={() => setShowStatus(true)} className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
                <Monitor size={16} /> {t("sidebar.status")}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t("projects.searchPlaceholder")} 
              className="w-full bg-[#f1f5f9] border-none rounded-lg py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowNotifications(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
            </button>
            <button onClick={() => setShowSupport(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-[#0061e0] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 min-w-[140px]"
            >
              {isDeploying ? t("common.processing") : t("header.deploy")}
            </button>
            <Link to="/account" className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white shadow-sm ring-2 ring-blue-50 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
            </Link>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("projects.title")}</h2>
              <p className="text-slate-500 mt-1 max-w-xl">{t("projects.subtitle")}</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#0061e0] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors active:scale-95"
            >
               <Plus size={18} /> {t("projects.createBtn")}
            </button>
          </div>

          {/* Top Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <SummaryCard label={t("projects.stats.nodes")} value="0" trend="0%" trendLabel={t("projects.trends.cycle")} trendUp />
            <SummaryCard label={t("projects.stats.activeFlows")} value={projects.length.toString()} dotColor="bg-green-500" sub={t("projects.status.operational")} />
            <SummaryCard label={t("projects.stats.latency")} value="0ms" icon={<Activity size={12} className="text-blue-500" />} sub={t("projects.status.optimized")} />
            <SummaryCard label={t("projects.stats.efficiency")} value="0%" progress={0} />
          </div>

          {/* Main Projects Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {featuredProject && filteredProjects.some(p => p.id === featuredProject.id) && (
            <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900">{t(featuredProject.title)}</h3>
                                <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{t(featuredProject.tag)}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{t(featuredProject.description)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">{t("projects.details.workflows")}</h4>
                        <ul className="space-y-3">
                            <li className="text-xs text-slate-400 italic">{t("dashboard.noRecent")}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">{t("projects.details.teamAssets")}</h4>
                        <div className="text-[10px] text-slate-400 font-bold">{t("account.managingTeam")}</div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">{t("projects.details.heatmap")}</h4>
                        <div className="h-12 bg-slate-50 rounded border border-dashed border-slate-200"></div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div className="flex gap-6 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        <span className="cursor-pointer hover:underline">{t("projects.actions.viewArch")}</span>
                        <span className="cursor-pointer hover:underline">{t("projects.actions.settings")}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{t("projects.status.lastSync", { time: "N/A" })}</span>
                </div>
            </div>
            )}

            {/* Neural Feed Sidebar Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6">
                    <Activity size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{t("projects.neural.title")}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{t("projects.neural.desc")}</p>
                
                <div className="bg-slate-50 p-4 rounded-xl mb-6">
                    <div className="flex justify-between text-[10px] font-bold mb-2">
                        <span className="text-slate-400">{t("projects.neural.load")}</span>
                        <span className="text-slate-900">0%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[0%]"></div>
                    </div>
                </div>

                <div className="space-y-3 mb-8"></div>

                <button className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors mt-auto">
                    {t("projects.actions.openDash")}
                </button>
            </div>

            {/* Small Project Cards */}
            {filteredProjects.filter(p => !p.isFeatured).map(project => (
              <ProjectCardSmall key={project.id} {...project} />
            ))}
            
            {/* Create Card */}
            <div 
              onClick={() => setIsCreateModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
            >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-900">{t("projects.createCard.title")}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">{t("projects.createCard.subtitle")}</p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{t("projects.health.title")}</h4>
                <div className="space-y-4">
                </div>
            </div>

            <div className="col-span-7 bg-[#1e293b] rounded-2xl p-6 shadow-2xl">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex justify-between items-center">
                    <span>{t("projects.terminal.title")}</span>
                    <MoreHorizontal size={14} />
                </div>
                <div className="font-mono text-[11px] space-y-1.5">
                </div>
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{t("projects.modal.title")}</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("projects.modal.name")}</label>
                  <input 
                    autoFocus
                    type="text" 
                    required
                    placeholder={t("projects.modal.namePlace")}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("projects.modal.desc")}</label>
                  <textarea 
                    placeholder={t("projects.modal.descPlace")}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("projects.modal.tag")}</label>
                  <input 
                    type="text" 
                    placeholder={t("projects.modal.tagPlace")}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={newProject.tag}
                    onChange={(e) => setNewProject({...newProject, tag: e.target.value})}
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2.5 bg-[#0061E0] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isCreating ? t("common.processing") : t("projects.modal.submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Slide-over Panels */}
        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
        <StatusPanel isOpen={showStatus} onClose={() => setShowStatus(false)} />
      </main>
    </div>
  );
};

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
      </div>
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t("projects.title")}</p>
        <p className="text-xs font-bold text-slate-800">{t("projects.terminalLogs.collabOk")}</p>
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
            {t("header.docs")} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
            {t("support.apiReference")} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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

const StatusPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
  <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t("projects.healthTitle")}</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
    </div>
    <div className="p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("common.latency")}</span>
          <span className="text-xs font-bold text-green-600">99.9%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[99%]"></div></div>
      </div>
      <div className="space-y-3">
        {[t("projects.status.usEastCluster"), t("projects.status.euWestCluster"), t("projects.status.globalCdn")].map(reg => (
          <div key={reg} className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{t(`projects.clusterStatus.${reg}`)}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);};

/* --- Component Helpers --- */

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#0052cc] font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const SummaryCard = ({ label, value, trend, trendLabel, trendUp, dotColor, icon, sub, progress }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        {trend && <span className={`text-[10px] font-bold ${trendUp ? 'text-green-500' : 'text-blue-500'}`}>{trend}</span>}
    </div>
    {progress ? (
        <div className="h-1 w-full bg-slate-100 rounded-full mt-4">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    ) : (
        <div className="flex items-center gap-2 mt-2">
            {dotColor && <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>}
            {icon && icon}
            <span className="text-[10px] text-slate-400 font-bold">{trendLabel || sub}</span>
        </div>
    )}
  </div>
);

const StatusItem = ({ label, active }) => (
    <div className="flex items-center justify-between text-[11px] font-bold">
        <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-slate-700">{label}</span>
        </div>
        <span className="text-slate-400 uppercase text-[9px]">Active</span>
    </div>
);

const ProjectCardSmall = ({ icon, title, description, color, alert, badge }) => {
    const { t } = useTranslation();
    return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 bg-blue-50 ${color} rounded-lg flex items-center justify-center`}>
                {icon}
            </div>
            <MoreHorizontal size={16} className="text-slate-300" />
        </div>
        <h4 className="text-sm font-black text-slate-900 mb-1">{t(title)}</h4>
        <p className="text-[10px] text-slate-400 font-bold leading-tight mb-6">{t(description)}</p>
        
        <div className="flex justify-between items-center">
            <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-md bg-slate-200 border border-white"></div>
                <div className="w-6 h-6 rounded-md bg-slate-300 border border-white"></div>
            </div>
            {alert && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">{t(alert)}</span>}
            {badge && <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">{t(badge)}</span>}
        </div>
    </div>
);};

const HealthRow = ({ label, status }) => (
    <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-100"></div>
        <div className="flex items-center gap-3 shrink-0">
            <p className="text-xs font-bold text-slate-700">{label}</p>
            <div className={`w-2 h-2 rounded-full ${status === 'green' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
        </div>
    </div>
);

export default ProjectsDashboard;