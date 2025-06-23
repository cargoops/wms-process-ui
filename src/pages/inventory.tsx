// src/pages/inventory/index.tsx
import { Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Title } = Typography;

export default function InventoryPage() {
  return (
    <div style={{ padding: 24 }}>
      <Outlet />
    </div>
  );
}
