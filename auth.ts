export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EDITOR = 'EDITOR',
  SUPPORT = 'SUPPORT',
  CUSTOMER = 'CUSTOMER',
}

export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_TICKETS = 'MANAGE_TICKETS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin?: string;
}