import React, { useEffect, useState } from 'react';
import {
  loadTossPayments,
  ANONYMOUS,
  TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import { PaymentAmount, PaymentConfirmRequest } from '@/types/payment.type';
import { TOSS_CLIENT_KEY } from '@/services/payment';
import { useConfirmPaymentMutation } from '@/hooks/mutations/useConfirmPaymentMutation';
import { isAxiosError } from '@/lib/error';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  price: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

const generateRandomString = () =>
  window.btoa(Math.random().toString()).slice(0, 20);

export default function PaymentModal({
  isOpen,
  onClose,
  quantity,
  price,
  userName,
  userEmail,
  userPhone,
}: PaymentModalProps) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [amount] = useState<PaymentAmount>({
    currency: 'KRW',
    value: parseInt(price.replace(/[^0-9]/g, '')),
  });

  const { mutate: confirmPayment } = useConfirmPaymentMutation();

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }

    if (isOpen) {
      fetchPaymentWidgets();
    }
  }, [isOpen]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;

      await widgets.setAmount(amount);

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      setReady(true);
    }

    if (widgets) {
      renderPaymentWidgets();
    }
  }, [widgets, amount]);

  const handlePayment = async () => {
    try {
      const result = await widgets?.requestPayment({
        orderId: generateRandomString(),
        orderName: `커피 ${quantity}개`,
        customerName: userName,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/mypage/payment/success?customerName=${userName}&customerEmail=${userEmail}&customerMobilePhone=${userPhone}`,
        failUrl: `${window.location.origin}/mypage/payment/fail`,
      });

      const paymentResult = result as unknown as {
        paymentKey: string;
        orderId: string;
      };

      if (paymentResult) {
        const confirmData: PaymentConfirmRequest = {
          paymentKey: paymentResult.paymentKey,
          orderId: paymentResult.orderId,
          amount: amount.value,
          customerEmail: userEmail,
          customerName: userName,
          customerMobilePhone: userPhone,
        };
        confirmPayment(confirmData);
      }
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : '결제 요청 중 오류가 발생했습니다.';

      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[480px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">결제하기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-2">주문 정보</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>커피 {quantity}개</p>
            <p className="font-bold mt-2">{price}</p>
          </div>
        </div>

        <div id="payment-method" className="w-full mb-4" />
        <div id="agreement" className="w-full mb-4" />

        <button
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 active:bg-blue-700"
          onClick={handlePayment}
          disabled={!ready}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
