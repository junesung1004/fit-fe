import { useMutation } from '@tanstack/react-query';
import { confirmPayment } from '@/services/payment';
import { PaymentConfirmRequest } from '@/types/payment.type';
import { toast } from 'react-toastify';

export const useConfirmPaymentMutation = () => {
  return useMutation({
    mutationFn: (paymentData: PaymentConfirmRequest) =>
      confirmPayment(paymentData),
    onSuccess: () => {
      toast.success('결제가 완료되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '결제에 실패했습니다.');
    },
  });
};
