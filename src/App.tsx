import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

import PickingPage from './pages/picking';
import MyPickingPage from './pages/picking/mypicking';


export default function App() {
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
    'inventory/management': 'Inventory Management',
    'picking/mypicking': 'My Picking',
  };

  {console.log('🔐 App에서 전달하는 userRole:', userInfo?.role)}

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={({ role, employeeId }) => {
                setIsAuthenticated(true);
                setUserInfo({ role, employeeId });
                // ✅ navigate는 LoginPage 내부에서 실행됨
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
          </Route>

          {/* Picking */}
          <Route path="picking" element={<PickingPage />}>
            <Route path="mypicking" element={<MyPickingPage />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
