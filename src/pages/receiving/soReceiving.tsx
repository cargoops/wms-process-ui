import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  Input,
  Button,
  Card,
  Form,
  message,
  InputNumber,
} from 'antd';

const { Title } = Typography;

export default function ReceivingProcess() {
  const [so, setSo] = useState('');
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  const [doc3, setDoc3] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [result, setResult] = useState<any>(null);

  const soRef = useRef<any>(null);
  const doc1Ref = useRef<any>(null);
  const doc2Ref = useRef<any>(null);
  const doc3Ref = useRef<any>(null);

  useEffect(() => {
    soRef.current?.input?.focus();
  }, []);

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
          inspectionResult: 'PASS', // 임시 값. 실제 응답값이 있으면 대체
          discrepancyDetail: '',
          receiverId: 'mel.kwon',   // 실제 로그인 유저 정보로 대체 가능
          receivedDate: new Date().toLocaleString(),
        });

        setSo('');
        setDoc1('');
        setDoc2('');
        setDoc3('');
        setQuantity(1);
        setTimeout(() => soRef.current?.input?.focus(), 100);
      } else {
        message.error('❌ 오류: ' + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      message.error('❌ 네트워크 오류');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={5} style={{ margin: 0 }}>Receiving New Storing Order</Title>}
        bordered
        style={{
          background: '#fff',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <p style={{ marginBottom: 24 }}>
          ※ Scan the barcode of 3 documents for inspection (Invoice / Bill of Entry / Airway Bill)
        </p>

        <Form layout="vertical">
          <Form.Item label="Storing Order Barcode:">
            <Input
              ref={soRef}
              value={so}
              onChange={handleSoChange}
              placeholder="SO"
            />
          </Form.Item>

          <Form.Item label="Document 1 (Invoice):">
            <Input
              ref={doc1Ref}
              value={doc1}
              onChange={handleDoc1Change}
              placeholder="INV"
            />
          </Form.Item>

          <Form.Item label="Document 2 (Bill of Entry):">
            <Input
              ref={doc2Ref}
              value={doc2}
              onChange={handleDoc2Change}
              placeholder="BOE"
            />
          </Form.Item>

          <Form.Item label="Document 3 (Airway Bill):">
            <Input
              ref={doc3Ref}
              value={doc3}
              onChange={handleDoc3Change}
              placeholder="AWB"
            />
          </Form.Item>

          <Form.Item label="Enter Quantity:">
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              style={{ width: '100%' }}
              placeholder="Enter quantity"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Submit for Inspection
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {result && (
        <div style={{ marginTop: 40 }}>
          <Title level={5}>Receiving Result</Title>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Storing Order ID</th>
                <th>Package ID</th>
                <th>Inspection Result</th>
                <th>Discrepancy Detail</th>
                <th>Receiver ID</th>
                <th>Received Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.storingOrderId}</td>
                <td>N/A</td>
                <td>{result.inspectionResult}</td>
                <td>{result.discrepancyDetail || 'N/A'}</td>
                <td>{result.receiverId}</td>
                <td>{result.receivedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
