// src/pages/login/roles.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function RoleSelectPage({ onSelectRole }: { onSelectRole: () => void }) {
  const navigate = useNavigate();

  const handleSelect = () => {
    onSelectRole();
    navigate('/dashboard'); // 예시: 로그인 완료 후 이동
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 400 }}>
        <Title level={4}>Select Role</Title>
        <div onClick={handleSelect} style={{ cursor: 'pointer', marginBottom: 16 }}>
          <img src="..." alt="Role 1" />
          <p>Role: Receiver</p>
          <p>Menu: Receiving &gt; SO Receiving</p>
        </div>
        <div onClick={handleSelect} style={{ cursor: 'pointer' }}>
          <img src="..." alt="Role 2" />
          <p>Role: Technical Query Inspector</p>
          <p>Menu: Technical Query &gt; Package TQ</p>
        </div>
      </Card>
    </div>
  );
}
