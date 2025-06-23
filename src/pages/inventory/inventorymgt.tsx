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

  useEffect(() => {
    fetch('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/inventory', {
      headers: {
        Authorization: 'adm-12345678',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const validBins = data.data.filter((item: any) =>
          /^BIN[1-8]$/.test(item.bin_id)
        );
        setInventory(validBins);
      });
  }, []);

  const renderBinCard = (item: InventoryItem, index: number) => {
    const binNum = item.bin_id.replace('BIN', '');
    const isPass = index % 2 !== 1; // Bin 01, 02 fail (❌), 나머지는 pass (✅)
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
        text === 'Pass' ? (
          <Tag color="green">Pass</Tag>
        ) : (
          <Tag color="red">Fail</Tag>
        ),
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
      <h1>Inventory Bin Status</h1>

      {/* Dashboard Area */}
      <div style={{ backgroundColor: '#1890ff', padding: '24px', borderRadius: 8 }}>
        <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: 4, marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            {upperBins.map((item, idx) => renderBinCard(item, idx))}
          </Row>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: 4 }}>
          <Row gutter={[16, 16]}>
            {lowerBins.map((item, idx) => renderBinCard(item, idx + 4))}
          </Row>
        </div>
      </div>

      <h3 style={{ marginTop: 32 }}>Inventory Reconciliation Result (Date: 2025-06-23)</h3>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
