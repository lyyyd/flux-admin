import React, { useState, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { padZero, generateHours, generateMinutesOrSeconds } from "./utils";

interface TimePickerProps {
  value?: Dayjs | null;
  onChange?: (time: Dayjs | null) => void;
  showSecond?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  className?: string;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  showSecond = true,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  className,
  placeholder = "Select time"
}) => {
  const [open, setOpen] = useState(false);
  const [tempInputValue, setTempInputValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hours = generateHours();
  const minutes = generateMinutesOrSeconds();
  const seconds = generateMinutesOrSeconds();

  // 使用内部时间状态或外部value来显示pop选择
  const displayTime = value ?? null;
  const currentHour = displayTime ? displayTime.hour() : null;
  const currentMinute = displayTime ? displayTime.minute() : null;
  const currentSecond = displayTime ? displayTime.second() : null;
  const disabledHourList = disabledHours?.() ?? [];
  const disabledMinuteList = disabledMinutes?.(currentHour ?? 0) ?? [];
  const disabledSecondList =
    disabledSeconds?.(currentHour ?? 0, currentMinute ?? 0) ?? [];

  const formattedValue = value
    ? value.format(showSecond ? "HH:mm:ss" : "HH:mm")
    : "";
  const displayValue =
    tempInputValue !== null ? tempInputValue : formattedValue;

  const parseTimeInput = (
    raw: string
  ): { hour: number; minute: number; second: number } | null => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return null;
    }

    const regex = showSecond
      ? /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/
      : /^(\d{1,2}):(\d{1,2})$/;
    const match = trimmed.match(regex);
    if (!match) {
      return null;
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = showSecond ? Number(match[3] ?? 0) : 0;

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      Number.isNaN(second) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      second < 0 ||
      second > 59
    ) {
      return null;
    }

    return { hour, minute, second };
  };

  const commitTime = (raw: string | null) => {
    if (raw === null) {
      return;
    }

    const trimmed = raw.trim();
    if (!trimmed) {
      onChange?.(null);
      setTempInputValue(null);
      return;
    }

    const parsed = parseTimeInput(trimmed);
    if (!parsed) {
      onChange?.(null);
      setTempInputValue(null);
      return;
    }

    const baseDate = (value ?? dayjs()).clone();
    const nextTime = baseDate
      .hour(parsed.hour)
      .minute(parsed.minute)
      .second(showSecond ? parsed.second : 0)
      .millisecond(0);

    onChange?.(nextTime);
    setTempInputValue(null);
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTempInputValue(newValue);

    if (!newValue.trim()) {
      onChange?.(null);
      return;
    }

    const parsed = parseTimeInput(newValue);
    if (parsed) {
      const baseDate = (value ?? dayjs()).clone();
      const nextTime = baseDate
        .hour(parsed.hour)
        .minute(parsed.minute)
        .second(showSecond ? parsed.second : 0)
        .millisecond(0);
      onChange?.(nextTime);
      setTempInputValue(null);
    }
  };

  // 处理输入框点击
  const handleInputClick = () => {
    // 先让input自然聚焦，延迟打开pop避免闪动
    setTimeout(() => {
      setOpen(true);
    }, 0);
  };

  // 处理失去焦点时同步数据到父组件
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 如果焦点移到 popover 内容，不处理 blur
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[role="dialog"]')) {
      return;
    }
    commitTime(tempInputValue);
  };

  const handleHourClick = (hour: number) => {
    if (disabledHourList.includes(hour)) return;
    const baseDate = (value ?? dayjs()).clone();
    const newValue = baseDate.hour(hour);
    onChange?.(newValue);
    setTempInputValue(null);
  };

  const handleMinuteClick = (minute: number) => {
    if (disabledMinuteList.includes(minute)) return;
    const baseDate = (value ?? dayjs()).clone();
    const newValue = baseDate.minute(minute);
    onChange?.(newValue);
    setTempInputValue(null);
  };

  const handleSecondClick = (second: number) => {
    if (disabledSecondList.includes(second)) return;
    const baseDate = (value ?? dayjs()).clone();
    const newValue = baseDate.second(second);
    onChange?.(newValue);
    setTempInputValue(null);
  };

  const renderTimeColumn = (
    items: number[],
    current: number,
    onClick: (value: number) => void,
    disabledCheck?: (value: number) => boolean
  ) => (
    <ScrollArea className="h-[200px] w-[60px]">
      <div className="flex flex-col">
        {items.map((item) => {
          const disabled = disabledCheck?.(item) ?? false;
          return (
            <button
              key={item}
              type="button"
              onClick={() => !disabled && onClick(item)}
              disabled={disabled}
              className={cn(
                "hover:bg-accent/50 flex h-7 w-full items-center justify-center rounded text-xs transition-all",
                current === item &&
                  "bg-primary/10 text-primary hover:bg-primary/15 font-semibold",
                disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
              )}
            >
              {padZero(item)}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="bg-background"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-2">
          {/* Hours */}
          {renderTimeColumn(hours, currentHour ?? -1, handleHourClick, (h) =>
            disabledHourList.includes(h)
          )}

          {/* Minutes */}
          {renderTimeColumn(
            minutes,
            currentMinute ?? -1,
            handleMinuteClick,
            (m) => disabledMinuteList.includes(m)
          )}

          {/* Seconds */}
          {showSecond &&
            renderTimeColumn(
              seconds,
              currentSecond ?? -1,
              handleSecondClick,
              (s) => disabledSecondList.includes(s)
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
