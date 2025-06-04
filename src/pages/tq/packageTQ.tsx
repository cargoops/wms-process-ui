// src/pages/tq/package.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Input, Button, Table, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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

interface PackageInfo {
  productId: string;
  productName: string;
  orderQuantity: number;
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

const productNameMap: Record<string, string> = {
  PROD4100: 'Apple iPhone 16 Pro',
  // 필요한 제품은 여기에 계속 추가
};

const PackageTQPage: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [qualityCheck, setQualityCheck] = useState('');
  const [data, setData] = useState<TQRecord[]>(dummyData);
  const [packageInfo, setPackageInfo] = useState<PackageInfo[]>([]);

  const handleSearch = async () => {
    if (!packageId) {
      message.warning('Please enter a Package ID');
      return;
    }

    try {
      const response = await axios.get(
        `https://t4hw5tf1ye.execute-api.us-east-2.amazonaws.com/Prod/package/${packageId}`,
        {
          headers: {
            Authorization: 'adm-12345678',
          },
        }
      );

      const res = response.data;
      const productName = productNameMap[res.product_id] || 'Unknown';

      setPackageInfo([
        {
          productId: res.product_id,
          productName,
          orderQuantity: res.quantity,
        },
      ]);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch package info');
      setPackageInfo([]);
    }
  };

  const handleQualitySubmit = () => {
    console.log('Submitting quality check:', qualityCheck);
  };

  const tqColumns: ColumnsType<TQRecord> = [
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

  const packageInfoColumns: ColumnsType<PackageInfo> = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Ordered Quantity',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
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
              <Table
                columns={packageInfoColumns}
                dataSource={packageInfo}
                pagination={false}
                rowKey="productId"
                style={{ marginTop: 8 }}
              />
            </div>
          </Card>
        </Col>

        <Col span={12}>
  <Card title="2. TQ Inspection">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Quality Check Section */}
        <div>
          <p style={{ fontWeight: 500, marginBottom: 4 }}>👍 Quality Check</p>
          <p style={{ marginBottom: 16 }}>
            Submit ticket if there is product ID discrepancy or physical damage.
          </p>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              onClick={async () => {
                if (!packageId) return message.warning('Package ID is required');
                try {
                  await axios.post(
                    'https://t4hw5tf1ye.execute-api.us-east-2.amazonaws.com/Prod/tq-quality-check',
                    {
                      package_id: packageId,
                      employee_id: 'emp007', // 실제 직원 ID
                    },
                    {
                      headers: {
                        Authorization: 'tq-4c9d8e2f',
                      },
                    }
                  );
                  message.success('Package marked as Pass (READY-FOR-RFID-ATTACH)');
                } catch (err: any) {
                  if (err.response?.status === 403) {
                    message.error('Forbidden: 권한이 없습니다');
                  } else if (err.response?.status === 400) {
                    message.error('패키지 상태가 READY-FOR-TQ가 아닙니다');
                  } else if (err.response?.status === 404) {
                    message.error('패키지를 찾을 수 없습니다');
                  } else {
                    message.error('Unexpected error occurred');
                  }
                }
              }}
            >
              Pass
            </Button>

            <Button danger onClick={() => setQualityCheck('Fail')}>
              Fail
            </Button>
          </div>

          {qualityCheck === 'Fail' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              <Input.TextArea
                placeholder="Please describe the issue"
                rows={3}
                onChange={(e) => {
                  const updated = data.map((item) =>
                    item.packageId === packageId
                      ? { ...item, discrepancyDetail: e.target.value }
                      : item
                  );
                  setData(updated);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  const failRow = data.find((d) => d.packageId === packageId);
                  message.info('Discrepancy saved.');
                  console.log('Discrepancy detail:', failRow?.discrepancyDetail);
                  setQualityCheck('');
                }}
              >
                Save Detail
              </Button>
            </div>
          )}
        </div>

        {/* Quantity Check Section */}
        <div>
          <p style={{ fontWeight: 500, marginBottom: 4 }}>🧮 Quantity Check</p>
          <p style={{ marginBottom: 0 }}>
            Attach and scan the RFID to verify the quantity. <br />
            The inspection results will be displayed below. <br />
            ※ Only for packages that passed quality check!
          </p>
        </div>
      </div>
    </Card>
  </Col>
      </Row>

      <Card title="3. TQ Inspection Result">
        <Table
          columns={tqColumns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          rowKey="packageId"
        />
      </Card>
    </div>
  );
};

export default PackageTQPage;
