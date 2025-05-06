import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Table, Tag, Row, Col, Button, Tabs, Space, message } from 'antd';

const { Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

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

  const [so, setSo] = useState('');
  const [awb, setAwb] = useState('');
  const [boe, setBoe] = useState('');

  const soRef = useRef(null);
  const awbRef = useRef(null);
  const boeRef = useRef(null);

  useEffect(() => {
    const fetchReceivingData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/packages');
        const mapped: ReceivingItem[] = res.data.data.map((item: ApiReceivingItem, idx: number) => ({
          key: idx,
          receivingId: item.storing_order_id,
          packageId: item.packageId,
          barcode: `BAR-${item.packageId}`,
          productId: item.product_id,
          receiverId: item.receiver_id ?? 'emp-001',
          receivedDate: item.received_date ?? new Date().toLocaleString(),
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

    const fetchDocumentInspectionData = async () => {
      try {
        const res = await axios.get('https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-orders');
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
        console.error('❌ 문서검사 데이터 불러오기 실패:', e);
      }
    };

    fetchReceivingData();
    fetchDocumentInspectionData();
  }, []);

  const sendToScannerAPI = async () => {
    const payload = {
      storingOrderId: so,
      airwayBillNumber: awb,
      billOfEntryId: boe
    };

    try {
      const res = await fetch("https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/dev/scanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        message.success("🚀 전송 완료!");
        setSo(''); setAwb(''); setBoe('');
      } else {
        message.error("❌ 전송 실패: " + (data?.error || 'Unknown error'));
      }
    } catch (err) {
      message.error("❌ 네트워크 오류");
      console.error(err);
    }
  };

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
        <Title level={5}>📥 바코드 입력</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}><Input ref={soRef} value={so} onChange={e => setSo(e.target.value)} placeholder="SO" /></Col>
          <Col span={8}><Input ref={awbRef} value={awb} onChange={e => setAwb(e.target.value)} placeholder="AWB" /></Col>
          <Col span={8}><Input ref={boeRef} value={boe} onChange={e => setBoe(e.target.value)} placeholder="BOE" /></Col>
        </Row>
        <Button type="primary" style={{ marginTop: 16 }} onClick={sendToScannerAPI}>전송</Button>
      </div>

      {openedInspectionTabs.length > 0 && (
        <div style={{ background: '#fff', padding: 24 }}>
          <Title level={5}>Document Inspection</Title>
          <Tabs activeKey={activeStoringOrderId ?? ''} onChange={(key) => setActiveStoringOrderId(key)} type="card">
            {openedInspectionTabs.map((id) => (
              <TabPane tab={id} key={id}>
                <Table columns={[]} dataSource={[]} pagination={false} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}
