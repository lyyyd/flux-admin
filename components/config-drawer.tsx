"use client";

import { type SVGProps } from "react";
import { Root as Radio, Item } from "@radix-ui/react-radio-group";
import { CircleCheck, RotateCcw, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { IconDir } from "@/assets/custom/icon-dir";
import { IconLayoutCompact } from "@/assets/custom/icon-layout-compact";
import { IconLayoutDefault } from "@/assets/custom/icon-layout-default";
import { IconLayoutFull } from "@/assets/custom/icon-layout-full";
import { IconSidebarFloating } from "@/assets/custom/icon-sidebar-floating";
import { IconSidebarInset } from "@/assets/custom/icon-sidebar-inset";
import { IconSidebarSidebar } from "@/assets/custom/icon-sidebar-sidebar";
import { IconSidebarAppearanceDark } from "@/assets/custom/icon-sidebar-appearance-dark";
import { IconSidebarAppearanceLight } from "@/assets/custom/icon-sidebar-appearance-light";
import { IconThemeDark } from "@/assets/custom/icon-theme-dark";
import { IconThemeLight } from "@/assets/custom/icon-theme-light";
import { IconThemeSystem } from "@/assets/custom/icon-theme-system";
import { cn } from "@/lib/utils";
import { useDirection } from "@/context/direction-provider";
import {
  type Collapsible,
  type SidebarMode,
  useLayout
} from "@/context/layout-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useSidebar } from "./ui/sidebar";

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetDir, dir } = useDirection();
  const { setTheme } = useTheme();
  const { resetLayout } = useLayout();

  const handleReset = () => {
    setOpen(true);
    resetDir();
    setTheme("system"); // Reset to system theme
    resetLayout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open theme settings"
          aria-describedby="config-drawer-description"
          className="rounded-full"
        >
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={dir === "rtl" ? "left" : "right"}
        className="flex flex-col gap-6"
      >
        <SheetHeader className="text-start">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto px-4">
          <ThemeConfig />
          <SidebarConfig />
          <SidebarAppearanceConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            aria-label="Reset all settings to default values"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  className
}: {
  title: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold",
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          size="icon"
          variant="secondary"
          className="size-4 rounded-full"
          onClick={onReset}
        >
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}

function RadioGroupItem({
  item,
  isTheme = false
}: {
  item: {
    value: string;
    label: string;
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
    disabled?: boolean;
  };
  isTheme?: boolean;
}) {
  return (
    <Item
      value={item.value}
      disabled={item.disabled}
      className={cn(
        "group outline-none",
        "transition duration-200 ease-in",
        item.disabled && "cursor-not-allowed opacity-50"
      )}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
      aria-disabled={item.disabled || undefined}
    >
      <div
        className={cn(
          "ring-border relative rounded-[6px] ring-[1px]",
          "group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl",
          "group-focus-visible:ring-2"
        )}
        role="img"
        aria-hidden="false"
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            "fill-primary size-6 stroke-white",
            "group-data-[state=unchecked]:hidden",
            "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
          )}
          aria-hidden="true"
        />
        <item.icon
          className={cn(
            !isTheme &&
              "stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground"
          )}
          aria-hidden="true"
        />
      </div>
      <div
        className="mt-1 text-xs"
        id={`${item.value}-description`}
        aria-live="polite"
      >
        {item.label}
      </div>
    </Item>
  );
}

function ThemeConfig() {
  const { theme, setTheme } = useTheme();
  const defaultTheme = "system";

  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <Radio
        value={theme || defaultTheme}
        onValueChange={setTheme}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme preference"
        aria-describedby="theme-description"
      >
        {[
          {
            value: "system",
            label: "System",
            icon: IconThemeSystem
          },
          {
            value: "light",
            label: "Light",
            icon: IconThemeLight
          },
          {
            value: "dark",
            label: "Dark",
            icon: IconThemeDark
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id="theme-description" className="sr-only">
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  );
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout();
  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar"
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
        aria-describedby="sidebar-description"
      >
        {[
          {
            value: "inset",
            label: "Inset",
            icon: IconSidebarInset
          },
          {
            value: "floating",
            label: "Floating",
            icon: IconSidebarFloating
          },
          {
            value: "sidebar",
            label: "Sidebar",
            icon: IconSidebarSidebar
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="sidebar-description" className="sr-only">
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  );
}

function SidebarAppearanceConfig() {
  const { sidebarMode, defaultSidebarMode, setSidebarMode, variant } =
    useLayout();
  const { resolvedTheme } = useTheme();
  const darkModeDisabled = variant === "inset";
  const themeForcesDark = resolvedTheme === "dark" && !darkModeDisabled;

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar Appearance"
        showReset={sidebarMode !== defaultSidebarMode}
        onReset={() => setSidebarMode(defaultSidebarMode)}
      />
      <Radio
        value={sidebarMode}
        onValueChange={(value) => setSidebarMode(value as SidebarMode)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar appearance"
        aria-describedby="sidebar-appearance-description"
      >
        {[
          {
            value: "dark" as SidebarMode,
            label: "Dark",
            icon: IconSidebarAppearanceDark,
            disabled: darkModeDisabled
          },
          {
            value: "light" as SidebarMode,
            label: "Light",
            icon: IconSidebarAppearanceLight,
            disabled: themeForcesDark
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      {themeForcesDark && (
        <p className="text-muted-foreground mt-2 text-xs">
          Sidebar appearance follows the dark theme.
        </p>
      )}
      <div id="sidebar-appearance-description" className="sr-only">
        Choose whether the sidebar uses a dark or light surface independent of
        the global theme
      </div>
    </div>
  );
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar();
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout();

  const radioState = open ? "default" : collapsible;

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Layout"
        showReset={radioState !== "default"}
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
      />
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === "default") {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as Collapsible);
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select layout style"
        aria-describedby="layout-description"
      >
        {[
          {
            value: "default",
            label: "Default",
            icon: IconLayoutDefault
          },
          {
            value: "icon",
            label: "Compact",
            icon: IconLayoutCompact
          },
          {
            value: "offcanvas",
            label: "Full layout",
            icon: IconLayoutFull
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="layout-description" className="sr-only">
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  );
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection();
  return (
    <div>
      <SectionTitle
        title="Direction"
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select site direction"
        aria-describedby="direction-description"
      >
        {[
          {
            value: "ltr",
            label: "Left to Right",
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="ltr" {...props} />
            )
          },
          {
            value: "rtl",
            label: "Right to Left",
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="rtl" {...props} />
            )
          }
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="direction-description" className="sr-only">
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  );
}
