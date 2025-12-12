# Cascader 组件安装指南

## 快速开始

### 前置要求

确保你的项目已经安装了 shadcn/ui 的基础组件：

```bash
npx shadcn@latest add popover
npx shadcn@latest add input
npx shadcn@latest add button
npx shadcn@latest add badge
npx shadcn@latest add checkbox
npx shadcn@latest add card  # (可选，仅用于测试页面)
```

### 安装依赖

```bash
npm install lucide-react
# 或
pnpm add lucide-react
# 或
yarn add lucide-react
```

## 使用组件

### 基本导入

```tsx
import { Cascader } from "@/cascader";
import type { CascaderOption } from "@/cascader";
```

### 最简示例

```tsx
const options: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州"
      }
    ]
  }
];

export default function MyComponent() {
  return (
    <Cascader
      options={options}
      onChange={(value) => console.log(value)}
      placeholder="请选择"
    />
  );
}
```

## 查看示例

### 方法 1: 使用测试页面

1. 创建测试页面路由:

```bash
mkdir -p app/test/cascader
cp cascader/test-page.tsx app/test/cascader/page.tsx
```

2. 启动开发服务器:

```bash
npm run dev
```

3. 访问 `http://localhost:3000/test/cascader`

### 方法 2: 使用示例组件

在你的页面中导入示例:

```tsx
import CascaderExamples from "@/cascader/examples";

export default function Page() {
  return <CascaderExamples />;
}
```

## 常见问题

### Q1: 如何处理受控组件？

```tsx
const [value, setValue] = useState<(string | number)[]>([]);

<Cascader
  value={value}
  onChange={(newValue) => setValue(newValue as (string | number)[])}
  options={options}
/>;
```

### Q2: 多选模式如何使用？

```tsx
const [multiValue, setMultiValue] = useState<(string | number)[][]>([]);

<Cascader
  multiple
  value={multiValue}
  onChange={(newValue) => setMultiValue(newValue as (string | number)[][])}
  options={options}
/>;
```

### Q3: 如何实现搜索？

```tsx
<Cascader showSearch options={options} placeholder="搜索并选择" />
```

或自定义搜索:

```tsx
<Cascader
  showSearch={{
    filter: (inputValue, path) =>
      path.some((opt) => String(opt.label).includes(inputValue)),
    limit: 50
  }}
  options={options}
/>
```

### Q4: 如何动态加载数据？

```tsx
const [opts, setOpts] = useState<CascaderOption[]>([
  { value: "1", label: "选项1", isLeaf: false }
]);

const loadData = (selectedOptions: CascaderOption[]) => {
  const target = selectedOptions[selectedOptions.length - 1];

  // 模拟异步加载
  setTimeout(() => {
    target.children = [{ value: "1-1", label: "子选项1-1" }];
    setOpts([...opts]);
  }, 1000);
};

<Cascader options={opts} loadData={loadData} />;
```

### Q5: 如何使用 ref 方法？

```tsx
const cascaderRef = useRef<CascaderRef>(null);

<Cascader ref={cascaderRef} options={options} />;

// 调用方法
cascaderRef.current?.focus();
cascaderRef.current?.blur();
```

## 完整 API 文档

请查看以下文件获取详细信息:

- **README.md** - 组件概述和基础 API
- **USAGE.md** - 完整使用指南和所有 API 详解
- **examples.tsx** - 功能示例代码
- **test-page.tsx** - 完整的可运行测试页面

## TypeScript 类型

组件导出了所有必要的类型:

```tsx
import type {
  CascaderProps,
  CascaderOption,
  CascaderRef,
  CascaderValueType,
  FieldNames,
  ShowSearchType,
  TagRenderProps,
  ShowCheckedStrategy
} from "@/cascader";
```

## 下一步

1. 查看 [USAGE.md](./USAGE.md) 了解所有 API
2. 运行测试页面查看实际效果
3. 查看 [examples.tsx](./examples.tsx) 学习各种用法
4. 根据需求定制样式和功能

## 支持

如有问题或建议，请查看:

- PROJECT.md - 项目概述
- README.md - 基础文档
- USAGE.md - 详细指南

Happy coding! 🎉
