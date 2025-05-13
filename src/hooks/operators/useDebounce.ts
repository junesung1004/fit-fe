export const createDebouncer = <T>(delay = 500) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let items: T[] = [];

  return {
    // eslint-disable-next-line no-unused-vars
    add: (callback: (items: T[]) => void, item: T): void => {
      items.push(item);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

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
