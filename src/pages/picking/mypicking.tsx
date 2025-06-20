import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Space, message, Card, Tabs } from 'antd';
import axios from 'axios';

const { Search } = Input;
const { TabPane } = Tabs;

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

const PickSlipOrderTabbedView: React.FC = () => {
  const [pickOrders, setPickOrders] = useState<PickOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<string[]>([]);
  const [tabOrders, setTabOrders] = useState<Record<string, PickOrder[]>>({});
  const [pickSlips, setPickSlips] = useState<PickSlip[]>([]);
  const [filtered, setFiltered] = useState<PickSlip[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slipRes, orderRes] = await Promise.all([
        axios.get<PickSlip[]>('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/pick-slips', {
          headers: { Authorization: 'adm-12345678' },
        }),
        axios.get<PickOrder[]>('https://ozw3p7h26e.execute-api.us-east-2.amazonaws.com/Prod/pick-orders', {
          headers: { Authorization: 'adm-12345678' },
        }),
      ]);

      setPickOrders(orderRes.data);
      setPickSlips(slipRes.data);
      setFiltered(slipRes.data);

      console.log('Fetched pick orders:', orderRes.data);
    } catch (err) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const result = pickSlips.filter(item =>
      item.pick_slip_id.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(result);
  };

  const handlePickSlipClick = (slipId: string) => {
    if (tabs.includes(slipId)) return;

    const orders = pickOrders.filter(o => o.pick_slip_id === slipId);
    setTabOrders(prev => ({ ...prev, [slipId]: orders }));
    setTabs(prev => [...prev, slipId]);
  };

  const handleTabEdit = (
    targetKey: string | React.MouseEvent | React.KeyboardEvent,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      setTabs(prev => prev.filter(tab => tab !== targetKey));
      setTabOrders(prev => {
        const updated = { ...prev };
        delete updated[targetKey];
        return updated;
      });
    }
  };

  const pickSlipColumns = [
    {
      title: 'Pick Slip ID',
      dataIndex: 'pick_slip_id',
      key: 'pick_slip_id',
      render: (text: string) => (
        <a onClick={() => handlePickSlipClick(text)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          {text}
        </a>
      ),
    },
    { title: 'Customer ID', dataIndex: 'customer_id', key: 'customer_id' },
    { title: 'Requested Delivery Date', dataIndex: 'requested_delivery_date', key: 'requested_delivery_date' },
    { title: 'Pick Slip Created Date', dataIndex: 'pick_slip_created_date', key: 'pick_slip_created_date' },
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
    { title: 'Picking Zone', dataIndex: 'picking_zone', key: 'picking_zone' },
    {
      title: 'Bin / Product / Qty',
      dataIndex: 'pick_task',
      key: 'pick_task',
      render: (task: any) => {
        try {
          const parsed = typeof task === 'string' ? JSON.parse(task.replace(/'/g, '"')) : task;
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          return arr.map((t, i) => (
            <div key={i}>{t.bin_id} / {t.product_id || t.product_Id} / {t.quantity}</div>
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
      <Card title="Pick Slip List" style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Search placeholder="Search Pick Slip ID" onSearch={handleSearch} enterButton allowClear />
        </Space>
        <Table
          columns={pickSlipColumns}
          dataSource={filtered}
          rowKey="pick_slip_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {tabs.length > 0 && (
        <Card title="Pick Order List (by Pick Slip)" style={{ marginTop: 24 }}>
          <Tabs
            type="editable-card"
            hideAdd
            onEdit={handleTabEdit}
          >
            {tabs.map(slipId => (
              <TabPane tab={slipId} key={slipId} closable>
                <Table
                  columns={pickOrderColumns}
                  dataSource={tabOrders[slipId]}
                  rowKey="pick_order_id"
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default PickSlipOrderTabbedView;
