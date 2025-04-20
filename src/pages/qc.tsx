import { Typography } from 'antd';

const { Title } = Typography;

export default function QCPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quality Check</Title>
      <p>This is the quality check page.</p>
    </div>
  );
}