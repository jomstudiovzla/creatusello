export type DeliveryMethod = 'DELIVERY' | 'PICKUP';

export interface OrderCustomerInfo {
  name: string;
  cedula: string;
  phone: string;
  email: string;
}

export interface OrderDeliveryDetails {
  address: string;
  reference: string;
  city: string;
  date: string;
  time: string;
}

export interface OrderPickupDetails {
  branch: string;
  date: string;
  time: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customText?: string;
  logoUrl?: string;
}

export interface Order {
  id?: string;
  customerInfo: OrderCustomerInfo;
  deliveryMethod: DeliveryMethod;
  deliveryDetails?: OrderDeliveryDetails;
  pickupDetails?: OrderPickupDetails;
  items: OrderItem[];
  subtotalBase: number; 
  totalVes: number; 
  bcvRateAtPurchase: number;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt?: string;
}
