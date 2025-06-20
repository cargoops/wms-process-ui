import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Space, message, Card } from 'antd';
import axios from 'axios';

const { Search } = Input;

interface PickSlip {
  pick_slip_id: string;
  customer_id: string;
  pick_slip_created_date: string;
  requested_delivery_date: string;
  pick_slip_status: string;
}

interface PickTask {
  bin_id: string;
  product_id: string;
  quantity: number;
}

interface PickOrder {
  pick_slip_id: string;
  pick_order_id: string;
  picker_id: string;
  picking_zone: string;
  pick_order_status: string;
  pick_task: PickTask[] | PickTask | string;
  order_created_date: string;
  picked_date?: string;
}

const statusColorMap: Record<string, string> = {
  OPEN: 'orange',
  'READY-FOR_PICKING': 'gold',
  'READY-FOR-PACKING': 'cyan',
  'READY-FOR-DISPATCH': 'blue',
  DISPATCHED: 'green',
  CLOSE: 'green',
};

const PickSlipWithOrderTable: React.FC = () => {
  const [pickSlips, setPickSlips] = useState<PickSlip[]>([]);
  const [pickOrders, setPickOrders] = useState<PickOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState<PickSlip[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slipsRes, ordersRes] = await Promise.all([
        axios.get<PickSlip[]>(
          'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/pick-slips',
          { headers: { Authorization: 'adm-12345678' } }
        ),
        axios.get<PickOrder[]>(
          'https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/pick-orders',
          { headers: { Authorization: 'adm-12345678' } }
        ),
      ]);

      setPickSlips(slipsRes.data);
      setFiltered(slipsRes.data);
      setPickOrders(ordersRes.data);

      console.log('Fetched pick orders:', ordersRes.data);
    } catch (err) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const filtered = pickSlips.filter(item =>
      item.pick_slip_id.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filtered);
  };

  const pickSlipColumns = [
    { title: 'Pick Slip ID', dataIndex: 'pick_slip_id', key: 'pick_slip_id' },
    { title: 'Customer ID', dataIndex: 'customer_id', key: 'customer_id' },
    {
      title: 'Requested Delivery Date',
      dataIndex: 'requested_delivery_date',
      key: 'requested_delivery_date',
    },
    {
      title: 'Pick Slip Created Date',
      dataIndex: 'pick_slip_created_date',
      key: 'pick_slip_created_date',
    },
    {
      title: 'Status',
      dataIndex: 'pick_slip_status',
      key: 'pick_slip_status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {status.replace(/_/g, ' ')}
        </Tag>
      ),
    },
  ];

  const pickOrderColumns = [
    { title: 'Pick Order ID', dataIndex: 'pick_order_id', key: 'pick_order_id' },
    { title: 'Pick Slip ID', dataIndex: 'pick_slip_id', key: 'pick_slip_id' },
    { title: 'Picking Zone', dataIndex: 'picking_zone', key: 'picking_zone' },
    {
      title: 'Bin / Product / Qty',
      dataIndex: 'pick_task',
      key: 'pick_task',
      render: (task: any) => {
        try {
          const parsed = typeof task === 'string'
            ? JSON.parse(task.replace(/'/g, '"'))
            : task;

          const arr = Array.isArray(parsed) ? parsed : [parsed];
          return arr.map((t, i) => (
            <div key={i}>
              {t.bin_id} / {t.product_id || t.product_Id} / {t.quantity}
            </div>
          ));
        } catch {
          return '-';
        }
      },
    },
    { title: 'Picker', dataIndex: 'picker_id', key: 'picker_id' },
    {
      title: 'Status',
      dataIndex: 'pick_order_status',
      key: 'pick_order_status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    { title: 'Picked Date', dataIndex: 'picked_date', key: 'picked_date' },
  ];

  return (
    <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        title="Pick Slip List"
        style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Space style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search Pick Slip ID"
            onSearch={handleSearch}
            enterButton
            allowClear
          />
        </Space>
        <Table
          columns={pickSlipColumns}
          dataSource={filtered}
          loading={loading}
          rowKey="pick_slip_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Card
        title="Pick Order List"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: 24 }}
      >
        <Table
          columns={pickOrderColumns}
          dataSource={pickOrders}
          rowKey="pick_order_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default PickSlipWithOrderTable;
