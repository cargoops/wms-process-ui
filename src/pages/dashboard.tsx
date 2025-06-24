import { Typography, Card, Row, Col, List } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>👋 Welcome, Administrator!</Title>
      <Paragraph style={{ fontSize: 14, color: '#595959' }}>
        You are now logged in to the{' '}
        <Text strong style={{ fontSize: 16 }}>
          CARGOOPS
        </Text>{' '}
        administrator console. <br />
        Use the sidebar menu to navigate through various logistics and inventory workflows.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<span style={{ fontSize: 18 }}>🗂 Storing Order</span>} bordered>
            <List
              size="small"
              dataSource={[
                'Storing Order List - View all incoming orders',
                'SO Receiving - Input documents & inspect packages',
                'My Receiving - View personal receiving history',
              ]}
              renderItem={(item) => <List.Item style={{ fontSize: 16 }}>📌 {item}</List.Item>}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span style={{ fontSize: 18 }}>🔍 Technical Query</span>} bordered>
            <List
              size="small"
              dataSource={['Package TQ - View or resolve package-related issues']}
              renderItem={(item) => <List.Item style={{ fontSize: 16 }}>📌 {item}</List.Item>}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span style={{ fontSize: 18 }}>📥 Binning</span>} bordered>
            <List
              size="small"
              dataSource={['Binning - View binned packages and products']}
              renderItem={(item) => <List.Item style={{ fontSize: 16 }}>📌 {item}</List.Item>}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span style={{ fontSize: 18 }}>📦 Inventory</span>} bordered>
            <List
              size="small"
              dataSource={['Inventory Management - Check bin and inventory status']}
              renderItem={(item) => <List.Item style={{ fontSize: 16 }}>📌 {item}</List.Item>}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span style={{ fontSize: 18 }}>🚚 Picking</span>} bordered>
            <List
              size="small"
              dataSource={['Pick Slip List - View and manage picking slips for outbound']}
              renderItem={(item) => <List.Item style={{ fontSize: 16 }}>📌 {item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
