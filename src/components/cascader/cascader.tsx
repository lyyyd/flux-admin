"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CascaderProps,
  CascaderOption,
  CascaderValueType,
  MultipleValueType,
  CascaderRef,
  SHOW_PARENT,
  SHOW_CHILD,
  SemanticDOM
} from "./types";
import {
  getFieldNames,
  getOptionLabel,
  getOptionValue,
  getOptionChildren,
  isLeaf,
  filterSearchOptions,
  formatDisplayValue,
  isValueSelected,
  getAllLeafOptions,
  getPathValue,
  arePathsEqual,
  isAncestorPath,
  isDescendantPath,
  findOptionsByValue
} from "./utils";
import {
  useCascaderValue,
  useCascaderOpen,
  useCascaderSearch,
  useCascaderMenu
} from "./hooks/use-cascader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const CascaderComponent = React.forwardRef<CascaderRef, CascaderProps>(
  (
    {
      allowClear = true,
      changeOnSelect = false,
      className,
      classNames,
      defaultOpen,
      defaultValue,
      disabled = false,
      displayRender,
      tagRender,
      popupRender,
      expandIcon,
      expandTrigger = "click",
      fieldNames: propFieldNames,
      getPopupContainer,
      loadData,
      maxTagCount,
      maxTagPlaceholder,
      maxTagTextLength,
      notFoundContent = "Not Found",
      open: propOpen,
      options = [],
      placeholder = "Please select",
      placement = "bottomLeft",
      prefix,
      showSearch = false,
      size = "middle",
      status,
      styles,
      suffixIcon,
      value: propValue,
      variant = "outlined",
      onChange,
      onOpenChange,
      multiple = false,
      showCheckedStrategy = SHOW_PARENT,
      removeIcon,
      popupMenuColumnStyle,
      optionRender,
      searchValue: propSearchValue,
      onSearch: propOnSearch
    },
    ref
  ) => {
    const fieldNames = React.useMemo(
      () => getFieldNames(propFieldNames),
      [propFieldNames]
    );
    const inputRef = React.useRef<HTMLInputElement>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const tagContainerRef = React.useRef<HTMLDivElement>(null);
    const [triggerWidth, setTriggerWidth] = React.useState<number>();
    const [responsiveTagLimit, setResponsiveTagLimit] =
      React.useState<number>();

    const cascaderPropsSnapshot = React.useMemo<CascaderProps>(
      () => ({
        allowClear,
        changeOnSelect,
        className,
        classNames,
        defaultOpen,
        defaultValue,
        disabled,
        displayRender,
        tagRender,
        popupRender,
        expandIcon,
        expandTrigger,
        fieldNames: propFieldNames,
        getPopupContainer,
        loadData,
        maxTagCount,
        maxTagPlaceholder,
        maxTagTextLength,
        notFoundContent,
        open: propOpen,
        options,
        placeholder,
        placement,
        prefix,
        showSearch,
        size,
        status,
        styles,
        suffixIcon,
        value: propValue,
        variant,
        onChange,
        onOpenChange,
        multiple,
        showCheckedStrategy,
        removeIcon,
        popupMenuColumnStyle,
        optionRender,
        searchValue: propSearchValue,
        onSearch: propOnSearch
      }),
      [
        allowClear,
        changeOnSelect,
        className,
        classNames,
        defaultOpen,
        defaultValue,
        disabled,
        displayRender,
        tagRender,
        popupRender,
        expandIcon,
        expandTrigger,
        propFieldNames,
        getPopupContainer,
        loadData,
        maxTagCount,
        maxTagPlaceholder,
        maxTagTextLength,
        notFoundContent,
        propOpen,
        options,
        placeholder,
        placement,
        prefix,
        showSearch,
        size,
        status,
        styles,
        suffixIcon,
        propValue,
        variant,
        onChange,
        onOpenChange,
        multiple,
        showCheckedStrategy,
        removeIcon,
        popupMenuColumnStyle,
        optionRender,
        propSearchValue,
        propOnSearch
      ]
    );

    const resolvedClassNames = React.useMemo<
      Partial<Record<SemanticDOM, string>>
    >(() => {
      if (typeof classNames === "function") {
        return classNames({ props: cascaderPropsSnapshot }) || {};
      }
      return (classNames as Partial<Record<SemanticDOM, string>>) || {};
    }, [classNames, cascaderPropsSnapshot]);

    const resolvedStyles = React.useMemo<
      Partial<Record<SemanticDOM, React.CSSProperties>>
    >(() => {
      if (typeof styles === "function") {
        return styles({ props: cascaderPropsSnapshot }) || {};
      }
      return (
        (styles as Partial<Record<SemanticDOM, React.CSSProperties>>) || {}
      );
    }, [styles, cascaderPropsSnapshot]);

    const {
      value,
      onChange: handleValueChange,
      selectedOptions
    } = useCascaderValue(
      propValue,
      defaultValue,
      multiple,
      onChange,
      options,
      fieldNames
    );

    const { open, onOpenChange: handleOpenChange } = useCascaderOpen(
      propOpen,
      defaultOpen,
      onOpenChange
    );

    const {
      searchValue,
      onSearch: handleSearch,
      clearSearch
    } = useCascaderSearch(propSearchValue, propOnSearch);

    const {
      activeMenus,
      handleOptionClick,
      handleOptionHover,
      resetMenus,
      syncMenusToPath
    } = useCascaderMenu(options, fieldNames, expandTrigger);

    const [loadingOptions, setLoadingOptions] = React.useState<Set<string>>(
      new Set()
    );

    const mapValuesToOptions = React.useCallback(
      (multiValue: MultipleValueType) =>
        multiValue.map((val) => findOptionsByValue(options, val, fieldNames)),
      [options, fieldNames]
    );

    const buildPathValue = React.useCallback(
      (path: CascaderOption[]) => getPathValue(path, fieldNames),
      [fieldNames]
    );

    type CheckboxVisualState = { checked: boolean; indeterminate: boolean };

    const getCheckboxState = React.useCallback(
      (option: CascaderOption, path: CascaderOption[]): CheckboxVisualState => {
        if (!multiple) {
          return { checked: false, indeterminate: false };
        }

        const currentValue = value as MultipleValueType;
        const pathValue = buildPathValue(path);
        const exactMatch = currentValue.some((val) =>
          arePathsEqual(val, pathValue)
        );
        const ancestorSelected = currentValue.some((val) =>
          isAncestorPath(val, pathValue)
        );
        const children = getOptionChildren(option, fieldNames);
        const hasChildren = !!children && children.length > 0;

        if (!hasChildren || changeOnSelect) {
          if (ancestorSelected && !exactMatch) {
            return { checked: false, indeterminate: true };
          }
          return {
            checked: exactMatch || ancestorSelected,
            indeterminate: false
          };
        }

        const leafPaths = getAllLeafOptions(children, fieldNames, path);
        if (leafPaths.length === 0) {
          if (ancestorSelected && !exactMatch) {
            return { checked: false, indeterminate: true };
          }
          return {
            checked: exactMatch || ancestorSelected,
            indeterminate: false
          };
        }

        let selectedLeaves = 0;
        for (const leafPath of leafPaths) {
          const leafValue = buildPathValue(leafPath);
          if (
            currentValue.some(
              (selected) =>
                arePathsEqual(selected, leafValue) ||
                isAncestorPath(selected, leafValue)
            )
          ) {
            selectedLeaves += 1;
          }
        }

        if (selectedLeaves === leafPaths.length) {
          return { checked: true, indeterminate: false };
        }
        if (selectedLeaves > 0 || ancestorSelected || exactMatch) {
          return { checked: false, indeterminate: true };
        }

        return { checked: false, indeterminate: false };
      },
      [multiple, value, buildPathValue, fieldNames, changeOnSelect]
    );

    const isPathCoveredBySelection = React.useCallback(
      (path: CascaderOption[]) => {
        if (!multiple) return false;
        const currentValue = value as MultipleValueType;
        const pathValue = buildPathValue(path);
        return currentValue.some(
          (selected) =>
            selected.length <= pathValue.length &&
            selected.every((v, index) => v === pathValue[index])
        );
      },
      [multiple, value, buildPathValue]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (disabled) return;
          if (!open) {
            handleOpenChange(true);
          }
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            } else {
              triggerRef.current?.focus();
            }
          });
        },
        blur: () => {
          inputRef.current?.blur();
          triggerRef.current?.blur?.();
          if (open) {
            handleOpenChange(false);
          }
        }
      }),
      [disabled, open, handleOpenChange]
    );

    const showSearchConfig = React.useMemo(() => {
      if (loadData) {
        return null;
      }
      if (typeof showSearch === "boolean") {
        return showSearch ? {} : null;
      }
      return showSearch || null;
    }, [showSearch, loadData]);

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        handleValueChange(multiple ? [] : [], multiple ? [] : []);
        clearSearch();
        resetMenus();
      },
      [multiple, handleValueChange, clearSearch, resetMenus]
    );

    const handleSelectOption = React.useCallback(
      (option: CascaderOption, path: CascaderOption[]) => {
        const pathValue = buildPathValue(path);

        if (multiple) {
          const children = getOptionChildren(option, fieldNames);
          const hasChildren = !!children && children.length > 0;
          const descendantLeafValues = hasChildren
            ? getAllLeafOptions(children, fieldNames, path).map((leafPath) =>
                getPathValue(leafPath, fieldNames)
              )
            : [];
          const treatAsLeaf =
            isLeaf(option, fieldNames) ||
            changeOnSelect ||
            descendantLeafValues.length === 0;
          const workingValue = Array.isArray(value)
            ? [...(value as MultipleValueType)]
            : [];

          const expandAncestorSelection = (targetPath: CascaderValueType) => {
            const ancestorIndex = workingValue.findIndex((val) =>
              isAncestorPath(val, targetPath)
            );
            if (ancestorIndex === -1) return;
            const ancestorValue = workingValue[ancestorIndex];
            const ancestorPath = findOptionsByValue(
              options,
              ancestorValue,
              fieldNames
            );
            const ancestorNode = ancestorPath[ancestorPath.length - 1];
            const ancestorChildren = getOptionChildren(
              ancestorNode,
              fieldNames
            );
            if (!ancestorChildren || ancestorChildren.length === 0) {
              return;
            }
            const descendantLeafPaths = getAllLeafOptions(
              ancestorChildren,
              fieldNames,
              ancestorPath
            ).map((leaf) => getPathValue(leaf, fieldNames));
            workingValue.splice(ancestorIndex, 1);
            descendantLeafPaths.forEach((leafPath) => {
              if (!workingValue.some((val) => arePathsEqual(val, leafPath))) {
                workingValue.push(leafPath);
              }
            });
          };

          expandAncestorSelection(pathValue);

          if (!treatAsLeaf) {
            const hasAllDescendantsSelected = descendantLeafValues.every(
              (leafValue) =>
                workingValue.some((selected) =>
                  arePathsEqual(selected, leafValue)
                )
            );

            if (hasAllDescendantsSelected) {
              const nextValue = workingValue.filter(
                (selected) =>
                  !descendantLeafValues.some((leafValue) =>
                    arePathsEqual(leafValue, selected)
                  )
              );
              handleValueChange(nextValue, mapValuesToOptions(nextValue));
            } else {
              let nextValue = [...workingValue];
              descendantLeafValues.forEach((leafValue) => {
                nextValue = nextValue.filter(
                  (selected) => !isAncestorPath(selected, leafValue)
                );
                if (
                  !nextValue.some((selected) =>
                    arePathsEqual(selected, leafValue)
                  )
                ) {
                  nextValue.push(leafValue);
                }
              });
              handleValueChange(nextValue, mapValuesToOptions(nextValue));
            }
            return;
          }

          const exists = workingValue.some((val) =>
            arePathsEqual(val, pathValue)
          );

          if (exists) {
            const nextValue = workingValue.filter(
              (val) =>
                !(
                  val.length === pathValue.length &&
                  val.every((v, i) => v === pathValue[i])
                )
            );
            handleValueChange(nextValue, mapValuesToOptions(nextValue));
          } else {
            let nextValue = workingValue.filter(
              (val) => !isDescendantPath(pathValue, val)
            );
            nextValue = nextValue.filter(
              (val) => !isAncestorPath(val, pathValue)
            );
            nextValue.push(pathValue);
            handleValueChange(nextValue, mapValuesToOptions(nextValue));
          }
        } else {
          const leaf = isLeaf(option, fieldNames);
          if (leaf || changeOnSelect) {
            handleValueChange(pathValue, path);
            // 只有在非搜索状态下选择叶子节点才关闭
            if (leaf && !searchValue) {
              handleOpenChange(false);
            }
          }
        }

        // 只有在非搜索状态下才清空搜索值
        if (!searchValue && showSearchConfig?.autoClearSearchValue !== false) {
          clearSearch();
        }
      },
      [
        multiple,
        value,
        fieldNames,
        changeOnSelect,
        handleValueChange,
        handleOpenChange,
        clearSearch,
        showSearchConfig,
        options,
        mapValuesToOptions,
        buildPathValue,
        searchValue
      ]
    );

    React.useEffect(() => {
      if (!open) return;
      if (multiple) {
        const multiSelected = (selectedOptions as CascaderOption[][]) || [];
        if (multiSelected.length > 0) {
          syncMenusToPath(multiSelected[0]);
        } else {
          resetMenus();
        }
      } else {
        const singleSelected = (selectedOptions as CascaderOption[]) || [];
        if (singleSelected.length > 0) {
          syncMenusToPath(singleSelected);
        } else {
          resetMenus();
        }
      }
    }, [open, multiple, selectedOptions, syncMenusToPath, resetMenus]);

    React.useLayoutEffect(() => {
      if (
        typeof window === "undefined" ||
        typeof ResizeObserver === "undefined"
      )
        return;
      const node = triggerRef.current;
      if (!node) return;
      const updateWidth = () => {
        setTriggerWidth(node.getBoundingClientRect().width);
      };
      updateWidth();
      const observer = new ResizeObserver(() => updateWidth());
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const handleLoadData = React.useCallback(
      async (option: CascaderOption, path: CascaderOption[]) => {
        if (
          !loadData ||
          loadingOptions.has(String(getOptionValue(option, fieldNames)))
        )
          return;

        const optionValue = String(getOptionValue(option, fieldNames));
        setLoadingOptions((prev) => new Set(prev).add(optionValue));

        try {
          await loadData(path);
        } finally {
          setLoadingOptions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(optionValue);
            return newSet;
          });
        }
      },
      [loadData, loadingOptions, fieldNames]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchValue || !showSearchConfig) return null;

      const results = filterSearchOptions(
        options,
        searchValue,
        fieldNames,
        showSearchConfig.filter
      );

      if (showSearchConfig.sort) {
        results.sort((a, b) => showSearchConfig.sort!(a, b, searchValue));
      }

      const limit =
        showSearchConfig.limit !== false
          ? showSearchConfig.limit || 50
          : undefined;
      return limit ? results.slice(0, limit) : results;
    }, [searchValue, showSearchConfig, options, fieldNames]);

    const displayValue = React.useMemo(() => {
      if (multiple) {
        const multiValue = value as MultipleValueType;
        const multiSelectedOptions = selectedOptions as CascaderOption[][];

        if (showCheckedStrategy === SHOW_PARENT) {
          const filteredValues: MultipleValueType = [];
          const filteredOptions: CascaderOption[][] = [];

          multiValue.forEach((val, index) => {
            const isChildOfSelected = multiValue.some(
              (otherVal, otherIndex) => {
                if (otherIndex === index) return false;
                if (otherVal.length >= val.length) return false;
                return val
                  .slice(0, otherVal.length)
                  .every((v, i) => v === otherVal[i]);
              }
            );

            if (!isChildOfSelected) {
              filteredValues.push(val);
              filteredOptions.push(multiSelectedOptions[index]);
            }
          });

          return filteredOptions;
        }

        if (showCheckedStrategy === SHOW_CHILD) {
          const expandedOptions: CascaderOption[][] = [];

          multiSelectedOptions.forEach((path) => {
            const lastOption = path[path.length - 1];
            const children = getOptionChildren(lastOption, fieldNames);
            if (children && children.length > 0) {
              const leafPaths = getAllLeafOptions(children, fieldNames, path);
              expandedOptions.push(...leafPaths);
            } else {
              expandedOptions.push(path);
            }
          });

          return expandedOptions;
        }

        return multiSelectedOptions;
      } else {
        return selectedOptions as CascaderOption[];
      }
    }, [multiple, value, selectedOptions, showCheckedStrategy, fieldNames]);

    React.useLayoutEffect(() => {
      if (!multiple || maxTagCount !== "responsive") {
        setResponsiveTagLimit(undefined);
        return;
      }
      if (
        typeof window === "undefined" ||
        typeof ResizeObserver === "undefined"
      )
        return;
      const container = tagContainerRef.current;
      if (!container) return;

      const measure = () => {
        const availableWidth = container.clientWidth;
        if (!availableWidth) {
          setResponsiveTagLimit(undefined);
          return;
        }
        const tagNodes = Array.from(
          container.querySelectorAll('[data-cascader-tag-item="true"]')
        ) as HTMLElement[];
        if (!tagNodes.length) {
          setResponsiveTagLimit(undefined);
          return;
        }
        let used = 0;
        let limit = tagNodes.length;
        for (let i = 0; i < tagNodes.length; i++) {
          const width = tagNodes[i].offsetWidth;
          if (width === 0) continue;
          if (used + width > availableWidth) {
            limit = i;
            break;
          }
          used += width;
        }
        setResponsiveTagLimit(limit === tagNodes.length ? undefined : limit);
      };

      measure();
      const observer = new ResizeObserver(() => measure());
      observer.observe(container);
      return () => observer.disconnect();
    }, [multiple, maxTagCount, displayValue, open]);

    const renderTags = () => {
      if (
        !multiple ||
        !Array.isArray(displayValue) ||
        displayValue.length === 0
      )
        return null;

      const paths = displayValue as CascaderOption[][];
      const numericLimit =
        typeof maxTagCount === "number" ? maxTagCount : undefined;
      const responsiveLimitValue =
        maxTagCount === "responsive" ? responsiveTagLimit : undefined;
      const effectiveLimit = responsiveLimitValue ?? numericLimit;
      const omittedPaths =
        typeof effectiveLimit === "number" ? paths.slice(effectiveLimit) : [];

      const wrapTag = (key: string, content: React.ReactNode) => (
        <span
          key={key}
          data-cascader-tag-item="true"
          className="flex max-w-full items-center"
        >
          {content}
        </span>
      );

      const tags = paths.map((path) => {
        const label = formatDisplayValue(path, fieldNames, displayRender);
        const valueStr = path
          .map((opt) => getOptionValue(opt, fieldNames))
          .join("-");

        const displayLabel =
          maxTagTextLength &&
          typeof label === "string" &&
          label.length > maxTagTextLength
            ? `${label.slice(0, maxTagTextLength)}...`
            : label;

        const handleRemove = (event?: React.MouseEvent) => {
          event?.stopPropagation();
          const multiValue = value as MultipleValueType;
          const pathValue = getPathValue(path, fieldNames);
          const nextValue = multiValue.filter(
            (val) => !arePathsEqual(val, pathValue)
          );
          handleValueChange(nextValue, mapValuesToOptions(nextValue));
        };

        if (tagRender) {
          const customTag = tagRender({
            label: String(displayLabel),
            onClose: () => handleRemove(),
            value: valueStr
          });
          return wrapTag(valueStr, customTag);
        }

        const defaultTag = (
          <Badge variant="secondary">
            {displayLabel}
            <button
              type="button"
              onClick={(e) => handleRemove(e)}
              className="hover:text-destructive ml-1"
            >
              {removeIcon || <X className="h-3 w-3" />}
            </button>
          </Badge>
        );

        return wrapTag(valueStr, defaultTag);
      });

      const visibleTags =
        typeof effectiveLimit === "number"
          ? tags.slice(0, effectiveLimit)
          : tags;
      const omittedCount =
        typeof effectiveLimit === "number"
          ? Math.max(0, tags.length - effectiveLimit)
          : 0;

      const omittedOptionNodes = omittedPaths
        .map((path) => path[path.length - 1])
        .filter(Boolean) as CascaderOption[];

      const placeholderContent =
        omittedCount > 0
          ? maxTagPlaceholder
            ? typeof maxTagPlaceholder === "function"
              ? maxTagPlaceholder(omittedOptionNodes)
              : maxTagPlaceholder
            : `+${omittedCount}`
          : null;

      return (
        <div
          ref={tagContainerRef}
          className="flex flex-wrap items-center gap-2"
        >
          {visibleTags}
          {omittedCount > 0 && (
            <Badge
              variant="secondary"
              className="flex items-center justify-center"
            >
              {placeholderContent}
            </Badge>
          )}
        </div>
      );
    };

    const renderInput = () => {
      const hasValue = multiple
        ? Array.isArray(value) && (value as MultipleValueType).length > 0
        : Array.isArray(value) && value.length > 0;

      const inputValue =
        searchValue ||
        (!multiple && hasValue
          ? formatDisplayValue(
              selectedOptions as CascaderOption[],
              fieldNames,
              displayRender
            )
          : "");

      const sizeClasses = {
        small: "h-8 text-sm",
        middle: "h-9 text-sm",
        large: "h-10 text-base"
      };

      const variantClasses = {
        outlined: "border border-input",
        borderless: "border-0",
        filled: "bg-muted border-0",
        underlined: "border-0 border-b rounded-none"
      };

      const statusClasses = {
        error: "border-destructive focus-visible:ring-destructive/20",
        warning: "border-yellow-500 focus-visible:ring-yellow-500/20"
      };

      return (
        <div
          className={cn(
            "flex w-full cursor-pointer items-center rounded-md px-3 py-1 transition-colors",
            sizeClasses[size],
            variantClasses[variant],
            status && statusClasses[status],
            disabled && "cursor-not-allowed opacity-50",
            "hover:border-ring",
            className,
            resolvedClassNames.selector
          )}
          {...(resolvedStyles.selector
            ? { style: resolvedStyles.selector }
            : {})}
          onClick={(e) => {
            // 如果点击的是输入框区域，由输入框自己处理
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT") {
              return;
            }
            // 否则切换下拉状态
            if (!disabled) {
              handleOpenChange(!open);
              // 如果有搜索功能且要打开下拉，聚焦到输入框
              if (!open && showSearchConfig) {
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }
            }
          }}
        >
          {prefix && <span className="mr-2">{prefix}</span>}

          <div className="flex min-h-0 flex-1 flex-wrap items-center gap-1">
            {multiple && renderTags()}
            {(!multiple ||
              (Array.isArray(value) && value.length === 0) ||
              showSearchConfig) && (
              <Input
                ref={inputRef}
                value={String(inputValue || "")}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={!showSearchConfig}
                onChange={(e) =>
                  showSearchConfig && handleSearch(e.target.value)
                }
                className={cn(
                  "h-auto border-0 p-0 shadow-none focus-visible:ring-0",
                  resolvedClassNames.input
                )}
                {...(resolvedStyles.input
                  ? { style: resolvedStyles.input }
                  : {})}
                onClick={() => {
                  // 点击输入框时打开下拉并聚焦
                  if (!disabled && !open) {
                    handleOpenChange(true);
                    // 延迟聚焦确保下拉已打开
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }
                }}
              />
            )}
          </div>

          <div className="ml-2 flex items-center gap-1">
            {allowClear && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-destructive"
              >
                {typeof allowClear === "object" && allowClear.clearIcon ? (
                  allowClear.clearIcon
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            )}
            <span className="text-muted-foreground">
              {suffixIcon || <ChevronDown className="h-4 w-4" />}
            </span>
          </div>
        </div>
      );
    };

    const renderMenuColumn = (
      menuOptions: CascaderOption[],
      level: number,
      parentPath: CascaderOption[]
    ) => {
      return (
        <div
          className="max-h-64 min-w-[120px] overflow-y-auto border-r last:border-r-0"
          {...(popupMenuColumnStyle ? { style: popupMenuColumnStyle } : {})}
        >
          {menuOptions.map((option) => {
            const optionValue = getOptionValue(option, fieldNames);
            const optionLabel = getOptionLabel(option, fieldNames);
            const children = getOptionChildren(option, fieldNames);
            const hasChildren = children && children.length > 0;
            const leaf = isLeaf(option, fieldNames);
            const isLoading = loadingOptions.has(String(optionValue));

            const path = [...parentPath, option];

            const singleSelected = !multiple
              ? (value as CascaderValueType).length === path.length &&
                (value as CascaderValueType).every(
                  (v, i) => v === getOptionValue(path[i], fieldNames)
                )
              : false;

            const checkboxState = multiple
              ? getCheckboxState(option, path)
              : null;
            const isSelected = multiple
              ? checkboxState?.checked
              : singleSelected;

            return (
              <div
                key={String(optionValue)}
                className={cn(
                  "hover:bg-accent flex cursor-pointer items-center justify-between px-3 py-2",
                  option.disabled && "cursor-not-allowed opacity-50",
                  isSelected && "bg-accent",
                  resolvedClassNames.menuItem
                )}
                {...(resolvedStyles.menuItem
                  ? { style: resolvedStyles.menuItem }
                  : {})}
                onClick={() => {
                  if (option.disabled) return;
                  if (multiple) {
                    if (!leaf) {
                      handleOptionClick(option, level);
                    }
                    if (!leaf && loadData && !hasChildren) {
                      handleLoadData(option, path);
                    }
                    return;
                  }
                  handleSelectOption(option, path);
                  if (!leaf) {
                    handleOptionClick(option, level);
                  }
                  if (!leaf && loadData && !hasChildren) {
                    handleLoadData(option, path);
                  }
                }}
                onMouseEnter={() => {
                  if (option.disabled) return;
                  handleOptionHover(option, level);
                  if (
                    expandTrigger === "hover" &&
                    !leaf &&
                    loadData &&
                    !hasChildren
                  ) {
                    handleLoadData(option, path);
                  }
                }}
              >
                <div className="flex flex-1 items-center">
                  {multiple && (
                    <Checkbox
                      checked={
                        checkboxState?.indeterminate
                          ? "indeterminate"
                          : checkboxState?.checked
                      }
                      disabled={option.disabled}
                      className="mr-2"
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => handleSelectOption(option, path)}
                    />
                  )}
                  <span className="flex-1">
                    {optionRender ? optionRender(option) : optionLabel}
                  </span>
                </div>

                {!multiple && isSelected && leaf && (
                  <Check className="text-primary ml-2 h-4 w-4" />
                )}

                {(hasChildren || (!leaf && loadData)) && (
                  <span className="ml-2">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : expandIcon ? (
                      expandIcon
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    const renderSearchResults = () => {
      if (!filteredOptions || filteredOptions.length === 0) {
        return (
          <div className="text-muted-foreground px-3 py-2 text-center">
            {notFoundContent}
          </div>
        );
      }

      const matchedWidth =
        showSearchConfig?.matchInputWidth === false ? undefined : triggerWidth;
      const searchStyles = {
        ...(resolvedStyles.menu || {}),
        ...(matchedWidth ? { minWidth: matchedWidth } : {})
      } as React.CSSProperties;
      const searchStyleProps = Object.keys(searchStyles).length
        ? { style: searchStyles }
        : {};

      return (
        <div
          className={cn("max-h-64 overflow-y-auto", resolvedClassNames.menu)}
          {...searchStyleProps}
        >
          {filteredOptions.map((path, index) => {
            const pathValue = path.map((opt) =>
              getOptionValue(opt, fieldNames)
            );
            const singleSelected = !multiple
              ? isValueSelected(pathValue, value as CascaderValueType)
              : false;
            const isSelected = multiple
              ? isPathCoveredBySelection(path)
              : singleSelected;

            const renderContent = showSearchConfig?.render
              ? showSearchConfig.render(searchValue, path)
              : formatDisplayValue(path, fieldNames, displayRender);

            return (
              <div
                key={`search-${index}`}
                className={cn(
                  "hover:bg-accent flex cursor-pointer items-center justify-between px-3 py-2",
                  isSelected && "bg-accent"
                )}
                onClick={() => handleSelectOption(path[path.length - 1], path)}
              >
                <div className="flex flex-1 items-center">
                  {multiple && (
                    <Checkbox
                      checked={isSelected}
                      className="mr-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <span className="flex-1">{renderContent}</span>
                </div>
                {!multiple && isSelected && (
                  <Check className="text-primary ml-2 h-4 w-4" />
                )}
              </div>
            );
          })}
        </div>
      );
    };

    const renderMenu = () => {
      if (searchValue && showSearchConfig) {
        return renderSearchResults();
      }

      if (activeMenus.length === 0 || activeMenus[0].options.length === 0) {
        return (
          <div className="text-muted-foreground px-3 py-2 text-center">
            {notFoundContent}
          </div>
        );
      }

      return (
        <div
          className={cn("flex", resolvedClassNames.menu)}
          {...(resolvedStyles.menu ? { style: resolvedStyles.menu } : {})}
        >
          {activeMenus.map(({ options: menuOptions, path }, level) => (
            <React.Fragment key={level}>
              {renderMenuColumn(menuOptions, level, path)}
            </React.Fragment>
          ))}
        </div>
      );
    };

    const placementMap = {
      bottomLeft: "bottom-start" as const,
      bottomRight: "bottom-end" as const,
      topLeft: "top-start" as const,
      topRight: "top-end" as const
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            tabIndex={-1}
            className={cn(
              "relative focus:outline-none",
              resolvedClassNames.root
            )}
            {...(resolvedStyles.root ? { style: resolvedStyles.root } : {})}
          >
            {renderInput()}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align={placementMap[placement].split("-")[1] as "start" | "end"}
          side={placementMap[placement].split("-")[0] as "top" | "bottom"}
          container={
            getPopupContainer && triggerRef.current
              ? getPopupContainer(triggerRef.current)
              : undefined
          }
        >
          {popupRender ? popupRender(renderMenu()) : renderMenu()}
        </PopoverContent>
      </Popover>
    );
  }
);

CascaderComponent.displayName = "Cascader";

export const Cascader = Object.assign(CascaderComponent, {
  SHOW_PARENT,
  SHOW_CHILD
});
