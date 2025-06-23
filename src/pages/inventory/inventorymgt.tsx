import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Tag } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

interface InventoryItem {
  bin_id: string;
  product_id: string;
  quantity?: string;
}

export default function InventoryMgtPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const fetchInventory = () => {
    fetch('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/inventory', {
      headers: {
        Authorization: 'adm-12345678',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const validBins = data.data
          .filter((item: any) => /^BIN[1-8]$/.test(item.bin_id))
          .sort((a: any, b: any) => {
            const numA = parseInt(a.bin_id.replace('BIN', ''));
            const numB = parseInt(b.bin_id.replace('BIN', ''));
            return numA - numB;
          });
        setInventory(validBins);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const renderBinCard = (item: InventoryItem, index: number) => {
    const binNum = item.bin_id.replace('BIN', '');
    const isPass = index % 2 !== 1; // Bin 01, 02 fail (❌), 나머지 pass (✅)
    const statusIcon = isPass ? (
      <CheckCircleTwoTone twoToneColor="#52c41a" />
    ) : (
      <CloseCircleTwoTone twoToneColor="#ff4d4f" />
    );

    return (
      <Col span={6} key={item.bin_id}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Bin {binNum.padStart(2, '0')}</span>
              {statusIcon}
            </div>
          }
          bordered
          style={{ marginBottom: 16 }}
        >
          <p><b>Product:</b> {item.product_id}</p>
          <p><b>Quantity:</b> {item.quantity || '0'}</p>
        </Card>
      </Col>
    );
  };

  const upperBins = inventory.filter((item) => {
    const num = parseInt(item.bin_id.replace('BIN', ''));
    return num >= 1 && num <= 4;
  });

  const lowerBins = inventory.filter((item) => {
    const num = parseInt(item.bin_id.replace('BIN', ''));
    return num >= 5 && num <= 8;
  });

  const columns = [
    {
      title: 'Bin ID',
      dataIndex: 'bin_id',
      key: 'bin_id',
      render: (text: string) => {
        const num = text.replace('BIN', '');
        const region = parseInt(num) <= 4 ? 'R1' : 'R2';
        return `${region} - ${text}`;
      },
    },
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: '① Binned',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '② Reserved',
      dataIndex: 'reserved',
      key: 'reserved',
    },
    {
      title: 'Available (① - ②)',
      dataIndex: 'available',
      key: 'available',
    },
    {
      title: 'Inspector ID',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: 'Recon Date',
      dataIndex: 'recon_date',
      key: 'recon_date',
    },
    {
      title: 'Scanned',
      dataIndex: 'scanned',
      key: 'scanned',
    },
    {
      title: 'Recon Result',
      dataIndex: 'recon_result',
      key: 'recon_result',
      render: (text: string) =>
        text === 'Pass' ? <Tag color="green">Pass</Tag> : <Tag color="red">Fail</Tag>,
    },
  ];

  const dataSource = inventory.map((item, index) => ({
    key: index,
    bin_id: item.bin_id,
    product_id: item.product_id,
    quantity: item.quantity || '0',
    reserved: '30',
    available: '20',
    inspector: 'RECON9807',
    recon_date: '2025-06-23',
    scanned: '20',
    recon_result: index % 2 === 0 ? 'Pass' : 'Fail',
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* Dashboard Area */}
      <div style={{ backgroundColor: '#1890ff', padding: '24px', borderRadius: 8 }}>
        <Row>
          {/* 왼쪽 Rack 가이드 */}
          <Col flex="40px">
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              paddingTop: 8,
            }}>
              <div style={{ width: 6, height: 16, backgroundColor: '#91caff', borderRadius: 3 }} />
              <div style={{ width: 6, height: 48, backgroundColor: '#ffffff', borderRadius: 3 }} />
              <div style={{ width: 6, height: 16, backgroundColor: '#91caff', borderRadius: 3 }} />
              <div style={{ width: 6, height: 16, backgroundColor: '#91caff', borderRadius: 3 }} />
            </div>
          </Col>

          {/* 오른쪽 Bin 카드들 */}
          <Col flex="auto">
            <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4, marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                {upperBins.map((item, idx) => renderBinCard(item, idx))}
              </Row>
            </div>
            <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4 }}>
              <Row gutter={[16, 16]}>
                {lowerBins.map((item, idx) => renderBinCard(item, idx + 4))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      {/* Reconciliation Title + Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
        <h3 style={{ margin: 0 }}>Inventory Reconciliation Result (Date: 2025-06-23)</h3>
        <button
          onClick={fetchInventory}
          style={{
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
