import { Dispatch, SetStateAction, useCallback, useState } from "react";

export function useMapState<T>(): [
  { [key: string]: T },
  (key: string, value: T) => void,
  Dispatch<SetStateAction<{ [key: string]: T }>>
] {
  const [state, setState] = useState({});
  const setValue = useCallback(
    (key: string, value: T) => {
      setState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setState]
  );

  return [state, setValue, setState];
}
