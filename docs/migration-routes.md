# B工程路由迁移清单

## 路由总览

### 认证相关路由 (Auth Routes)
- [x] `/sign-in` - 登录页 → `/login/sign-in`
- [x] `/sign-in-2` - 登录页2（变体） → `/login/sign-in-2`
- [x] `/sign-up` - 注册页 → `/login/sign-up`
- [x] `/otp` - OTP验证页 → `/login/otp`
- [x] `/forgot-password` - 忘记密码页 → `/login/forgot-password`

### 错误页面 (Error Pages)
- [x] `/401` - 未授权 → `/dashboard/errors/401`
- [x] `/403` - 禁止访问 → `/dashboard/errors/403`
- [x] `/404` - 页面未找到 → `/dashboard/errors/404`
- [x] `/500` - 服务器错误 → `/dashboard/errors/500`
- [x] `/503` - 服务不可用 → `/dashboard/errors/503`
- [x] `/errors/$error` - 动态错误页 → `/dashboard/errors/[error]`

### 主要功能页面 (Main Pages)
- [ ] `/` - 首页/Dashboard
- [ ] `/apps` - 应用列表页
- [ ] `/chats` - 聊天页
- [ ] `/help-center` - 帮助中心
- [ ] `/tasks` - 任务管理页
- [ ] `/users` - 用户管理页

### 设置页面 (Settings Pages)
- [ ] `/settings` - 设置首页
- [ ] `/settings/account` - 账户设置
- [ ] `/settings/appearance` - 外观设置
- [ ] `/settings/display` - 显示设置
- [ ] `/settings/notifications` - 通知设置

### Clerk 相关路由 (可选)
- [ ] `/clerk/sign-in` - Clerk登录
- [ ] `/clerk/sign-up` - Clerk注册
- [ ] `/clerk/user-management` - Clerk用户管理

---

## 路由冲突检测

### A工程已存在的路由
- ✅ `/` - 存在
- ✅ `/auth/sign-in` - 存在（不同路径）
- ✅ `/auth/sign-up` - 存在（不同路径）
- ✅ `/dashboard/*` - 存在

### 需要注意的点
1. B工程的 `/sign-in`, `/sign-up` 与 A工程的 `/auth/sign-in`, `/auth/sign-up` 路径不同，需要决定使用哪个
2. B工程的 `/` 与 A工程的 `/` 都是首页，需要合并或替换
3. B工程有大量 `/dashboard` 下没有的新页面：`/apps`, `/chats`, `/help-center`, `/tasks`, `/users`

---

## 迁移进度记录

**开始日期**: 2025-12-11

### 已完成
**2025-12-11 认证页面迁移**
- ✅ `/login/sign-in` - 标准登录页（带表单验证）
- ✅ `/login/sign-in-2` - 分屏登录页（带背景图）
- ✅ `/login/sign-up` - 注册页（带密码确认）
- ✅ `/login/otp` - OTP双因素验证页
- ✅ `/login/forgot-password` - 忘记密码页

**迁移组件**
- ✅ `components/password-input.tsx` - 密码输入组件
- ✅ `features/auth/auth-layout.tsx` - 认证页面布局
- ✅ `features/auth/sign-in/user-auth-form.tsx` - 登录表单
- ✅ `features/auth/sign-up/sign-up-form.tsx` - 注册表单
- ✅ `features/auth/otp/otp-form.tsx` - OTP表单
- ✅ `features/auth/forgot-password/forgot-password-form.tsx` - 忘记密码表单

**2025-12-11 错误页面迁移**
- ✅ `/dashboard/errors/401` - 未授权访问错误页（dashboard布局内）
- ✅ `/dashboard/errors/403` - 禁止访问错误页（dashboard布局内）
- ✅ `/dashboard/errors/404` - 页面未找到错误页（dashboard布局内）
- ✅ `/dashboard/errors/500` - 服务器内部错误页（dashboard布局内）
- ✅ `/dashboard/errors/503` - 网站维护错误页（dashboard布局内）
- ✅ `/dashboard/errors/[error]` - 动态错误页（支持多种错误类型）

**迁移组件**
- ✅ `features/errors/unauthorized-error.tsx` - 401错误组件
- ✅ `features/errors/forbidden-error.tsx` - 403错误组件
- ✅ `features/errors/not-found-error.tsx` - 404错误组件
- ✅ `features/errors/general-error.tsx` - 500错误组件
- ✅ `features/errors/maintenance-error.tsx` - 503错误组件

### 进行中
<!-- 这里记录正在进行的迁移 -->

### 待处理
<!-- 所有上面未勾选的项目 -->

---

## 迁移注意事项

1. **路由风格转换**: TanStack Router → Next.js App Router
   - B工程使用文件路由：`src/routes/_authenticated/xxx/index.tsx`
   - A工程应转为：`app/dashboard/xxx/page.tsx`

2. **认证保护**:
   - B工程使用 `_authenticated` 路由组
   - A工程需要在 layout 或 middleware 中实现

3. **组件依赖**:
   - 检查 B工程页面使用的组件是否在 A工程中存在
   - shadcn 组件应该是共通的

4. **状态管理**:
   - B工程可能使用了特定的 store
   - 需要检查并适配到 A工程

5. **API 调用**:
   - 检查 B工程页面的数据获取方式
   - 转换为 Next.js 的 Server/Client Component 模式
