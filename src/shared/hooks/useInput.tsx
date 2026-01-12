import { useState, useCallback, type ChangeEvent } from "react";

interface UseInputProps<T> {
  initialValue: T;
  maxLength?: number;
  onLimitReached?: () => void;
  required?: boolean;
  validate?: (value: T) => string | undefined;
}

export default function useInput<T>({
  initialValue,
  maxLength,
  onLimitReached,
  required,
  validate,
}: UseInputProps<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>();

  const validateValue = useCallback(
    (val: T) => {
      if (required && !val) {
        return "필수 입력 항목입니다.";
      }

      if (maxLength !== undefined && String(val).length > maxLength) {
        return `최대 ${maxLength}자까지 입력 가능합니다.`;
      }

      if (validate) {
        return validate(val);
      }

      return undefined;
    },
    [required, maxLength, validate]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = event.target.value as unknown as T;

      if (maxLength !== undefined && String(newValue).length > maxLength) {
        onLimitReached?.();

        const currentError = validateValue(newValue);
        setError(currentError);
        return;
      }

      if (maxLength !== undefined && String(newValue).length === maxLength) {
        onLimitReached?.();
      }

      const currentError = validateValue(newValue);
      setError(currentError);
      setValue(newValue);
    },
    [maxLength, onLimitReached, validateValue]
  );

  return {
    value,
    error,
    handleChange,
    setValue: (val: T) => {
      setValue(val);
      setError(validateValue(val));
    },
    setError,
    validate: () => {
      const currentError = validateValue(value);
      setError(currentError);
      return !currentError;
    },
  };
}
