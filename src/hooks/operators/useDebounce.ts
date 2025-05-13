export const createDebouncer = <T>(delay = 500) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let items: T[] = [];

  return {
    // eslint-disable-next-line no-unused-vars
    add: (callback: (items: T[]) => void, item: T): void => {
      // 항목 추가
      items.push(item);

      // 이전 타이머가 있으면 취소
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 새 타이머 설정
      timeoutId = setTimeout(() => {
        if (items.length > 0) {
          callback([...items]);
          items = [];
        }
        timeoutId = null;
      }, delay);
    },

    cancel: (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      items = [];
    },
  };
};
