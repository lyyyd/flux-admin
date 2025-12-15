import { useState } from "react";

/**
 * Toggleable dialog state helper. Returns current key and setter that closes when same key is passed twice.
 * Example: const [open, setOpen] = useDialogState<"create" | "delete">();
 */
export default function useDialogState<T extends string | boolean>(
  initialState: T | null = null
) {
  const [open, _setOpen] = useState<T | null>(initialState);

  const setOpen = (value: T | null) =>
    _setOpen((prev) => (prev === value ? null : value));

  return [open, setOpen] as const;
}
