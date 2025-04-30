import { ChatRoom } from '@/components/page/chats/ChatRoom';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatRoomPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">채팅방</h1>
      <ChatRoom chatRoomId={id} />
    </main>
  );
}
