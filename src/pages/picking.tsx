import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PickingPage() {
  return (
    <div>
      <h1>Picking</h1>
      <Outlet />
    </div>
  );
}