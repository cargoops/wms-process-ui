import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Layout,
  Menu,
  Typography,
  Input,
  Button,
  Table,
  Tag,
  Avatar,
  DatePicker,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// ✅ 타입 지정
interface StoringOrder {
  key: number;
  storingOrderId: string;
  airwayBillNumber: string;
  billOfEntryId: string;
  customerId: string;
  invoiceNumber: string;
  orderDate: string;
  status: string;
}

// ✅ 테이블 컬럼 정의
const columns = [
  {
    title: 'Storing Order ID',
    dataIndex: 'storingOrderId',
    key: 'storingOrderId',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Customer ID',
    dataIndex: 'customerId',
    key: 'customerId',
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
  },
  {
    title: 'Invoice Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
  },
  {
    title: 'Bill of Entry ID',
    dataIndex: 'billOfEntryId',
    key: 'billOfEntryId',
  },
  {
    title: 'Airway Bill Number',
    dataIndex: 'airwayBillNumber',
    key: 'airwayBillNumber',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = 'default';
      if (status === 'OPEN') color = 'orange';
      else if (status === 'TQ') color = 'geekblue';
      else if (status === 'BIN') color = 'green';
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const detailColumns = [
  {
    title: 'Package ID',
    dataIndex: 'packageId',
    key: 'packageId',
  },
  {
    title: 'Product ID',
    dataIndex: 'productId',
    key: 'productId',
  },
  {
    title: 'Height * Width * Breadth',
    dataIndex: 'dimensions',
    key: 'dimensions',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const detailData = [
  {
    key: 1,
    packageId: 'pkg-824292',
    productId: 'prd-928493',
    dimensions: '84.42 * 94.22 * 43.21',
    status: 'Open',
  },
  {
    key: 2,
    packageId: 'pkg-824292',
    productId: 'prd-928493',
    dimensions: '84.42 * 94.22 * 43.21',
    status: 'Ready for TQ',
  },
  {
    key: 3,
    packageId: 'pkg-824292',
    productId: 'prd-928493',
    dimensions: '84.42 * 94.22 * 43.21',
    status: 'Ready for Bin Allocation',
  },
];

export default function App() {
  const [data, setData] = useState<StoringOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoringOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-orders'
        );

        console.log('✅ API 응답:', response.data);

        const rawData = response.data?.data || [];

        const mappedRows: StoringOrder[] = rawData.map(
          (item: any, idx: number): StoringOrder => ({
            key: idx,
            storingOrderId: item.storingOrderId,
            airwayBillNumber: item.airwayBillNumber,
            billOfEntryId: item.billOfEntryId,
            customerId: item.customerId,
            invoiceNumber: item.invoiceNumber,
            orderDate: item.orderDate,
            status: item.status,
          })
        );

        setData(mappedRows);
      } catch (error) {
        console.error('❌ 입고 주문 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoringOrders();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            padding: 24,
            fontWeight: 'bold',
            fontSize: 18,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          CARGOOPS
        </div>
        <Menu
          mode="inline"
          defaultOpenKeys={['receiving']}
          selectedKeys={['storing']}
        >
          <Menu.Item key="dashboard">Dashboard</Menu.Item>
          <Menu.Item key="master">Master</Menu.Item>
          <Menu.SubMenu key="receiving" title="Receiving">
            <Menu.Item key="storing">Storing Order Request</Menu.Item>
            <Menu.Item key="myreceiving">My Receiving List</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="qc">Quality Check</Menu.Item>
          <Menu.Item key="binning">Binning</Menu.Item>
          <Menu.Item key="inventory">Inventory</Menu.Item>
          <Menu.Item key="picking">Picking</Menu.Item>
          <Menu.Item key="dispatch">Dispatch</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Text type="secondary">Home / Receiving /</Text>
              <Title level={3} style={{ margin: 0 }}>
                Storing Order Request List
              </Title>
              <Text type="secondary">
                Advanced forms are commonly seen in scenarios where large
                quantities of data are entered and submitted at once.
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text>Mel Kwon</Text>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </Header>

        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          {/* Search Filters */}
          <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Input placeholder="Customer ID" />
              <Input placeholder="Storing Order ID" />
              <DatePicker placeholder="Delivery Date" />
              <Button type="primary">Search</Button>
            </div>
          </div>

          {/* Table List */}
          <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
            <Title level={5}>Storing Order Request List</Title>
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              pagination={{ pageSize: 6 }}
            />
          </div>

          {/* Detail Section */}
          <div style={{ background: '#fff', padding: 24 }}>
            <Title level={5}>Storing Order Detail & Progress</Title>
            <div style={{ marginBottom: 16 }}>
              {[1, 2, 3, 4].map((n) => (
                <Tag key={n} closable color="blue">
                  sto-2505012104224
                </Tag>
              ))}
            </div>
            <Table
              columns={detailColumns}
              dataSource={detailData}
              pagination={false}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
