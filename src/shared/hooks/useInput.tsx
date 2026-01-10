import { useState, type ChangeEvent } from "react";

interface UseControlledProps<T> {
  initialValue: T;
}

export default function useInput<T>({ initialValue }: UseControlledProps<T>) {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value as T);
  };

  return {
    value,
    handleChange,
    setValue,
  };
}
