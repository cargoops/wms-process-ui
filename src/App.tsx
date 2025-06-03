import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './layout/applayout';

import LoginPage from './pages/login/login';
import PrivateRoute from './components/privateroute';

// 상위 페이지들
import DashboardPage from './pages/dashboard';
import MasterPage from './pages/master';
import ReceivingPage from './pages/receiving';
import SOPage from './pages/so';
import TQPage from './pages/tq';

// 하위 페이지들
import ReceivingListPage from './pages/receiving/receivingList';
import SOReceivingPage from './pages/receiving/soReceiving';
import SOListPage from './pages/storingorder/soList';
import PackageTQPage from './pages/tq/packageTQ';

import BinningPage from './pages/binning';
import BinAssignPage from './pages/binning/binassign';

import InventoryPage from './pages/inventory';
import InventoryMgtPage from './pages/inventory/inventorymgt';
import InventoryReconPage from './pages/inventory/inventoryrecon';

import PickingPage from './pages/picking';
import MyPickingPage from './pages/picking/mypicking';
import PickSlipPage from './pages/picking/pickslip';

import DispatchPage from './pages/dispatch';
import MyPackingPage from './pages/dispatch/mypacking';
import DispatchInspectionPage from './pages/dispatch/dispatchinspection';

// 역할별 기본 랜딩 경로 설정
const defaultRouteByRole: Record<string, string> = {
  admin: '/dashboard',
  receiver: '/receiving/soreceiving',
  tq_employee: '/tq/package',
  binner: '/binning/assign',
};

// 내부 컴포넌트로 감싸서 useNavigate 사용
function AppWrapper() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ role: string; employeeId: string } | null>(null);

  const menuGroups: Record<string, string> = {
    soList: 'Storing Order',
    soReceiving: 'Receiving',
    receivingList: 'Receiving',
    packageTQ: 'Technical Query',
    tqList: 'Technical Query',
    binning: 'Binning',
    inventory: 'Inventory',
    picking: 'Picking',
    dispatch: 'Dispatch',
    dashboard: 'Dashboard',
    master: 'Master',
  };

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    master: 'Master Data',
    soList: 'Storing Order List (All)',
    soReceiving: 'SO Receiving',
    receivingList: 'Receiving List (All)',
    packageTQ: 'Package TQ',
    tqList: 'Technical Query List (All)',
    'binning/assign': 'Bin Assignment List',
    'binning/my': 'My Binning',
    'dispatch/mypacking': 'My Packing',
    'dispatch/inspection': 'Dispatch Inspection',
    'inventory/management': 'Inventory Management',
    'inventory/reconciliation': 'Inventory Reconciliation',
    'picking/mypicking': 'My Picking',
    'picking/pickslip': 'Pick Slip List',
  };

  {console.log('🔐 App에서 전달하는 userRole:', userInfo?.role)}

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={({ role, employeeId }) => {
              setIsAuthenticated(true);
              setUserInfo({ role, employeeId });
              const route = defaultRouteByRole[role] ?? '/dashboard';
              navigate(route); // ✅ 역할 기반 페이지로 이동
            }}
          />
        }
      />

      <Route
        path="/*"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AppLayout
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              userRole={userInfo?.role}
              employeeId={userInfo?.employeeId}
            />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="master" element={<MasterPage />} />

        {/* Storing Order */}
        <Route path="storingorder" element={<SOPage />}>
          <Route path="list" element={<SOListPage />} />
        </Route>

        {/* Receiving */}
        <Route path="receiving" element={<ReceivingPage />}>
          <Route path="soreceiving" element={<SOReceivingPage />} />
          <Route path="list" element={<ReceivingListPage />} />
        </Route>

        {/* Technical Query */}
        <Route path="tq" element={<TQPage />}>
          <Route path="package" element={<PackageTQPage />} />
        </Route>

        {/* Binning */}
        <Route path="binning" element={<BinningPage />}>
          <Route path="assign" element={<BinAssignPage />} />
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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// 최상단 Router 설정
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
