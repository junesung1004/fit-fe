import { create } from 'zustand';

interface LikeState {
  likeChanged: boolean;
  // eslint-disable-next-line no-unused-vars
  setLikeChanged: (value: boolean) => void;
  resetLikeChanged: () => void; // ✅ 초기화 함수 추가
}

export const useLikeStore = create<LikeState>((set) => ({
  likeChanged: false,
  setLikeChanged: (value) => set({ likeChanged: value }),
  resetLikeChanged: () => set({ likeChanged: false }), // ✅ reset 추가
}));
