/**
 * Backend client for the Engine Core Express API.
 * Base URL: VITE_API_URL (default http://127.0.0.1:5678).
 * List endpoints degrade to local empty mocks when the server is
 * unreachable so the canvas stays usable without a database.
 */
const BASE = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://127.0.0.1:5678';

async function request(path, { method = 'GET', body = null } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === null ? null : JSON.stringify(body),
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return payload.data !== undefined ? payload.data : payload;
}

async function fallback(promise, value) {
  try {
    return await promise;
  } catch {
    return value;
  }
}

export const api = {
  baseUrl: BASE,

  health: () => request('/api/health'),

  // Workflows
  getWorkflows: () => fallback(request('/api/workflows'), []),
  getWorkflow: (id) => request(`/api/workflows/${id}`),
  createWorkflow: (payload) => request('/api/workflows', { method: 'POST', body: payload }),
  updateWorkflow: (id, payload) => request(`/api/workflows/${id}`, { method: 'PUT', body: payload }),
  deleteWorkflow: (id) => request(`/api/workflows/${id}`, { method: 'DELETE' }),
  executeWorkflow: (id, data) => request(`/api/workflows/${id}/execute`, { method: 'POST', body: { data: data || {} } }),

  // Executions
  getExecutions: (workflowId) =>
    fallback(request(workflowId ? `/api/executions?workflow_id=${workflowId}` : '/api/executions'), []),
  getExecution: (id) => request(`/api/executions/${id}`),

  // Credentials
  getCredentials: () => fallback(request('/api/credentials'), []),
  createCredential: (payload) => request('/api/credentials', { method: 'POST', body: payload }),
  deleteCredential: (id) => request(`/api/credentials/${id}`, { method: 'DELETE' }),

  // Dashboard-shaped helpers (map backend rows onto existing cards)
  getDashboardStats: async () => {
    const [workflows, executions] = await Promise.all([
      fallback(request('/api/workflows'), []),
      fallback(request('/api/executions?limit=200'), []),
    ]);
    const errors = executions.filter((item) => item.status === 'failed').length;
    return { workflows: workflows.length, executions: executions.length, errors };
  },
  getLogs: () => fallback(request('/api/executions?limit=100'), []),
  getProjects: () => fallback(request('/api/workflows'), []),

  // Legacy translate stub (kept for LanguageContext)
  translate: async (text) => ({ translatedText: text }),
};
