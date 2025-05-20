import React, { useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar, message } from 'antd';
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
  HighlightOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const menuTitleMap: Record<string, string> = {
  dashboard: 'Dashboard',
  master: 'Master',
  'storingorder/list': 'Storing Order List',
  'receiving/soreceiving': 'SO Receiving',
  'receiving/list': 'Receiving List',
  'tq/package': 'Package Technical Query',
  'tq/list': 'TQ List',
  'binning/assign': 'Bin Assignment',
  'binning/my': 'My Binning',
  'inventory/management': 'Inventory Management',
  'inventory/reconciliation': 'Inventory Reconciliation',
  'picking/mypicking': 'My Picking',
  'picking/pickslip': 'Pick Slip',
  'dispatch/mypacking': 'My Packing',
  'dispatch/inspection': 'Dispatch Inspection',
};

// ✅ 1. userRole, employeeId prop 타입 정의 추가
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
  userRole,       // ✅ 2. 구조 분해
  employeeId,
}) => {

  console.log('📥 AppLayout에서 받은 userRole:', userRole);
  
  const location = useLocation();
  const navigate = useNavigate();

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

  // ✅ 3. role별 허용 메뉴 설정 (원한다면 클릭 차단에도 활용 가능)
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
      'tq/list',
      'binning',
      'binning/assign',
      'binning/my',
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
    receiver: [
      'dashboard',
      'receiving',
      'receiving/soreceiving',
    ],
  };

  const allowedMenus = allowedMenusByRole[userRole ?? ''] ?? [];

  const isAllowed = (menuKey: string) => allowedMenus.includes(menuKey);

  return (
    <Layout style={{ minHeight: '100vh', paddingTop: 56 }}>
      {/* 헤더 */}
      <Header
        style={{
          display: 'flex',
          height: 56,
          padding: '0 24px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          boxShadow: 'inset 0px -1px 0px 0px #F0F0F0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5492 0.112436C13.8089 -0.0374786 14.1288 -0.0374786 14.3885 0.112436L27.5181 7.69282C27.7777 7.84273 27.9377 8.11979 27.9377 8.41962V23.5804C27.9377 23.8802 27.7777 24.1573 27.5181 24.3072L14.3885 31.8876C14.1288 32.0375 13.8089 32.0375 13.5492 31.8876L0.419631 24.3072C0.159972 24.1573 0 23.8802 0 23.5804V8.41962C0 8.11979 0.159972 7.84273 0.419631 7.69282L13.5492 0.112436ZM25.42 8.41961L13.9689 15.0309L2.51771 8.41961L13.9689 1.80829L25.42 8.41961Z"
              fill="none"
              stroke="#515A48"
              strokeWidth="2"
            />
          </svg>
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

      <Layout>
        {/* 사이드바 */}
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

          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={(e) => {
              if (!isAllowed(e.key)) {
                message.warning('❌ 해당 메뉴에 접근할 수 없습니다.');
                return;
              }
              setSelectedMenu(e.key);
              navigate(`/${e.key}`);
            }}
          >
            {/* 예시: 메뉴 하나씩 접근 제어 */}
            <Menu.Item key="dashboard" icon={<DashboardOutlined />} disabled={!isAllowed('dashboard')}>Dashboard</Menu.Item>
            <Menu.Item key="master" icon={<HighlightOutlined />} disabled={!isAllowed('master')}>Master</Menu.Item>

            <Menu.SubMenu key="storingorder" icon={<FormOutlined />} title="Storing Order">
              <Menu.Item key="storingorder/list" disabled={!isAllowed('storingorder/list')}>Storing Order List</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="receiving" icon={<CheckCircleOutlined />} title="Receiving">
              <Menu.Item key="receiving/soreceiving" disabled={!isAllowed('receiving/soreceiving')}>SO Receiving</Menu.Item>
              <Menu.Item key="receiving/list" disabled={!isAllowed('receiving/list')}>Receiving List</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="tq" icon={<TableOutlined />} title="Technical Query">
              <Menu.Item key="tq/package" disabled={!isAllowed('tq/package')}>Package TQ</Menu.Item>
              <Menu.Item key="tq/list" disabled={!isAllowed('tq/list')}>TQ List</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="binning" icon={<DatabaseOutlined />} title="Binning">
              <Menu.Item key="binning/assign" disabled={!isAllowed('binning/assign')}>Bin Assignment</Menu.Item>
              <Menu.Item key="binning/my" disabled={!isAllowed('binning/my')}>My Binning</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="inventory" icon={<CheckCircleOutlined />} title="Inventory">
              <Menu.Item key="inventory/management" disabled={!isAllowed('inventory/management')}>Inventory Management</Menu.Item>
              <Menu.Item key="inventory/reconciliation" disabled={!isAllowed('inventory/reconciliation')}>Inventory Reconciliation</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="picking" icon={<WarningOutlined />} title="Picking">
              <Menu.Item key="picking/mypicking" disabled={!isAllowed('picking/mypicking')}>My Picking</Menu.Item>
              <Menu.Item key="picking/pickslip" disabled={!isAllowed('picking/pickslip')}>Pick Slip</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="dispatch" icon={<SendOutlined />} title="Dispatch">
              <Menu.Item key="dispatch/mypacking" disabled={!isAllowed('dispatch/mypacking')}>My Packing</Menu.Item>
              <Menu.Item key="dispatch/inspection" disabled={!isAllowed('dispatch/inspection')}>Dispatch Inspection</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        {/* 콘텐츠 영역 */}
        <Layout>
          <div style={{ background: '#fff', padding: '16px 24px' }}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              {segments.length >= 1 && segments[0] && (
                <Breadcrumb.Item>
                  {menuTitleMap[segments[0]] || segments[0]}
                </Breadcrumb.Item>
              )}
              {segments.length === 2 && segments[1] && (
                <Breadcrumb.Item>
                  {menuTitleMap[`${segments[0]}/${segments[1]}`] || segments[1]}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>

          <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={3} style={{ margin: 0 }}>{resolvedPageTitle}</Title>
          </div>

          <Content style={{ padding: 24, background: '#f5f5f5' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
