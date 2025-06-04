// src/pages/binning/index.tsx 또는 binning.tsx
import { Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Title } = Typography;

export default function BinningPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Binning</Title>
      <Outlet />
    </div>
  );
}
