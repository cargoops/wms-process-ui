import { Typography } from 'antd';

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Dashboard</Title>
      <p>This is the dashboard page.</p>
    </div>
  );
}
