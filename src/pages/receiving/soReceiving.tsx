import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  Input,
  Button,
  Card,
  Form,
  message,
  InputNumber,
  Modal,
} from 'antd';

const { Title } = Typography;

export default function ReceivingProcess() {
  const [so, setSo] = useState('');
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  const [doc3, setDoc3] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [result, setResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const soRef = useRef<any>(null);
  const doc1Ref = useRef<any>(null);
  const doc2Ref = useRef<any>(null);
  const doc3Ref = useRef<any>(null);

  useEffect(() => {
    soRef.current?.input?.focus();
  }, []);

  const renderStatusBadge = (value: string | number) => {
    const submitted = value !== '' && value !== null && value !== undefined;
    return (
      <span
        style={{
          padding: '2px 12px',
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 500,
          border: submitted ? '1px solid #52c41a' : '1px solid #d9d9d9',
          color: submitted ? '#389e0d' : '#595959',
          background: submitted ? '#f6ffed' : '#fafafa',
          display: 'inline-block',
          minWidth: 90,
          textAlign: 'center',
        }}
      >
        {submitted ? '✅ Submitted' : '⬜ Waiting'}
      </span>
    );
  };

  const handleSoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSo(e.target.value);
    if (e.target.value.length > 0) {
      setTimeout(() => doc1Ref.current?.input?.focus(), 100);
    }
  };

  const handleDoc1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc1(e.target.value);
    if (e.target.value.length > 0) {
      setTimeout(() => doc2Ref.current?.input?.focus(), 100);
    }
  };

  const handleDoc2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc2(e.target.value);
    if (e.target.value.length > 0) {
      setTimeout(() => doc3Ref.current?.input?.focus(), 100);
    }
  };

  const handleDoc3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc3(e.target.value);
  };

  const handleSubmit = async () => {
    const payload = {
      storing_order_id: so,
      invoice_number: doc1,
      bill_of_entry_id: doc2,
      airway_bill_number: doc3,
      quantity,
    };

    try {
      const res = await fetch(
        'https://t4hw5tf1ye.execute-api.us-east-2.amazonaws.com/Prod/storing-orders/receive',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'rcv-7fa3d1b2',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success('✅ 입고 처리 성공');
        setResult({
          storingOrderId: so,
          invoiceNumber: doc1,
          billOfEntryId: doc2,
          airwayBillNumber: doc3,
          inspectionResult: 'Pass ✅',
          receivedDate: new Date().toLocaleString(),
        });
      } else {
        message.error('❌ 검사 실패 또는 입력 오류');
        setResult({
          storingOrderId: so,
          invoiceNumber: doc1,
          billOfEntryId: doc2,
          airwayBillNumber: doc3,
          inspectionResult: 'Fail ❌',
          discrepancyDetail: data?.discrepancy_detail || '',
        });
      }

      setModalVisible(true);
      setSo('');
      setDoc1('');
      setDoc2('');
      setDoc3('');
      setQuantity(1);
      setTimeout(() => soRef.current?.input?.focus(), 100);
    } catch (err) {
      message.error('❌ 네트워크 오류');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={5}>Receiving New Storing Order</Title>}
        bordered
        style={{ background: '#fff', width: '100%' }}
      >
        <p style={{ marginBottom: 24 }}>
          ※ Scan the barcode of 3 documents for inspection (Invoice / Bill of Entry / Airway Bill)
        </p>

        <Form layout="vertical">
          <Form.Item label="Storing Order Barcode:">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                ref={soRef}
                value={so}
                onChange={handleSoChange}
                placeholder="SO"
                style={{ flex: 1 }}
              />
              {renderStatusBadge(so)}
            </div>
          </Form.Item>

          <Form.Item label="Invoice:">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                ref={doc1Ref}
                value={doc1}
                onChange={handleDoc1Change}
                placeholder="INV"
                style={{ flex: 1 }}
              />
              {renderStatusBadge(doc1)}
            </div>
          </Form.Item>

          <Form.Item label="Bill of Entry:">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                ref={doc2Ref}
                value={doc2}
                onChange={handleDoc2Change}
                placeholder="BOE"
                style={{ flex: 1 }}
              />
              {renderStatusBadge(doc2)}
            </div>
          </Form.Item>

          <Form.Item label="Airway Bill:">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                ref={doc3Ref}
                value={doc3}
                onChange={handleDoc3Change}
                placeholder="AWB"
                style={{ flex: 1 }}
              />
              {renderStatusBadge(doc3)}
            </div>
          </Form.Item>

          <Form.Item label="Quantity of Packages:">
            <div style={{ display: 'flex', gap: 8 }}>
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                style={{ flex: 1 }}
                placeholder="Enter quantity"
              />
              {renderStatusBadge(quantity)}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="Inspection Result"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        centered
      >
        <p>
          Result:{' '}
          <span
            style={{
              color: result?.inspectionResult === 'Pass ✅' ? 'green' : 'red',
              fontWeight: 600,
            }}
          >
            {result?.inspectionResult}
          </span>
        </p>
        <p>Storing Order ID: {result?.storingOrderId}</p>
        <p>Invoice: {result?.invoiceNumber}</p>
        <p>BOE: {result?.billOfEntryId}</p>
        <p>AWB: {result?.airwayBillNumber}</p>
        {result?.discrepancyDetail && (
          <p style={{ color: 'red' }}>
            Discrepancy: {result.discrepancyDetail}
          </p>
        )}
      </Modal>
    </div>
  );
}
