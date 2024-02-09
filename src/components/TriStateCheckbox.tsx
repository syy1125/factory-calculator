import React, { useEffect, useRef } from "react";

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange"
  > {
  checked?: boolean | null;
  onChange?: (checked: boolean) => void;
}

export function TriStateCheckbox(props: Props) {
  const { checked, onChange, ...inputProps } = props;
  const checkboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkboxRef.current == null) return;
    if (checked == null) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [checked]);
  return (
    <input
      {...inputProps}
      type="checkbox"
      ref={checkboxRef}
      checked={checked === undefined ? undefined : (checked ?? false)}
      onChange={
        onChange === undefined ? undefined : (e) => onChange(e.target.checked)
      }
    />
  );
}
