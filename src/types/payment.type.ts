export interface PaymentDataType {
  id: number;
  quantity: number;
  price: string;
}

export interface PaymentAmount {
  currency: string;
  value: number;
}

export interface PaymentRequest {
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
}

export interface PaymentConfirmResponse {
  success: boolean;
  message: string;
}
