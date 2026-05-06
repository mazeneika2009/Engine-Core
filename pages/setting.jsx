import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../LanguageContext";
import {
  LayoutDashboard,
  Activity,
  Hammer,
  FileText,
  Blocks,
  Settings,
  User,
  Plus,
  Monitor,
  Globe,
  Moon,
  Shield,
  Zap,
  Key,
  Bell,
  HelpCircle,
  Download,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const PlatformSettings = () => {
  const { lang, setLang, t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans transition-colors duration-300">
      {/* Sidebar - Shared Design System */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#0052cc] rounded flex items-center justify-center text-white font-bold text-xs shadow-inner">
              A
            </div>
            <div>
              <h1 className="text-xs font-black leading-tight uppercase tracking-tighter">
                {t("sidebar.core")}
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                v2.4.0-stable
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            <NavItem
              to="/"
              icon={<LayoutDashboard size={18} />}
              label={t("sidebar.dashboard")}
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/workflows"
              icon={<Activity size={18} />}
              label={t("sidebar.workflows")}
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/builder"
              icon={<Hammer size={18} />}
              label={t("sidebar.builder")}
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/logs"
              icon={<FileText size={18} />}
              label={t("sidebar.logs")}
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/projects"
              icon={<Blocks size={18} />}
              label={t("sidebar.projects")}
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/settings"
              icon={<Settings size={18} />}
              label={t("sidebar.settings")}
              active
              onClick={() => setIsSidebarOpen(false)}
            />
            <NavItem
              to="/account"
              icon={<User size={18} />}
              label={t("sidebar.account")}
              onClick={() => setIsSidebarOpen(false)}
            />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-4">
          <button className="w-full bg-[#0061e0] text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-100">
            {t("sidebar.newWorkflow")}
          </button>
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
              <span className="opacity-50">?</span> {t("sidebar.support")}
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
              <Monitor size={16} /> {t("sidebar.status")}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <button
              onClick={() =>
                document.getElementById("general")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="text-[#0052cc] border-b-2 border-[#0052cc] h-16 flex items-center focus:outline-none"
            >
              {t("settings.nav.general")}
            </button>
            <button
              onClick={() =>
                document.getElementById("docs")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="h-16 flex items-center hover:text-slate-900 transition-colors focus:outline-none"
            >
              {t("header.docs")}
            </button>
            <button
              onClick={() =>
                document.getElementById("templates")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="h-16 flex items-center hover:text-slate-900 transition-colors focus:outline-none"
            >
              {t("header.templates")}
            </button>
            <button
              onClick={() =>
                document.getElementById("marketplace")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="h-16 flex items-center hover:text-slate-900 transition-colors focus:outline-none"
            >
              {t("header.marketplace")}
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-200 pr-6 mr-1">
              <CheckCircle2 size={14} className="text-green-500" />
              {t("settings.systemSynced")}
            </div>

            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors focus:outline-none">
              {t("common.save")}
            </button>

            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={() => alert(t("settings.deployingMsg"))}
              className="bg-[#0061e0] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              {t("header.deploy")}
            </button>
            <Link
              to="/account"
              className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="avatar"
              />
            </Link>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                {t("common.active")}
              </span> 
              <span className="text-[10px] text-slate-400 font-bold">
                {t('common.lastConfigured', { time: t('2h ago') })} 
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {t("settings.title")}
            </h2>
            <p className="text-sm text-slate-500 mt-1"> 
              {t("settings.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {/* Regional Environment */}
            <div
              id="general"
              className="col-span-2 bg-white rounded-2xl border border-slate-100 p-8 flex flex-col shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <Globe className="text-blue-600" size={20} />
                  <h3 className="font-black text-slate-800">
                    {t("settings.regional")}
                  </h3>
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  {t("settings.localization")}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {t("settings.regionalDesc")}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t("settings.langLabel")}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    // The options themselves are usually displayed in their native language
                    // or a common English name for selection purposes. 
                    // The `t()` function is used for the label, not the option text.
                    // If you need to translate the option text, you'd add keys like "language.english"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none w-full"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic (العربية)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t("settings.timeLabel")}
                  </label> 
                  <input type="time" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none w-full" placeholder={t("settings.timePlaceholder")} /> 
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                <button className="bg-[#0061e0] text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all active:scale-95">
                  {t("settings.saveBtn")}
                </button>
              </div>
            </div>

            {/* Data Scrubbing */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <Shield className="text-green-600" size={20} />
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  {t("settings.privacy")}
                </span>
              </div>
              <h3 className="font-black text-slate-800 mb-2">{t("settings.dataScrubbing")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {t("settings.dataScrubbingDesc")}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-5 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t("common.disabled")}
                </span>
              </div>
            </div>

            {/* Beta Feature */}
            <div className="col-span-2 bg-[#eef2ff] rounded-2xl border border-blue-100 p-8 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  {t("common.betaFeature")}
                </span>
                <h3 className="font-black text-xl text-slate-900 mt-1 mb-2">
                  {t("settings.dynamicScaling")}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  {t("settings.dynamicScalingDesc")}
                </p>
              </div>
              <button className="bg-white border border-blue-200 text-blue-700 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                {t("settings.enableBeta")}
              </button>
            </div>

            {/* Docs Section */}
            <div
              id="docs"
              className="col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-xl font-bold text-slate-900">{t("header.docs")}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {t("account.docsDesc")}
              </p>
              <button className="bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-colors">
                {t("account.openDocs")}
              </button>
            </div>

            {/* Templates Section */}
            <div
              id="templates"
              className="col-span-3 bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Blocks className="text-purple-600" size={20} />
                <h3 className="text-xl font-bold text-slate-900">{t("account.templatesTitle")}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {t("account.templatesDesc")}
              </p>
              <button className="bg-slate-50 text-slate-700 px-5 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-colors">
                {t("account.exploreTemplates")}
              </button>
            </div>

            {/* Marketplace Section */}
            <div
              id="marketplace"
              className="col-span-3 bg-[#121826] p-8 rounded-xl shadow-xl mt-4 text-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t("common.comingSoon")}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("account.marketplaceTitle")}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t("account.marketplaceDesc")}
              </p>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">
                {t("account.getNotified")}
              </button>
            </div>
          </div>

          {/* API Credentials */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t("settings.apiTitle")}
                </h3>
                <p className="text-sm text-slate-500">
                  {t("settings.apiSubtitle")}
                </p>
              </div>
              <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> {t("settings.createNewKey")}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">{t("settings.identityName")}</th>
                    <th className="px-8 py-4">{t("settings.secretKey")}</th>
                    <th className="px-8 py-4">{t("settings.lastInvocation")}</th>
                    <th className="px-8 py-4">{t("common.status")}</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* API keys will appear here */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing & Usage */}
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-7 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {t("settings.billingTitle")}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {t("settings.currentPlan")}
                  </p>
                </div>
                <div className="w-12 h-10 bg-slate-100 rounded-lg" />
              </div>

              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>{t("settings.workflowExecutions")}</span>
                    <span className="text-slate-800">0 / 100,000</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>{t("settings.dataStorage")}</span>
                    <span className="text-slate-800">0 GB / 10 GB</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="border border-slate-200 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                  {t("settings.managePayment")}
                </button>
                <button className="bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">
                  {t("settings.upgradePlan")}
                </button>
              </div>
            </div>
            {/* Transaction History */}
            <div className="col-span-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                {t("settings.transactionHistory")}
              </p>
              <div className="space-y-4">
                 {/* Transaction history will appear here */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NotificationPanel = ({ isOpen, onClose, setShowNotifications }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          {t("header.notifications")}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
            {t("notifications.systemUpdate")}
          </p>
          <p className="text-xs font-bold text-slate-800">
            {t("notifications.deployed")}
          </p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1"> 
            {t("sidebar.account")}
          </p>
          <p className="text-xs font-bold text-slate-800">
            {t("account.editProfile")}
          </p>
        </div>
      </div>
      <div className="p-4 border-t border-slate-50">
        <button className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          {t("header.markRead")}
        </button>
      </div>
    </div>
  );
};

const SupportPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          {t("support.title")}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {t("support.quickLinks")}
          </h4>
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group"
            >
              {t("header.docs")}{" "}
              <ChevronDown
                size={14}
                className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all"
              />
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group"
            >
              {t("support.apiReference")}{" "}
              <ChevronDown
                size={14}
                className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all"
              />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {t("support.contactUs")}
          </h4>
          <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
            <p className="text-sm font-black mb-1">{t("support.needHelp")}</p>
            <p className="text-[10px] opacity-80 mb-4 leading-relaxed">
              {t("support.supportAvailability")}
            </p>
            <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {t("support.chatBtn")}
            </button>
          </div>
        </div>
        <div className="pt-4 text-center">
          <p className="text-[10px] font-bold text-slate-400">{t("support.systemStatus")}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-black text-green-600 uppercase">
              {t("support.nominal")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplatesPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          {t("account.templatesTitle")}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {["E-commerce Sync", "SaaS Onboarding", "Security Monitor"].map((templateName) => (
          <div
            key={templateName}
            className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
          > 
            <p className="text-xs font-black text-blue-600 uppercase mb-1"> 
              {t("templatesPanel.standard")}
            </p> 
            <p className="text-sm font-bold text-slate-800">{templateName}</p>
            <p className="text-[10px] text-slate-400 mt-2">
              {t("templatesPanel.desc")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketplacePanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-[#121826] shadow-2xl z-[150] flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-800 flex justify-between items-center"> 
        <h3 className="text-sm font-black text-white uppercase tracking-widest">
          {t("account.marketplaceTitle")}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-500"
        >
          <X size={18} /> 
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
          <Zap size={32} />
        </div>
        <h4 className="text-white font-black text-lg">{t("common.comingSoon")}</h4> 
        <p className="text-slate-400 text-xs mt-2 leading-relaxed"> 
          {t("account.marketplaceDesc")}
        </p>
        <button className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest">
          {t("account.getNotified")}
        </button>
      </div>
    </div>
  );
};

const StatusPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] border-l border-slate-100 flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-50 flex justify-between items-center"> 
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          {t("sidebar.status")}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
        >
          <X size={18} /> 
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2"> 
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t("dashboard.uptime")}
            </span>
            <span className="text-xs font-bold text-green-600">99.9%</span> 
          </div> 
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"> 
            <div className="h-full bg-green-500 w-[99%]"></div>
          </div> 
        </div>
        <div className="space-y-3">
          {["US-East Cluster", "EU-West Cluster", "Global CDN"].map((reg) => (
            <div key={reg} className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{t(`projects.clusterStatus.${reg}`)}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- Helpers --- */

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const SelectField = ({ label, value }) => {
  const values =
    typeof value === "string" ? value.split(",").map((v) => v.trim()) : [value];

  return (
    <div className="relative group">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">
        {label} ({values.length})
      </label>
      <div className="border border-slate-200 rounded-lg p-2.5 flex justify-between items-center text-sm font-bold text-slate-700 group-hover:border-slate-300 transition-colors cursor-pointer min-h-[46px]">
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center"
            >
              {v}
            </span>
          ))}
        </div>
        <ChevronDown size={16} className="text-slate-400 ml-2 shrink-0" />
      </div>
    </div>
  );
};

const ApiRow = ({ name, keyval, last, status }) => {
  const { t } = useTranslation();
  const statusColor = {
    ACTIVE: "bg-green-100 text-green-700",
    IDLE: "bg-slate-100 text-slate-500",
    REVOKED: "bg-red-50 text-red-600",
  };
  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5 text-sm font-bold text-slate-800">{t(name)}</td>
      <td className="px-8 py-5 text-xs font-mono text-slate-400 tracking-wider">
        {keyval}
      </td>
      <td className="px-8 py-5 text-xs font-bold text-slate-500">{t(last)}</td>
      <td className="px-8 py-5">
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${statusColor[status]}`}
        >
          {t("common." + status.toLowerCase())}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <MoreVertical
          size={16}
          className="text-slate-300 inline cursor-pointer"
        />
      </td>
    </tr>
  );
};

const TransactionRow = ({ id, date, amount }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <FileText size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800 leading-none mb-1">
            {id}
          </p>
          <p className="text-[10px] text-slate-400 font-bold">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-slate-900 mb-1">{amount}</p>
        <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
          <Download size={10} /> {t("settings.downloadPdf")}
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;