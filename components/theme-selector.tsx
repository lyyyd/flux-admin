"use client";

import { useThemeConfig } from "@/components/active-theme";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export const DEFAULT_THEMES = [
  {
    name: "Default",
    value: "default"
  },
  {
    name: "Blue",
    value: "blue"
  },
  {
    name: "Green",
    value: "green"
  },
  {
    name: "Orange",
    value: "orange"
  },
  {
    name: "Red",
    value: "red"
  },
  {
    name: "Rose",
    value: "rose"
  },
  {
    name: "Violet",
    value: "violet"
  },
  {
    name: "Yellow",
    value: "yellow"
  },
  {
    name: "Amber",
    value: "amber"
  }
];

export const SCALED_THEMES = [
  {
    name: "Default",
    value: "default-scaled"
  },
  {
    name: "Blue",
    value: "blue-scaled"
  }
];

export const MONO_THEMES = [
  {
    name: "Mono",
    value: "mono-scaled"
  }
];

const ALL_THEMES = [...DEFAULT_THEMES, ...SCALED_THEMES, ...MONO_THEMES];

export function getThemeDisplayName(value?: string) {
  if (!value) return DEFAULT_THEMES[0]?.name ?? "Default";
  return ALL_THEMES.find((theme) => theme.value === value)?.name ?? value;
}

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          className="justify-start *:data-[slot=select-value]:w-12"
        >
          <span className="text-muted-foreground hidden sm:block">
            Select a theme:
          </span>
          <span className="text-muted-foreground block sm:hidden">Theme</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>Default</SelectLabel>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Scaled</SelectLabel>
            {SCALED_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Monospaced</SelectLabel>
            {MONO_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
