import { useEffect, useState } from "react";

type UseDebounceProps<T> = {
  value: T;
  time: number;
};

export function useDebouncer<T>({ value, time }: UseDebounceProps<T>) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    return () => clearTimeout(timer);
  }, [value, time]);

  return debouncedValue;
}
