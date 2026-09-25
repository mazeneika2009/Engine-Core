import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  Panel,
} from 'reactflow';

import { Link } from 'react-router-dom';
import { useTranslation } from '../LanguageContext';
import { NODE_DEFINITIONS, NODE_CATEGORIES } from '../nodes/index.js';
import { useWorkflowStore } from '../store/workflowStore';
import PropertyPanel from '../components/property/PropertyPanel.jsx';
import { Sidebar, SlidePanel } from '../components/shell';
import { api } from '../service/api.js';
import 'reactflow/dist/style.css';

const EDGE_STYLE = { stroke: '#78716C', strokeWidth: 1.5 };

/* Canvas node — dark functional card. IF nodes expose true/false branch handles. */
function WorkflowNode({ data, selected }) {
  const paramCount = Object.keys(data.params || {}).filter(
    (key) => data.params[key] !== '' && data.params[key] !== undefined
  ).length;
  const isIf = data.nodeType === 'engine.ifCondition';
  const isSwitch = data.nodeType === 'engine.switch';
  const switchOutputs = useMemo(() => {
    if (!isSwitch) return [];
    let rules = data.params?.rules;
    if (typeof rules === 'string') {
      try {
        rules = JSON.parse(rules);
      } catch {
        rules = [];
      }
    }
    const names = [];
    for (const rule of Array.isArray(rules) ? rules : []) {
      if (rule && typeof rule.output === 'string' && rule.output && !names.includes(rule.output)) {
        names.push(rule.output);
      }
    }
    const fallback = data.params?.defaultOutput || 'default';
    if (fallback && !names.includes(fallback)) names.push(fallback);
    return names.slice(0, 6);
  }, [isSwitch, data.params]);

  return (
    <div
      className="w-[228px] rounded-lg transition-colors"
      style={{
        background: '#232120',
        border: selected ? '1px solid #84A98C' : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Handle type="target" position={Position.Left} id="main" />

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ background: data.tone.bg, color: data.tone.fg, border: `1px solid ${data.tone.edge}` }}
          >
            {data.monogram}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold tracking-tight leading-tight truncate text-cream">{data.name}</p>
            <p className="text-[10px] text-smoke font-medium mt-0.5 truncate">{data.label} — {data.category}</p>
          </div>
        </div>

        <div
          className="mt-3 pt-2.5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-[10px] font-medium text-smoke uppercase tracking-[0.1em]">
            {paramCount > 0 ? `${paramCount} params` : 'No params'}
          </span>
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: paramCount > 0 ? '#84A98C' : '#57534E' }}
          />
        </div>
      </div>

      {isSwitch ? (
        <>
          {switchOutputs.map((output, index) => (
            <React.Fragment key={output}>
              <span
                className="absolute font-mono text-[9px] text-ochre truncate max-w-[64px]"
                style={{ right: 16, top: 8 + index * 20 }}
              >
                {output}
              </span>
              <Handle type="source" position={Position.Right} id={output} style={{ top: 14 + index * 20 }} />
            </React.Fragment>
          ))}
        </>
      ) : isIf ? (
        <>
          <span className="absolute right-4 font-mono text-[9px] text-sage" style={{ top: 6 }}>T</span>
          <Handle type="source" position={Position.Right} id="true" style={{ top: 12 }} />
          <span className="absolute right-4 font-mono text-[9px] text-ochre" style={{ bottom: 6 }}>F</span>
          <Handle type="source" position={Position.Right} id="false" style={{ top: 'auto', bottom: 12 }} />
        </>
      ) : (
        <Handle type="source" position={Position.Right} id="main" />
      )}
    </div>
  );
}

const nodeTypes = { workflowNode: WorkflowNode };

export default function WorkflowBuilder() {
  const { t } = useTranslation();
  const store = useWorkflowStore();
  const {
    workflowId, workflowName, workflowActive, nodes, edges,
    selectedId, selectedNode, saving, running, lastRun,
    setWorkflowName, setWorkflowActive, setSelectedId,
    setNodes, setEdges, addNode, updateNodeParams, renameNode,
    removeNode, loadGraph, newGraph, save, run,
  } = store;

  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [openPanel, setOpenPanel] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [copied, setCopied] = useState(false);

  const onNodesChange = useCallback((changes) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  }, [setEdges]);

  const onConnect = useCallback((connection) => {
    setEdges((current) => addEdge({ ...connection, style: EDGE_STYLE }, current));
  }, [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    if (event.target.classList.contains('react-flow__handle')) return;
    setSelectedId(node.id);
  }, [setSelectedId]);

  const onPaneClick = useCallback(() => setSelectedId(null), [setSelectedId]);

  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = useCallback((category) => {
    setCollapsed((current) => ({ ...current, [category]: !current[category] }));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return NODE_DEFINITIONS.filter(
      (def) =>
        def.displayName.toLowerCase().includes(query) ||
        def.type.toLowerCase().includes(query) ||
        (def.category || '').toLowerCase().includes(query)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const def of filtered) {
      const category = def.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(def);
    }
    return NODE_CATEGORIES.filter((category) => groups[category]).map((category) => ({ category, defs: groups[category] }));
  }, [filtered]);

  const handleSave = async (activate) => {
    setSaveError(null);
    try {
      if (activate !== undefined) setWorkflowActive(activate);
      await save();
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const handleRun = async () => {
    setSaveError(null);
    try {
      await run();
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const openLoadPanel = async () => {
    setOpenPanel(true);
    try {
      setSavedList(await api.getWorkflows());
    } catch {
      setSavedList([]);
    }
  };

  const handleLoad = async (id) => {
    const workflow = await api.getWorkflow(id);
    loadGraph(workflow);
    setOpenPanel(false);
  };

  const webhookUrl = workflowId ? `${api.baseUrl}/api/v1/webhook/${workflowId}` : null;

  const copyWebhook = async () => {
    if (!webhookUrl) return;
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-screen bg-base text-cream overflow-hidden">
      <Sidebar active="builder" mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />

      {/* Node library */}
      <aside
        className="flex-col z-30 hidden md:flex shrink-0 bg-coal transition-all"
        style={{
          width: libraryOpen ? 264 : 0,
          borderRight: libraryOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
          overflow: 'hidden',
        }}
      >
        <div className="w-[264px] flex flex-col h-full">
          <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[14px] font-bold tracking-tight text-cream">{t('builder.library')}</h2>
                <p className="text-[11px] text-smoke mt-0.5 font-mono">{filtered.length} nodes</p>
              </div>
              <button onClick={() => setLibraryOpen(false)} className="text-[12px] font-medium text-sand hover:text-cream px-1">
                Hide
              </button>
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('builder.nodes')} className="field mt-3" />
          </div>

          <div className="flex-1 overflow-y-auto p-2.5">
            {grouped.map(({ category, defs }) => {
              const isCollapsed = search ? false : !!collapsed[category];
              return (
                <div key={category} className="mb-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left hover:bg-white/[0.04]"
                  >
                    <span className="font-mono text-[10px] text-smoke w-4">{isCollapsed ? '+' : '–'}</span>
                    <span className="label-caps !text-[10px] flex-1">{category} ({defs.length})</span>
                  </button>
                  {!isCollapsed && defs.map((def) => (
                    <button
                      key={def.type}
                      onClick={() => addNode(def.type)}
                      className="w-full px-2.5 py-2 rounded-lg text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ background: def.tone.bg, color: def.tone.fg, border: `1px solid ${def.tone.edge}` }}
                        >
                          {def.monogram}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium leading-tight truncate text-cream">{def.displayName}</p>
                          <p className="text-[10px] text-smoke mt-0.5 font-mono truncate">{def.type}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
            {grouped.length === 0 && (
              <p className="text-[12px] text-smoke px-2.5 py-4">No nodes match “{search}”.</p>
            )}
          </div>
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 relative min-w-0 flex flex-col">
        <div
          className="min-h-[60px] shrink-0 bg-coal/90 backdrop-blur px-5 py-2 flex items-center gap-3 z-20 flex-wrap"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-[13px] font-medium text-sand">
            Menu
          </button>
          {!libraryOpen && (
            <button onClick={() => setLibraryOpen(true)} className="btn-quiet !px-3 !py-1.5">Library</button>
          )}
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-[15px] font-bold tracking-tight text-cream outline-none w-[180px] placeholder:text-smoke"
            placeholder="New Flow"
          />
          <button
            onClick={() => handleSave(!workflowActive)}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: workflowActive ? '#84A98C' : '#78716C' }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: workflowActive ? '#84A98C' : '#57534E' }} />
            {workflowActive ? t('common.active') : t('common.idle')}
          </button>
          <span className="text-[11px] text-smoke font-mono">{nodes.length} nodes — {edges.length} edges</span>

          <div className="ml-auto flex items-center gap-2">
            <Link to="/workflows" className="btn-quiet">Workflows</Link>
            <button onClick={openLoadPanel} className="btn-quiet hidden sm:block">Open</button>
            <button onClick={newGraph} className="btn-quiet hidden sm:block">New</button>
            <button onClick={() => handleSave()} disabled={saving} className="btn-quiet disabled:opacity-60">
              {saving ? t('common.processing') : t('common.save')}
            </button>
            <button onClick={handleRun} disabled={running} className="btn-primary disabled:opacity-60">
              {running ? t('common.processing') : 'Run'}
            </button>
          </div>
        </div>

        {(saveError || webhookUrl) && (
          <div
            className="shrink-0 px-5 py-2 flex items-center gap-3 text-[11px] font-mono z-20"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#232120' }}
          >
            {saveError && <span className="text-brick">{saveError}</span>}
            {webhookUrl && !saveError && (
              <>
                <span className="text-smoke truncate">POST {webhookUrl}</span>
                <button onClick={copyWebhook} className="text-sage hover:underline shrink-0">{copied ? 'Copied' : 'Copy'}</button>
              </>
            )}
          </div>
        )}

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{ style: EDGE_STYLE }}
            style={{ background: '#1C1917' }}
          >
            <Background color="rgba(255,255,255,0.07)" gap={22} size={1} />
            <MiniMap pannable zoomable style={{ background: '#232120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} maskColor="rgba(28,25,23,0.6)" />
            <Controls />

            {(running || lastRun) && (
              <Panel position="bottom-center">
                <div
                  className="w-[520px] max-w-[80vw] rounded-lg px-4 py-3 mb-4"
                  style={{ background: '#232120', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="label-caps">Last Run</p>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: running ? '#D4A373' : lastRun?.status === 'success' ? '#84A98C' : '#C96A5E' }}
                    >
                      {running ? 'Running…' : lastRun?.status}
                    </span>
                  </div>
                  {!running && lastRun && (
                    <pre className="font-mono text-[11px] text-cream/80 leading-relaxed overflow-auto max-h-[140px]">
                      {JSON.stringify(lastRun.final ?? lastRun, null, 2)}
                    </pre>
                  )}
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      <PropertyPanel
        node={selectedNode}
        onClose={() => setSelectedId(null)}
        onUpdate={updateNodeParams}
        onRename={renameNode}
        onDelete={(id) => removeNode(id)}
        onTest={() => run()}
      />

      <SlidePanel open={openPanel} onClose={() => setOpenPanel(false)} title="Open Workflow">
        <div className="space-y-1.5">
          {savedList.length === 0 && <p className="text-[13px] text-sand">Nothing saved yet.</p>}
          {savedList.map((workflow) => (
            <button
              key={workflow.id}
              onClick={() => handleLoad(workflow.id)}
              className="w-full card-flat px-3.5 py-3 text-left hover:bg-white/[0.03]"
            >
              <p className="text-[13px] font-semibold text-cream">{workflow.name}</p>
              <p className="text-[10px] text-smoke font-mono mt-0.5">
                {(workflow.nodes || []).length} nodes — {workflow.active ? 'active' : 'idle'}
              </p>
            </button>
          ))}
        </div>
      </SlidePanel>
    </div>
  );
}
