import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceMenu from './pages/ServiceMenu';
import ServiceDetail from './pages/ServiceDetail';
import Dashboard from './pages/Dashboard';
import Workflow from './pages/Workflow';
import Agents from './pages/Agents';
import AgentOps from './pages/AgentOps';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ServiceMenu />} />
          <Route path="/services" element={<ServiceMenu />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent-ops" element={<AgentOps />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
