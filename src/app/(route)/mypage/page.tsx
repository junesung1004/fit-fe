import MyPageNavigation from '@/components/page/mypage/MyPageNavigation';
import ProfileEdit from '@/components/page/mypage/ProfileImageEdit';

export default function MyPage() {
  return (
    <main className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* 프로필 상단 */}
          <section className="w-full">
            <ProfileEdit />
          </section>
          {/* 프로필 하단 */}
          <section className="w-full">
            <MyPageNavigation />
          </section>
        </div>
      </div>
    </main>
  );
}
