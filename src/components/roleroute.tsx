import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleRoute({
  allowedRoles,
  userRole,
  children,
}: {
  allowedRoles: string[];
  userRole: string;
  children: React.ReactNode;
}) {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}
