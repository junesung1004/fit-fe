import ProfileEdit from '@/components/page/mypage/ProfileImageEdit';
import Link from 'next/link';

export default function MyPage() {
  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center justify-center">
      {/* 프로필 상단 */}
      <ProfileEdit />
      {/* 프로필 하단 */}
      <div className="w-full">
        <nav className="w-full">
          <ul className="flex flex-col gap-6 w-full px-14">
            <li className="w-full px-5 py-4 border border-black rounded-lg">
              <Link href={'#'}>1</Link>
            </li>
            <li>
              <Link href={'#'}>2</Link>
            </li>
            <li>
              <Link href={'#'}>3</Link>
            </li>
            <li>
              <Link href={'#'}>4</Link>
            </li>
            <li>
              <Link href={'#'}>5</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
