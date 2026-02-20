import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceMenu from './pages/ServiceMenu';
import Dashboard from './pages/Dashboard';
import Workflow from './pages/Workflow';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ServiceMenu />} />
          <Route path="/services" element={<ServiceMenu />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow" element={<Workflow />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
