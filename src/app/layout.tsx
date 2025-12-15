import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/font";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import { cn } from "@/lib/utils";
import { FontProvider } from "@/context/font-provider";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import "./theme.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b"
};

export const metadata: Metadata = {
  title: "Flux Admin",
  description:
    "A modern Next.js admin dashboard and SaaS platform with shadcn/ui",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flux Admin"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");
  const initialLayout = {
    variant: cookieStore.get("sidebar-layout-variant")?.value as
      | "inset"
      | "floating"
      | "sidebar"
      | undefined,
    collapsible: cookieStore.get("sidebar-layout-collapsible")?.value as
      | "icon"
      | "offcanvas"
      | "none"
      | undefined,
    sidebarMode: cookieStore.get("sidebar-layout-sidebar-mode")?.value as
      | "dark"
      | "light"
      | undefined
  };
  const initialDir = cookieStore.get("direction")?.value as
    | "ltr"
    | "rtl"
    | undefined;

  return (
    <html lang="en" dir={initialDir ?? "ltr"} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overflow-hidden overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <FontProvider>
              <Providers
                activeThemeValue={activeThemeValue}
                initialLayout={initialLayout}
                initialDir={initialDir}
              >
                <Toaster />
                {children}
              </Providers>
            </FontProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
