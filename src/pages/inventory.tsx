import { Typography } from 'antd';

const { Title } = Typography;

export default function InventoryPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Inventory</Title>
      <p>This is the inventory page.</p>
    </div>
  );
}