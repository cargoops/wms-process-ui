import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import AppLayout from './layout/applayout';

import DashboardPage from './pages/dashboard';
import ReceivingPage from './pages/receiving';
import StoringPage from './pages/receiving/storingorder';
import MyReceivingPage from './pages/receiving/myreceiving';
import QCPage from './pages/qc';
import BinningPage from './pages/binning';
import InventoryPage from './pages/inventory';
import PickingPage from './pages/picking';
import DispatchPage from './pages/dispatch';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const menuGroups: Record<string, string> = {
    storing: 'Receiving',
    myreceiving: 'Receiving',
    receiving: 'Receiving',
    qc: 'Quality Check',
    binning: 'Binning',
    inventory: 'Inventory',
    picking: 'Picking',
    dispatch: 'Dispatch',
    dashboard: 'Dashboard',
    master: 'Master',
  };

  const pageTitles: Record<string, string> = {
    storing: 'Storing Order Request List',
    myreceiving: 'My Receiving List',
    receiving: 'Receiving Overview',
    qc: 'Quality Check',
    binning: 'Binning',
    inventory: 'Inventory',
    picking: 'Picking',
    dispatch: 'Dispatch',
    dashboard: 'Dashboard',
    master: 'Master Data',
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              menuGroups={menuGroups}
              pageTitles={pageTitles}
            />
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Nested Receiving Routes */}
          <Route path="receiving" element={<ReceivingPage />}>
            <Route path="storing" element={<StoringPage />} />
            <Route path="myreceiving" element={<MyReceivingPage />} />
          </Route>

          <Route path="qc" element={<QCPage />} />
          <Route path="binning" element={<BinningPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="picking" element={<PickingPage />} />
          <Route path="dispatch" element={<DispatchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
