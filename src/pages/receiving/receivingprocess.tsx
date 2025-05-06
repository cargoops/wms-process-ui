import React, { useState, useRef } from 'react';
import { Typography, Input, Row, Col, Button, message } from 'antd';

const { Title } = Typography;

export default function BarcodeInputSection() {
  const [so, setSo] = useState('');
  const [awb, setAwb] = useState('');
  const [boe, setBoe] = useState('');

  const soRef = useRef(null);
  const awbRef = useRef(null);
  const boeRef = useRef(null);

  const sendToStoringOrderCheckAPI = async () => {
    const payload = {
      storingOrderId: so,
      airwayBillNumber: awb,
      billOfEntryId: boe
    };

    try {
      const res = await fetch("https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/storing-order/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "e476717b-e720-4281-8e2f-1c0fdc574342"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        message.success("✅ 상태 업데이트 완료!");
        setSo('');
        setAwb('');
        setBoe('');
      } else {
        message.error("❌ 실패: " + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      message.error("❌ 네트워크 오류");
      console.error(err);
    }
  };

  return (
    <div style={{ background: '#fff', padding: 24, marginBottom: 24 }}>
      <Title level={5}>📥 바코드 입력</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Input
            ref={soRef}
            value={so}
            onChange={(e) => setSo(e.target.value)}
            placeholder="SO"
          />
        </Col>
        <Col span={8}>
          <Input
            ref={awbRef}
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            placeholder="AWB"
          />
        </Col>
        <Col span={8}>
          <Input
            ref={boeRef}
            value={boe}
            onChange={(e) => setBoe(e.target.value)}
            placeholder="BOE"
          />
        </Col>
      </Row>
      <Button type="primary" style={{ marginTop: 16 }} onClick={sendToStoringOrderCheckAPI}>
        전송
      </Button>
    </div>
  );
}
