// src/pages/tq/package.tsx

import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Table, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface TQRecord {
  packageId: string;
  productName: string;
  orderQuantity: number;
  scannedQuantity: number;
  inspectionResult: 'Pass' | 'Fail';
  discrepancyDetail?: string;
  employeeId: string;
}

const dummyData: TQRecord[] = [
  {
    packageId: 'pkg-00123',
    productName: 'Apple iPhone 13 Pro',
    orderQuantity: 12,
    scannedQuantity: 12,
    inspectionResult: 'Fail',
    employeeId: 'emp001',
  },
  {
    packageId: 'pkg-00124',
    productName: 'Apple iPhone 13 Pro',
    orderQuantity: 12,
    scannedQuantity: 11,
    inspectionResult: 'Fail',
    employeeId: 'emp002',
  },
  {
    packageId: 'pkg-00125',
    productName: 'Apple iPhone 13 Pro',
    orderQuantity: 12,
    scannedQuantity: 12,
    inspectionResult: 'Fail',
    employeeId: 'emp003',
  },
];

const PackageTQPage: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [qualityCheck, setQualityCheck] = useState('');
  const [data, setData] = useState<TQRecord[]>(dummyData);

  const handleSearch = () => {
    // TODO: API 연동하여 package 정보 불러오기
    console.log('Searching package:', packageId);
  };

  const handleQualitySubmit = () => {
    // TODO: API 연동하여 quality check 저장
    console.log('Submitting quality check:', qualityCheck);
  };

  const columns: ColumnsType<TQRecord> = [
    {
      title: 'Package ID',
      dataIndex: 'packageId',
      key: 'packageId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Order Quantity',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
    },
    {
      title: 'Scanned Quantity',
      dataIndex: 'scannedQuantity',
      key: 'scannedQuantity',
    },
    {
      title: 'Inspection Result',
      dataIndex: 'inspectionResult',
      key: 'inspectionResult',
    },
    {
      title: 'Discrepancy Detail',
      key: 'discrepancyDetail',
      render: (_, record) => (
        <Input
          placeholder="Describe"
          defaultValue={record.discrepancyDetail}
          onChange={(e) => {
            const updated = data.map((item) =>
              item.packageId === record.packageId
                ? { ...item, discrepancyDetail: e.target.value }
                : item
            );
            setData(updated);
          }}
        />
      ),
    },
    {
      title: 'Employee',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="1. Package Search">
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 100px)' }}
                placeholder="Enter Package ID"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
              />
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </Input.Group>
            <div style={{ marginTop: 16 }}>
              <div>📦 Package Information</div>
              <p>
                <strong>Product ID:</strong> pid-00123<br />
                <strong>Product Name:</strong> Apple iPhone 13 Pro<br />
                <strong>Order Quantity:</strong> 12
              </p>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="2. Quality Check">
            <Select
              placeholder="Quality Check"
              style={{ width: '100%' }}
              value={qualityCheck}
              onChange={(val) => setQualityCheck(val)}
            >
              <Option value="Pass">Pass</Option>
              <Option value="Fail">Fail</Option>
            </Select>
            <Button
              type="primary"
              style={{ marginTop: 12 }}
              onClick={handleQualitySubmit}
              block
            >
              Submit
            </Button>
          </Card>
        </Col>
      </Row>

      <Card title="3. TQ Inspection Result">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          rowKey="packageId"
        />
      </Card>
    </div>
  );
};

export default PackageTQPage;
