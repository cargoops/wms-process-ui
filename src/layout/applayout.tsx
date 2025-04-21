import React, { useEffect, useCallback } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar } from 'antd';
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

interface AppLayoutProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  selectedMenu: string;
  setSelectedMenu: (val: string) => void;
  menuGroups: Record<string, string>;
  pageTitles: Record<string, string>;
}

//컴포넌트 본문
const AppLayout: React.FC<AppLayoutProps> = ({
  collapsed,
  setCollapsed,
  selectedMenu,
  setSelectedMenu,
  menuGroups,
  pageTitles,
}) => {
  const location = useLocation(); // 현재 경로 추적
  const navigate = useNavigate(); // 버튼 클릭 등 페이지 이동

  {/*경로에서 메뉴 키 추출*/}
  const path = location.pathname.slice(1);
  const segments = path.split('/');
  const key = segments.length === 1 ? segments[0] : `${segments[0]}/${segments[1]}`;

  {/*경로 바뀔 때마다 selectMenu 값을 동기화*/}
  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedMenu('1');
    }
  }, [location.pathname, setSelectedMenu, key]);

  {/*헤더, 사이드바, 메뉴, 브레드크럼 */}
  return (
    <Layout style={{ minHeight: '100vh', paddingTop: 56 }}>
      <Header
        style={{
          display: 'flex',
          height: 56,
          padding: '0 24px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          boxShadow: 'inset 0px -1px 0px 0px #F0F0F0',
          flexShrink: 0,
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
              stroke-width = "2"
            />
          </svg>
          <Text style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>CARGOOPS</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <SearchOutlined style={{ color: 'white' }} />
          <QuestionCircleOutlined style={{ color: 'white' }} />
          <BellOutlined style={{ color: 'white' }} />
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <Text style={{ color: 'white' }}>Mel Kwon</Text>
          <GlobalOutlined style={{ color: 'white' }} />
        </div>
      </Header>

      <Layout>
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              gap: 8,
            }}
          >
            <div onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
              {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
            </div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={(e) => {
              setSelectedMenu(e.key);
              navigate(`/${e.key}`);
            }}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
            <Menu.Item key="master" icon={<HighlightOutlined />}>Master</Menu.Item>

            <Menu.SubMenu key="receiving" icon={<FormOutlined />} title="Receiving">
              <Menu.Item key="receiving/storing">Storing Order Request</Menu.Item>
              <Menu.Item key="receiving/myreceiving">My Receiving List</Menu.Item>
            </Menu.SubMenu>

            <Menu.Item key="qc" icon={<TableOutlined />}>Quality Check</Menu.Item>

            <Menu.SubMenu key="binning" icon={<DatabaseOutlined />} title="Binning">
              <Menu.Item key="binning/assign">Bin Assignment</Menu.Item>
              <Menu.Item key="binning/my">My Binning</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="inventory" icon={<CheckCircleOutlined />} title="Inventory">
              <Menu.Item key="inventory/management">Inventory Management</Menu.Item>
              <Menu.Item key="inventory/reconciliation">Inventory Reconciliation</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="picking" icon={<WarningOutlined />} title="Picking">
              <Menu.Item key="picking/mypicking">My Picking</Menu.Item>
              <Menu.Item key="picking/pickslip">Pick Slip</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="dispatch" icon={<SendOutlined />} title="Dispatch">
              <Menu.Item key="dispatch/mypacking">My Packing</Menu.Item>
              <Menu.Item key="dispatch/inspection">Dispatch Inspection</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <div style={{ background: '#fff', padding: '16px 24px' }}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              {segments.length >= 1 && segments[0] && (
                <Breadcrumb.Item>
                  {menuGroups[segments[0]] || pageTitles[segments[0]] || segments[0]}
                </Breadcrumb.Item>
              )}
              {segments.length === 2 && segments[1] && (
                <Breadcrumb.Item>
                  {pageTitles[`${segments[0]}/${segments[1]}`] || segments[1]}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>

          <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={3} style={{ margin: 0 }}>
              {pageTitles[selectedMenu] || 'Page Title'}
            </Title>
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
