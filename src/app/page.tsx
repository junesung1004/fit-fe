'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-200 to-rose-200 text-white px-4">
      {/* 상단 로고와 메뉴 */}
      
      <div className="absolute top-6 right-6 flex gap-4 text-sm">
        <button onClick={() => router.push('/login')} className="hover:underline">Log in</button>
        <button onClick={() => router.push('/signup')} className="hover:underline">Sign up</button>
      </div>

      {/* 일러스트 자리 */}
      <div className="max-w-md w-full mt-20 mb-10">
        <img
          src="/landing-illustration.png"
          alt="남녀 소개팅 일러스트"
          className="w-full object-contain"
        />
      </div>
      
      <div className="text-3xl font-bold">
        FIT
      </div>

      <div className="text-3xl mb-6">
        우리, 연결될 준비 됐나요?
      </div>

      {/* 버튼 */}
      <button
        onClick={() => router.push('/home')}
        className="bg-white text-violet-600 font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition"
      >
        Get Started
      </button>
    </main>
  )
}
