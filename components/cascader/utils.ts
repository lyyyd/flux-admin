import { CascaderOption, CascaderValueType, FieldNames } from "./types";

export function getFieldNames(fieldNames?: FieldNames) {
  return {
    label: fieldNames?.label || "label",
    value: fieldNames?.value || "value",
    children: fieldNames?.children || "children"
  };
}

export function getOptionLabel(
  option: CascaderOption,
  fieldNames: FieldNames
): string {
  const names = getFieldNames(fieldNames);
  return String(option[names.label] || option[names.value] || "");
}

export function getOptionValue(
  option: CascaderOption,
  fieldNames: FieldNames
): string | number {
  const names = getFieldNames(fieldNames);
  return option[names.value] as string | number;
}

export function getOptionChildren(
  option: CascaderOption,
  fieldNames: FieldNames
): CascaderOption[] | undefined {
  const names = getFieldNames(fieldNames);
  return option[names.children] as CascaderOption[] | undefined;
}

export function getPathValue(
  path: CascaderOption[],
  fieldNames: FieldNames
): CascaderValueType {
  return path.map((opt) => getOptionValue(opt, fieldNames));
}

export function arePathsEqual(
  a: CascaderValueType,
  b: CascaderValueType
): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function isAncestorPath(
  parent: CascaderValueType,
  child: CascaderValueType
): boolean {
  if (parent.length >= child.length) return false;
  return parent.every((value, index) => value === child[index]);
}

export function isDescendantPath(
  parent: CascaderValueType,
  child: CascaderValueType
): boolean {
  return isAncestorPath(parent, child);
}

export function isLeaf(
  option: CascaderOption,
  fieldNames: FieldNames
): boolean {
  if (option.isLeaf !== undefined) {
    return option.isLeaf;
  }
  const children = getOptionChildren(option, fieldNames);
  return !children || children.length === 0;
}

export function findOptionsByValue(
  options: CascaderOption[],
  values: (string | number)[],
  fieldNames: FieldNames
): CascaderOption[] {
  const result: CascaderOption[] = [];
  let currentOptions = options;

  for (const value of values) {
    const option = currentOptions.find(
      (opt) => getOptionValue(opt, fieldNames) === value
    );
    if (!option) break;

    result.push(option);
    const children = getOptionChildren(option, fieldNames);
    if (!children) break;
    currentOptions = children;
  }

  return result;
}

export function getAllLeafOptions(
  options: CascaderOption[],
  fieldNames: FieldNames,
  path: CascaderOption[] = []
): CascaderOption[][] {
  const result: CascaderOption[][] = [];

  for (const option of options) {
    const currentPath = [...path, option];
    const children = getOptionChildren(option, fieldNames);

    if (!children || children.length === 0) {
      result.push(currentPath);
    } else {
      const childLeafs = getAllLeafOptions(children, fieldNames, currentPath);
      result.push(...childLeafs);
    }
  }

  return result;
}

export function getParentValues(
  options: CascaderOption[],
  fieldNames: FieldNames
): Set<string | number> {
  const parentValues = new Set<string | number>();

  function traverse(opts: CascaderOption[]) {
    for (const option of opts) {
      const children = getOptionChildren(option, fieldNames);
      if (children && children.length > 0) {
        parentValues.add(getOptionValue(option, fieldNames));
        traverse(children);
      }
    }
  }

  traverse(options);
  return parentValues;
}

export function filterSearchOptions(
  options: CascaderOption[],
  searchValue: string,
  fieldNames: FieldNames,
  filter?: (inputValue: string, path: CascaderOption[]) => boolean
): CascaderOption[][] {
  const result: CascaderOption[][] = [];

  function traverse(opts: CascaderOption[], path: CascaderOption[] = []) {
    for (const option of opts) {
      const currentPath = [...path, option];
      const label = getOptionLabel(option, fieldNames).toLowerCase();
      const searchLower = searchValue.toLowerCase();

      const matches = filter
        ? filter(searchValue, currentPath)
        : label.includes(searchLower);

      const children = getOptionChildren(option, fieldNames);

      if (matches) {
        // 如果匹配到了，检查是否有子节点
        if (children && children.length > 0) {
          // 有子节点，获取所有叶子节点路径
          const leafPaths = getAllLeafOptions(
            children,
            fieldNames,
            currentPath
          );
          result.push(...leafPaths);
        } else {
          // 没有子节点，是叶子节点，直接添加
          result.push(currentPath);
        }
      } else if (children) {
        // 如果当前节点不匹配，继续遍历子节点
        traverse(children, currentPath);
      }
    }
  }

  traverse(options);
  return result;
}

export function formatDisplayValue(
  selectedOptions: CascaderOption[],
  fieldNames: FieldNames,
  displayRender?: (
    labels: string[],
    selectedOptions: CascaderOption[]
  ) => React.ReactNode
): React.ReactNode {
  const labels = selectedOptions.map((opt) => getOptionLabel(opt, fieldNames));

  if (displayRender) {
    return displayRender(labels, selectedOptions);
  }

  return labels.join(" / ");
}

export function isValueSelected(
  value: (string | number)[],
  selectedValue: (string | number)[] | (string | number)[][]
): boolean {
  if (Array.isArray(selectedValue[0])) {
    return (selectedValue as (string | number)[][]).some(
      (val) =>
        val.length === value.length && val.every((v, i) => v === value[i])
    );
  }
  return (
    value.length === (selectedValue as (string | number)[]).length &&
    value.every((v, i) => v === (selectedValue as (string | number)[])[i])
  );
}
