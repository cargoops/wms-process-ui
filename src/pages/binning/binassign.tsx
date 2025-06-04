import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Input, Button, Table, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
  bin_allocation?: Record<string, number>;
  binning_date?: string;
}

const productNameMap: Record<string, string> = {
  'prd-824922': 'Apple iPhone 16 Pro',
  'prd-824923': 'Samsung Galaxy S22',
  'prd-824924': 'Google Pixel 7',
};

const BinningPage: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [packageInfo, setPackageInfo] = useState<PackageInfo[]>([]);
  const [binnedList, setBinnedList] = useState<BinnedRow[]>([]);
  const [allPackages, setAllPackages] = useState<RawPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
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
        const allocations = pkg.bin_allocation || {};
        Object.entries(allocations).forEach(([bin, qty]) => {
          rows.push({
            packageId: pkg.package_id,
            status: pkg.status,
            productId: pkg.product_id,
            binLocation: bin,
            assignedQuantity: qty,
            binnedQuantity: '',
            binningDate: pkg.binning_date || '',
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

  const handleAssign = () => {
    if (!packageId) {
      return message.warning('Package ID를 입력하세요.');
    }

    const found = allPackages.find((pkg) => pkg.package_id === packageId);

    if (!found) {
      message.error('해당 Package ID를 찾을 수 없습니다.');
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
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Product ID', dataIndex: 'productId', key: 'productId' },
    { title: 'Bin Location', dataIndex: 'binLocation', key: 'binLocation' },
    { title: 'Assigned Quantity', dataIndex: 'assignedQuantity', key: 'assignedQuantity' },
    { title: 'Binned Quantity', dataIndex: 'binnedQuantity', key: 'binnedQuantity' },
    { title: 'Binning Date (Last Update)', dataIndex: 'binningDate', key: 'binningDate' },
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
        </Row>

        {packageInfo.length > 0 && (
          <Table
            title={() => '📦 Package Information'}
            columns={packageInfoColumns}
            dataSource={packageInfo}
            pagination={false}
            rowKey="productId"
          />
        )}
      </Card>

      <Card title="Binned List">
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
