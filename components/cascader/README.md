# Cascader 级联选择器

基于 shadcn/ui 组件构建的级联选择器组件，支持单选、多选、搜索、动态加载等功能。

## 功能特性

✅ 单选和多选模式  
✅ 搜索过滤  
✅ 动态加载数据  
✅ 自定义渲染  
✅ 支持禁用选项  
✅ 多种尺寸和样式变体  
✅ 完全的类型支持  
✅ 响应式标签显示

## 安装

确保已安装以下依赖：

```bash
npm install lucide-react
```

> 💡 本组件完全使用 Tailwind CSS，无需额外的 CSS 文件，完全符合 shadcn/ui 风格。

## 基础用法

### 单选

```tsx
import { Cascader, CascaderOption } from "@/cascader";

const options: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
        children: [
          { value: "xihu", label: "西湖" },
          { value: "xiacheng", label: "下城" }
        ]
      }
    ]
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [
      {
        value: "nanjing",
        label: "南京",
        children: [{ value: "zhonghuamen", label: "中华门" }]
      }
    ]
  }
];

export default function Demo() {
  return (
    <Cascader
      options={options}
      onChange={(value, selectedOptions) => {
        console.log(value, selectedOptions);
      }}
      placeholder="请选择"
    />
  );
}
```

### 多选

```tsx
<Cascader
  multiple
  options={options}
  onChange={(value, selectedOptions) => {
    console.log(value, selectedOptions);
  }}
  placeholder="请选择"
/>
```

### 搜索

```tsx
<Cascader
  showSearch
  options={options}
  onChange={(value) => console.log(value)}
  placeholder="搜索并选择"
/>
```

### 自定义搜索

```tsx
<Cascader
  showSearch={{
    filter: (inputValue, path) => {
      return path.some((option) =>
        option.label
          ?.toString()
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      );
    },
    render: (inputValue, path) => {
      return path.map((opt) => opt.label).join(" / ");
    },
    limit: 20
  }}
  options={options}
/>
```

### 动态加载

```tsx
const [options, setOptions] = React.useState<CascaderOption[]>([
  {
    value: "zhejiang",
    label: "浙江",
    isLeaf: false
  }
]);

const loadData = (selectedOptions: CascaderOption[]) => {
  const targetOption = selectedOptions[selectedOptions.length - 1];

  // 模拟异步加载
  setTimeout(() => {
    targetOption.children = [
      {
        label: `${targetOption.label} 动态选项1`,
        value: "dynamic1"
      },
      {
        label: `${targetOption.label} 动态选项2`,
        value: "dynamic2"
      }
    ];
    setOptions([...options]);
  }, 1000);
};

<Cascader
  options={options}
  loadData={loadData}
  onChange={(value) => console.log(value)}
/>;
```

### 自定义显示

```tsx
<Cascader options={options} displayRender={(labels) => labels.join(" > ")} />
```

### 自定义字段名

```tsx
const customOptions = [
  {
    id: "1",
    name: "浙江",
    items: [
      {
        id: "1-1",
        name: "杭州"
      }
    ]
  }
];

<Cascader
  options={customOptions}
  fieldNames={{ label: "name", value: "id", children: "items" }}
/>;
```

## API

### CascaderProps

| 参数            | 说明                                   | 类型                                   | 默认值                     |
| --------------- | -------------------------------------- | -------------------------------------- | -------------------------- | ------------ | ------------ | ------------ |
| allowClear      | 支持清除                               | boolean \\                             | { clearIcon?: ReactNode }  | true         |
| changeOnSelect  | 单选时，点选每级菜单选项值都会发生变化 | boolean                                | false                      |
| className       | 自定义类名                             | string                                 | -                          |
| defaultValue    | 默认的选中项                           | string[] \\                            | number[]                   | []           |
| disabled        | 禁用                                   | boolean                                | false                      |
| displayRender   | 选择后展示的渲染函数                   | (labels, selectedOptions) => ReactNode | labels => labels.join('/') |
| expandIcon      | 自定义次级菜单展开图标                 | ReactNode                              | -                          |
| expandTrigger   | 次级菜单的展开方式                     | 'click' \\                             | 'hover'                    | 'click'      |
| fieldNames      | 自定义字段名                           | { label, value, children }             | -                          |
| loadData        | 动态加载选项                           | (selectedOptions) => void              | -                          |
| maxTagCount     | 最多显示多少个 tag                     | number \\                              | 'responsive'               | -            |
| multiple        | 支持多选                               | boolean                                | false                      |
| notFoundContent | 当下拉列表为空时显示的内容             | ReactNode                              | 'Not Found'                |
| open            | 控制浮层显隐                           | boolean                                | -                          |
| options         | 可选项数据源                           | Option[]                               | -                          |
| optionRender    | 自定义渲染下拉选项                     | (option) => ReactNode                  | -                          |
| placeholder     | 输入框占位文本                         | string                                 | -                          |
| placement       | 浮层预设位置                           | 'bottomLeft' \\                        | 'bottomRight' \\           | 'topLeft' \\ | 'topRight'   | 'bottomLeft' |
| prefix          | 自定义前缀                             | ReactNode                              | -                          |
| showSearch      | 显示搜索框                             | boolean \\                             | ShowSearchType             | false        |
| size            | 输入框大小                             | 'large' \\                             | 'middle' \\                | 'small'      | 'middle'     |
| status          | 设置校验状态                           | 'error' \\                             | 'warning'                  | -            |
| suffixIcon      | 自定义的选择框后缀图标                 | ReactNode                              | -                          |
| tagRender       | 自定义 tag 内容 render                 | (props) => ReactNode                   | -                          |
| value           | 指定选中项                             | string[] \\                            | number[]                   | -            |
| variant         | 形态变体                               | 'outlined' \\                          | 'borderless' \\            | 'filled' \\  | 'underlined' | 'outlined'   |
| onChange        | 选择完成后的回调                       | (value, selectedOptions) => void       | -                          |
| onOpenChange    | 显示/隐藏浮层的回调                    | (open) => void                         | -                          |
| onSearch        | 监听搜索                               | (value) => void                        | -                          |

### ShowSearchType

```typescript
{
  filter?: (inputValue: string, path: CascaderOption[]) => boolean;
  render?: (inputValue: string, path: CascaderOption[]) => ReactNode;
  sort?: (a: CascaderOption[], b: CascaderOption[], inputValue: string) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
  autoClearSearchValue?: boolean;
}
```

### CascaderOption

```typescript
{
  value: string | number;
  label?: ReactNode;
  disabled?: boolean;
  children?: CascaderOption[];
  isLeaf?: boolean;
}
```

### Methods

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## 示例

查看更多示例，请参考 `/examples` 目录。
