import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Table, Tag, Row, Col, Button } from 'antd';

const { Title } = Typography;
const { Search } = Input;

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

export default function MyReceivingPage() {
  const [receivingData, setReceivingData] = useState<ReceivingItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReceivingData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/packages');
        const mapped: ReceivingItem[] = res.data.data.map((item: ApiReceivingItem, idx: number) => ({
          key: idx,
          receivingId: item.storingOrderId,
          packageId: item.packageId,
          barcode: `BAR-${item.packageId}`,
          productId: item.productId,
          receiverId: 'emp-001',
          receivedDate: new Date().toLocaleString(),
          dimensions: `${item.height} * ${item.width} * ${item.breadth}`,
          status: item.status,
        }));
        setReceivingData(mapped);
      } catch (e) {
        console.error('❌ 입고 목록 불러오기 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivingData();
  }, []);

  return (
    <>
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Row gutter={16} align="middle">
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
        <Table
          columns={[
            { title: 'Receiving ID', dataIndex: 'receivingId', key: 'receivingId' },
            { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
            { title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
            { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
            { title: 'Receiver ID', dataIndex: 'receiverId', key: 'receiverId' },
            { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
            { title: 'Height * Width * Breadth', dataIndex: 'dimensions', key: 'dimensions' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (text: string) => <Tag>{text}</Tag>
            },
          ]}
          dataSource={receivingData}
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </div>

      <div style={{ background: '#fff', padding: 24 }}>
        <Title level={5}>Document Inspection</Title>
        <div style={{ marginBottom: 16 }}>
          {['rc-dfaw432', 'rc-83skviw', 'rc-f8dkeic'].map((id) => (
            <Tag key={id} closable color="blue">{id}</Tag>
          ))}
        </div>
        <Table
          columns={[
            { title: 'Inspection ID', dataIndex: 'inspectionId', key: 'inspectionId' },
            { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
            { title: 'Inspection Result', dataIndex: 'result', key: 'result' },
            { title: 'Discrepancy Detail', dataIndex: 'discrepancy', key: 'discrepancy' },
            { title: 'Inspector ID', dataIndex: 'inspectorId', key: 'inspectorId' },
            { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
          ]}
          dataSource={[]}
          pagination={false}
        />
      </div>
    </>
  );
}
