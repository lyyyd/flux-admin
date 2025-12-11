import { NavItem } from "@/types";

/**
 * Navigation configuration with RBAC support
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 *
 * RBAC Access Control:
 * Each navigation item can have an `access` property that controls visibility
 * based on permissions, plans, features, roles, and organization context.
 *
 * Examples:
 *
 * 1. Require organization:
 *    access: { requireOrg: true }
 *
 * 2. Require specific permission:
 *    access: { requireOrg: true, permission: 'org:teams:manage' }
 *
 * 3. Require specific plan:
 *    access: { plan: 'pro' }
 *
 * 4. Require specific feature:
 *    access: { feature: 'premium_access' }
 *
 * 5. Require specific role:
 *    access: { role: 'admin' }
 *
 * 6. Multiple conditions (all must be true):
 *    access: { requireOrg: true, permission: 'org:teams:manage', plan: 'pro' }
 *
 * Note: The `visible` function is deprecated but still supported for backward compatibility.
 * Use the `access` property for new items.
 */
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: []
  },
  {
    title: "Auth",
    url: "#",
    icon: "login",
    isActive: true,
    items: [
      {
        title: "Sign In",
        url: "/login/sign-in",
        icon: "login"
      },
      {
        title: "Sign In 2",
        url: "/login/sign-in-2",
        icon: "login"
      },
      {
        title: "Sign Up",
        url: "/login/sign-up",
        icon: "signUp"
      },
      {
        title: "OTP",
        url: "/login/otp",
        icon: "otp"
      },
      {
        title: "Forgot Password",
        url: "/login/forgot-password",
        icon: "forgotPassword"
      }
    ]
  },
  {
    title: "Errors",
    url: "#",
    icon: "error",
    isActive: true,
    items: [
      {
        title: "401 - Unauthorized",
        url: "/dashboard/errors/401",
        icon: "error401"
      },
      {
        title: "403 - Forbidden",
        url: "/dashboard/errors/403",
        icon: "error403"
      },
      {
        title: "404 - Not Found",
        url: "/dashboard/errors/404",
        icon: "error404"
      },
      {
        title: "500 - Server Error",
        url: "/dashboard/errors/500",
        icon: "error500"
      },
      {
        title: "503 - Maintenance",
        url: "/dashboard/errors/503",
        icon: "error503"
      }
    ]
  },
  {
    title: "Examples",
    url: "#",
    icon: "dashboard",
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/examples",
        icon: "dashboard"
      },
      {
        title: "Apps",
        url: "/dashboard/examples/apps",
        icon: "apps"
      },
      {
        title: "Chats",
        url: "/dashboard/examples/chats",
        icon: "chats"
      },
      {
        title: "Help Center",
        url: "/dashboard/examples/help-center",
        icon: "helpCenter"
      },
      {
        title: "Tasks",
        url: "/dashboard/examples/tasks",
        icon: "tasks"
      },
      {
        title: "Users",
        url: "/dashboard/examples/users",
        icon: "users"
      }
    ]
  },
  {
    title: "Workspaces",
    url: "/dashboard/workspaces",
    icon: "workspace",
    isActive: false,
    items: []
  },
  {
    title: "Teams",
    url: "/dashboard/workspaces/team",
    icon: "teams",
    isActive: false,
    items: [],
    // Require organization to be active
    access: { requireOrg: true }
    // Alternative: require specific permission
    // access: { requireOrg: true, permission: 'org:teams:view' }
  },
  {
    title: "Product",
    url: "/dashboard/product",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: []
  },
  {
    title: "Kanban",
    url: "/dashboard/kanban",
    icon: "kanban",
    shortcut: ["k", "k"],
    isActive: false,
    items: []
  },
  {
    title: "Pro",
    url: "#", // Placeholder as there is no direct link for the parent
    icon: "pro",
    isActive: true,
    items: [
      {
        title: "Exclusive",
        url: "/dashboard/exclusive",
        icon: "exclusive",
        shortcut: ["m", "m"]
      }
    ]
  },
  {
    title: "Account",
    url: "#", // Placeholder as there is no direct link for the parent
    icon: "account",
    isActive: true,
    items: [
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: "profile",
        shortcut: ["m", "m"]
      },
      {
        title: "Billing",
        url: "/dashboard/billing",
        icon: "billing",
        shortcut: ["b", "b"],
        // Only show billing if in organization context
        access: { requireOrg: true }
        // Alternative: require billing management permission
        // access: { requireOrg: true, permission: 'org:manage:billing' }
      },
      {
        title: "Login",
        shortcut: ["l", "l"],
        url: "/",
        icon: "login"
      }
    ]
  }
];
