import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/Input";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function SearchInput(props: SearchInputProps) {
  return (
    <Input
      type="search"
      autoComplete="off"
      leftIcon={<span aria-hidden="true">⌕</span>}
      {...props}
    />
  );
}
