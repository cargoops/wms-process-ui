import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import moment, { Moment } from 'moment';
import type { RangeValue } from 'rc-picker/lib/interface';
import {
  Layout,
  Menu,
  Typography,
  Input,
  Table,
  Tag,
  Avatar,
  DatePicker,
  Row,
  Col,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

// ✅ 타입 정의
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
  { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
  { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
  {
    title: 'Height * Width * Breadth',
    dataIndex: 'dimensions',
    key: 'dimensions',
  },
  { title: 'Status', dataIndex: 'status', key: 'status' },
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
  const [rawData, setRawData] = useState<StoringOrder[]>([]);
  const [data, setData] = useState<StoringOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    customerId: string;
    storingOrderId: string;
    dateRange: RangeValue<Moment>;
  }>({
    customerId: '',
    storingOrderId: '',
    dateRange: null,
  });

  useEffect(() => {
    const fetchStoringOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-orders'
        );

        const raw = response.data?.data || [];
        const mapped: StoringOrder[] = raw.map(
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

        setRawData(mapped);
        setData(mapped);
      } catch (error) {
        console.error('❌ 입고 주문 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoringOrders();
  }, []);

  const handleSearch = () => {
    const filtered = rawData.filter((item) => {
      const matchCustomer =
        !filters.customerId ||
        item.customerId.toLowerCase().includes(filters.customerId.toLowerCase());
      const matchOrderId =
        !filters.storingOrderId ||
        item.storingOrderId.toLowerCase().includes(filters.storingOrderId.toLowerCase());
      const matchDate =
        !filters.dateRange ||
        (moment(item.orderDate).isSameOrAfter(filters.dateRange[0], 'day') &&
          moment(item.orderDate).isSameOrBefore(filters.dateRange[1], 'day'));

      return matchCustomer && matchOrderId && matchDate;
    });

    setData(filtered);
  };

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
          {/* 검색 필터 영역 */}
          <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
            <Row gutter={16}>
              <Col>
                <label style={{ display: 'block', marginBottom: 4 }}>
                  Customer ID
                </label>
                <Search
                  placeholder="Input search text"
                  enterButton
                  allowClear
                  value={filters.customerId}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      customerId: e.target.value,
                    }))
                  }
                  onSearch={handleSearch}
                />
              </Col>
              <Col>
                <label style={{ display: 'block', marginBottom: 4 }}>
                  Storing Order ID
                </label>
                <Search
                  placeholder="Input search text"
                  enterButton
                  allowClear
                  value={filters.storingOrderId}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      storingOrderId: e.target.value,
                    }))
                  }
                  onSearch={handleSearch}
                />
              </Col>
              <Col>
                <label style={{ display: 'block', marginBottom: 4 }}>
                  Delivery Date
                </label>
                <RangePicker
                  style={{ width: 250 }}
                  value={filters.dateRange}
                  onChange={(dates) =>
                    setFilters((prev) => ({ ...prev, dateRange: dates }))
                  }
                />
              </Col>
            </Row>
          </div>

          {/* 테이블 */}
          <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
            <Title level={5}>Storing Order Request List</Title>
            <Table
              columns={columns}
              dataSource={data}
              loading={loading}
              pagination={{ pageSize: 6 }}
            />
          </div>

          {/* 상세 영역 */}
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
