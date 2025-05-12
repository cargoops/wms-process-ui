
import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default function TQListPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Technical Query List (All)</Title>
      {/* 전체 TQ 목록을 보여주는 리스트, 테이블 등을 여기에 추가 */}
      <p>This page shows a list of all technical queries.</p>
    </div>
  );
}
