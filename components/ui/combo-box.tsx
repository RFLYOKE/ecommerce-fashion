import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ComboboxProps<T extends { id: number }> {
  value: number | null;
  onChange: (value: number) => void;
  onSearchChange?: (query: string) => void;
  data: T[];
  isLoading?: boolean;
  placeholder?: string;
  getOptionLabel?: (item: T) => string;
  disabled?: boolean;
}

export function Combobox<T extends { id: number }>({
  value,
  onChange,
  onSearchChange,
  data,
  isLoading,
  placeholder = "Pilih Data",
  getOptionLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selected = data.find((item) => item.id === value);

  const defaultOptionLabel = (item: T) => {
    if ("name" in item && "email" in item) {
      return `${(item as { name: string; email: string }).name} (${
        (item as { name: string; email: string }).email
      })`;
    }
    return `ID: ${item.id}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between w-full"
        >
          {selected
            ? (getOptionLabel ?? defaultOptionLabel)(selected)
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Cari..."
            onValueChange={(value) => {
              if (value.length >= 2 && onSearchChange) {
                onSearchChange(value);
              }
            }}
          />
          <CommandList>
            {isLoading && (
              <CommandItem disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memuat...
              </CommandItem>
            )}
            <CommandEmpty>Tidak ditemukan</CommandEmpty>
            {data.map((item) => (
              <CommandItem
                key={item.id}
                value={(getOptionLabel ?? defaultOptionLabel)(item)}
                onSelect={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                {(getOptionLabel ?? defaultOptionLabel)(item)}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
