import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/applayout';

// 상위 페이지
import DashboardPage from './pages/dashboard';
import ReceivingPage from './pages/receiving';
import QCPage from './pages/qc';
import BinningPage from './pages/binning';
import InventoryPage from './pages/inventory';
import PickingPage from './pages/picking';
import DispatchPage from './pages/dispatch';
import MasterPage from './pages/master';

// Receiving 하위
import StoringPage from './pages/receiving/storingorder';
import MyReceivingPage from './pages/receiving/myreceiving';

// Binning 하위
import BinAssignPage from './pages/binning/binassign';
import MyBinningPage from './pages/binning/mybinning';

// Dispatch 하위
import MyPackingPage from './pages/dispatch/mypacking';
import DispatchInspectionPage from './pages/dispatch/dispatchinspection';

// Inventory 하위
import InventoryMgtPage from './pages/inventory/inventorymgt';
import InventoryReconPage from './pages/inventory/inventoryrecon';

// Picking 하위
import MyPickingPage from './pages/picking/mypicking';
import PickSlipPage from './pages/picking/pickslip';

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
    'receiving/storing': 'Storing Order Request List',
    'receiving/myreceiving': 'My Receiving List',
    'binning/assign': 'Bin Assignment List',
    'binning/my': 'My Binning',
    'dispatch/mypacking': 'My Packing',
    'dispatch/inspection': 'Dispatch Inspection',
    'inventory/management': 'Inventory Management',
    'inventory/reconciliation': 'Inventory Reconciliation',
    'picking/mypicking': 'My Picking',
    'picking/pickslip': 'Pick Slip List',
    dashboard: 'Dashboard',
    master: 'Master Data',
    qc: 'Quality Check',
  };

  return (
    <Router>
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

          {/* Master */}
          <Route path="master" element={<MasterPage />} />

          {/* Receiving */}
          <Route path="receiving" element={<ReceivingPage />}>
            <Route path="storing" element={<StoringPage />} />
            <Route path="myreceiving" element={<MyReceivingPage />} />
          </Route>

          {/* Quality Check */}
          <Route path="qc" element={<QCPage />} />

          {/* Binning */}
          <Route path="binning" element={<BinningPage />}>
            <Route path="assign" element={<BinAssignPage />} />
            <Route path="my" element={<MyBinningPage />} />
          </Route>

          {/* Inventory */}
          <Route path="inventory" element={<InventoryPage />}>
            <Route path="management" element={<InventoryMgtPage />} />
            <Route path="reconciliation" element={<InventoryReconPage />} />
          </Route>

          {/* Picking */}
          <Route path="picking" element={<PickingPage />}>
            <Route path="mypicking" element={<MyPickingPage />} />
            <Route path="pickslip" element={<PickSlipPage />} />
          </Route>

          {/* Dispatch */}
          <Route path="dispatch" element={<DispatchPage />}>
            <Route path="mypacking" element={<MyPackingPage />} />
            <Route path="inspection" element={<DispatchInspectionPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
