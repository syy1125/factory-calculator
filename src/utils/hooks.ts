import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

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

export function useLocalStorageMapState<T>(
  key: string
): [
  { [key: string]: T },
  (key: string, value: T) => void,
  Dispatch<SetStateAction<{ [key: string]: T }>>
] {
  const [state, setState] = useLocalStorage<{ [key: string]: T }>(
    key,
    {},
    { serializer: JSON.stringify, deserializer: JSON.parse }
  );
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
