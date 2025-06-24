import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Table, Tag, Row, Col } from 'antd';

const { Title } = Typography;
const { Search } = Input;

interface StoringOrder {
  storing_order_id: string;
  airway_bill_number: string;
  bill_of_entry_id: string;
  customer_id: string;
  discrepancy_detail: string;
  doc_inspection_result: string;
  expected_delivery_date: string;
  invoice_number: string;
  order_date: string;
  package_quantity: number;
  packages: string;
  received_date: string;
  receiver_id: string;
  status: string;
}

interface StoringOrderRow {
  key: string;
  storingOrderId: string;
  result: string;
  discrepancy: string;
  packages: string[];
  receivedDate: string;
  status: string;
  receiverId: string;
}

export default function MyReceivingPage() {
  const [storingOrders, setStoringOrders] = useState<StoringOrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoringOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/storing-orders?employee_id=RCV2054&role=receiver'
        );
        console.log('✅ Storing orders 불러오기 성공:', res.data);
        const raw: StoringOrder[] = res.data.data;

        const processed: StoringOrderRow[] = raw
          .filter((order) => order.receiver_id === 'RCV2054')
          .map((order) => ({
            key: order.storing_order_id,
            storingOrderId: order.storing_order_id,
            result: order.doc_inspection_result,
            discrepancy:
              order.doc_inspection_result === 'PASS' ? '-' : order.discrepancy_detail || '',
            packages: order.packages
              ? order.packages.replace(/[\[\]]/g, '').split(';').filter((p) => p.trim() !== '')
              : [],
            receivedDate: order.received_date || order.order_date,
            status: order.status,
            receiverId: order.receiver_id,
          }));

        setStoringOrders(processed);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error('❌ Storing orders 불러오기 실패:', e.response?.status, e.response?.data);
        } else {
          console.error('❌ storing-orders 오류:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoringOrders();
  }, []);

  return (
    <>
      {/* Filter Section */}
      <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <label>Storing Order ID</label>
            <Search placeholder="Search Storing Order ID" enterButton />
          </Col>
        </Row>
      </div>

      {/* Storing Orders Table */}
      <div style={{ background: '#fff', padding: 24 }}>
        <Title level={5}>Storing Orders</Title>
        <Table
          columns={[
            { title: 'Storing Order ID', dataIndex: 'storingOrderId', key: 'storingOrderId' },
            { title: 'Inspection Result', dataIndex: 'result', key: 'result' },
            { title: 'Discrepancy Detail', dataIndex: 'discrepancy', key: 'discrepancy' },
            {
              title: 'Packages',
              key: 'packages',
              render: (_: any, record: StoringOrderRow) => (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {record.packages.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              ),
            },
            { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => {
                let color: string;
                switch (status) {
                  case 'INSPECTION-FAILED':
                    color = 'red';
                    break;
                  case 'OPEN':
                    color = 'blue';
                    break;
                  case 'RECEIVED':
                    color = 'green';
                    break;
                  case 'BINNED':
                    color = 'lime';
                    break;
                  default:
                    color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
              },
            },
            {
              title: 'Employee ID',
              dataIndex: 'receiverId',
              key: 'receiverId',
            },
          ]}
          dataSource={storingOrders}
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
}
