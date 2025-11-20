import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDropdownProps {
  defaultValue?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  items: { label: string; value: string }[];
  disabled?: boolean;
  className?: string;
}

export function SelectDropdown({
  defaultValue,
  value,
  onValueChange,
  placeholder = "Select...",
  items,
  disabled,
  className,
}: SelectDropdownProps) {
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
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
