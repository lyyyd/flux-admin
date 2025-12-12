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
import { DatePickerProps, DatePickerRef } from "./types";
import { TimePicker } from "@/components/time-picker";
import { formatDate, getDefaultFormat, parseDate } from "./utils";

export const DatePickerAdvanced = React.forwardRef<
  DatePickerRef,
  DatePickerProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      onOk,
      onOpenChange,
      allowClear = true,
      className,
      disabled = false,
      placeholder,
      format,
      showTime = false,
      showNow = true,
      size = "middle",
      status,
      variant = "outlined",
      open: controlledOpen,
      defaultOpen = false,
      suffixIcon,
      presets,
      renderExtraFooter,
      disabledDate,
      minDate,
      maxDate,
      needConfirm = false,
      inputReadOnly = false
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<Dayjs | null>(
      value ?? defaultValue ?? null
    );
    const [open, setOpen] = useState(controlledOpen ?? defaultOpen);
    const [tempInputValue, setTempInputValue] = useState<string | null>(null);
    const [tempPopupDate, setTempPopupDate] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeGuardRef = useRef(false);

    const actualValue = value !== undefined ? value : internalValue;
    const actualFormat = format
      ? typeof format === "string"
        ? format
        : "YYYY-MM-DD"
      : getDefaultFormat(showTime);

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

    const handleChange = (newValue: Dayjs | null) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(
        newValue,
        newValue ? formatDate(newValue, actualFormat) : null
      );

      if (!needConfirm && !showTime) {
        handleOpenChange(false);
      }
    };

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputValue = e.target.value;
      setTempInputValue(newInputValue);

      const strictValue = parseStrictValue(newInputValue);
      if (strictValue) {
        setTempInputValue(null);
        handleChange(strictValue);
      }
    };

    const handleInputClick = () => {
      // 先让input自然聚焦，延迟打开pop避免闪动
      setTimeout(() => {
        requestOpen();
      }, 0);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // 如果焦点移到 popover 内容，不处理 blur
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget && relatedTarget.closest('[role="dialog"]')) {
        return;
      }

      // 只有用户实际输入了内容才验证
      if (tempInputValue !== null) {
        const inputToValidate = tempInputValue;
        setTempInputValue(null);

        if (!inputToValidate.trim()) {
          handleChange(null);
          return;
        }

        const strictValue = parseStrictValue(inputToValidate);
        if (strictValue) {
          handleChange(strictValue);
        } else {
          handleChange(null);
        }
      }
    };

    const handlePopupDateInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const nextValue = e.target.value;
      setTempPopupDate(nextValue);

      const parsedDate = parsePopupDate(nextValue);
      if (parsedDate) {
        let newValue = parsedDate;
        if (showTime && actualValue) {
          newValue = parsedDate
            .hour(actualValue.hour())
            .minute(actualValue.minute())
            .second(actualValue.second());
        }
        setTempPopupDate(null);
        handleChange(newValue);
      }
    };

    const handlePopupDateInputBlur = () => {
      if (tempPopupDate === null) {
        return;
      }

      const inputValue = tempPopupDate;
      setTempPopupDate(null);

      if (!inputValue.trim()) {
        handleChange(null);
        return;
      }

      const parsedDate = parsePopupDate(inputValue);
      if (parsedDate) {
        let newValue = parsedDate;
        if (showTime && actualValue) {
          newValue = parsedDate
            .hour(actualValue.hour())
            .minute(actualValue.minute())
            .second(actualValue.second());
        }
        handleChange(newValue);
      } else {
        handleChange(null);
      }
    };

    const handleDateSelect = (date: Date | undefined) => {
      if (!date) return;

      let newValue = dayjs(date);

      // 如果有时间选择，保留当前时间
      if (showTime && actualValue) {
        newValue = newValue
          .hour(actualValue.hour())
          .minute(actualValue.minute())
          .second(actualValue.second());
      }

      handleChange(newValue);
    };

    const handleTimeChange = (time: Dayjs | null) => {
      if (!time) {
        handleChange(null);
        return;
      }
      const baseDate = actualValue || dayjs();
      const newValue = baseDate
        .hour(time.hour())
        .minute(time.minute())
        .second(time.second());

      handleChange(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setTempInputValue(null);
      setTempPopupDate(null);
      handleChange(null);
    };

    const handleNow = () => {
      const now = dayjs();
      handleChange(now);
    };

    const handleOk = () => {
      onOk?.();
      requestClose();
    };

    const handlePresetClick = (presetValue: Dayjs | (() => Dayjs)) => {
      const value =
        typeof presetValue === "function" ? presetValue() : presetValue;
      handleChange(value);
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
      disabled && "cursor-not-allowed opacity-50",
      className
    );

    const actualOpen = controlledOpen ?? open;

    // 当用户正在编辑时，使用tempInputValue；否则使用实时计算的值
    const displayValue =
      tempInputValue !== null
        ? tempInputValue
        : actualValue
          ? formatDate(actualValue, actualFormat)
          : "";

    const calendarSelectedDate = actualValue ? actualValue.toDate() : undefined;

    return (
      <Popover open={actualOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              ref={inputRef}
              value={displayValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              placeholder={
                typeof placeholder === "string"
                  ? placeholder
                  : placeholder?.[0] || "Select date"
              }
              disabled={disabled}
              readOnly={inputReadOnly}
              className={inputClassName}
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              {allowClear && actualValue && !disabled && (
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
                    onClick={() =>
                      handlePresetClick(preset.value as Dayjs | (() => Dayjs))
                    }
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
                <div className="mb-4 max-w-[250px]">
                  <label className="mb-2 block text-xs font-medium">
                    Date & Time
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={
                          tempPopupDate !== null
                            ? tempPopupDate
                            : actualValue
                              ? actualValue.format("YYYY-MM-DD")
                              : ""
                        }
                        onChange={handlePopupDateInputChange}
                        onBlur={handlePopupDateInputBlur}
                        placeholder="YYYY-MM-DD"
                        className="pr-8"
                      />
                      <IconCalendar className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
                    </div>
                    <TimePicker
                      value={actualValue}
                      onChange={handleTimeChange}
                      showSecond={
                        typeof showTime === "object"
                          ? showTime.showSecond !== false
                          : true
                      }
                      placeholder="Select time"
                      className="max-w-[90px]"
                    />
                  </div>
                </div>
              )}

              {/* Calendar */}
              <Calendar
                mode="single"
                selected={calendarSelectedDate}
                onSelect={handleDateSelect}
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
              <div className="mt-4 flex items-center justify-between border-t p-2">
                <div className="flex gap-2">
                  {showNow && (
                    <Button variant="ghost" size="sm" onClick={handleNow}>
                      Now
                    </Button>
                  )}
                  {renderExtraFooter?.("date")}
                </div>
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

DatePickerAdvanced.displayName = "DatePickerAdvanced";
