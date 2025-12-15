# 🎨 Cascader - 纯 Tailwind CSS 实现

## ✨ 设计特点

本组件**完全使用 Tailwind CSS**，无需任何自定义 CSS 文件，完全符合 **shadcn/ui** 设计风格。

### 核心优势

- ✅ **零 CSS 文件** - 100% Tailwind CSS utilities
- ✅ **shadcn 风格** - 完美匹配 shadcn/ui 设计系统
- ✅ **深色模式** - 原生支持，无需额外配置
- ✅ **响应式** - Tailwind 响应式类开箱即用
- ✅ **可定制** - 通过 className 和 Tailwind 配置轻松定制

## 📦 文件结构

```
cascader/
├── cascader.tsx          # 主组件 (纯 Tailwind CSS)
├── types.ts              # TypeScript 类型定义
├── utils.ts              # 工具函数
├── index.ts              # 导出文件
├── hooks/
│   └── use-cascader.ts   # React Hooks
├── examples.tsx          # 示例代码
├── test-page.tsx         # 测试页面
├── README.md             # 文档
├── USAGE.md              # 使用指南
└── PROJECT.md            # 项目概述
```

**注意：无 style 目录，无 CSS 文件！**

## 🎯 Tailwind CSS 应用示例

### 输入框样式

```tsx
className={cn(
  'flex items-center w-full rounded-md px-3 py-1',
  'border border-input bg-transparent',
  'hover:border-ring transition-colors',
  'focus-visible:ring-ring focus-visible:ring-[3px]',
  disabled && 'opacity-50 cursor-not-allowed'
)}
```

### 菜单项样式

```tsx
className={cn(
  'flex items-center justify-between px-3 py-2',
  'cursor-pointer hover:bg-accent',
  'transition-colors',
  option.disabled && 'opacity-50 cursor-not-allowed',
  isSelected && 'bg-accent'
)}
```

### 尺寸变体（Tailwind 类）

```tsx
const sizeClasses = {
  small: "h-8 text-sm",
  middle: "h-9 text-sm",
  large: "h-10 text-base"
};
```

### 样式变体（Tailwind 类）

```tsx
const variantClasses = {
  outlined: "border border-input",
  borderless: "border-0",
  filled: "bg-muted border-0",
  underlined: "border-0 border-b rounded-none"
};
```

## 🎨 深色模式支持

完全基于 Tailwind 的深色模式实现，无需额外配置：

```tsx
// 自动适配深色模式的类
"dark:bg-input/30";
"dark:aria-invalid:ring-destructive/40";
```

## 🔧 自定义主题

### 方法 1: 通过 className 属性

```tsx
<Cascader className="rounded-lg border-2 border-blue-500" options={options} />
```

### 方法 2: 通过 Tailwind 配置

在 `tailwind.config.ts` 中自定义颜色：

```ts
export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
        // ... 更多自定义
      }
    }
  }
};
```

### 方法 3: 使用 CSS 变量（shadcn 方式）

在 `globals.css` 中定义变量：

```css
@layer base {
  :root {
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }

  .dark {
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

## 📋 组件使用的 Tailwind 类清单

### 布局类

- `flex`, `flex-1`, `flex-wrap`, `items-center`, `justify-between`
- `w-full`, `min-w-[120px]`, `max-h-64`, `h-8`, `h-9`, `h-10`
- `px-3`, `py-1`, `py-2`, `gap-1`, `space-y-2`, `space-y-4`

### 边框和圆角

- `border`, `border-0`, `border-b`, `border-r`, `border-input`
- `rounded-md`, `rounded-none`

### 背景和颜色

- `bg-transparent`, `bg-muted`, `bg-accent`
- `text-sm`, `text-base`, `text-muted-foreground`, `text-primary`

### 交互状态

- `hover:border-ring`, `hover:bg-accent`, `hover:text-destructive`
- `focus-visible:ring-ring`, `focus-visible:ring-[3px]`
- `disabled:opacity-50`, `disabled:cursor-not-allowed`

### 过渡动画

- `transition-colors`, `transition-[color,box-shadow]`

### 响应式

- `md:text-sm`, `lg:grid-cols-2`

### 深色模式

- `dark:bg-input/30`, `dark:aria-invalid:ring-destructive/40`

## 🚀 快速开始

```tsx
import { Cascader } from '@/cascader';

// 基础使用 - 零配置，纯 Tailwind
<Cascader options={options} />

// 自定义样式 - 使用 Tailwind 类
<Cascader
  options={options}
  className="border-2 border-blue-500 shadow-lg"
  size="large"
  variant="filled"
/>
```

## 🎯 与其他 shadcn 组件的集成

本组件使用了以下 shadcn/ui 基础组件：

- **Popover** - 下拉层容器
- **Input** - 输入框
- **Badge** - 多选标签
- **Checkbox** - 多选复选框

所有组件共享相同的：

- CSS 变量系统
- Tailwind 配置
- 深色模式主题
- 设计规范

## 💡 最佳实践

1. **保持一致性** - 使用项目中已有的 Tailwind 配置
2. **利用 CSS 变量** - 通过 shadcn 的 CSS 变量系统定制主题
3. **响应式设计** - 使用 Tailwind 响应式前缀 (`sm:`, `md:`, `lg:`)
4. **深色模式** - 使用 `dark:` 前缀自动适配
5. **语义化类名** - 使用 `classNames` prop 定制内部元素

## 📚 相关资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)

---

**完全符合 shadcn/ui 设计规范，纯 Tailwind CSS 实现** ✨
