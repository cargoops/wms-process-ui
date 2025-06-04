// src/pages/tq/package.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Input, Button, Table, message, Modal, Spin, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface TQRecord {
  package_id: string;
  product_id: string;
  quantity: string;
  status: string;
  tq_scanned_quantity?: string;
  tq_employee_id?: string;
  tq_date?: string;
}

interface PackageInfo {
  productId: string;
  productName: string;
  orderQuantity: number;
}

const productNameMap: Record<string, string> = {
  PROD4100: 'Apple iPhone 16 Pro',
  PROD1: 'Apple iPhone 13 Pro',
  PROD2: 'Samsung Galaxy S22',
  PROD3: 'Google Pixel 7',
};

const PackageTQPage: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [qualityCheck, setQualityCheck] = useState('');
  const [data, setData] = useState<TQRecord[]>([]);
  const [packageInfo, setPackageInfo] = useState<PackageInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/packages',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'adm-12345678',
          },
        }
      );
      setData(response.data.data);
    } catch (err) {
      message.error('패키지 리스트 조회에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const handleSearch = () => {
    if (!packageId) {
      message.warning('Please enter a Package ID');
      return;
    }

    const found = data.find((pkg) => pkg.package_id === packageId);

    if (!found) {
      message.error('Package not found');
      setPackageInfo([]);
      return;
    }

    const productName = productNameMap[found.product_id] || 'Unknown';

    setPackageInfo([
      {
        productId: found.product_id,
        productName,
        orderQuantity: parseInt(found.quantity, 10),
      },
    ]);
  };

  const tqColumns: ColumnsType<TQRecord> = [
    {
      title: 'Package ID',
      dataIndex: 'package_id',
      key: 'package_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          OPEN: 'blue',
          'READY-FOR-TQ': 'green',
          'TQ-CHECKING': 'gold',
          'READY-FOR-BIN-ALLOCATION': 'purple',
          'INSPECTION-FAILED': 'red',
          'TQ-QUALITY-CHECK-FAILED': 'red',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Scanned Qty',
      dataIndex: 'tq_scanned_quantity',
      key: 'tq_scanned_quantity',
    },
    {
      title: 'TQ Employee',
      dataIndex: 'tq_employee_id',
      key: 'tq_employee_id',
    },
    {
      title: 'TQ Date',
      dataIndex: 'tq_date',
      key: 'tq_date',
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
                      setModalVisible(true);

                      try {
                        const response = await axios.post(
                          'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/tq-quality-check',
                          {
                            package_id: packageId,
                            employee_id: 'TQ3101',
                            flag: 'pass',
                          },
                          {
                            headers: {
                              Authorization: 'tq-4c9d8e2f',
                            },
                          }
                        );

                        console.log('✅ TQ Quality Check Response:', response.data);
                        setPackageId('');
                        setPackageInfo([]);
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
                        console.log('Discrepancy:', e.target.value);
                      }}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        message.info('Discrepancy saved.');
                        setQualityCheck('');
                        setPackageId('');
                        setPackageInfo([]);
                      }}
                    >
                      Save Detail
                    </Button>
                  </div>
                )}
              </div>

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

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>3. TQ Inspection Result</span>
            <Button onClick={fetchAllPackages}>Refresh</Button>
          </div>
        }
      >
        {loading ? (
          <Spin tip="Loading packages..." />
        ) : (
          <Table
            columns={tqColumns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            rowKey="package_id"
          />
        )}
      </Card>

      <Modal
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        centered
        title="✅ Quality Check Passed"
      >
        <p>Move on to RFID Attach.</p>
      </Modal>
    </div>
  );
};

export default PackageTQPage;
