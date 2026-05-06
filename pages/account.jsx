import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, User, 
  Plus, Shield, Key, History, Users, Monitor, Trash2, ChevronDown, Zap,
  Globe, Menu, X
} from 'lucide-react';

const AccountDashboard = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const navigate = useNavigate();

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{t("sidebar.core")}</h1>
              <p className="text-[10px] text-slate-400">v2.4.0-stable</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/account" icon={<User size={18} />} label={t("sidebar.account")} active onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => navigate('/builder')}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md text-sm font-medium transition-all active:scale-95"
          >
            {t("sidebar.newWorkflow")}
          </button>
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div onClick={() => setShowSupport(true)} className="flex items-center gap-3 text-slate-500 text-sm cursor-pointer hover:text-slate-800 transition-colors">
              <span className="opacity-50">?</span> {t("sidebar.support")}
            </div>
            <div onClick={() => setShowStatus(true)} className="flex items-center gap-3 text-slate-500 text-sm cursor-pointer hover:text-slate-800 transition-colors">
              <Monitor size={16} /> {t("sidebar.status")}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <span className="text-blue-700 border-b-2 border-blue-700 h-14 flex items-center">{t("common.engineName")}</span>
            <button onClick={() => setShowSupport(true)} className="h-14 flex items-center hover:text-slate-900 transition-colors">{t("header.docs")}</button>
            <button onClick={() => setShowTemplates(true)} className="h-14 flex items-center hover:text-slate-900 transition-colors">{t("header.templates")}</button>
            <button onClick={() => setShowMarketplace(true)} className="h-14 flex items-center hover:text-slate-900 transition-colors">{t("header.marketplace")}</button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50 min-w-[140px]"
            >
              {isDeploying ? t("common.processing") : t("header.deploy")}
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-green-400 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-[10px] font-bold text-blue-700 tracking-widest uppercase">{t("common.systemConfig")}</p>
            <h2 className="text-3xl font-bold text-slate-900">{t("account.title")}</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Profile Section */}
            <div id="profile" className="col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-end justify-center overflow-hidden border border-slate-100">
                      <div className="w-14 h-14 bg-slate-300 rounded-t-full"></div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-blue-700 p-1.5 rounded-full text-white border-4 border-white">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t("common.userName")}</h3>
                    <p className="text-sm text-slate-500 mb-2">{t("account.role")}</p>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t("account.verified")}</span>
                  </div>
                </div>
                <button className="text-sm border border-slate-200 px-4 py-1.5 rounded-md font-medium text-slate-600 hover:bg-slate-50">{t("common.editProfile")}</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InputGroup label={t("account.fullName")} value={t("common.userName")} />
                <InputGroup label={t("account.emailAddress")} value="alex.rivero@axiom-logic.io" />
                <SelectGroup label={t("account.language")} value={t("account.languageValues")} /> 
                <SelectGroup label={t("account.timezone")} value={t("account.timezoneValue")} />
              </div>
            </div>

            {/* Security Score */}
            <div className="space-y-6">
              <div className="bg-blue-700 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} />
                  <span className="text-sm font-semibold">{t("account.securityScore")}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-blue-300 text-sm">/ 100</span>
                </div>
                <div className="w-full bg-blue-800 h-1.5 rounded-full mb-4">
                  <div className="bg-green-400 h-full w-[0%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-blue-200 uppercase tracking-tighter">{t("account.securityDesc")}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 mb-4 tracking-wider">{t("account.securityShortcuts")}</p>
                <div className="space-y-2">
                  <ShortcutButton icon={<Key size={14} />} label={t("account.rotateApiKeys")} />
                  <ShortcutButton icon={<History size={14} />} label={t("account.auditLogs")} />
                </div>
              </div>
            </div>

            {/* Team Management */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg">{t("account.teamTitle")}</h3>
                  <p className="text-[11px] text-slate-400">0 engineers active</p>
                </div>
                <button className="p-2 text-blue-700 bg-blue-50 rounded-md"><Users size={18} /></button>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-slate-400 italic">No team members found.</p>
              </div>
            </div>

            {/* Security & Access */}
            <div className="col-span-2 bg-blue-50/50 p-8 rounded-xl shadow-sm border border-blue-100">
               <h3 className="font-bold text-lg mb-6">{t("account.securityAccessTitle")}</h3>
               <div className="grid grid-cols-2 gap-4">
                  <SecurityCard title={t("account.twoFactorAuth")} status={t("common.active")} action="MANAGE" icon={<Shield size={20} className="text-green-600"/>}/>
                  <SecurityCard title={t("account.password")} status={t("account.passwordChanged")} action="UPDATE" icon={<History size={20} className="text-blue-600"/>}/>
               </div>
               <div className="mt-6">
                  <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">{t("account.activeSessions")}</p>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-xs text-slate-400 italic">Current session active</span>
                  </div>
               </div>
            </div>

            {/* Workspace Environment */}
            <div className="col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-4">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold">{t("account.workspaceEnv")}</h3>
                  <p className="text-sm text-slate-400">{t("account.workspaceEnvDesc")}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-slate-50 text-slate-600 text-sm font-medium rounded-md">{t("account.archiveWorkspace")}</button>
                  <button className="px-6 py-2 bg-blue-700 text-white text-sm font-medium rounded-md shadow-md">{t("account.saveChanges")}</button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-12">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-700">❄</span>
                    <Globe size={16} className="text-blue-700" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">{t("account.nodeDist")}</h4> 
                  </div> 
                  <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">{t("account.nodeDistDesc")}</p> 
                  <div className="flex flex-wrap gap-2">
                    <RegionBadge label={t("account.usEast")} active />
                    <RegionBadge label={t("account.euCentral")} />
                    <RegionBadge label={t("account.apSoutheast")} />
                  </div>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-700">⚡</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">{t("account.autoScaleThreshold")}</h4> 
                  </div> 
                  <p className="text-[11px] text-slate-400 mb-8 leading-relaxed">{t("account.autoScaleThresholdDesc")}</p> 
                  <input type="range" className="w-full h-1 bg-slate-100 appearance-none rounded-full accent-blue-700" />
                  <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>{t("account.precision")}</span>
                    <span>{t("account.throughput")}</span>
                  </div>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-700">📊</span>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">{t("account.dataRetention")}</h4> 
                  </div> 
                  <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">{t("account.dataRetentionDesc")}</p> 
                  <div className="flex items-center gap-3">
                    <div className="w-16 border-b-2 border-blue-700 pb-1 text-center font-bold text-slate-700">30</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t("common.days")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Docs Section */}
            <div id="docs" className="col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-xl font-bold text-slate-900">{t("sidebar.support")}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{t("account.docsDesc")}</p>
              <button className="bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-colors">{t("account.openDocs")}</button>
            </div>

            {/* Templates Section */}
            <div id="templates" className="col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <Blocks className="text-purple-600" size={20} />
                <h3 className="text-xl font-bold text-slate-900">{t("account.templatesTitle")}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{t("account.templatesDesc")}</p>
              <button className="bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-colors">{t("account.exploreTemplates")}</button>
            </div>

            {/* Marketplace Section */}
            <div id="marketplace" className="col-span-3 bg-[#121826] p-8 rounded-xl shadow-xl mt-4 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t("common.comingSoon")}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("account.marketplaceTitle")}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t("account.marketplaceDesc")}</p>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">{t("account.getNotified")}</button>
            </div>

            {/* Danger Zone */}
            <div className="col-span-3 border-2 border-dashed border-red-100 bg-red-50/30 p-6 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="text-red-600 font-bold">{t("account.dangerZone")}</h4>
                <p className="text-sm text-red-400">{t("account.dangerZoneDesc")}</p>
              </div>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-red-700 transition-colors">
                {t("account.terminate")}
              </button>
            </div>
          </div>
          
          <footer className="mt-12 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest pb-8">
            {t("common.footerText")}
          </footer>
        </div>

        {/* Slide-over Panels */}
        <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
        <TemplatesPanel isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
        <MarketplacePanel isOpen={showMarketplace} onClose={() => setShowMarketplace(false)} />
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
        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t("settings.security")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.apiKeyGenerated")}</p>
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
            {t("header.docs")} <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group"> 
            {t("support.apiReference")} <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
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

const TemplatesPanel = ({ isOpen, onClose }) => (
  <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Templates Hub</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {['E-commerce Sync', 'SaaS Onboarding', 'Security Monitor'].map(t => (
        <div key={t} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
          <p className="text-xs font-black text-blue-600 uppercase mb-1">Standard</p>
          <p className="text-sm font-bold text-slate-800">{t}</p>
          <p className="text-[10px] text-slate-400 mt-2">Ready to deploy automation sequence.</p>
        </div>
      ))}
    </div>
  </div>
);

const MarketplacePanel = ({ isOpen, onClose }) => (
  <div className={`fixed inset-y-0 right-0 w-96 bg-[#121826] shadow-2xl z-[150] flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
      <h3 className="text-sm font-black text-white uppercase tracking-widest">Engine Marketplace</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X size={18} /></button>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
        <Zap size={32} />
      </div>
      <h4 className="text-white font-black text-lg">Coming Soon</h4>
      <p className="text-slate-400 text-xs mt-2 leading-relaxed">Community nodes, custom logic blocks, and advanced integration triggers.</p>
      <button className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest">Get Notified</button>
    </div>
  </div>
);

const StatusPanel = ({ isOpen, onClose }) => (
  <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">System Health</h3>
      <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
    </div>
    <div className="p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</span>
          <span className="text-xs font-bold text-green-600">99.9%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[99%]"></div></div>
      </div>
      <div className="space-y-3">
        {['US-East Cluster', 'EU-West Cluster', 'Global CDN'].map(reg => (
          <div key={reg} className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{reg}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* Sub-components for cleaner structure */
const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const InputGroup = ({ label, value }) => (
  <div className="border-b border-slate-100 pb-2">
    <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wider">{label}</label>
    <div className="text-sm text-slate-700 font-medium">{value}</div>
  </div>
);

const SelectGroup = ({ label, value }) => {
  const values = typeof value === 'string' ? value.split(',').map(v => v.trim()) : [value];
  return (
    <div className="border-b border-slate-100 pb-2 flex justify-between items-end">
      <div>
        <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wider">{label} ({values.length})</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
              {v}
            </span>
          ))}
        </div>
      </div>
      <ChevronDown size={14} className="text-slate-400 shrink-0 mb-1" />
    </div>
  );
};

const ShortcutButton = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 transition-colors border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      <span className="text-blue-700">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  </button>
);

const TeamMember = ({ name, role, badge, color }) => (
  <div className="bg-white border border-slate-100 p-3 rounded-lg flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 ${color} rounded-md flex items-end justify-center overflow-hidden`}>
        <div className="w-5 h-5 bg-white/20 rounded-t-full"></div>
      </div>
      <div>
        <p className="text-sm font-bold leading-none">{name}</p>
        <p className="text-[10px] text-slate-400 uppercase mt-1">{role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
       <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${badge === 'ADMIN' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>{badge}</span>
       <span className="text-slate-300">⋮</span>
    </div>
  </div>
);

const SecurityCard = ({ icon, title, status, action }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className={`text-[10px] font-bold uppercase ${status === 'ACTIVE' ? 'text-green-500' : 'text-slate-400'}`}>{status}</p>
      </div>
    </div>
    <button className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{action}</button>
  </div>
);

const RegionBadge = ({ label, active = false }) => (
  <span className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${active ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
    {label}
  </span>
);

export default AccountDashboard;