// AppLayout.tsx (Drawer 적용 모바일 대응)
import React, { useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Avatar,
  Modal,
  Drawer,
  Button,
} from 'antd';
import {
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TableOutlined,
  DatabaseOutlined,
  WarningOutlined,
  SendOutlined,
  DashboardOutlined,
  FormOutlined,
  CheckCircleOutlined,
  HighlightOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const menuTitleMap: Record<string, string> = {
  dashboard: 'Dashboard',
  master: 'Master',
  'storingorder/list': 'Storing Order List',
  'receiving/soreceiving': 'SO Receiving',
  'receiving/list': 'Receiving List',
  'tq/package': 'Package Technical Query',
  'binning/assign': 'Binning',
  'inventory/management': 'Inventory Management',
  'inventory/reconciliation': 'Inventory Reconciliation',
  'picking/mypicking': 'My Picking',
  'picking/pickslip': 'Pick Slip',
  'dispatch/mypacking': 'My Packing',
  'dispatch/inspection': 'Dispatch Inspection',
};

interface AppLayoutProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  selectedMenu: string;
  setSelectedMenu: (val: string) => void;
  userRole?: string;
  employeeId?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  collapsed,
  setCollapsed,
  selectedMenu,
  setSelectedMenu,
  userRole,
  employeeId,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const path = location.pathname.slice(1);
  const segments = path.split('/');
  const key = segments.length === 1 ? segments[0] : `${segments[0]}/${segments[1]}`;

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedMenu('dashboard');
    } else {
      setSelectedMenu(key);
    }
  }, [location.pathname]);

  const resolvedPageTitle = menuTitleMap[selectedMenu] || menuTitleMap[key] || 'Page Title';

  const allowedMenusByRole: Record<string, string[]> = {
    admin: [
      'dashboard',
      'master',
      'storingorder',
      'storingorder/list',
      'receiving',
      'receiving/soreceiving',
      'receiving/list',
      'tq',
      'tq/package',
      'binning',
      'binning/assign',
      'inventory',
      'inventory/management',
      'inventory/reconciliation',
      'picking',
      'picking/mypicking',
      'picking/pickslip',
      'dispatch',
      'dispatch/mypacking',
      'dispatch/inspection',
    ],
    receiver: ['receiving', 'receiving/soreceiving'],
    tq_employee: ['tq', 'tq/package'],
    binner: ['binning', 'binning/assign'],
  };

  const allowedMenus = allowedMenusByRole[userRole ?? ''] ?? [];

  const isAllowed = (menuKey: string) => allowedMenus.includes(menuKey);

  const getItemStyle = (key: string): React.CSSProperties =>
    isAllowed(key)
      ? {}
      : {
          opacity: 0.4,
          pointerEvents: 'auto',
          cursor: 'not-allowed',
        };

  const MenuContent = (
    <Menu
      mode="inline"
      selectedKeys={[selectedMenu]}
      onClick={(e) => {
        if (!isAllowed(e.key)) {
          Modal.warning({
            title: 'Access Denied',
            content: 'You are not allowed to this tab.',
            centered: true,
          });
          return;
        }
        setSelectedMenu(e.key);
        navigate(`/${e.key}`);
        if (isMobile) setDrawerVisible(false);
      }}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined />} style={getItemStyle('dashboard')}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="master" icon={<HighlightOutlined />} style={getItemStyle('master')}>
        Master
      </Menu.Item>
      <Menu.SubMenu key="storingorder" icon={<FormOutlined />} title="Storing Order" style={getItemStyle('storingorder')}>
        <Menu.Item key="storingorder/list" style={getItemStyle('storingorder/list')}>
          Storing Order List
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="receiving" icon={<CheckCircleOutlined />} title="Receiving" style={getItemStyle('receiving')}>
        <Menu.Item key="receiving/soreceiving" style={getItemStyle('receiving/soreceiving')}>
          SO Receiving
        </Menu.Item>
        <Menu.Item key="receiving/list" style={getItemStyle('receiving/list')}>
          Receiving List
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="tq" icon={<TableOutlined />} title="Technical Query" style={getItemStyle('tq')}>
        <Menu.Item key="tq/package" style={getItemStyle('tq/package')}>
          Package TQ
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="binning" icon={<DatabaseOutlined />} title="Binning" style={getItemStyle('binning')}>
        <Menu.Item key="binning/assign" style={getItemStyle('binning/assign')}>
          Binning
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="inventory" icon={<CheckCircleOutlined />} title="Inventory" style={getItemStyle('inventory')}>
        <Menu.Item key="inventory/management" style={getItemStyle('inventory/management')}>
          Inventory Management
        </Menu.Item>
        <Menu.Item key="inventory/reconciliation" style={getItemStyle('inventory/reconciliation')}>
          Inventory Reconciliation
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="picking" icon={<WarningOutlined />} title="Picking" style={getItemStyle('picking')}>
        <Menu.Item key="picking/mypicking" style={getItemStyle('picking/mypicking')}>
          My Picking
        </Menu.Item>
        <Menu.Item key="picking/pickslip" style={getItemStyle('picking/pickslip')}>
          Pick Slip
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="dispatch" icon={<SendOutlined />} title="Dispatch" style={getItemStyle('dispatch')}>
        <Menu.Item key="dispatch/mypacking" style={getItemStyle('dispatch/mypacking')}>
          My Packing
        </Menu.Item>
        <Menu.Item key="dispatch/inspection" style={getItemStyle('dispatch/inspection')}>
          Dispatch Inspection
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', paddingTop: 56, overflow: 'hidden' }}>
      <Header
        style={{
          display: 'flex',
          height: 56,
          padding: '0 16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && (
            <MenuOutlined
              onClick={() => setDrawerVisible(true)}
              style={{ color: 'white', fontSize: 18, marginRight: 8, cursor: 'pointer' }}
            />
          )}
          <Text style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>CARGOOPS</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <SearchOutlined style={{ color: 'white' }} />
          <QuestionCircleOutlined style={{ color: 'white' }} />
          <BellOutlined style={{ color: 'white' }} />
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <Text style={{ color: 'white' }}>{employeeId ?? 'User'}</Text>
          <GlobalOutlined style={{ color: 'white' }} />
        </div>
      </Header>

      <Drawer
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={220}
        bodyStyle={{ padding: 0 }}
      >
        {MenuContent}
      </Drawer>

      <Layout>
        {!isMobile && (
          <Sider
            width={220}
            collapsible
            collapsed={collapsed}
            trigger={null}
            style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
          >
            <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <div onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
                {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
              </div>
            </div>
            {MenuContent}
          </Sider>
        )}

        <Layout>
          <div style={{ background: '#fff', padding: '16px 24px' }}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              {segments.length >= 1 && segments[0] && (
                <Breadcrumb.Item>{menuTitleMap[segments[0]] || segments[0]}</Breadcrumb.Item>
              )}
              {segments.length === 2 && segments[1] && (
                <Breadcrumb.Item>{menuTitleMap[`${segments[0]}/${segments[1]}`] || segments[1]}</Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>

          <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={3} style={{ margin: 0 }}>{resolvedPageTitle}</Title>
          </div>

          <Content
            style={{
              padding: isMobile ? 12 : 24,
              background: '#f5f5f5',
              overflowX: 'auto',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
