'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-200 to-rose-200 text-white px-4">
      {/* 상단 로고와 메뉴 */}
      
      <div className="absolute top-6 right-6 flex gap-4 text-sm">
        <Link href="/login">Log in</Link>
        <Link href="/login">Sign up</Link>
        
      </div>
    
      {/* 일러스트 자리 */}
      <div className="max-w-md w-full mt-20 mb-10">
        <Image
          src="/landing-illustration.png"
          alt="남녀 소개팅 일러스트"
          width={500}
          height={500} 
          className="w-full object-contain"
        />
      </div>
      
      <div className="text-3xl font-bold">
        FIT
      </div>

      <div className="text-3xl mb-6">
        우리, 연결될 준비 됐나요?
      </div>
      <Link href="/home">
      <div className="bg-white text-violet-600 font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition text-center">
    Get Started
      </div>
      </Link>
    </main>
  )
}
