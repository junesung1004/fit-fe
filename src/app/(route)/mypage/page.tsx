import MyPageNavigation from '@/components/page/mypage/MyPageNavigation';
import ProfileEdit from '@/components/page/mypage/ProfileImageEdit';

export default function MyPage() {
  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center justify-center">
      {/* 프로필 상단 */}
      <ProfileEdit />
      {/* 프로필 하단 */}
      <MyPageNavigation />
    </div>
  );
}
