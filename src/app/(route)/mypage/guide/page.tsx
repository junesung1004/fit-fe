'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideItem {
  category: string;
  question: string;
  answer: string;
}

const guideItems: GuideItem[] = [
  // 1. 앱 설명
  {
    category: '앱 설명',
    question: '이 앱은 어떤 앱인가요?',
    answer: '관심사 기반으로 친구를 만들고, 커피챗을 신청할 수 있는 소셜 매칭 플랫폼입니다. 단순한 소개팅을 넘어 자연스럽게 연결되는 커뮤니티를 지향합니다.',
  },

  // 2. 호감 / 커피챗 / 월드컵
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '친구를 어떻게 만들 수 있나요?',
    answer: '관심 있는 사람에게 커피챗을 신청하거나, 호감을 표시하거나, 월드컵 매칭을 통해 친구를 만들 수 있어요.',
  },
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '월드컵은 언제 열리고 어떻게 참여하나요?',
    answer: '월드컵은 매일 오전 10시에 열리며, 하루에 한 번만 참여할 수 있어요. 모든 상대를 선택하면 그날 월드컵은 종료되고, 다음 날 오전 10시까지 기다려야 해요.',
  },
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '커피챗 신청은 어떻게 처리되나요?',
    answer: '커피챗을 신청하면 상대방이 수락하거나 거절할 수 있어요. 수락되면 알림이 가고 매칭이 완료되어 채팅방이 생성됩니다.',
  },
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '커피챗 신청 시 결제가 필요한가요?',
    answer: '네, 커피챗 신청을 보내려면 커피 아이템을 사용하거나 추가 결제가 필요할 수 있어요. 커피 수량은 왼쪽 상단 커피 아이콘이나 마이페이지에서 확인할 수 있습니다. 또한 결제는 마이페이지 커피 충전하기에서 하실 수 있습니다.',
  },
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '호감을 보내면 바로 매칭되나요?',
    answer: '호감은 나의 관심 표현일 뿐입니다. 상대방에게 알림이 가고 호감 페이지에 나의 프로필이 노출됩니다.',
  },
  {
    category: '호감 / 커피챗 / 월드컵',
    question: '회원목록 페이지는 어떤 기능을 하나요?',
    answer: '회원목록 페이지에서는 모든 회원을 볼 수 있으며, 회원의 온라인/오프라인 상태를 확인할 수 있어요. 원하는 회원을 둘러본 뒤 호감을 보내거나 커피챗을 신청할 수 있습니다.',
  },

  // 3. 매칭 후
  {
    category: '매칭 후',
    question: '채팅은 어떻게 하나요?',
    answer: '매칭되거나 커피챗이 수락되면 자동으로 채팅방이 생성돼요. 그곳에서 자유롭게 대화할 수 있어요.',
  },
  {
    category: '매칭 후',
    question: '채팅방은 언제 만들어지나요?',
    answer: '서로 매칭이 완료되었거나, 커피챗이 수락된 경우에만 채팅방이 자동으로 만들어집니다.',
  },
  {
    category: '매칭 후',
    question: '매칭 결과는 어디서 볼 수 있나요?',
    answer: '월드컵 매칭 결과는 상단의 매칭결과 페이지를 통해 확인할 수 있어요.',
  },

  // 4. 기타
{
  category: '기타',
  question: '비밀번호는 어떻게 변경하나요?',
  answer: '마이페이지 > 비밀번호 변경 메뉴에서 현재 비밀번호를 입력하고 새로운 비밀번호로 변경할 수 있어요.',
},
{
  category: '기타',
  question: '프로필 이미지는 어떻게 변경하나요?',
  answer: '마이페이지 > 프로필 이미지 관리 메뉴에서 이미지를 추가하거나 삭제할 수 있어요.',
},
{
  category: '기타',
  question: '소개팅 선호 설정은 어떻게 하나요?',
  answer: '마이페이지 > 소개팅 설정 메뉴에서 원하는 나이, 키, 지역 선호 조건을 설정할 수 있어요.',
},
];



export default function Guide() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const groupedItems = guideItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GuideItem[]>);

  const toggleOpen = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      {/* 메인 타이틀 */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-4">앱 사용 가이드</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          처음 오신 분들을 위해 앱 사용 방법<br />
          필요한 내용을 쉽고 빠르게 확인하세요.
        </p>
      </section>

      {/* 카테고리별 정리 */}
      <div className="flex flex-col gap-14">
        {Object.entries(groupedItems).map(([category, items]) => (
          <section key={category}>
            {/* 카테고리 제목 */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">{category}</h2>
              <div className="mt-2 w-10 border-b-2 border-pink-300"></div>
            </div>

            {/* 질문 리스트 */}
            <div className="flex flex-col gap-6">
              {items.map((item) => {
                const index = Object.values(groupedItems)
                  .flat()
                  .findIndex((q) => q.question === item.question);

                const isOpen = openIndex === index;

                return (
                  <div
                    key={item.question}
                    className={`border rounded-xl bg-white overflow-hidden transition-all ${
                      isOpen ? 'border-pink-200 shadow-md' : 'border-gray-200 shadow-xs'
                    }`}
                  >
                    {/* 질문 */}
                    <button
                      className="w-full text-left px-5 py-4 flex justify-between items-center"
                      onClick={() => toggleOpen(index)}
                    >
                      <span className="text-gray-800 font-medium">{item.question}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`text-2xl leading-none transition-colors duration-300 ${
                          isOpen ? 'text-pink-600' : 'text-pink-400'
                        }`}
                      >
                        +
                      </motion.span>
                    </button>

                    {/* 답변 */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-6 text-gray-700 text-base leading-relaxed space-y-2"
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
