import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { api } from "../service/api";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, 
  Search, Plus, X, AlertCircle, RotateCcw, Copy, ChevronRight,
  Bell, HelpCircle,
  Menu
} from 'lucide-react';

const ExecutionLogs = () => {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isReRunning, setIsReRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getLogs().then(data => {
      setLogsData(data);
      if (data.length > 0) setSelectedLog(data[0]);
    }).catch(err => console.error("Failed to fetch logs", err));
  }, []);

  const filteredLogs = useMemo(() => {
    return logsData.filter(log => 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.env.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, logsData]);

  const handleReRun = () => {
    setIsReRunning(true);
    setTimeout(() => setIsReRunning(false), 1000);
  };

  const handleReExecute = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 1200);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Same as previous screens */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-xl font-black tracking-tight text-[#001b71]">{t("sidebar.core")}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.4.0</p>
          </div>
          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} active onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/account" icon={<Settings size={18} />} label={t("sidebar.account")} onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => navigate('/builder')}
            className="w-full bg-[#0061E0] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform"
          >
            <Plus size={18} /> {t("sidebar.newWorkflow")}
          </button>
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
            <div>
              <p className="text-xs font-bold">{t("common.adminUser")}</p>
              <p className="text-[10px] text-slate-400">{t("common.adminEmail")}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white px-8 flex items-center border-b border-slate-100">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t("logs.table.searchPlaceholder")} 
              className="w-full bg-[#eef2ff]/50 border-none rounded-lg py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={() => setShowNotifications(true)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={18} />
            </button>
            <button onClick={() => setShowSupport(true)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t("logs.title")}</h2>
          <p className="text-slate-500 mt-1 mb-8 max-w-2xl">
            {t("logs.subtitle")}
          </p>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-[#eef2ff]/40 p-6 rounded-2xl border border-blue-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t("logs.stats.rate")}</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black">0%</span>
                    <span className="text-green-500 text-xs font-bold">↑ 0%</span>
                </div>
            </div>
            <div className="bg-[#eef2ff]/40 p-6 rounded-2xl border border-blue-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t("logs.stats.total")}</p>
                <span className="text-3xl font-black">{logsData.length}</span>
            </div>
            <div className="bg-[#eef2ff]/40 p-6 rounded-2xl border border-blue-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t("logs.stats.duration")}</p>
                <span className="text-3xl font-black">0s</span>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">{t("logs.table.id")}</th>
                  <th className="px-6 py-4">{t("logs.table.name")}</th>
                  <th className="px-6 py-4">{t("logs.table.start")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <LogTableRow key={log.id} {...log} t={t} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm">{t("logs.table.noResults")} "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-6 text-[11px] text-slate-400 font-medium">{t("logs.table.showing", { count: filteredLogs.length, unit: t("common.results") })}</div>
          </div>
        </div>

        {/* --- Slide-over Panel --- */}
        {isPanelOpen && (
          <div className="absolute inset-y-0 right-0 w-[420px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-lg font-black text-slate-900">{t("logs.details.title")}</h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{t("common.id")}: {selectedLog?.id}</p>
              </div>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Alert */}
              {selectedLog?.isFailed && (
              <div className="bg-white border border-red-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t("logs.details.failed")}</p>
                    <p className="text-xs font-bold text-slate-600">{t("common.step")}: {selectedLog?.failedStep || 'Unknown'}</p>
                  </div>
                </div>
                <button onClick={handleReRun} className="text-[10px] font-black text-blue-700 uppercase flex items-center gap-1 hover:text-blue-900 transition-colors">
                    <RotateCcw size={12} className={isReRunning ? 'animate-spin' : ''}/> {isReRunning ? t("common.retrying") : t("logs.details.rerun")}
                </button>
              </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoBox label={t("logs.details.env")} value={t(selectedLog?.env)} />
                <InfoBox label={t("logs.details.version")} value={selectedLog?.version || 'N/A'} />
                <InfoBox label={t("logs.details.source")} value={t(selectedLog?.source)} />
                <InfoBox label={t("logs.details.retries")} value={`${selectedLog?.retries || 0} ${t("common.of")} 3`} />
              </div>

              {/* Payload Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("logs.details.payload")}</p>
                  <button className="text-[9px] font-bold text-blue-700 flex items-center gap-1 uppercase tracking-tighter">
                    <Copy size={10}/> {t("logs.details.copyJson")}
                  </button>
                </div>
                <pre className="bg-[#232a3b] text-blue-100 p-4 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto">
                  {JSON.stringify(selectedLog?.payload || {}, null, 2)}
                </pre>
              </div>

              {/* Error Message */}
              {selectedLog?.error && (
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t("logs.details.errorMsg")}</p>
                 <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                    <p className="text-[11px] font-mono text-red-700 leading-normal">{selectedLog.error}</p>
                 </div>
              </div>
              )}

              {/* Execution Steps Timeline */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t("logs.details.steps")}</p>
                <div className="space-y-6 relative ml-2">
                   {selectedLog?.steps?.map((step, idx) => (
                     <TimelineStep key={idx} name={step.name} status={t(`common.${step.status}`)} time={step.duration} isLast={idx === selectedLog.steps.length - 1} isError={step.status === 'failed'} />
                   ))}
                </div>
              </div>
            </div>

            {/* Panel Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={handleReExecute}
                className="flex-1 bg-[#0061E0] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
              >
                {isExecuting ? t("common.processing") : t("logs.details.reexecute")}
              </button> 
              <button onClick={() => navigate('/builder')} className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform">
                {t("logs.details.viewBuilder")}
              </button>
            </div>
          </div>
        )}

        {/* Global Panels */}
        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
      </main>
    </div>
  );
};

/* --- Sub-components --- */

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
      <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
        <p className="text-[10px] font-black text-red-600 uppercase mb-1">{t("notifications.executionAlert")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.latencyDetected")}</p>
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

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const LogTableRow = ({ id, name, env, time, active, t }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${active ? 'bg-blue-50/30' : ''}`}>
    <td className="px-6 py-5">
      <span className="text-xs font-bold text-blue-600 hover:underline">{id}</span>
    </td>
    <td className="px-6 py-5">
      <p className="text-sm font-bold text-slate-800">{t(name)}</p>
      <p className="text-[10px] text-slate-400 font-medium">{t(env)}</p>
    </td>
    <td className="px-6 py-5 text-xs text-slate-500 font-medium">{t(time)}</td>
  </tr>
);

const InfoBox = ({ label, value }) => (
    <div className="bg-[#eef2ff]/40 p-3 rounded-xl border border-blue-50">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
);

const TimelineStep = ({ name, status, time, isLast, isError, active }) => (
    <div className="flex gap-4 relative">
        {!isLast && <div className="absolute left-[5px] top-4 bottom-[-24px] w-[1px] bg-slate-200"></div>}
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 z-10 shrink-0 ${isError ? 'bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]'}`}></div>
        <div>
            <p className="text-xs font-bold text-slate-800 leading-none">{name}</p>
            <p className="text-[10px] text-slate-400 mt-1">{status} • {time}</p>
        </div>
    </div>
);

export default ExecutionLogs;