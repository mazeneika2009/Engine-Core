import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { 
  LayoutDashboard, Activity, Hammer, FileText, Blocks, Settings, 
  Bell, HelpCircle, Plus, Play, Save, X, Search, ZoomIn, ZoomOut, 
  Maximize, Webhook, Clock, Mail, MessageSquare, ChevronDown, Trash2,
  Menu, Code, Split, Database, FileJson
} from 'lucide-react';

const WorkflowBuilder = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const workflowName = location.state?.name || t("builder.defaultName");

  // Nodes state: Initializing with a trigger node
  const [nodes, setNodes] = useState([
    { 
      id: 'node_1', 
      type: 'trigger', 
      name: 'builder.nodesList.webhookTrigger', 
      sub: 'builder.nodesList.paymentFailed', 
      icon: <Activity size={20} />, 
      x: 150, 
      y: 250,
      config: { label: 'builder.nodesList.webhookTrigger', event: 'builder.nodesList.paymentFailed' }
    }
  ]);
  
  const [activeNodeId, setActiveNodeId] = useState('node_1');
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNodesMenuOpen, setIsNodesMenuOpen] = useState(true);
  const [zoom, setZoom] = useState(0.85);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [executingNodeId, setExecutingNodeId] = useState(null);

  // Drag and drop states
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, node) => {
    if (e.button !== 0) return; // Only allow left-click dragging
    e.stopPropagation();
    setActiveNodeId(node.id);
    setDraggedNodeId(node.id);
    
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset in "world" space to maintain accuracy under zoom
    setDragOffset({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggedNodeId || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Convert screen coordinates to canvas space factoring in zoom
      const newX = (e.clientX - canvasRect.left) / zoom - dragOffset.x;
      const newY = (e.clientY - canvasRect.top) / zoom - dragOffset.y;

      setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n));
    };

    const handleMouseUp = () => setDraggedNodeId(null);

    if (draggedNodeId) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNodeId, zoom, dragOffset]);

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  const addNode = (type, labelKey, icon, colorClass) => {
    const parentNode = nodes.find(n => n.id === activeNodeId) || nodes[nodes.length - 1];
    const newNodeId = `node_${nodes.length + 1}`;
    
    let x = parentNode.x + 250;
    let y = parentNode.y;

    if (viewportRef.current) {
      const v = viewportRef.current;
      // Calculate the center of the visible viewport in world space
      x = (v.scrollLeft + v.clientWidth / 2) / zoom - 96; // Offset by half node width (w-48 = 192px)
      y = (v.scrollTop + v.clientHeight / 2) / zoom - 36; // Offset by half approx node height
    }

    const newNode = {
      id: newNodeId,
      type: type,
      name: labelKey,
      sub: 'builder.nodesList.configureStep',
      icon: icon,
      x,
      y,
      config: { label: labelKey },
      parentId: parentNode.id
    };

    setNodes([...nodes, newNode]);
    setActiveNodeId(newNodeId);
    setIsPropertiesOpen(true);
  };

  // Calculate canvas dimensions to only show scrollbars when nodes are out of bounds
  const canvasDimensions = useMemo(() => {
    const maxX = nodes.reduce((max, node) => Math.max(max, node.x + 400), 0);
    const maxY = nodes.reduce((max, node) => Math.max(max, node.y + 400), 0);
    return { width: `${maxX}px`, height: `${maxY}px` };
  }, [nodes]);

  const updateNodeLabel = (newLabel) => {
    setNodes(nodes.map(n => 
      n.id === activeNodeId ? { ...n, name: newLabel, config: { ...n.config, label: newLabel } } : n
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, this would be a toast notification
    }, 800);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 1500);
  };

  const handleTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= nodes.length) {
        clearInterval(interval);
        setIsTesting(false);
        setExecutingNodeId(null);
        return;
      }
      setExecutingNodeId(nodes[step].id);
      step++;
    }, 600);
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Precision Engine Standard */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} active onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/account" icon={<Settings size={18} />} label={t("sidebar.account")} onClick={() => setIsSidebarOpen(false)} />
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button className="w-full bg-[#0061E0] text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
            <Plus size={18} /> {t("sidebar.newWorkflow")}
          </button>
        </div>
      </aside>

      {/* Main Builder Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Builder Header */}
        <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <h2 className="font-bold text-slate-800">{t(workflowName)}</h2>
            <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{t("builder.active")}</span>
            <div className="h-4 w-px bg-slate-200 mx-2"></div>
            <button 
              onClick={handleTest}
              disabled={isTesting}
              className={`flex items-center gap-2 text-xs font-bold transition-all ${isTesting ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 active:scale-95'}`}
            >
              <Play size={14} className={isTesting ? 'animate-pulse' : ''} /> {isTesting ? t("common.processing") : t("builder.test")}
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 active:scale-95 transition-transform">
              <Save size={14} className={isSaving ? 'animate-spin' : ''} /> {isSaving ? t("common.processing") : t("builder.save")}
            </button>
            <button onClick={() => setIsNodesMenuOpen(true)} className={`flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 ${isNodesMenuOpen ? 'hidden' : 'flex'}`}>
              <Plus size={14} /> {t("builder.nodes")}
            </button>
            <button onClick={() => setIsPropertiesOpen(true)} className={`flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 ${isPropertiesOpen ? 'hidden' : 'flex'}`}>
              <Settings size={14} /> {t("builder.properties")}
            </button>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setShowNotifications(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={18} />
            </button>
            <button onClick={() => setShowSupport(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <HelpCircle size={18} />
            </button>
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="bg-[#0061E0] text-white px-5 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 min-w-[80px]"
            >
              {isDeploying ? t("common.processing") : t("builder.deploy")}
            </button>
            <Link to="/account" className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 overflow-hidden hover:opacity-80 transition-opacity">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
            </Link>
          </div>
        </header>

        {/* The Canvas */}
        <div ref={viewportRef} className="flex-1 relative overflow-auto bg-[#fcfcfd]" 
             style={{ 
               backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', 
               backgroundSize: `${24 * zoom}px ${24 * zoom}px` 
             }}>
          
          {/* Draggable Components Menu */}
          {isNodesMenuOpen && (
          <div className="absolute top-6 left-6 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-4 max-h-[calc(100vh-120px)] overflow-y-auto z-30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("builder.library")}</p>
              <button onClick={() => setIsNodesMenuOpen(false)} className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600 transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{t("builder.triggers")}</p>
              <div className="space-y-2 cursor-pointer">
                <ComponentItem 
                  icon={<Webhook size={14} className="text-blue-500"/>} 
                  label={t("builder.nodesList.webhook")} 
                  onClick={() => addNode('trigger', 'builder.nodesList.webhook', <Webhook size={20}/>, 'text-blue-600')}
                />
                <ComponentItem 
                  icon={<Clock size={14} className="text-blue-500"/>} 
                  label={t("builder.nodesList.schedule")} 
                  onClick={() => addNode('trigger', 'builder.nodesList.schedule', <Clock size={20}/>, 'text-blue-600')}
                />
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{t("builder.logic")}</p>
              <div className="space-y-2 cursor-pointer">
                <ComponentItem 
                  icon={<Code size={14} className="text-purple-500"/>} 
                  label={t("builder.nodesList.javascript")} 
                  onClick={() => addNode('logic', 'builder.nodesList.javascript', <Code size={20}/>, 'text-purple-600')}
                />
                <ComponentItem 
                  icon={<Split size={14} className="text-purple-500"/>} 
                  label={t("builder.nodesList.conditional")} 
                  onClick={() => addNode('logic', 'builder.nodesList.conditional', <Split size={20}/>, 'text-purple-600')}
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{t("builder.actions")}</p>
              <div className="space-y-2">
                <ComponentItem 
                  icon={<Mail size={14} className="text-green-500"/>} 
                  label={t("builder.nodesList.sendEmail")} 
                  onClick={() => addNode('action', 'builder.nodesList.sendEmail', <Mail size={20}/>, 'text-green-600')}
                />
                <ComponentItem 
                  icon={<MessageSquare size={14} className="text-green-500"/>} 
                  label={t("builder.nodesList.slackMessage")} 
                  onClick={() => addNode('action', 'builder.nodesList.slackMessage', <MessageSquare size={20}/>, 'text-green-600')}
                />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{t("builder.data")}</p>
              <div className="space-y-2 cursor-pointer">
                <ComponentItem 
                  icon={<Database size={14} className="text-amber-500"/>} 
                  label={t("builder.nodesList.database")} 
                  onClick={() => addNode('data', 'builder.nodesList.database', <Database size={20}/>, 'text-amber-600')}
                />
                <ComponentItem 
                  icon={<FileJson size={14} className="text-amber-500"/>} 
                  label={t("builder.nodesList.jsonTransform")} 
                  onClick={() => addNode('data', 'builder.nodesList.jsonTransform', <FileJson size={20}/>, 'text-amber-600')}
                />
              </div>
            </div>
          </div>
          )}

          {/* Scalable Canvas Content */}
          <div 
            ref={canvasRef}
            className="absolute inset-0 origin-top-left transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom})`, 
              ...canvasDimensions,
              minWidth: '100%',
              minHeight: '100%'
            }}
          >
            {/* Dynamic Nodes and Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map(node => {
                if (!node.parentId) return null;
                const parent = nodes.find(n => n.id === node.parentId);
                if (!parent) return null;
                // Draw a Bezier curve like n8n
                const startX = parent.x + 192; // Right side of node
                const startY = parent.y + 36;
                const endX = node.x;
                const endY = node.y + 36;
                return (
                  <path 
                    key={`edge-${node.id}`}
                    d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              })}
            </svg>

            {nodes.map(node => (
              <div 
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node)}
                className={`absolute cursor-pointer ${activeNodeId === node.id ? 'z-20' : 'z-10'}`}
                style={{ left: node.x, top: node.y }}
              >
                <div className={`bg-white rounded-xl overflow-x-auto shadow-lg p-4 w-48 border-2 ${activeNodeId === node.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200'} ${executingNodeId === node.id ? 'ring-4 ring-green-400 border-green-500 scale-105 shadow-2xl' : ''}`}>
                  <div className={`absolute -top-3 left-4 bg-white border text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase ${
                    node.type === 'trigger' ? 'border-blue-100 text-blue-600' : 
                    node.type === 'logic' ? 'border-purple-100 text-purple-600' :
                    node.type === 'data' ? 'border-amber-100 text-amber-600' :
                    'border-green-100 text-green-600'
                  }`}>
                    {t("builder.type." + node.type)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      node.type === 'trigger' ? 'bg-blue-50 text-blue-600' : 
                      node.type === 'logic' ? 'bg-purple-50 text-purple-600' :
                      node.type === 'data' ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {node.icon}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate">{t(node.name)}</p>
                      <p className="text-[10px] text-slate-400 truncate">{t(node.sub)}</p>
                    </div>
                  </div>
                  {/* Connection Points */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-200 rounded-full"></div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNodeId(node.id);
                    setIsNodesMenuOpen(true);
                  }}
                  className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center hover:scale-125 transition-transform active:bg-blue-800"
                >
                    <Plus size={8} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Viewport Controls */}
          <div className="absolute bottom-6 left-6 flex bg-white border border-slate-200 rounded-lg shadow-lg divide-x divide-slate-100 overflow-hidden">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
              className="p-3 hover:bg-slate-50 transition-colors"
            >
              <ZoomIn size={16} className="text-slate-500" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.4))}
              className="p-3 hover:bg-slate-50 transition-colors"
            >
              <ZoomOut size={16} className="text-slate-500" />
            </button>
            <button 
              onClick={() => setZoom(1)}
              className="p-3 hover:bg-slate-50 transition-colors"
            >
              <Maximize size={16} className="text-slate-500" />
            </button>
            <div className="px-4 flex items-center text-[10px] font-bold text-slate-400 w-14 justify-center">
              {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        {isPropertiesOpen && (
        <aside className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t("builder.properties")}</h3>
            <button onClick={() => setIsPropertiesOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeNode.type === 'trigger' ? 'bg-blue-50 text-blue-600' : 
                  activeNode.type === 'logic' ? 'bg-purple-50 text-purple-600' :
                  activeNode.type === 'data' ? 'bg-amber-50 text-amber-600' :
                  'bg-green-50 text-green-600'
                }`}>
                    {activeNode.icon}
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-900">{t(activeNode.name)}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{t("builder.nodeId")}: {activeNode.id}</p>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t("builder.label")}</label>
                <input 
                  type="text" 
                  value={t(activeNode.name)} 
                  onChange={(e) => updateNodeLabel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                />
             </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("builder.logicConfig")}</label>
                    <span className="text-[10px] font-black text-blue-600 uppercase cursor-pointer">{t("common.advanced")}</span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase w-6">{t("common.if")}</span>
                        <div className="flex-1 bg-white border border-slate-200 rounded p-2 text-[11px] font-mono">{t("builder.invoiceAmount")}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase w-6">{t("builder.is")}</span>
                        <div className="flex-1 bg-white border border-slate-200 rounded p-2 text-[11px] font-bold flex justify-between items-center">
                            {t("builder.greaterThan")} <ChevronDown size={12} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase w-6">{t("builder.val")}</span>
                        <input type="text" defaultValue="1000" className="flex-1 bg-white border border-slate-200 rounded p-2 text-[11px] font-mono" />
                    </div>
                </div>
            </div>

            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t("builder.variables")}</p>
                <div className="flex flex-wrap gap-2">
                    <VariableTag label="builder.customerEmail" />
                    <VariableTag label="builder.orderId" />
                    <button className="text-[10px] font-bold border border-dashed border-slate-300 px-2 py-1 rounded text-slate-400">{t("builder.addData")}</button>
                </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 space-y-3">
             <button onClick={handleSave} className="w-full bg-[#121826] text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform">{t("builder.saveConfig")}</button>
             <button 
                disabled={nodes.length === 1}
                onClick={() => setNodes(nodes.filter(n => n.id !== activeNodeId))}
                className="w-full text-red-500 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-30"
              >{t("builder.deleteNode")}</button>
          </div>
        </aside>
        )}
      </div>

      {/* Professional Overlays */}
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <SupportPanel isOpen={showSupport} onClose={() => setShowSupport(false)} />
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
        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{t("notifications.builder")}</p>
        <p className="text-xs font-bold text-slate-800">{t("notifications.newNodes")}</p>
      </div>
    </div>
    <div className="p-4 border-t border-slate-50">
      <button className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">{t("notifications.markRead")}</button>
    </div>
  </div>
  );
};

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
          <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
            {t("support.community")} <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
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
  );
};

/* --- Sub-components --- */

const NavItem = ({ icon, label, to = "/", active = false, onClick }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-700 rounded-r-none shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const ComponentItem = ({ icon, label, onClick }) => (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg cursor-pointer hover:border-blue-200 hover:bg-white transition-all group"
    >
        <div className="w-7 h-7 bg-white rounded border border-slate-100 flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
    </div>
);

const VariableTag = ({ label }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-blue-50 border border-blue-100 px-2 py-1 rounded flex items-center gap-2">
        <div className="w-3 h-1.5 bg-blue-600 rounded-sm"></div>
        <span className="text-[10px] font-bold text-blue-700">{t(label)}</span>
    </div>
  );
};

export default WorkflowBuilder;