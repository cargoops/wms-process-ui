import React, { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button, Card, Form, message } from 'antd';

const { Title } = Typography;

export default function ReceivingProcess() {
  const [so, setSo] = useState('');
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  const [doc3, setDoc3] = useState('');

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
      storingOrderId: so,
      document1: doc1,
      document2: doc2,
      document3: doc3,
    };

    try {
      const res = await fetch(
        'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-order/check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'e476717b-e720-4281-8e2f-1c0fdc574342',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        message.success('✅ 상태 업데이트 완료!');
        setSo('');
        setDoc1('');
        setDoc2('');
        setDoc3('');
        setTimeout(() => soRef.current?.input?.focus(), 100);
      } else {
        message.error('❌ 실패: ' + (data?.message || 'Unknown error'));
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
          ※ Scan the barcode of 3 documents for inspection (Invoice/Bill of Entry/Airway Bill)
        </p>

        <Form layout="vertical">
          <Form.Item label="Scan Storing Order Barcode:">
            <Input
              ref={soRef}
              value={so}
              onChange={handleSoChange}
              placeholder="SO"
            />
          </Form.Item>

          <Form.Item label="Scan Document 1:">
            <Input
              ref={doc1Ref}
              value={doc1}
              onChange={handleDoc1Change}
              placeholder="INV"
            />
          </Form.Item>

          <Form.Item label="Scan Document 2:">
            <Input
              ref={doc2Ref}
              value={doc2}
              onChange={handleDoc2Change}
              placeholder="BOE"
            />
          </Form.Item>

          <Form.Item label="Scan Document 3:">
            <Input
              ref={doc3Ref}
              value={doc3}
              onChange={handleDoc3Change}
              placeholder="AOB"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Submit for Document Inspection
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
