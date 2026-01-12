import { useState, useCallback, type ChangeEvent } from "react";

interface UseInputProps<T> {
  initialValue: T;
  maxLength?: number;
  onLimitReached?: () => void;
}

export default function useInput<T>({ initialValue, maxLength, onLimitReached }: UseInputProps<T>) {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value;

      if (maxLength !== undefined && newValue.length > maxLength) {
        onLimitReached?.();
        return;
      }

      // If user reaches exactly the limit, show toast but update state
      if (maxLength !== undefined && newValue.length === maxLength) {
        onLimitReached?.();
      }

      setValue(newValue as unknown as T);
    },
    [maxLength, onLimitReached]
  );

  return {
    value,
    handleChange,
    setValue,
  };
}
