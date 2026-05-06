import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Panel,
} from 'reactflow';

import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "../LanguageContext";
import { api } from "../service/api";
import { NODE_REGISTRY } from '../constants/node-registry'; // Import NODE_REGISTRY
import DynamicForm from '../components/workflow/DynamicForm'; // Import DynamicForm
import NodeConfigPanel from '../components/workflow/NodeConfigPanel'; // Import NodeConfigPanel
import 'reactflow/dist/style.css';
import {
  LayoutDashboard,
  Activity,
  Hammer,
  FileText,
  Blocks,
  Settings,
  User,
  Webhook,
  Search,
  Save,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { Clock, Mail, MessageSquare, Database, FileJson, Bot, Bell, HelpCircle, Monitor, Code, Split, Cloud } from 'lucide-react';

/* =====================================================
   UI COMPONENTS
===================================================== */

const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
      ${active 
        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
    `}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

/* =====================================================
   NODE COMPONENT
===================================================== */

const WorkflowNode = ({ data, selected }) => {
  const { t } = useTranslation();
  const isConfigured = Object.keys(data.config || {}).length > 0;

  return (
    <div
      className={`
        min-w-[220px]
        rounded-2xl
        border-2
        bg-white
        text-slate-900
        shadow-lg
        transition-all
        duration-200
        ${selected ? 'border-blue-500 ring-4 ring-blue-500/10 scale-[1.02]' : 'border-slate-100'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-blue-500 !w-3 !h-3 !border-white !border-2"
      />

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              ${data.color}
            `}
          >
            {data.icon}
          </div>

          <div>
            <p className="font-black text-sm">{t(`builder.nodesList.${data.type}`)}</p>
            <p className="text-xs text-slate-400">{t(`builder.${data.category.toLowerCase()}`)}</p>
          </div>
        </div>

        <div className={`mt-4 rounded-xl border p-3 transition-colors ${isConfigured ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("common.status")}</p>
            <div className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
          </div>
          <p className="text-[10px] font-bold text-slate-500">
            {isConfigured ? t("builder.configActive") : t("builder.requiresSetup")}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-500 !w-3 !h-3 !border-white !border-2"
      />
    </div>
  );
};

/* =====================================================
   NODE TYPES
===================================================== */

const nodeTypes = {
  workflowNode: WorkflowNode,
};

/* =====================================================
   INITIAL NODES
===================================================== */

const initialNodes = [];
const initialEdges = [];

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function WorkflowBuilder() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('nodes'); // 'nodes' or 'config'
  const [rfInstance, setRfInstance] = useState(null);
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: '#3b82f6',
              strokeWidth: 3,
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => { // UX Behavior: Open config panel on node body click
    // Check if the click originated from a handle
    const isHandleClick = event.target.classList.contains('react-flow__handle');
    if (isHandleClick) {
      // If it's a handle click, do not open the config panel
      return;
    }

    setSelectedNodeDetails(node);
  }, []);

  const addNode = (type) => {
    const config = NODE_REGISTRY[type];
    const newNode = {
      id: `${Date.now()}`,
      type: 'workflowNode',
      position: {
        x: Math.random() * 250 + 50, // Random position to avoid overlap
        y: Math.random() * 250 + 50,
      },
      data: {
        type: type,
        label: config.label,
        category: config.category,
        icon: config.icon,
        color: config.color,
        config: {}, // Store dynamic fields here
      },
    };

    setNodes((nds) => [...nds, newNode]); // Add new node to the canvas
    if (rfInstance) {
      rfInstance.fitView(); // Adjust view to fit new node
    }
  };

  const updateNodeConfig = useCallback((nodeId, fieldName, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config: { ...node.data.config, [fieldName]: value },
            },
          };
          // Sync the panel state too
          setSelectedNodeDetails(updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  const filteredNodes = useMemo(() => {
    return Object.entries(NODE_REGISTRY).filter(([key, node]) =>
      node.label.toLowerCase().includes(search.toLowerCase()) || node.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 1500);
  };

  return (
    
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* =====================================================
          MAIN NAVIGATION SIDEBAR (Consistent with App)
      ===================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#0052cc] rounded flex items-center justify-center text-white font-bold text-xs shadow-inner">A</div>
            <div>
              <h1 className="text-xs font-black leading-tight uppercase tracking-tighter">{t("sidebar.core")}</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">v2.4.0-stable</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("sidebar.dashboard")} />
            <NavItem to="/workflows" icon={<Activity size={18} />} label={t("sidebar.workflows")} />
            <NavItem to="/builder" icon={<Hammer size={18} />} label={t("sidebar.builder")} active />
            <NavItem to="/logs" icon={<FileText size={18} />} label={t("sidebar.logs")} />
            <NavItem to="/projects" icon={<Blocks size={18} />} label={t("sidebar.projects")} />
            <NavItem to="/settings" icon={<Settings size={18} />} label={t("sidebar.settings")} />
            <NavItem to="/account" icon={<User size={18} />} label={t("sidebar.account")} />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50 space-y-3">
          <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
            <HelpCircle size={16} /> {t("sidebar.support")}
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-slate-700 cursor-pointer transition-colors">
            <Monitor size={16} /> {t("sidebar.status")}
          </div>
        </div>
      </aside>

      {/* =====================================================
          NODE LIBRARY PANEL (Left Sidebar)
      ===================================================== */}
      <aside className={`${isNodeLibraryOpen ? 'w-80 border-r' : 'w-0 border-r-0'} border-slate-200 bg-white flex flex-col z-30 shadow-sm transition-all duration-300 overflow-hidden`}>
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                {t("builder.library")}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {t("builder.defaultName")}
              </p>
            </div>
            <button 
              onClick={() => setIsNodeLibraryOpen(false)}
              className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("builder.nodes")}
              className="
                w-full
                bg-white
                border border-slate-200
                rounded-lg py-2 pl-9
                pr-4
                outline-none
                focus:border-cyan-400
              "
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNodes.map(([key, node]) => (
            <button
              key={key}
              onClick={() => addNode(key)}
              className="
                w-full
                p-3
                rounded-xl
                border border-slate-100
                bg-white
                hover:border-blue-200
                hover:bg-blue-50/30
                transition-all
                text-left
                group
              "
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${node.color} transition-transform group-hover:scale-110`}>
                  {node.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{t(`builder.nodesList.${key}`)}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t(`builder.${node.category.toLowerCase()}`)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* =====================================================
          MAIN CANVAS AREA
      ===================================================== */}
      <div className="flex-1 relative">
        {/* TOP BUILDER HEADER */}
        <div className="absolute top-0 left-0 right-0 h-16 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            {!isNodeLibraryOpen && (
              <button 
                onClick={() => setIsNodeLibraryOpen(true)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                title="Open Library"
              >
                <Plus size={20} />
              </button>
            )}
            <div>
            <div className="flex items-center gap-3">
               <h2 className="font-black text-slate-900 text-lg">{t("builder.defaultName")}</h2>
               <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{t("common.active")}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Precision Engine v2.4.0</p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <button
              className="
                px-5
                py-2.5
                rounded-xl
                bg-white
                border border-slate-200
                text-slate-600
                hover:bg-slate-50
                flex
                items-center
                gap-2
                text-sm font-bold
              "
            >
              <Save size={16} />
              {t("common.save")}
            </button>

            <button
              onClick={handleDeploy}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-[#0061e0]
                hover:bg-blue-700
                text-white
                flex
                items-center
                gap-2
                text-sm font-black
                shadow-lg shadow-blue-100
              "
            >
              {isDeploying ? t("common.processing") : t("builder.deploy")}
            </button>
          </div>
        </div>

        {/* REACT FLOW */}

        <div className="w-full h-full pt-16">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onInit={setRfInstance}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              animated: true,
            }}
          >
            <Background
              color="#f1f5f9"
              gap={20}
            />

            <MiniMap
              pannable
              zoomable
              className="!bg-white !border !border-slate-200 !rounded-xl !shadow-lg"
            />

            <Controls className="!bg-white !border !border-slate-200 !rounded-lg !shadow-md" />

            {/* EXECUTION PANEL */}
            <Panel position="bottom-center">
              <div
                className="
                  w-[700px]
                  h-[120px]
                  rounded-2xl
                  border-2
                  border-slate-100
                  bg-white/90
                  backdrop-blur-xl
                  p-5
                  shadow-2xl
                  mb-6
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{t("sidebar.logs")}</h3>
                  </div>
                  
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-blue-50
                      text-blue-600
                      text-xs
                      font-bold
                    "
                  >
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-2 text-xs font-bold font-mono">
                  <div className="text-emerald-500 flex items-center gap-2">
                    <span className="text-[10px] opacity-50">14:52:01</span>
                    SUCCESS: Webhook Trigger instantiated.
                  </div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="text-[10px] opacity-50">14:52:02</span>
                    → Waiting for next workflow step...
                  </div>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
      <NodeConfigPanel node={selectedNodeDetails} onClose={() => setSelectedNodeDetails(null)} onUpdate={updateNodeConfig} />
    </div>
  );
}
