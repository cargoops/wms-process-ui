import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/applayout';

// 로그인/역할 페이지
import LoginPage from './pages/login/login';
import RoleSelectPage from './pages/login/roles';
import PrivateRoute from './components/privateroute';

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
import ReceivingProcessPage from './pages/receiving/receivingprocess';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const menuGroups: Record<string, string> = {
    storing: 'Receiving',
    myreceiving: 'Receiving',
    receivingprocess: 'Receiving',
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
    'receiving/receivingprocess': 'Receiving Process',
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
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage onLogin={() => window.location.hash = '#/roles'} />} />

        {/* 역할 선택 페이지 */}
        <Route path="/roles" element={<RoleSelectPage onSelectRole={() => setIsAuthenticated(true)} />} />

        {/* 인증된 사용자만 접근 가능한 앱 */}
        <Route
          path="/*"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AppLayout
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                menuGroups={menuGroups}
                pageTitles={pageTitles}
              />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="master" element={<MasterPage />} />

          <Route path="receiving" element={<ReceivingPage />}>
            <Route path="storing" element={<StoringPage />} />
            <Route path="myreceiving" element={<MyReceivingPage />} />
            <Route path="receivingprocess" element={<ReceivingProcessPage />} />
          </Route>

          <Route path="qc" element={<QCPage />} />

          <Route path="binning" element={<BinningPage />}>
            <Route path="assign" element={<BinAssignPage />} />
            <Route path="my" element={<MyBinningPage />} />
          </Route>

          <Route path="inventory" element={<InventoryPage />}>
            <Route path="management" element={<InventoryMgtPage />} />
            <Route path="reconciliation" element={<InventoryReconPage />} />
          </Route>

          <Route path="picking" element={<PickingPage />}>
            <Route path="mypicking" element={<MyPickingPage />} />
            <Route path="pickslip" element={<PickSlipPage />} />
          </Route>

          <Route path="dispatch" element={<DispatchPage />}>
            <Route path="mypacking" element={<MyPackingPage />} />
            <Route path="inspection" element={<DispatchInspectionPage />} />
          </Route>
        </Route>

        {/* 잘못된 경로는 로그인으로 리디렉션 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
