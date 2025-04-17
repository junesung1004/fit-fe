'use client';

import { Message } from '@/components/page/chats/Message';
import React, { useState, useRef, useEffect } from 'react';

export default function ChatDetailPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: '앗 반갑습니다 :)🙊', isMine: false },
    { id: 2, text: '뭐하고 계셨어요?', isMine: false },
    { id: 3, text: '안녕하세요!', isMine: true },
    { id: 4, text: '저 나혼산 보고 있었어요 ㅎㅎㅎ', isMine: true },
    {
      id: 5,
      text: '아 그거 보시는군요! 저는 기안84편 재밌게 봤었는데!',
    },
  ]);
  const [input, setInput] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleMessageSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: input, isMine: true },
    ]);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{ backgroundImage: "url('/chatbackground.png')" }}
      className="relative w-full h-full flex flex-col"
    >
      {/* 메시지 영역 */}
      <div className="flex flex-col gap-5 flex-1  overflow-y-auto px-5 pt-10">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            isMine={msg.isMine}
            showAvatar={!msg.isMine}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="w-full h-[60px] bg-white px-4 py-2 border-t border-gray-200 flex items-center justify-between">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-lg px-3 py-2 mr-2 outline-none"
        />
        <button
          onClick={handleMessageSend}
          className="px-4 py-2 bg-yellow-300 rounded-md font-bold text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}
