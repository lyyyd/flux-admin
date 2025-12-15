import { ReactNode, CSSProperties } from "react";

export interface CascaderOption {
  value: string | number;
  label?: ReactNode;
  disabled?: boolean;
  children?: CascaderOption[];
  isLeaf?: boolean;
  [key: string]: unknown;
}

export interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
}

export interface ShowSearchType {
  filter?: (inputValue: string, path: CascaderOption[]) => boolean;
  render?: (inputValue: string, path: CascaderOption[]) => ReactNode;
  sort?: (
    a: CascaderOption[],
    b: CascaderOption[],
    inputValue: string
  ) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
  autoClearSearchValue?: boolean;
}

export type CascaderValueType = (string | number)[];

export type SingleValueType = CascaderValueType;
export type MultipleValueType = CascaderValueType[];

export interface CascaderRef {
  focus: () => void;
  blur: () => void;
}

export type SemanticDOM = "root" | "input" | "selector" | "menu" | "menuItem";

export interface TagRenderProps {
  label: string;
  onClose: () => void;
  value: string;
}

export const SHOW_PARENT = "SHOW_PARENT";
export const SHOW_CHILD = "SHOW_CHILD";

export type ShowCheckedStrategy = typeof SHOW_PARENT | typeof SHOW_CHILD;

export interface CascaderProps {
  allowClear?: boolean | { clearIcon?: ReactNode };
  changeOnSelect?: boolean;
  className?: string;
  classNames?:
    | Record<SemanticDOM, string>
    | ((info: { props: CascaderProps }) => Record<SemanticDOM, string>);
  defaultOpen?: boolean;
  defaultValue?: CascaderValueType | MultipleValueType;
  disabled?: boolean;
  displayRender?: (
    labels: string[],
    selectedOptions: CascaderOption[]
  ) => ReactNode;
  tagRender?: (props: TagRenderProps) => ReactNode;
  popupRender?: (menus: ReactNode) => ReactNode;
  expandIcon?: ReactNode;
  expandTrigger?: "click" | "hover";
  fieldNames?: FieldNames;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  loadData?: (selectedOptions: CascaderOption[]) => void;
  maxTagCount?: number | "responsive";
  maxTagPlaceholder?:
    | ReactNode
    | ((omittedValues: CascaderOption[]) => ReactNode);
  maxTagTextLength?: number;
  notFoundContent?: ReactNode;
  open?: boolean;
  options?: CascaderOption[];
  placeholder?: string;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  prefix?: ReactNode;
  showSearch?: boolean | ShowSearchType;
  size?: "large" | "middle" | "small";
  status?: "error" | "warning";
  styles?:
    | Record<SemanticDOM, CSSProperties>
    | ((info: { props: CascaderProps }) => Record<SemanticDOM, CSSProperties>);
  suffixIcon?: ReactNode;
  value?: CascaderValueType | MultipleValueType;
  variant?: "outlined" | "borderless" | "filled" | "underlined";
  onChange?: (
    value: CascaderValueType | MultipleValueType,
    selectedOptions: CascaderOption[] | CascaderOption[][]
  ) => void;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  showCheckedStrategy?: ShowCheckedStrategy;
  removeIcon?: ReactNode;
  popupMenuColumnStyle?: CSSProperties;
  optionRender?: (option: CascaderOption) => ReactNode;
  searchValue?: string;
  onSearch?: (search: string) => void;
}
