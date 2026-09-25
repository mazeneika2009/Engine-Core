import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { WorkflowStoreProvider } from './store/workflowStore';
import EngineDashboard from './pages/Dashboard';
import WorkflowsPage from './pages/workflow';
import WorkflowBuilder from './pages/workflow-builder';
import ExecutionLogs from './pages/logs';
import PlatformSettings from './pages/setting';
import AccountDashboard from './pages/account';
import ProjectsDashboard from './pages/projects';

function App() {
  return (
    <LanguageProvider>
      <WorkflowStoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EngineDashboard />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/builder" element={<WorkflowBuilder />} />
          <Route path="/logs" element={<ExecutionLogs />} />
          <Route path="/settings" element={<PlatformSettings />} />
          <Route path="/account" element={<AccountDashboard />} />
          <Route path="/projects" element={<ProjectsDashboard />} />
          <Route path="*" element={<div className="min-h-screen bg-base text-sand flex items-center justify-center text-[13px]">Page not found</div>} />
        </Routes>
      </Router>
      </WorkflowStoreProvider>
    </LanguageProvider>
  );
}

export default App;