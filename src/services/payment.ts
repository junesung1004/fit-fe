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
      '/payments/confirm',
      paymentData
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<PaymentConfirmResponse>;
    console.error('결제 승인 에러:', err);
    console.error('응답 상태 코드:', err.response?.status);
    console.error('메시지:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '결제 승인에 실패했습니다.');
  }
};
