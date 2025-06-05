// src/pages/binassign.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Input, Button, Table, Tag, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface PackageInfo {
  productId: string;
  productName: string;
  orderQuantity: number;
}

interface BinnedRow {
  packageId: string;
  status: string;
  productId: string;
  binLocation: string;
  assignedQuantity: number;
  binnedQuantity: string;
  binningDate: string;
}

interface RawPackage {
  package_id: string;
  product_id: string;
  quantity: string;
  status: string;
  bin_allocation?: Record<string, number> | string | null;
  bin_current?: Record<string, number> | string | null;
  binning_date?: string;
  bin_allocation_date?: string;
}

interface BinAllocRow {
  binLocation: string;
  quantity: number;
}

const productNameMap: Record<string, string> = {
  PROD11: 'Large Item',
  PROD12: 'Medium Item',
  PROD13: 'Small Item',
  PROD14: 'Tiny Item',
};

const statusColorMap: Record<string, string> = {
  BIN_ASSIGNED: 'green',
  BINNING_DONE: 'blue',
  'READY-FOR-BINNING': 'purple',
};

const BinningPage: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [packageInfo, setPackageInfo] = useState<PackageInfo[]>([]);
  const [binAllocResult, setBinAllocResult] = useState<BinAllocRow[]>([]);
  const [binnedList, setBinnedList] = useState<BinnedRow[]>([]);
  const [allPackages, setAllPackages] = useState<RawPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/packages',
        {
          headers: {
            Authorization: 'adm-12345678',
          },
        }
      );

      const all: RawPackage[] = res.data.data;
      setAllPackages(all);

      const rows: BinnedRow[] = [];

      all.forEach((pkg) => {
        if (!pkg.bin_allocation) return;

        let allocation: Record<string, number> = {};
        let current: Record<string, number> = {};

        try {
          allocation =
            typeof pkg.bin_allocation === 'string'
              ? JSON.parse(pkg.bin_allocation)
              : pkg.bin_allocation || {};
        } catch (err) {
          console.warn(`Invalid bin_allocation JSON for package ${pkg.package_id}`);
          return;
        }

        try {
          current =
            typeof pkg.bin_current === 'string'
              ? JSON.parse(pkg.bin_current)
              : pkg.bin_current || {};
        } catch (err) {
          console.warn(`Invalid bin_current JSON for package ${pkg.package_id}`);
          current = {};
        }

        Object.entries(allocation).forEach(([bin, qty]) => {
          const currentQty = current?.[bin] ?? '';

          const binningDateOnly = pkg.bin_allocation_date
            ? dayjs(pkg.bin_allocation_date).format('YYYY-MM-DD')
            : '';

          rows.push({
            packageId: pkg.package_id,
            status: pkg.status,
            productId: pkg.product_id,
            binLocation: bin,
            assignedQuantity: qty,
            binnedQuantity: currentQty?.toString() ?? '',
            binningDate: binningDateOnly,
          });
        });
      });

      setBinnedList(rows);
    } catch (e) {
      message.error('Binned list 불러오기 실패');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!packageId) {
      return message.warning('Package ID를 입력하세요.');
    }

    const found = allPackages.find((pkg) => pkg.package_id === packageId);

    if (!found) {
      message.error('해당 Package ID를 찾을 수 없습니다.');
      setPackageInfo([]);
      setBinAllocResult([]);
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

    try {
      const res = await axios.post(
        'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/bin-allocation',
        {
          package_id: packageId,
          employee_id: 'BIN0401',
        },
        {
          headers: {
            Authorization: 'bin-010101',
          },
        }
      );

      const bin_id = res.data.bin_id;
      const quantity = res.data.quantity;

      setBinAllocResult([{ binLocation: bin_id, quantity }]);
      message.success(`✅ Bin 할당 성공: ${bin_id} (${quantity})`);
    } catch (err: any) {
      console.error('❌ Bin Allocation 실패', err);
      setBinAllocResult([]);

      if (err.response?.status === 403) {
        message.error('❌ 권한이 없습니다.');
      } else if (err.response?.status === 400) {
        message.error('❌ 상태 오류 또는 공간 부족');
      } else if (err.response?.status === 404) {
        message.error('❌ 해당 패키지를 찾을 수 없습니다');
      } else {
        message.error('❌ 알 수 없는 오류 발생');
      }
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const packageInfoColumns: ColumnsType<PackageInfo> = [
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Ordered Quantity', dataIndex: 'orderQuantity', key: 'orderQuantity' },
  ];

  const binnedListColumns: ColumnsType<BinnedRow> = [
    { title: 'Package ID', dataIndex: 'packageId', key: 'packageId' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    { title: 'Bin Location', dataIndex: 'binLocation', key: 'binLocation' },
    { title: 'Assigned Quantity', dataIndex: 'assignedQuantity', key: 'assignedQuantity' },
    { title: 'Binned Quantity', dataIndex: 'binnedQuantity', key: 'binnedQuantity' },
    { title: 'Binning Date (Last Update)', dataIndex: 'binningDate', key: 'binningDate' },
  ];

  const allocColumns: ColumnsType<BinAllocRow> = [
    { title: 'Bin Location', dataIndex: 'binLocation', key: 'binLocation' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Bin Assignment">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Package ID"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={handleAssign}>
              Assign
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                setPackageId('');
                setPackageInfo([]);
                setBinAllocResult([]);
              }}
            >
              Done
            </Button>
          </Col>
        </Row>

        {packageInfo.length > 0 && (
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Table
                title={() => '📦 Package Information'}
                columns={packageInfoColumns}
                dataSource={packageInfo}
                pagination={false}
                rowKey="productId"
              />
            </Col>
            <Col xs={24} lg={12}>
              <Table
                title={() => '🎯 Bin Allocation Result'}
                columns={allocColumns}
                dataSource={binAllocResult}
                pagination={false}
                rowKey="binLocation"
              />
            </Col>
          </Row>
        )}
      </Card>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Binned List</span>
            <Button icon={<ReloadOutlined />} onClick={fetchPackages}>
              Refresh
            </Button>
          </div>
        }
      >
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          <Table
            columns={binnedListColumns}
            dataSource={binnedList}
            pagination={{ pageSize: 5 }}
            rowKey={(row) => `${row.packageId}-${row.binLocation}`}
          />
        )}
      </Card>
    </div>
  );
};

export default BinningPage;
