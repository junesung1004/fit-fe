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
      <ChatRoom chatRoomId={id} />
    </main>
  );
}
