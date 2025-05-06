import MyPageNavigation from '@/components/page/mypage/MyPageNavigation';
import ProfileEdit from '@/components/page/mypage/ProfileImageEdit';

export default function MyPage() {
  return (
    <main className="w-full min-h-[calc(100vh-144px)] py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12">
        {/* 프로필 상단 */}
        <section className="w-full">
          <ProfileEdit />
        </section>
        {/* 프로필 하단 */}
        <section className="w-full">
          <MyPageNavigation />
        </section>
      </div>
    </main>
  );
}
