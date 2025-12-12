import React, { useState, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { RangePickerProps, DatePickerRef } from "./types";
import { TimePicker } from "@/components/time-picker";
import { formatDate, getDefaultFormat, parseDate } from "./utils";
import type { DateRange } from "react-day-picker";

export const RangePicker = React.forwardRef<DatePickerRef, RangePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onOpenChange,
      allowClear = true,
      className,
      disabled = false,
      placeholder = "Select date range",
      format,
      showTime = false,
      size = "middle",
      status,
      variant = "outlined",
      open: controlledOpen,
      defaultOpen = false,
      suffixIcon,
      presets,
      separator = " ~ ",
      disabledDate,
      minDate,
      maxDate,
      needConfirm = false,
      inputReadOnly = false
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<[Dayjs, Dayjs] | null>(
      () => value ?? defaultValue ?? null
    );
    const [open, setOpen] = useState(controlledOpen ?? defaultOpen);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [startTime, setStartTime] = useState<Dayjs | null>(() => {
      const initial = value ?? defaultValue ?? null;
      return initial ? initial[0] : null;
    });
    const [endTime, setEndTime] = useState<Dayjs | null>(() => {
      const initial = value ?? defaultValue ?? null;
      return initial ? initial[1] : null;
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const closeGuardRef = useRef(false);
    const [tempStartDate, setTempStartDate] = useState<string | null>(null);
    const [tempEndDate, setTempEndDate] = useState<string | null>(null);
    const [tempMainInput, setTempMainInput] = useState<string | null>(null);

    const actualValue = value !== undefined ? value : internalValue;
    const actualFormat = format
      ? typeof format === "string"
        ? format
        : "YYYY-MM-DD"
      : getDefaultFormat(showTime);

    const isDisabledInput =
      typeof disabled === "boolean" ? disabled : disabled[0] || disabled[1];

    const actualOpen = controlledOpen ?? open;
    const separatorStr = typeof separator === "string" ? separator : " ~ ";

    const parseStrictValue = (raw: string): Dayjs | null => {
      const trimmed = raw.trim();
      if (!trimmed) {
        return null;
      }
      return parseDate(trimmed, actualFormat);
    };

    const parsePopupDate = (raw: string): Dayjs | null => {
      const trimmed = raw.trim();
      if (!trimmed) {
        return null;
      }
      return parseDate(trimmed, "YYYY-MM-DD");
    };

    const mergeWithTime = (date: Dayjs, type: "start" | "end"): Dayjs => {
      if (!showTime) {
        return date;
      }

      const source =
        (type === "start" ? startTime : endTime) ??
        (actualValue ? actualValue[type === "start" ? 0 : 1] : null) ??
        (type === "start"
          ? dayjs(date).startOf("day")
          : dayjs(date).endOf("day"));

      return date
        .hour(source.hour())
        .minute(source.minute())
        .second(source.second());
    };

    const getCurrentBoundary = (type: "start" | "end"): Dayjs | null => {
      if (actualValue) {
        return actualValue[type === "start" ? 0 : 1];
      }

      if (dateRange) {
        const date = type === "start" ? dateRange.from : dateRange.to;
        return date ? dayjs(date) : null;
      }

      return null;
    };

    const commitStartDateInput = (raw: string): boolean => {
      const parsedDate = parsePopupDate(raw);
      if (!parsedDate) {
        return false;
      }

      const newStart = mergeWithTime(parsedDate, "start");
      const currentEnd = getCurrentBoundary("end");
      const normalized = normalizePartialRange(newStart, currentEnd, "start");
      if (!normalized) {
        return false;
      }

      const [start, end] = normalized;
      setDateRange({ from: start.toDate(), to: end.toDate() });
      handleChange([start, end]);
      return true;
    };

    const commitEndDateInput = (raw: string): boolean => {
      const parsedDate = parsePopupDate(raw);
      if (!parsedDate) {
        return false;
      }

      const newEnd = mergeWithTime(parsedDate, "end");
      const currentStart = getCurrentBoundary("start");
      const normalized = normalizePartialRange(currentStart, newEnd, "end");
      if (!normalized) {
        return false;
      }

      const [start, end] = normalized;
      setDateRange({ from: start.toDate(), to: end.toDate() });
      handleChange([start, end]);
      return true;
    };

    // 计算显示值：直接从 actualValue 计算
    const displayValue = actualValue
      ? `${formatDate(actualValue[0], actualFormat)}${
          typeof separator === "string" ? separator : " ~ "
        }${formatDate(actualValue[1], actualFormat)}`
      : "";

    // 计算 dateRange 和同步日期输入框
    const computedDateRange = actualValue
      ? { from: actualValue[0].toDate(), to: actualValue[1].toDate() }
      : dateRange;

    // 同步日期输入框显示值
    const displayStartDate = actualValue
      ? actualValue[0].format("YYYY-MM-DD")
      : "";
    const displayEndDate = actualValue
      ? actualValue[1].format("YYYY-MM-DD")
      : "";

    React.useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur()
    }));

    const handleOpenChange = (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        if (!newOpen && !closeGuardRef.current) {
          return;
        }
        closeGuardRef.current = false;
        setOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const requestOpen = () => {
      closeGuardRef.current = false;
      handleOpenChange(true);
    };

    const requestClose = () => {
      closeGuardRef.current = true;
      handleOpenChange(false);
    };

    const handleChange = (newValue: [Dayjs, Dayjs] | null) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(
        newValue,
        newValue
          ? [
              formatDate(newValue[0], actualFormat),
              formatDate(newValue[1], actualFormat)
            ]
          : null
      );

      if (newValue) {
        setStartTime(newValue[0]);
        setEndTime(newValue[1]);
      } else {
        setStartTime(null);
        setEndTime(null);
      }
    };

    const resetRangeSelection = () => {
      setTempMainInput(null);
      setTempStartDate(null);
      setTempEndDate(null);
      setDateRange(undefined);
      setStartTime(null);
      setEndTime(null);
      handleChange(null);
    };

    const normalizeRangeInput = (rawValue: string): [Dayjs, Dayjs] | null => {
      const parts = rawValue.split(separatorStr);
      if (parts.length !== 2) {
        return null;
      }

      const startInput = parts[0].trim();
      const endInput = parts[1].trim();
      const hasStartInput = Boolean(startInput);
      const hasEndInput = Boolean(endInput);

      if (!hasStartInput && !hasEndInput) {
        return null;
      }

      let start = hasStartInput ? parseStrictValue(startInput) : null;
      let end = hasEndInput ? parseStrictValue(endInput) : null;

      if ((hasStartInput && !start) || (hasEndInput && !end)) {
        return null;
      }

      if (!start && end) {
        start = end;
      }

      if (start && !end) {
        end = start;
      }

      if (!start || !end) {
        return null;
      }

      if (start.isAfter(end)) {
        end = start;
      }

      return [start, end];
    };

    const normalizePartialRange = (
      partialStart: Dayjs | null,
      partialEnd: Dayjs | null,
      changed: "start" | "end"
    ): [Dayjs, Dayjs] | null => {
      if (!partialStart && !partialEnd) {
        return null;
      }

      let start = partialStart ?? partialEnd;
      let end = partialEnd ?? partialStart;

      if (!start && end) {
        start = end;
      }

      if (start && !end) {
        end = start;
      }

      if (!start || !end) {
        return null;
      }

      if (start.isAfter(end)) {
        if (changed === "start") {
          end = start;
        } else {
          start = end;
        }
      }

      return [start, end];
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value;
      setTempMainInput(newInputValue);
      const normalized = normalizeRangeInput(newInputValue);
      if (normalized) {
        const [start, end] = normalized;
        setTempMainInput(null);
        setDateRange({ from: start.toDate(), to: end.toDate() });
        handleChange([start, end]);
      }
    };

    const handleInputClick = () => {
      // 先让input自然聚焦，延迟打开pop避免闪动
      setTimeout(() => {
        requestOpen();
      }, 0);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // 如果焦点移到 popover 刈容，不处理 blur
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget && relatedTarget.closest('[role="dialog"]')) {
        return;
      }

      // 只有用户实际输入了内容才验证
      if (tempMainInput !== null) {
        const inputValue = tempMainInput;
        setTempMainInput(null);

        if (!inputValue.trim()) {
          resetRangeSelection();
          return;
        }

        const normalized = normalizeRangeInput(inputValue);
        if (normalized) {
          const [start, end] = normalized;
          setDateRange({ from: start.toDate(), to: end.toDate() });
          handleChange([start, end]);
        } else {
          resetRangeSelection();
        }
      }
    };

    const handleDateRangeSelect = (range: DateRange | undefined) => {
      if (!actualValue) {
        setDateRange(range);
      }

      if (range?.from && range?.to) {
        let start = dayjs(range.from);
        let end = dayjs(range.to);

        // 如果有时间选择，使用当前的时间
        if (showTime) {
          start = mergeWithTime(start, "start");
          end = mergeWithTime(end, "end");
        }

        handleChange([start, end]);
        // 不自动关闭，等用户点击空白处或确认按钮
      }
    };

    const handleStartTimeChange = (time: Dayjs | null) => {
      if (!time) {
        resetRangeSelection();
        return;
      }
      setStartTime(time);
      if (actualValue) {
        const newStart = actualValue[0]
          .hour(time.hour())
          .minute(time.minute())
          .second(time.second());
        handleChange([newStart, actualValue[1]]);
      }
    };

    const handleEndTimeChange = (time: Dayjs | null) => {
      if (!time) {
        resetRangeSelection();
        return;
      }
      setEndTime(time);
      if (actualValue) {
        const newEnd = actualValue[1]
          .hour(time.hour())
          .minute(time.minute())
          .second(time.second());
        handleChange([actualValue[0], newEnd]);
      }
    };

    const handleStartDateInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = e.target.value;
      setTempStartDate(newValue);
      if (commitStartDateInput(newValue)) {
        setTempStartDate(null);
      }
    };

    const handleStartDateInputBlur = () => {
      if (tempStartDate === null) {
        return;
      }

      const inputValue = tempStartDate;
      setTempStartDate(null);

      if (!inputValue.trim()) {
        resetRangeSelection();
        return;
      }

      if (!commitStartDateInput(inputValue)) {
        resetRangeSelection();
      }
    };

    const handleEndDateInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = e.target.value;
      setTempEndDate(newValue);
      if (commitEndDateInput(newValue)) {
        setTempEndDate(null);
      }
    };

    const handleEndDateInputBlur = () => {
      if (tempEndDate === null) {
        return;
      }

      const inputValue = tempEndDate;
      setTempEndDate(null);

      if (!inputValue.trim()) {
        resetRangeSelection();
        return;
      }

      if (!commitEndDateInput(inputValue)) {
        resetRangeSelection();
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      resetRangeSelection();
    };

    const handleOk = () => {
      requestClose();
    };

    const handlePresetClick = (
      presetValue: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])
    ) => {
      const rangeValue =
        typeof presetValue === "function" ? presetValue() : presetValue;
      handleChange(rangeValue);
      if (!needConfirm) {
        requestClose();
      }
    };

    const sizeClasses = {
      small: "h-8 text-xs",
      middle: "h-9 text-sm",
      large: "h-10 text-base"
    };

    const variantClasses = {
      outlined: "border-input bg-background",
      borderless: "border-transparent bg-transparent",
      filled: "border-transparent bg-muted",
      underlined: "border-0 border-b-2 rounded-none bg-transparent"
    };

    const statusClasses = {
      error: "border-destructive focus-visible:ring-destructive",
      warning: "border-yellow-500 focus-visible:ring-yellow-500"
    };

    const inputClassName = cn(
      "w-full pr-20 transition-colors",
      sizeClasses[size],
      variantClasses[variant],
      status && statusClasses[status],
      isDisabledInput && "cursor-not-allowed opacity-50",
      className
    );

    const mainInputDisplayValue =
      tempMainInput !== null ? tempMainInput : displayValue;

    return (
      <Popover open={actualOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              ref={inputRef}
              value={mainInputDisplayValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              placeholder={
                typeof placeholder === "string"
                  ? placeholder
                  : placeholder.join(" ~ ")
              }
              disabled={isDisabledInput}
              readOnly={inputReadOnly}
              className={inputClassName}
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              {allowClear && actualValue && !isDisabledInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <IconX className="h-4 w-4" />
                </button>
              )}
              {suffixIcon || (
                <IconCalendar className="text-muted-foreground h-4 w-4" />
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={() => {
            closeGuardRef.current = true;
          }}
        >
          <div className="flex">
            {/* Presets */}
            {presets && presets.length > 0 && (
              <div className="flex flex-col gap-1 border-r p-2">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handlePresetClick(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col p-4">
              {/* Date and Time Inputs */}
              {showTime && (
                <div className="mb-4 max-w-[500px]">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-xs font-medium">
                        Start Date & Time
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            type="text"
                            value={
                              tempStartDate !== null
                                ? tempStartDate
                                : displayStartDate
                            }
                            onChange={handleStartDateInputChange}
                            onBlur={handleStartDateInputBlur}
                            placeholder="YYYY-MM-DD"
                            className="pr-8"
                          />
                          <IconCalendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
                        </div>
                        <TimePicker
                          value={startTime}
                          onChange={handleStartTimeChange}
                          showSecond={
                            typeof showTime === "object"
                              ? showTime.showSecond !== false
                              : true
                          }
                          placeholder="Start time"
                          className="max-w-[90px]"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="mb-2 block text-xs font-medium">
                        End Date & Time
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Input
                            type="text"
                            value={
                              tempEndDate !== null
                                ? tempEndDate
                                : displayEndDate
                            }
                            onChange={handleEndDateInputChange}
                            onBlur={handleEndDateInputBlur}
                            placeholder="YYYY-MM-DD"
                            className="pr-8"
                          />
                          <IconCalendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
                        </div>
                        <TimePicker
                          value={endTime}
                          onChange={handleEndTimeChange}
                          showSecond={
                            typeof showTime === "object"
                              ? showTime.showSecond !== false
                              : true
                          }
                          placeholder="End time"
                          className="max-w-[90px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar */}
              <Calendar
                mode="range"
                selected={computedDateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                disabled={(date) => {
                  const dayjsDate = dayjs(date);
                  if (minDate && dayjsDate.isBefore(minDate, "day"))
                    return true;
                  if (maxDate && dayjsDate.isAfter(maxDate, "day")) return true;
                  if (disabledDate)
                    return disabledDate(dayjsDate, { type: "date" });
                  return false;
                }}
                initialFocus
              />

              {/* Footer */}
              <div className="mt-4 flex items-center justify-end border-t pt-2">
                {(needConfirm || showTime) && (
                  <Button size="sm" onClick={handleOk}>
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

RangePicker.displayName = "RangePicker";
