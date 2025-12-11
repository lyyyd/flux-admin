"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export type SelectDropdownItem = {
  label: string;
  value: string;
};

interface SelectDropdownProps {
  items: SelectDropdownItem[];
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function SelectDropdown({
  items,
  placeholder = "Select",
  defaultValue,
  onValueChange
}: SelectDropdownProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
