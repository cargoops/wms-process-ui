import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Table, Tag, Row, Col, Button, Tabs, Space } from 'antd';

const { Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface ReceivingItem {
  key: number;
  receivingId: string;
  packageId: string;
  productId: string;
  receiverId: string;
  receivedDate: string;
  dimensions: string;
  status: string;
}

interface ApiReceivingItem {
  packageId: string;
  breadth: string;
  storing_order_id: string;
  width: string;
  height: string;
  status: string;
  product_id: string;
  receiver_id?: string;
  received_date?: string;
}

interface DocumentInspectionItem {
  key: string;
  storingOrderId: string;
  packageId: string;
  result: string;
  discrepancy: string;
  receivedDate: string;
}

interface StoringOrder {
  orderDate: string;
  documentInspectionResult: string;
  storingOrderId: string;
  billOfEntryId: string;
  status: string;
  airwayBillNumber: string;
  packages: string[];
  invoiceNumber: string;
  customerId: string;
}

export default function MyReceivingPage() {
  const [receivingData, setReceivingData] = useState<ReceivingItem[]>([]);
  const [documentInspectionData, setDocumentInspectionData] = useState<DocumentInspectionItem[]>([]);
  const [editedDiscrepancies, setEditedDiscrepancies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [activeStoringOrderId, setActiveStoringOrderId] = useState<string | null>(null);
  const [openedInspectionTabs, setOpenedInspectionTabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchReceivingData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/packages',
          {
            headers: {
              'x-api-key': 'adm-12345678',
            },
          }
        );
        console.log('✅ 입고 데이터 불러오기 성공:', res.data);
        const mapped: ReceivingItem[] = res.data.data.map((item: ApiReceivingItem, idx: number) => ({
          key: idx,
          receivingId: item.storing_order_id,
          packageId: item.packageId,
          productId: item.product_id,
          receiverId: item.receiver_id ?? 'emp-001',
          receivedDate: item.received_date ?? new Date().toLocaleString(),
          dimensions: `${item.height} * ${item.width} * ${item.breadth}`,
          status: item.status,
        }));
        setReceivingData(mapped);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error('❌ 입고 목록 불러오기 실패:', e.response?.status, e.response?.data);
        } else {
          console.error('❌ 입고 목록 불러오기 실패 (기타 오류):', e);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchDocumentInspectionData = async () => {
      try {
        const res = await axios.get(
          'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-orders',
          {
            headers: {
              'x-api-key': 'adm-12345678',
            },
          }
        );
        console.log('✅ 문서 검사 데이터 불러오기 성공:', res.data);
        const raw: StoringOrder[] = res.data.data;

        const processed: DocumentInspectionItem[] = raw.flatMap((order: StoringOrder, idx: number) =>
          order.packages.map((pkgId: string, pkgIdx: number) => ({
            key: `${order.storingOrderId}-${pkgIdx}`,
            storingOrderId: order.storingOrderId,
            packageId: pkgId,
            result: order.documentInspectionResult,
            discrepancy: order.documentInspectionResult === 'PASS' ? '-' : '',
            receivedDate: order.orderDate,
          }))
        );

        setDocumentInspectionData(processed);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error('❌ 문서검사 데이터 불러오기 실패:', e.response?.status, e.response?.data);
        } else {
          console.error('❌ 문서검사 데이터 불러오기 실패 (기타 오류):', e);
        }
      }
    };

    fetchReceivingData();
    fetchDocumentInspectionData();
  }, []);

  const handleDiscrepancyChange = (key: string, value: string) => {
    setEditedDiscrepancies((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveDiscrepancy = (key: string) => {
    const newVal = editedDiscrepancies[key] ?? '';
    setDocumentInspectionData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, discrepancy: newVal } : item
      )
    );
  };

  const handleOpenTab = (soId: string) => {
    setOpenedInspectionTabs((prev) => (prev.includes(soId) ? prev : [...prev, soId]));
    setActiveStoringOrderId(soId);
  };

  return (
    <>
      {/* Receiving Filter */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <label>Package ID</label>
            <Search placeholder="Search Package ID" enterButton />
          </Col>
          <Col>
            <label>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary">All</Button>
              <Button>In Progress</Button>
              <Button>Ready for TQ</Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Receiving List */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Title level={5}>Receiving List</Title>
        <Table
          columns={[
            {
              title: 'Storing Order ID',
              dataIndex: 'receivingId',
              key: 'receivingId',
              render: (text: string) => (
                <button
                  onClick={() => handleOpenTab(text)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1890ff',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  {text}
                </button>
              ),
            },
            { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
            { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
            { title: 'Receiver ID', dataIndex: 'receiverId', key: 'receiverId' },
            { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
            { title: 'Height * Width * Breadth', dataIndex: 'dimensions', key: 'dimensions' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (text: string) => <Tag>{text}</Tag>,
            },
          ]}
          dataSource={receivingData}
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* Document Inspection */}
      {openedInspectionTabs.length > 0 && (
        <div style={{ background: '#fff', padding: 24 }}>
          <Title level={5}>Document Inspection</Title>
          <Tabs
            activeKey={activeStoringOrderId ?? ''}
            onChange={(key) => setActiveStoringOrderId(key)}
            type="card"
          >
            {openedInspectionTabs.map((id) => (
              <TabPane tab={id} key={id}>
                <Table
                  columns={[
                    { title: 'Storing Order ID', dataIndex: 'storingOrderId', key: 'storingOrderId' },
                    { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
                    { title: 'Inspection Result', dataIndex: 'result', key: 'result' },
                    {
                      title: 'Discrepancy Detail',
                      dataIndex: 'discrepancy',
                      key: 'discrepancy',
                      render: (_: any, record: DocumentInspectionItem) =>
                        record.result === 'FAIL' ? (
                          <Space>
                            <Input
                              value={editedDiscrepancies[record.key] ?? record.discrepancy}
                              onChange={(e) =>
                                handleDiscrepancyChange(record.key, e.target.value)
                              }
                              placeholder="Describe issue"
                            />
                            <Button
                              type="primary"
                              onClick={() => handleSaveDiscrepancy(record.key)}
                            >
                              Save
                            </Button>
                          </Space>
                        ) : (
                          <span>{record.discrepancy}</span>
                        ),
                    },
                    { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
                  ]}
                  dataSource={documentInspectionData.filter(item => item.storingOrderId === id)}
                  pagination={false}
                />
              </TabPane>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}
