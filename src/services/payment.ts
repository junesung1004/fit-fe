import {
  PaymentConfirmRequest,
  PaymentConfirmResponse,
} from '@/types/payment.type';
import instance from '@/lib/axios';
import { AxiosError } from 'axios';

export const TOSS_CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

// 결제 승인 요청
export const confirmPayment = async (paymentData: PaymentConfirmRequest) => {
  try {
    const response = await instance.post<PaymentConfirmResponse>(
      '/payment/confirm',
      paymentData
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<PaymentConfirmResponse>;
    throw new Error(err.response?.data?.message || '결제 승인에 실패했습니다.');
  }
};
