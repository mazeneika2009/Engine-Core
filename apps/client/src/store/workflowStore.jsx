import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { NODE_MAP, defaultParams } from '../nodes/index.js';
import { api } from '../service/api.js';

const WorkflowStoreContext = createContext(null);

let counter = 0;
function nextName(type) {
  counter += 1;
  const def = NODE_MAP[type];
  const base = def ? def.displayName.replace(/[^A-Za-z0-9]+/g, '') : 'Node';
  return `${base}${counter}`;
}

/**
 * Canvas graph store: nodes, connections (reactflow edges), selection,
 * params editing, and backend persistence (workflows CRUD + execute).
 */
export function WorkflowStoreProvider({ children }) {
  const [workflowId, setWorkflowId] = useState(null);
  const [workflowName, setWorkflowName] = useState('New Flow');
  const [workflowActive, setWorkflowActive] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) || null,
    [nodes, selectedId]
  );

  const addNode = useCallback((type, position) => {
    const def = NODE_MAP[type];
    if (!def) return null;
    const id = `n_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const node = {
      id,
      type: 'workflowNode',
      position: position || { x: 120 + Math.random() * 220, y: 120 + Math.random() * 220 },
      data: {
        nodeType: type,
        name: nextName(type),
        label: def.displayName,
        category: def.category,
        monogram: def.monogram,
        tone: def.tone,
        params: defaultParams(def),
      },
    };
    setNodes((current) => [...current, node]);
    setSelectedId(id);
    return node;
  }, []);

  const updateNodeParams = useCallback((nodeId, fieldName, value) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, params: { ...node.data.params, [fieldName]: value } } }
          : node
      )
    );
  }, []);

  const renameNode = useCallback((nodeId, name) => {
    const clean = String(name || '').trim();
    if (!clean) return;
    setNodes((current) =>
      current.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, name: clean } } : node))
    );
  }, []);

  const removeNode = useCallback((nodeId) => {
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedId((current) => (current === nodeId ? null : current));
  }, []);

  const toGraph = useCallback(() => ({
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.data.name,
      type: node.data.nodeType,
      params: node.data.params || {},
    })),
    connections: edges.map((edge) => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle || 'main',
      target: edge.target,
      targetHandle: edge.targetHandle || 'main',
    })),
  }), [nodes, edges]);

  const loadGraph = useCallback((workflow) => {
    setWorkflowId(workflow.id || null);
    setWorkflowName(workflow.name || 'New Flow');
    setWorkflowActive(Boolean(workflow.active));
    const byId = new Map();
    const next = (workflow.nodes || []).map((node, index) => {
      const def = NODE_MAP[node.type];
      const id = node.id || `n_${index}`;
      byId.set(node.name, id);
      return {
        id,
        type: 'workflowNode',
        position: node.position || { x: 80 + index * 260, y: 140 },
        data: {
          nodeType: node.type,
          name: node.name,
          label: def ? def.displayName : node.type,
          category: def ? def.category : '',
          monogram: def ? def.monogram : '??',
          tone: def ? def.tone : { bg: 'rgba(245,241,234,0.07)', fg: '#F5F1EA', edge: 'rgba(245,241,234,0.2)' },
          params: node.params || {},
        },
      };
    });
    // Connections may reference names or ids — map names to canvas ids.
    const nextEdges = (workflow.connections || []).map((connection, index) => ({
      id: `e_${index}`,
      source: byId.get(connection.source) || connection.source,
      sourceHandle: connection.sourceHandle || 'main',
      target: byId.get(connection.target) || connection.target,
      targetHandle: connection.targetHandle || 'main',
      style: { stroke: '#78716C', strokeWidth: 1.5 },
    }));
    setNodes(next);
    setEdges(nextEdges);
    setSelectedId(null);
    setLastRun(null);
  }, []);

  const newGraph = useCallback(() => {
    setWorkflowId(null);
    setWorkflowName('New Flow');
    setWorkflowActive(false);
    setNodes([]);
    setEdges([]);
    setSelectedId(null);
    setLastRun(null);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const { nodes: graphNodes, connections } = toGraph();
      const payload = { name: workflowName, active: workflowActive, nodes: graphNodes, connections };
      const saved = workflowId
        ? await api.updateWorkflow(workflowId, payload)
        : await api.createWorkflow(payload);
      setWorkflowId(saved.id);
      return saved;
    } finally {
      setSaving(false);
    }
  }, [toGraph, workflowId, workflowName, workflowActive]);

  const run = useCallback(async (inputData) => {
    setRunning(true);
    try {
      // Persist first so manual runs execute the saved graph.
      const saved = await save().catch(() => null);
      const id = saved ? saved.id : workflowId;
      if (!id) throw new Error('Save the workflow before running');
      const result = await api.executeWorkflow(id, inputData);
      setLastRun(result);
      return result;
    } finally {
      setRunning(false);
    }
  }, [save, workflowId]);

  const value = useMemo(() => ({
    workflowId, workflowName, workflowActive,
    nodes, edges, selectedId, selectedNode,
    saving, running, lastRun,
    setWorkflowName, setWorkflowActive, setSelectedId,
    setNodes, setEdges,
    addNode, updateNodeParams, renameNode, removeNode,
    toGraph, loadGraph, newGraph, save, run, setLastRun,
  }), [
    workflowId, workflowName, workflowActive, nodes, edges,
    selectedId, selectedNode, saving, running, lastRun,
    addNode, updateNodeParams, renameNode, removeNode,
    toGraph, loadGraph, newGraph, save, run,
  ]);

  return <WorkflowStoreContext.Provider value={value}>{children}</WorkflowStoreContext.Provider>;
}

export function useWorkflowStore() {
  const store = useContext(WorkflowStoreContext);
  if (!store) throw new Error('useWorkflowStore must be used inside WorkflowStoreProvider');
  return store;
}
