import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { api } from "../service/api";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, 
  Search, Bell, HelpCircle, Plus, AlertTriangle, Zap, CheckCircle2, TrendingDown, ArrowUpRight,
  Menu, X
} from 'lucide-react';

const EngineDashboard = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, executions: 0, errors: 0 });
  const [executions, setExecutions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, workflowsData] = await Promise.all([
          api.getDashboardStats(),
          api.getWorkflows()
        ]);
        setStats(statsData);
        // Using first few workflows as mock executions for now if logs aren't filtered
        setExecutions(workflowsData.slice(0, 5));
      } catch (error) {
        console.error("Dashboard loading failed", error);
      }
    };
    loadDashboardData();
  }, []);

  const filteredExecutions = useMemo(() => {
    return executions.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, executions]);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-xl font-black tracking-tight italic">{t("sidebar.core")}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.4.0</p>
          </div>

          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} active onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => navigate('/builder')}
            className="w-full bg-[#0061E0] hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={18} /> {t("sidebar.newWorkflow")}
          </button>
          
          <div className="bg-[#f1f5f9] p-3 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-500 flex items-end justify-center">
                    <div className="w-6 h-6 bg-slate-300 rounded-t-full"></div>
                </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">{t("common.userName")}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase">{t("common.adminAccess")}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white px-8 flex items-center justify-between border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t("header.search")} 
              className="w-full bg-[#f1f5f9] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowNotifications(true)} className="relative p-1 hover:bg-slate-50 rounded-full transition-colors focus:outline-none">
                <Bell size={20} className="text-slate-600" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
            </button>
            <button onClick={() => setShowSupport(true)} className="p-1 hover:bg-slate-50 rounded-full transition-colors focus:outline-none">
              <HelpCircle size={20} className="text-slate-600" />
            </button>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-[#eef2ff] text-[#0061E0] px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50 min-w-[100px]"
            >
              {isDeploying ? t("common.processing") : t("header.deploy")}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {/* Dashboard Title Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t("dashboard.title")}</h2>
              <p className="text-slate-500 mt-1">{t("dashboard.subtitle")}</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold border border-blue-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {t("dashboard.uptime")}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard 
                icon={<Activity className="text-blue-600" size={18}/>} 
                value={stats.workflows} 
                label={t("dashboard.stats.workflows")} 
                trend={t("dashboard.trends.workflows")} 
                trendColor="text-green-600 bg-green-50" 
            />
            <StatCard 
                icon={<Zap className="text-yellow-500" size={18}/>} 
                value={stats.executions} 
                label={t("dashboard.stats.executions")} 
                trend={t("dashboard.trends.executions")} 
                trendColor="text-blue-600 bg-blue-50" 
            />
            <StatCard 
                icon={<AlertTriangle className="text-red-500" size={18}/>} 
                value={stats.errors} 
                label={t("dashboard.stats.errors")} 
                trend={t("dashboard.trends.errors")} 
                trendColor="text-red-600 bg-red-50" 
                isError
            />
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Chart Area */}
            <div className="col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800">{t("dashboard.successRateTitle")}</h3>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['week', 'month', 'all'].map(filter => (
                        <button key={filter} className={`px-4 py-1 text-[10px] font-bold rounded-md ${filter === 'week' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}>{t(`dashboard.chartFilters.${filter}`)}</button>
                    ))}
                </div>
              </div>
              <div className="relative h-64 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0061E0" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#0061E0" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M0,150 L800,150 L800,200 L0,200 Z" fill="url(#chartGradient)" />
                    <path d="M0,150 L800,150" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4" />
                </svg>
                <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => <span key={day}>{t(`dashboard.days.${day}`)}</span>)}
                </div>
              </div>
            </div>

            {/* Integrity Card */}
            <div className="col-span-1 bg-[#232a3b] rounded-2xl p-8 text-white flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{t("dashboard.integrity")}</p>
                <h3 className="text-4xl font-black mb-8 tracking-tight">0%</h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-[11px] font-bold mb-2">
                            <span className="text-slate-400">{t("dashboard.latency")}</span>
                            <span className="text-green-400">0ms</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-green-400 h-full w-[0%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[11px] font-bold mb-2">
                            <span className="text-slate-400">{t("dashboard.cpu")}</span>
                            <span className="text-slate-300">0%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-white/40 h-full w-[0%]"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto bg-slate-700/30 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <p className="text-[10px] text-slate-300 leading-tight">{t("dashboard.nodesOptimal")}</p>
                </div>
            </div>
          </div>

          {/* Recent Executions Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{t("dashboard.recentExecutions")}</h3>
              <Link to="/logs" className="text-xs font-bold text-blue-600 hover:underline">{t("dashboard.viewLogs")}</Link>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">{t("dashboard.table.identity")}</th>
                  <th className="px-8 py-4">{t("dashboard.table.timestamp")}</th>
                  <th className="px-8 py-4">{t("dashboard.table.status")}</th>
                  <th className="px-8 py-4 text-right">{t("dashboard.table.duration")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredExecutions.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{t(ex.name)}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{t("common.id")}: {ex.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{t(ex.time)}</td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${ex.isFailed ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                        {t(`common.${ex.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500 text-right">{t(ex.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slide-over Panels */}
        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
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
        <p className="text-[10px] text-slate-400 mt-2">{t("notifications.time2h")}</p> 
      </div>
      <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
        <p className="text-[10px] font-black text-red-600 uppercase mb-1">{t("notifications.executionError")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.failedMsg")}</p>
        <p className="text-[10px] text-slate-400 mt-2">{t("notifications.timeRecent")}</p>
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
            {t("header.docs")} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group"> 
            {t("support.apiReference")} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold shadow-sm border-r-4 border-blue-700 rounded-r-none' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const StatCard = ({ icon, value, label, trend, trendColor, isError }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
    <div className="flex justify-between items-start mb-6">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${trendColor}`}>
            {isError ? <TrendingDown size={10}/> : <ArrowUpRight size={10}/>}
            {trend}
        </span>
    </div>
    <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{label}</div>
  </div>
);

export default EngineDashboard;