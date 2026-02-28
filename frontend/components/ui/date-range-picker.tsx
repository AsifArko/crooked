"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DateRangePickerProps = {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  /** Format for display. Default: "dd/MM/yyyy" */
  displayFormat?: string;
  /** Number of months to show. Default: 1 */
  numberOfMonths?: number;
};

/**
 * Reusable date range picker component.
 * Use for filtering by date range (e.g. "From" / "To").
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  displayFormat = "dd/MM/yyyy",
  numberOfMonths = 1,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const displayValue = React.useMemo(() => {
    if (!value?.from) return placeholder;
    if (value.to && value.from.getTime() !== value.to.getTime()) {
      return `${format(value.from, displayFormat)} – ${format(value.to, displayFormat)}`;
    }
    return format(value.from, displayFormat);
  }, [value, placeholder, displayFormat]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start text-left font-normal bg-zinc-50/80 border-zinc-200 hover:bg-zinc-100",
            !value?.from && "text-zinc-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={(range) => {
            onChange?.(range);
            if (range?.from && range?.to) setOpen(false);
          }}
          numberOfMonths={numberOfMonths}
        />
        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-zinc-600 hover:text-zinc-900"
            onClick={() => {
              onChange?.(undefined);
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-zinc-600 hover:text-zinc-900"
            onClick={() => {
              const today = new Date();
              onChange?.({ from: today, to: today });
              setOpen(false);
            }}
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
