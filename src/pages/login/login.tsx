import React, { useState } from 'react';
import {
  Button,
  Input,
  Typography,
  Card,
  Space,
  Divider,
  message,
} from 'antd';

import {
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  KeyOutlined,
} from '@ant-design/icons';

import logo from '../../components/logo_cargoops.png';
import topLeftPng from '../../components/Group14_login.png';
import bottomLeftPng from '../../components/Group18_login.png';
import topRightPng from '../../components/Group10_login.png';
import { useNavigate } from 'react-router-dom';

const { Title, Link, Text } = Typography;

export default function LoginPage({
  onLogin,
}: {
  onLogin: (info: { role: string; employeeId: string }) => void;
}) {
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!apiKey.trim()) {
      message.warning('🔑 API Key를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://t4hw5tf1ye.execute-api.us-east-2.amazonaws.com/Prod/api-key?api_key=${apiKey}`
      );
      const data = await res.json();
      console.log('🔑 API 응답 데이터:', data);

      if (res.ok && data?.role && data?.employee_id) {
        message.success(`✅ 로그인 성공 (${data.role})`);
        onLogin({ role: data.role, employeeId: data.employee_id });
        navigate('/'); // 홈 또는 권한 페이지로 이동
      } else {
        message.error('❌ 유효하지 않은 API Key입니다');
      }
    } catch (err) {
      message.error('❌ 네트워크 오류');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
      {/* 배경 이미지 */}
      <img
        src={topLeftPng}
        alt="top-left-decoration"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 200,
          zIndex: 0,
          height: 200,
        }}
      />
      <img
        src={bottomLeftPng}
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
        src={topRightPng}
        alt="top-right-decoration"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          zIndex: 0,
        }}
      />

      {/* 로그인 박스 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#F0F2F5',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="logo" style={{ width: 40, marginBottom: 12 }} />
          <Title level={3} style={{ margin: 0 }}>
            CargoOps
          </Title>
          <Text type="secondary">End-to-End Warehouse Management System</Text>
        </div>

        <Card style={{ width: 300 }}>
          <Title level={5} style={{ marginBottom: 24 }}>
            Login with API Key
          </Title>

          <Input
            size="large"
            placeholder="Enter your API Key"
            prefix={<KeyOutlined />}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onPressEnter={handleLogin}
            style={{ marginBottom: 16 }}
          />

          <Button
            type="primary"
            block
            size="large"
            onClick={handleLogin}
            loading={loading}
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

        <div style={{ marginTop: 32, textAlign: 'center', color: '#999' }}>
          <div style={{ marginBottom: 4 }}>Ant Design Pro &nbsp; | &nbsp; Ant Design</div>
          <div style={{ fontSize: 12 }}>
            Copyright ©2020 Produced by Ant Finance Experience Technology Department
          </div>
        </div>
      </div>
    </div>
  );
}
