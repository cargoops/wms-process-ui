// App.tsx (Global Toolbar + Sidebar + Full Content 포함)
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import moment, { Moment } from 'moment';
import type { RangeValue } from 'rc-picker/lib/interface';
import {
  Layout, Menu, Typography, Input, Table, Tag, Avatar,
  DatePicker, Row, Col, Button
} from 'antd';
import {
  UserOutlined, BellOutlined, GlobalOutlined,
  SearchOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;



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

interface ReceivingItem {
  key: number;
  receivingId: string;
  packageId: string;
  barcode: string;
  productId: string;
  receiverId: string;
  receivedDate: string;
  dimensions: string;
  status: string;
}

interface ApiReceivingItem {
  quantity: number;
  packageId: string;
  breadth: number;
  storingOrderId: string;
  width: number;
  height: number;
  status: string;
  productId: string;
}

interface InspectionItem {
  key: number;
  inspectionId: string;
  packageId: string;
  result: string;
  discrepancy: string;
  inspectorId: string;
  receivedDate: string;
}

export default function App() {
  const [activeStoringOrder, setActiveStoringOrder] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState('storing');
  const [rawData, setRawData] = useState<StoringOrder[]>([]);
  const [data, setData] = useState<StoringOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [receivingData, setReceivingData] = useState<ReceivingItem[]>([]);
  const [receivingLoading, setReceivingLoading] = useState(false);
  const [filters, setFilters] = useState<{
    customerId: string;
    storingOrderId: string;
    dateRange: RangeValue<Moment>;
  }>({ customerId: '', storingOrderId: '', dateRange: null });

  const [inspectionData] = useState<InspectionItem[]>([{
    key: 1, inspectionId: 'isp-049231', packageId: 'pkg-824292',
    result: 'Pass', discrepancy: 'N/A', inspectorId: 'emp-001', receivedDate: '25-05-01-12-10'
  }, {
    key: 2, inspectionId: 'isp-049231', packageId: 'pkg-824292',
    result: 'Fail', discrepancy: 'Describe', inspectorId: 'emp-001', receivedDate: '25-05-01-12-10'
  }]);

  useEffect(() => {
    const fetchStoringOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-orders');
        const mapped: StoringOrder[] = res.data?.data.map((item: any, idx: number) => ({
          key: idx, storingOrderId: item.storingOrderId, airwayBillNumber: item.airwayBillNumber,
          billOfEntryId: item.billOfEntryId, customerId: item.customerId, invoiceNumber: item.invoiceNumber,
          orderDate: item.orderDate, status: item.status
        })) || [];
        setRawData(mapped); setData(mapped);
      } catch (e) {
        console.error('❌ 입고 주문 목록 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStoringOrders();
  }, []);

  useEffect(() => {
    const fetchReceivingData = async () => {
      setReceivingLoading(true);
      try {
        const res = await axios.get('https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/packages');
        const mapped: ReceivingItem[] = res.data.data.map((item: ApiReceivingItem, idx: number) => ({
          key: idx,
          receivingId: item.storingOrderId,
          packageId: item.packageId,
          barcode: `BAR-${item.packageId}`,
          productId: item.productId,
          receiverId: 'emp-001', // Default value since not in API
          receivedDate: moment().format('YY-MM-DD-HH-mm'), // Current date since not in API
          dimensions: `${item.height} * ${item.width} * ${item.breadth}`,
          status: item.status
        }));
        setReceivingData(mapped);
      } catch (e) {
        console.error('❌ 입고 목록 불러오기 실패:', e);
      } finally {
        setReceivingLoading(false);
      }
    };

    if (selectedMenu === 'myreceiving') {
      fetchReceivingData();
    }
  }, [selectedMenu]);

  const handleSearch = () => {
    const filtered = rawData.filter((item) => {
      const matchCustomer = !filters.customerId || item.customerId.toLowerCase().includes(filters.customerId.toLowerCase());
      const matchOrderId = !filters.storingOrderId || item.storingOrderId.toLowerCase().includes(filters.storingOrderId.toLowerCase());
      const matchDate = !filters.dateRange || (
        moment(item.orderDate).isSameOrAfter(filters.dateRange[0], 'day') &&
        moment(item.orderDate).isSameOrBefore(filters.dateRange[1], 'day')
      );
      return matchCustomer && matchOrderId && matchDate;
    });
    setData(filtered);
  };

  const storingOrderColumns = [
    { title: 'Storing Order ID', dataIndex: 'storingOrderId', key: 'storingOrderId', render: (text: string) => <a>{text}</a> },
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Bill of Entry ID', dataIndex: 'billOfEntryId', key: 'billOfEntryId' },
    { title: 'Airway Bill Number', dataIndex: 'airwayBillNumber', key: 'airwayBillNumber' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const color = status === 'OPEN' ? 'orange' : status === 'TQ' ? 'geekblue' : status === 'BIN' ? 'green' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Global Toolbar */}
      <Header
        style={{
          display: 'flex',
          height: 48,
          padding: '0 16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          boxShadow: 'inset 0px -1px 0px 0px #F0F0F0',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.5492 0.112436C13.8089 -0.0374786 14.1288 -0.0374786 14.3885 0.112436L27.5181 7.69282C27.7777 7.84273 27.9377 8.11979 27.9377 8.41962V23.5804C27.9377 23.8802 27.7777 24.1573 27.5181 24.3072L14.3885 31.8876C14.1288 32.0375 13.8089 32.0375 13.5492 31.8876L0.419631 24.3072C0.159972 24.1573 1.52588e-05 23.8802 1.52588e-05 23.5804V8.41962C1.52588e-05 8.11979 0.159972 7.84273 0.419631 7.69282L13.5492 0.112436ZM25.42 8.41961L13.9689 15.0309L2.51771 8.41961L13.9689 1.80829L25.42 8.41961Z" fill="#93B04C"/>
          </svg>
          <Text style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>CARGOOPS</Text>
        </div>

        {/* 툴 아이콘 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SearchOutlined style={{ color: 'white' }} />
          <QuestionCircleOutlined style={{ color: 'white' }} />
          <div style={{ position: 'relative' }}>
            <BellOutlined style={{ color: 'white' }} />
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: '#ff4d4f',
              color: 'white',
              borderRadius: '50%',
              width: 18,
              height: 18,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>11</span>
          </div>
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <Text style={{ color: 'white' }}>Mel Kwon</Text>
          <GlobalOutlined style={{ color: 'white' }} />
        </div>
      </Header>


      <Layout>
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <Menu mode="inline" defaultOpenKeys={['receiving']} selectedKeys={[selectedMenu]} onClick={(e) => setSelectedMenu(e.key)}>
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
          <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={3} style={{ margin: 0 }}>{selectedMenu === 'storing' ? 'Storing Order Request List' : 'My Receiving List'}</Title>
          </Header>
          <Content style={{ padding: 24, background: '#f5f5f5' }}>
            {selectedMenu === 'storing' && (
              <>
                {/* ✅ 상단 필터 */}
                <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
                  <Row gutter={16}>
                    <Col>
                      <label>Customer ID</label>
                      <Search
                        placeholder="Search Customer ID"
                        enterButton
                        value={filters.customerId}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, customerId: e.target.value }))
                        }
                        onSearch={handleSearch}
                      />
                    </Col>
                    <Col>
                      <label>Storing Order ID</label>
                      <Search
                        placeholder="Search Order ID"
                        enterButton
                        value={filters.storingOrderId}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, storingOrderId: e.target.value }))
                        }
                        onSearch={handleSearch}
                      />
                    </Col>
                    <Col>
                      <label>Delivery Date</label>
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

                {/* ✅ Storing Order Request Table */}        
                <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
                  <Title level={5}>Storing Order Request List</Title>
                  <Table
                    columns={storingOrderColumns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                  />
                </div>

                {/* ✅ Storing Order Detail & Progress */}
                <div style={{ background: '#fff', padding: 24}}>
                  <Title level={5}>Storing Order Detail & Progress</Title>

                  <Tabs
                    activeKey={activeStoringOrder ?? undefined}
                    onChange={setActiveStoringOrder}
                    type="editable-card"
                    hideAdd
                    style={{ marginBottom: 16 }}
                  >
                    {Array.from(new Set(receivingData.map(item => item.receivingId))).map((id) => (
                      <TabPane tab={id} key={id} closable />
                    ))}
                  </Tabs>

                  <Table
                    columns={[
                      { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
                      { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
                      { title: 'Height * Width * Breadth', dataIndex: 'dimensions', key: 'dimensions' },
                      { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag>{text}</Tag> }
                    ]}
                    dataSource={
                      activeStoringOrder
                        ? receivingData.filter(item => item.receivingId === activeStoringOrder)
                        : []
                    }
                    loading={receivingLoading}
                    pagination={false}
                  />
                </div>

              </>
            )}




            
            {selectedMenu === 'myreceiving' && (
              <>
                <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
                  <Row gutter={16}>
                    <Col><label>Package ID</label><Search placeholder="Search Package ID" enterButton /></Col>
                    <Col><label>Status</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button type="primary">All</Button>
                        <Button>In Progress</Button>
                        <Button>Ready for TQ</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
                  <Title level={5}>Receiving List</Title>
                  <Table columns={[
                    { title: 'Receiving ID', dataIndex: 'receivingId', key: 'receivingId' },
                    { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
                    { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
                    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
                    { title: 'Receiver ID', dataIndex: 'receiverId', key: 'receiverId' },
                    { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
                    { title: 'Height * Width * Breadth', dataIndex: 'dimensions', key: 'dimensions' },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => <Tag>{text}</Tag> },
                  ]} dataSource={receivingData} loading={receivingLoading} pagination={{ pageSize: 6 }} />
                </div>
                <div style={{ background: '#fff', padding: 24 }}>
                  <Title level={5}>Document Inspection</Title>
                  <div style={{ marginBottom: 16 }}>
                    {['rc-dfaw432', 'rc-83skviw', 'rc-f8dkeic'].map((id) => (
                      <Tag key={id} closable color="blue">{id}</Tag>
                    ))}
                  </div>
                  <Table columns={[
                    { title: 'Inspection ID', dataIndex: 'inspectionId', key: 'inspectionId' },
                    { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
                    { title: 'Inspection Result', dataIndex: 'result', key: 'result' },
                    { title: 'Discrepancy Detail', dataIndex: 'discrepancy', key: 'discrepancy' },
                    { title: 'Inspector ID', dataIndex: 'inspectorId', key: 'inspectorId' },
                    { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
                  ]} dataSource={inspectionData} pagination={false} />
                </div>
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
