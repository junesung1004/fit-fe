import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import { ToastContainer } from 'react-toastify';
import SocketProvider from '@/components/providers/SocketProvider';

export const metadata: Metadata = {
  title: 'Fit',
  description: '당신의 인연, 오늘도 어디선가 커피를 기다리고 있어요💓',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="select-none [&_img]:drag-none" suppressHydrationWarning>
        <ReactQueryProvider>
          <SocketProvider>{children}</SocketProvider>
        </ReactQueryProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </body>
    </html>
  );
}
