import { ReactNode, CSSProperties } from "react";
import type { Dayjs } from "dayjs";

export type PanelMode = "time" | "date" | "month" | "year" | "decade";
export type PickerType = "date" | "week" | "month" | "quarter" | "year";
export type Placement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type SemanticDOM = "root" | "input" | "panel" | "footer";

export type FormatType =
  | string
  | ((value: Dayjs) => string)
  | Array<string | ((value: Dayjs) => string)>
  | {
      format: string;
      type?: "mask";
    };

export interface PresetValue {
  label: ReactNode;
  value: Dayjs | (() => Dayjs) | [Dayjs, Dayjs] | (() => [Dayjs, Dayjs]);
}

export interface CellRenderInfo {
  originNode: React.ReactElement;
  today: Dayjs;
  range?: "start" | "end";
  type: PanelMode;
  locale?: unknown;
  subType?: "hour" | "minute" | "second" | "meridiem";
}

export interface DisabledTimeConfig {
  from?: Dayjs;
  type?: PickerType;
}

export interface ShowTimeConfig {
  defaultOpenValue?: Dayjs;
  showSecond?: boolean;
  format?: string;
}

export interface RangeShowTimeConfig {
  defaultOpenValue?: [Dayjs, Dayjs];
  showSecond?: boolean;
  format?: string;
}

// 共同的 API
export interface CommonPickerProps {
  allowClear?: boolean | { clearIcon?: ReactNode };
  className?: string;
  classNames?:
    | Record<SemanticDOM, string>
    | ((info: { props: unknown }) => Record<SemanticDOM, string>);
  defaultOpen?: boolean;
  disabled?: boolean;
  disabledDate?: (currentDate: Dayjs, info: DisabledTimeConfig) => boolean;
  format?: FormatType;
  order?: boolean;
  preserveInvalidOnBlur?: boolean;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  inputReadOnly?: boolean;
  locale?: unknown;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  mode?: PanelMode;
  needConfirm?: boolean;
  nextIcon?: ReactNode;
  open?: boolean;
  panelRender?: (panelNode: ReactNode) => ReactNode;
  picker?: PickerType;
  placeholder?: string | [string, string];
  placement?: Placement;
  prefix?: ReactNode;
  prevIcon?: ReactNode;
  previewValue?: false | "hover";
  presets?: PresetValue[];
  size?: "large" | "middle" | "small";
  status?: "error" | "warning";
  style?: CSSProperties;
  styles?:
    | Record<SemanticDOM, CSSProperties>
    | ((info: { props: unknown }) => Record<SemanticDOM, CSSProperties>);
  suffixIcon?: ReactNode;
  superNextIcon?: ReactNode;
  superPrevIcon?: ReactNode;
  variant?: "outlined" | "borderless" | "filled" | "underlined";
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (value: Dayjs | null, mode: PanelMode) => void;
}

// DatePicker Props
export interface DatePickerProps extends CommonPickerProps {
  defaultPickerValue?: Dayjs;
  defaultValue?: Dayjs | null;
  disabledTime?: (date: Dayjs) => {
    disabledHours?: () => number[];
    disabledMinutes?: () => number[];
    disabledSeconds?: () => number[];
  };
  format?: FormatType;
  multiple?: boolean;
  pickerValue?: Dayjs;
  renderExtraFooter?: (mode: PanelMode) => ReactNode;
  showNow?: boolean;
  showTime?: ShowTimeConfig | boolean;
  showWeek?: boolean;
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null, dateString: string | null) => void;
  onOk?: () => void;
  cellRender?: (current: Dayjs, info: CellRenderInfo) => ReactNode;
}

// RangePicker Props
export interface RangePickerProps extends Omit<
  CommonPickerProps,
  "placeholder" | "disabled"
> {
  allowEmpty?: [boolean, boolean];
  defaultPickerValue?: [Dayjs, Dayjs];
  defaultValue?: [Dayjs, Dayjs] | null;
  disabled?: [boolean, boolean] | boolean;
  disabledTime?: (
    date: Dayjs,
    partial: "start" | "end",
    info: { from?: Dayjs }
  ) => {
    disabledHours?: () => number[];
    disabledMinutes?: () => number[];
    disabledSeconds?: () => number[];
  };
  format?: FormatType;
  id?: { start?: string; end?: string };
  pickerValue?: [Dayjs, Dayjs];
  presets?: {
    label: ReactNode;
    value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs]);
  }[];
  renderExtraFooter?: () => ReactNode;
  separator?: ReactNode;
  showTime?: RangeShowTimeConfig | boolean;
  value?: [Dayjs, Dayjs] | null;
  placeholder?: [string, string];
  onCalendarChange?: (
    dates: [Dayjs | null, Dayjs | null],
    dateStrings: [string, string],
    info: { range: "start" | "end" }
  ) => void;
  onChange?: (
    dates: [Dayjs, Dayjs] | null,
    dateStrings: [string, string] | null
  ) => void;
  onFocus?: (event: React.FocusEvent, info: { range: "start" | "end" }) => void;
  onBlur?: (event: React.FocusEvent, info: { range: "start" | "end" }) => void;
  cellRender?: (current: Dayjs, info: CellRenderInfo) => ReactNode;
}

export interface DatePickerRef {
  focus: () => void;
  blur: () => void;
}
