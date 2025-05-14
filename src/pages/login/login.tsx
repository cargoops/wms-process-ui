import React, { useState } from 'react';
import {
  Button,
  Input,
  Checkbox,
  Typography,
  Card,
  Space,
  Divider
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Link, Text } = Typography;

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin(); // 임시로 통과
    navigate('/roles');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 배경 SVG들 */}
      <img
        src="/Group14_login.svg"
        alt="top-left-decoration"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 200,
          zIndex: 0,
        }}
      />
      <img
        src="/Group18_login.svg"
        alt="bottom-left-decoration"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 200,
          zIndex: 0,
        }}
      />
      <img
        src="/Group10_login.svg"
        alt="top-right-decoration"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          zIndex: 0,
        }}
      />

      {/* 로그인 콘텐츠 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--Conditional-page-background, #F0F2F5)'
        }}
      >
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/logo_cargoops.png"
            alt="logo"
            style={{ width: 40, marginBottom: 12 }}
          />
          <Title level={3} style={{ margin: 0 }}>
            CargoOps
          </Title>
          <Text type="secondary">End-to-End Warehouse Management System</Text>
        </div>

        {/* 로그인 카드 */}
        <Card style={{ width: 300 }}>
          <Title level={5} style={{ marginBottom: 24 }}>
            Login
          </Title>

          <Input
            size="large"
            placeholder="Scan ID or Type Username"
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input.Password
            size="large"
            placeholder="password: ant.design"
            prefix={<LockOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16
            }}
          >
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            >
              Remember me
            </Checkbox>
            <Link>Forgot your</Link>
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={handleLogin}
            style={{ marginBottom: 16 }}
          >
            Sign In
          </Button>

          <Divider style={{ margin: '12px 0' }}>Quick Sign-in:</Divider>

          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <AlipayCircleOutlined style={{ fontSize: 20 }} />
              <TaobaoCircleOutlined style={{ fontSize: 20 }} />
              <WeiboCircleOutlined style={{ fontSize: 20 }} />
            </Space>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link>Sign Up</Link>
          </div>
        </Card>

        {/* 하단 푸터 */}
        <div style={{ marginTop: 32, textAlign: 'center', color: '#999' }}>
          <div style={{ marginBottom: 4 }}>
            Ant Design Pro &nbsp; | &nbsp; Ant Design
          </div>
          <div style={{ fontSize: 12 }}>
            Copyright ©2020 Produced by Ant Finance Experience Technology Department
          </div>
        </div>
      </div>
    </div>
  );
}
