import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default function PackageTQPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Package Technical Query</Title>
      {/* 여기에 Package TQ 데이터 테이블, 필터, 버튼 등을 추가 */}
      <p>This page displays package-level technical queries.</p>
    </div>
  );
}
