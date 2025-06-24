import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import type { RangeValue } from 'rc-picker/lib/interface';
import { Typography, Input, Table, Tag, DatePicker, Row, Col, Tabs } from 'antd';
import api from '../../api/axios';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

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

export default function StoringOrderPage() {
  const [activeStoringOrder, setActiveStoringOrder] = useState<string | null>(null);
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchStoringOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/storing-orders', {
          params: {
            employee_id: 'RCV2054',
            role: 'receiver',
          },
        });
        const mapped: StoringOrder[] = res.data?.data.map((item: any, idx: number) => ({
          key: idx,
          storingOrderId: item.storing_order_id,
          airwayBillNumber: item.airway_bill_number,
          billOfEntryId: item.bill_of_entry_id,
          customerId: item.customer_id,
          invoiceNumber: item.invoice_number,
          orderDate: item.order_date,
          status: item.status,
        })) || [];
        setRawData(mapped);
        setData(mapped);
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
        const res = await api.get('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/packages', {
          params: {
            employee_id: 'ADMIN01',
            role: 'admin',
          },
        });
        const mapped: ReceivingItem[] = res.data.data.map((item: any, idx: number) => ({
          key: idx,
          receivingId: item.storing_order_id,
          packageId: item.package_id,
          barcode: `BAR-${item.package_id}`,
          productId: item.product_id,
          receiverId: 'emp-001',
          receivedDate: moment().format('YY-MM-DD-HH-mm'),
          dimensions: `${item.height} * ${item.width} * ${item.breadth}`,
          status: item.status,
        }));
        setReceivingData(mapped);
      } catch (e) {
        console.error('❌ 입고 목록 불러오기 실패:', e);
      } finally {
        setReceivingLoading(false);
      }
    };
    fetchReceivingData();
  }, []);

  const handleSearch = () => {
    const filtered = rawData.filter((item) => {
      const matchCustomer = !filters.customerId || item.customerId.toLowerCase().includes(filters.customerId.toLowerCase());
      const matchOrderId = !filters.storingOrderId || item.storingOrderId.toLowerCase().includes(filters.storingOrderId.toLowerCase());
      const matchDate =
        !filters.dateRange ||
        (moment(item.orderDate).isSameOrAfter(filters.dateRange[0], 'day') &&
          moment(item.orderDate).isSameOrBefore(filters.dateRange[1], 'day'));
      return matchCustomer && matchOrderId && matchDate;
    });
    setData(filtered);
  };

  const handleOpenTab = (id: string) => {
    setOpenedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveStoringOrder(id);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'OPEN':
        return 'orange';
      case 'TQ':
        return 'geekblue';
      case 'BIN':
        return 'green';
      case 'INSPECTION-FAILED':
        return 'volcano';
      case 'TQ-QUALITY-CHECK-FAILED':
        return 'magenta';
      case 'READY-FOR-BIN-ALLOCATION':
        return 'cyan';
      case 'RECEIVED':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <>
      {/* 필터 영역 */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Row gutter={80} align="top">
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 8, fontWeight: 500 }}>Customer ID</label>
              <Search
                placeholder="Search Customer ID"
                enterButton
                value={filters.customerId}
                onChange={(e) => setFilters((prev) => ({ ...prev, customerId: e.target.value }))}
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
            </div>
          </Col>

          <Col>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 8, fontWeight: 500 }}>Storing Order ID</label>
              <Search
                placeholder="Search Order ID"
                enterButton
                value={filters.storingOrderId}
                onChange={(e) => setFilters((prev) => ({ ...prev, storingOrderId: e.target.value }))}
                onSearch={handleSearch}
                style={{ width: 250 }}
              />
            </div>
          </Col>

          <Col>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 8, fontWeight: 500 }}>Delivery Date</label>
              <RangePicker
                style={{ width: 250 }}
                value={filters.dateRange}
                onChange={(dates) => setFilters((prev) => ({ ...prev, dateRange: dates }))}
                format="YYYY/MM/DD"
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* 테이블 */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Title level={5}>Storing Order Request List</Title>
        <Table
          columns={[
            {
              title: 'Storing Order ID',
              dataIndex: 'storingOrderId',
              key: 'storingOrderId',
              render: (text: string) => <a onClick={() => handleOpenTab(text)}>{text}</a>,
            },
            { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
            { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
            { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
            { title: 'Bill of Entry ID', dataIndex: 'billOfEntryId', key: 'billOfEntryId' },
            { title: 'Airway Bill Number', dataIndex: 'airwayBillNumber', key: 'airwayBillNumber' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
            },
          ]}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </div>

      <div style={{ background: '#fff', padding: 24 }}>
        <Title level={5}>Storing Order Detail & Progress</Title>
        <Tabs
          activeKey={activeStoringOrder ?? undefined}
          onChange={setActiveStoringOrder}
          type="editable-card"
          hideAdd
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              const newTabs = openedTabs.filter((id) => id !== targetKey);
              setOpenedTabs(newTabs);
              if (activeStoringOrder === targetKey) {
                setActiveStoringOrder(newTabs[0] ?? null);
              }
            }
          }}
        >
          {openedTabs.map((id) => (
            <TabPane tab={id} key={id} closable />
          ))}
        </Tabs>

        <Table
          columns={[
            { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
            { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
            { title: 'Height * Width * Breadth', dataIndex: 'dimensions', key: 'dimensions' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
            },
          ]}
          dataSource={
            activeStoringOrder
              ? receivingData.filter((item) => item.receivingId === activeStoringOrder)
              : []
          }
          loading={receivingLoading}
          pagination={false}
        />
      </div>
    </>
  );
}
