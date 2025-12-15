# Cascader 组件使用指南

## 快速开始

### 1. 导入组件

```tsx
import { Cascader } from "@/cascader";
import type { CascaderOption } from "@/cascader";
```

### 2. 准备数据

```tsx
const options: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
        children: [{ value: "xihu", label: "西湖" }]
      }
    ]
  }
];
```

### 3. 使用组件

```tsx
<Cascader
  options={options}
  onChange={(value, selectedOptions) => {
    console.log(value, selectedOptions);
  }}
/>
```

## 完整 API 功能列表

### ✅ 基础功能

- [x] `allowClear` - 支持清除按钮
- [x] `className` - 自定义类名
- [x] `defaultValue` - 默认选中值
- [x] `disabled` - 禁用状态
- [x] `placeholder` - 占位文本
- [x] `value` - 受控值
- [x] `onChange` - 值变化回调

### ✅ 选择行为

- [x] `changeOnSelect` - 点选每级都触发变化
- [x] `multiple` - 多选模式
- [x] `showCheckedStrategy` - 多选回填策略 (SHOW_PARENT | SHOW_CHILD)

### ✅ 展开行为

- [x] `expandTrigger` - 展开方式 ('click' | 'hover')
- [x] `expandIcon` - 自定义展开图标
- [x] `open` - 控制浮层显示
- [x] `defaultOpen` - 默认是否展开
- [x] `onOpenChange` - 浮层显示变化回调

### ✅ 搜索功能

- [x] `showSearch` - 启用搜索
- [x] `showSearch.filter` - 自定义过滤逻辑
- [x] `showSearch.render` - 自定义搜索结果渲染
- [x] `showSearch.sort` - 自定义排序
- [x] `showSearch.limit` - 限制搜索结果数量
- [x] `showSearch.matchInputWidth` - 搜索结果宽度匹配
- [x] `showSearch.autoClearSearchValue` - 选中后自动清空搜索
- [x] `searchValue` - 受控搜索值
- [x] `onSearch` - 搜索回调

### ✅ 自定义渲染

- [x] `displayRender` - 自定义已选项显示
- [x] `optionRender` - 自定义选项渲染
- [x] `popupRender` - 自定义弹出层内容
- [x] `tagRender` - 自定义多选标签

### ✅ 动态加载

- [x] `loadData` - 动态加载数据
- [x] `options` 中的 `isLeaf` - 标记叶子节点

### ✅ 样式定制

- [x] `size` - 尺寸 ('small' | 'middle' | 'large')
- [x] `variant` - 样式变体 ('outlined' | 'borderless' | 'filled' | 'underlined')
- [x] `status` - 校验状态 ('error' | 'warning')
- [x] `classNames` - 语义化 class 定制
- [x] `styles` - 内联样式定制
- [x] `popupMenuColumnStyle` - 下拉菜单列样式

### ✅ 图标定制

- [x] `prefix` - 前缀图标
- [x] `suffixIcon` - 后缀图标
- [x] `removeIcon` - 删除图标
- [x] `allowClear.clearIcon` - 清除图标

### ✅ 多选特性

- [x] `maxTagCount` - 最多显示标签数
- [x] `maxTagPlaceholder` - 隐藏标签占位符
- [x] `maxTagTextLength` - 标签文本最大长度

### ✅ 布局控制

- [x] `placement` - 浮层位置 ('bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight')
- [x] `getPopupContainer` - 自定义浮层容器

### ✅ 字段映射

- [x] `fieldNames` - 自定义字段名映射 ({ label, value, children })

### ✅ 空状态

- [x] `notFoundContent` - 空列表占位内容

### ✅ 方法

- [x] `focus()` - 获取焦点
- [x] `blur()` - 失去焦点

## 使用示例

### 1. 基础单选

```tsx
<Cascader
  options={options}
  onChange={(value) => console.log(value)}
  placeholder="请选择"
/>
```

### 2. 多选模式

```tsx
<Cascader
  multiple
  options={options}
  maxTagCount={3}
  maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}...`}
/>
```

### 3. 搜索功能

```tsx
<Cascader
  showSearch={{
    filter: (input, path) => path.some((opt) => opt.label.includes(input)),
    limit: 50
  }}
  options={options}
/>
```

### 4. 动态加载

```tsx
const [opts, setOpts] = useState(initialOptions);

<Cascader
  options={opts}
  loadData={(selectedOptions) => {
    const target = selectedOptions[selectedOptions.length - 1];
    setTimeout(() => {
      target.children = [...newChildren];
      setOpts([...opts]);
    }, 1000);
  }}
/>;
```

### 5. 自定义显示

```tsx
<Cascader
  options={options}
  displayRender={(labels, selectedOptions) => labels.join(" → ")}
  optionRender={(option) => (
    <div className="flex items-center">
      <Icon /> {option.label}
    </div>
  )}
/>
```

### 6. 不同尺寸和样式

```tsx
<Cascader size="small" variant="filled" />
<Cascader size="middle" variant="outlined" />
<Cascader size="large" variant="borderless" />
```

### 7. 校验状态

```tsx
<Cascader status="error" />
<Cascader status="warning" />
```

### 8. 受控组件

```tsx
const [value, setValue] = useState([]);
const [open, setOpen] = useState(false);
const [search, setSearch] = useState("");

<Cascader
  value={value}
  onChange={setValue}
  open={open}
  onOpenChange={setOpen}
  searchValue={search}
  onSearch={setSearch}
/>;
```

### 9. 使用 ref 方法

```tsx
const cascaderRef = useRef<CascaderRef>(null);

<Cascader ref={cascaderRef} options={options} />;

// 调用方法
cascaderRef.current?.focus();
cascaderRef.current?.blur();
```

### 10. 自定义字段名

```tsx
<Cascader
  options={customData}
  fieldNames={{
    label: "name",
    value: "id",
    children: "items"
  }}
/>
```

## 注意事项

1. **性能优化**
   - 大数据量时建议使用 `showSearch.limit` 限制搜索结果
   - 使用 `maxTagCount` 限制多选标签显示数量
   - 动态加载时合理使用 `isLeaf` 标记

2. **样式定制**
   - 组件完全兼容 Tailwind CSS
   - 支持通过 `className` 和 `classNames` 定制样式
   - 支持深色模式

3. **TypeScript 支持**
   - 所有 Props 都有完整的类型定义
   - 导出所有必要的类型接口

4. **无障碍访问**
   - 支持键盘导航
   - 支持屏幕阅读器

## 文件结构

```
cascader/
├── cascader.tsx          # 主组件 (完全使用 Tailwind CSS)
├── types.ts              # TypeScript 类型定义
├── utils.ts              # 工具函数
├── hooks/
│   └── use-cascader.ts   # React Hooks
├── index.ts              # 导出文件
├── examples.tsx          # 示例代码
└── README.md             # 文档

💡 完全使用 Tailwind CSS 实现样式，符合 shadcn/ui 设计规范
```

## 依赖项

- React 18+
- @radix-ui/react-popover
- lucide-react
- Tailwind CSS (完全使用 Tailwind，无需额外 CSS 文件)
- shadcn/ui 基础组件 (Input, Popover, Badge, Checkbox)

## 贡献

欢迎提交 Issue 和 Pull Request！
