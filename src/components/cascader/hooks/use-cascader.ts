import { useState, useCallback, useMemo, useEffect } from "react";
import {
  CascaderOption,
  CascaderValueType,
  MultipleValueType,
  FieldNames
} from "../types";
import {
  getOptionChildren,
  getOptionValue,
  findOptionsByValue
} from "../utils";

interface MenuLevel {
  options: CascaderOption[];
  path: CascaderOption[];
}

export function useCascaderValue(
  value?: CascaderValueType | MultipleValueType,
  defaultValue?: CascaderValueType | MultipleValueType,
  multiple?: boolean,
  onChange?: (
    value: CascaderValueType | MultipleValueType,
    selectedOptions: CascaderOption[] | CascaderOption[][]
  ) => void,
  options?: CascaderOption[],
  fieldNames?: FieldNames
) {
  const [internalValue, setInternalValue] = useState<
    CascaderValueType | MultipleValueType
  >(defaultValue || (multiple ? [] : []));

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = useCallback(
    (
      newValue: CascaderValueType | MultipleValueType,
      selectedOptions: CascaderOption[] | CascaderOption[][]
    ) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, selectedOptions);
    },
    [value, onChange]
  );

  const selectedOptions = useMemo(() => {
    if (!options || !fieldNames) return multiple ? [] : [];

    if (multiple) {
      const multiValue = currentValue as MultipleValueType;
      return multiValue.map((val) =>
        findOptionsByValue(options, val, fieldNames)
      );
    } else {
      const singleValue = currentValue as CascaderValueType;
      return findOptionsByValue(options, singleValue, fieldNames);
    }
  }, [currentValue, options, fieldNames, multiple]);

  return {
    value: currentValue,
    onChange: handleChange,
    selectedOptions
  };
}

export function useCascaderOpen(
  open?: boolean,
  defaultOpen?: boolean,
  onOpenChange?: (open: boolean) => void
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen || false);

  const currentOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange]
  );

  return {
    open: currentOpen,
    onOpenChange: handleOpenChange
  };
}

export function useCascaderSearch(
  searchValue?: string,
  onSearch?: (value: string) => void
) {
  const [internalSearchValue, setInternalSearchValue] = useState("");

  const currentSearchValue =
    searchValue !== undefined ? searchValue : internalSearchValue;

  const handleSearch = useCallback(
    (value: string) => {
      if (searchValue === undefined) {
        setInternalSearchValue(value);
      }
      onSearch?.(value);
    },
    [searchValue, onSearch]
  );

  const clearSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);

  return {
    searchValue: currentSearchValue,
    onSearch: handleSearch,
    clearSearch
  };
}

export function useCascaderMenu(
  options: CascaderOption[] = [],
  fieldNames: FieldNames,
  expandTrigger: "click" | "hover" = "click"
) {
  const [activeMenus, setActiveMenus] = useState<MenuLevel[]>([
    { options, path: [] }
  ]);
  const [hoveredOption, setHoveredOption] = useState<CascaderOption | null>(
    null
  );

  const resetMenus = useCallback(() => {
    setActiveMenus([{ options, path: [] }]);
    setHoveredOption(null);
  }, [options]);

  const syncMenusToPath = useCallback(
    (path: CascaderOption[]) => {
      if (!path.length) {
        resetMenus();
        return;
      }

      const newMenus: MenuLevel[] = [{ options, path: [] }];
      let currentOptions = options;
      const currentPath: CascaderOption[] = [];

      for (const target of path) {
        const matched = currentOptions.find(
          (opt) =>
            getOptionValue(opt, fieldNames) ===
            getOptionValue(target, fieldNames)
        );

        if (!matched) break;

        currentPath.push(matched);
        const children = getOptionChildren(matched, fieldNames);
        if (children && children.length > 0) {
          newMenus.push({ options: children, path: [...currentPath] });
          currentOptions = children;
        }
      }

      setActiveMenus(newMenus);
    },
    [fieldNames, options, resetMenus]
  );

  const expandMenu = useCallback(
    (option: CascaderOption, level: number) => {
      const children = getOptionChildren(option, fieldNames);
      if (!children || children.length === 0) return;

      setActiveMenus((prev) => {
        const newMenus = prev.slice(0, level + 1);
        const parentPath = prev[level]?.path ?? [];
        newMenus.push({ options: children, path: [...parentPath, option] });
        return newMenus;
      });
    },
    [fieldNames]
  );

  const handleOptionClick = useCallback(
    (option: CascaderOption, level: number) => {
      expandMenu(option, level);
    },
    [expandMenu]
  );

  const handleOptionHover = useCallback(
    (option: CascaderOption, level: number) => {
      setHoveredOption(option);
      if (expandTrigger === "hover") {
        expandMenu(option, level);
      }
    },
    [expandTrigger, expandMenu]
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setActiveMenus([{ options, path: [] }]);
  }, [options]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    activeMenus,
    hoveredOption,
    handleOptionClick,
    handleOptionHover,
    expandMenu,
    resetMenus,
    syncMenusToPath
  };
}
