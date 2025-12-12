# Date-Time Picker

Complete date and datetime picker component with range support, built on shadcn/ui and dayjs.

## Features

- ✅ **Date Selection**: Single date picking with calendar interface
- ✅ **DateTime Selection**: Date with time (HH:mm or HH:mm:ss)
- ✅ **Range Selection**: Date range and datetime range
- ✅ **Time Picker**: Standalone time picker with hour/minute/second
- ✅ **Presets**: Quick selection with predefined values
- ✅ **Bidirectional Binding**: Trigger inputs, popover inputs, calendars, and time pickers stay synchronized in real time
- ✅ **Manual Input Safety**: Free typing keeps focus, invalid/blank text clears every surface, and popovers stay open until you click outside
- ✅ **Date Constraints**: Min/max dates, disabled dates
- ✅ **Multiple Sizes**: Small, middle, large
- ✅ **Multiple Variants**: Outlined, filled, borderless, underlined
- ✅ **Status States**: Error, warning
- ✅ **Accessibility**: Keyboard navigation, ARIA labels
- ✅ **TypeScript**: Full type safety with comprehensive types
- ✅ **100% Tailwind CSS**: No custom CSS files

## Installation

1. Install dependencies:

```bash
pnpm add dayjs
```

2. Copy component files to your project:

```
components/ui/date-time-picker/
├── date-picker.tsx
├── range-picker.tsx
├── types.ts
├── use-date-validation.ts
├── utils.ts
└── index.ts
components/time-picker.tsx
```

## Usage

### Basic DatePicker

```tsx
import { DatePickerAdvanced } from "@/components/ui/date-time-picker";
import { useState } from "react";
import type { Dayjs } from "dayjs";

function App() {
  const [date, setDate] = useState<Dayjs | null>(null);

  return (
    <DatePickerAdvanced
      value={date}
      onChange={(date) => setDate(date)}
      placeholder="Select date"
    />
  );
}
```

### DatePicker with Time

```tsx
<DatePickerAdvanced
  value={date}
  onChange={(date) => setDate(date)}
  showTime
  placeholder="Select datetime"
/>

// With HH:mm format (no seconds)
<DatePickerAdvanced
  value={date}
  onChange={(date) => setDate(date)}
  showTime={{ showSecond: false }}
  placeholder="Select datetime"
/>
```

### RangePicker

```tsx
import { RangePicker } from "@/components/ui/date-time-picker";

function App() {
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);

  return (
    <RangePicker
      value={range}
      onChange={(dates) => setRange(dates)}
      placeholder={["Start date", "End date"]}
    />
  );
}
```

### RangePicker with Time

```tsx
<RangePicker
  value={range}
  onChange={(dates) => setRange(dates)}
  showTime
  placeholder={["Start datetime", "End datetime"]}
/>
```

### Standalone TimePicker

```tsx
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@/components/time-picker";

function App() {
  const [time, setTime] = useState<Dayjs | null>(null);

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      showSecond={false}
      placeholder="Select time"
    />
  );
}
```

### Manual Input & Validation Rules

- Typing in any trigger or popover input keeps focus and only commits after the text exactly matches the configured format.
- Blank or invalid text clears the selection entirely (inputs, calendars, and time pickers) instead of guessing a date.
- Time pickers treat empty strings as `null` and never auto-fill the current time.
- Popovers stay open until you click outside or explicitly call the close handler, so manual editing is never interrupted.

### With Presets

```tsx
<DatePickerAdvanced
  placeholder="Select date"
  presets={[
    { label: 'Today', value: dayjs() },
    { label: 'Yesterday', value: dayjs().subtract(1, 'day') },
    { label: 'Last Week', value: dayjs().subtract(7, 'day') },
  ]}
/>

<RangePicker
  placeholder={['Start date', 'End date']}
  presets={[
    {
      label: 'Last 7 Days',
      value: [dayjs().subtract(6, 'day'), dayjs()],
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().subtract(29, 'day'), dayjs()],
    },
  ]}
/>
```

### Date Constraints

```tsx
// Min/Max dates
<DatePickerAdvanced
  minDate={dayjs().startOf('month')}
  maxDate={dayjs().endOf('month')}
  placeholder="Select date"
/>

// Disabled dates (e.g., weekends)
<DatePickerAdvanced
  disabledDate={(date) => {
    const day = date.day();
    return day === 0 || day === 6;
  }}
  placeholder="Select date"
/>
```

## API

### DatePicker Props

| Property          | Type                                                        | Default      | Description                           |
| ----------------- | ----------------------------------------------------------- | ------------ | ------------------------------------- |
| value             | `Dayjs \| null`                                             | -            | Current selected date                 |
| defaultValue      | `Dayjs \| null`                                             | -            | Default selected date                 |
| onChange          | `(date: Dayjs \| null, dateString: string \| null) => void` | -            | Callback when date changes            |
| placeholder       | `string \| [string, string]`                                | -            | Placeholder text                      |
| format            | `string \| FormatType`                                      | `YYYY-MM-DD` | Display format                        |
| showTime          | `boolean \| ShowTimeConfig`                                 | `false`      | Show time picker                      |
| allowClear        | `boolean`                                                   | `true`       | Show clear button                     |
| disabled          | `boolean`                                                   | `false`      | Disable the picker                    |
| size              | `'small' \| 'middle' \| 'large'`                            | `'middle'`   | Size variant                          |
| variant           | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'`    | `'outlined'` | Visual variant                        |
| status            | `'error' \| 'warning'`                                      | -            | Status state                          |
| open              | `boolean`                                                   | -            | Controlled open state                 |
| defaultOpen       | `boolean`                                                   | `false`      | Default open state                    |
| onOpenChange      | `(open: boolean) => void`                                   | -            | Callback when open state changes      |
| presets           | `PresetValue[]`                                             | -            | Preset values for quick selection     |
| disabledDate      | `(currentDate: Dayjs, info: DisabledTimeConfig) => boolean` | -            | Specify dates that cannot be selected |
| minDate           | `Dayjs`                                                     | -            | Minimum selectable date               |
| maxDate           | `Dayjs`                                                     | -            | Maximum selectable date               |
| needConfirm       | `boolean`                                                   | `false`      | Require confirmation button           |
| inputReadOnly     | `boolean`                                                   | `false`      | Make input read-only                  |
| showNow           | `boolean`                                                   | `true`       | Show "Now" button                     |
| suffixIcon        | `ReactNode`                                                 | -            | Custom suffix icon                    |
| renderExtraFooter | `(mode: PanelMode) => ReactNode`                            | -            | Render extra footer                   |
| onOk              | `() => void`                                                | -            | Callback when OK button is clicked    |
| cellRender        | `(current: Dayjs, info: CellRenderInfo) => ReactNode`       | -            | Custom cell renderer                  |

### RangePicker Props

| Property         | Type                                                                                                                | Default                      | Description                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------- |
| value            | `[Dayjs, Dayjs] \| null`                                                                                            | -                            | Current selected range          |
| defaultValue     | `[Dayjs, Dayjs] \| null`                                                                                            | -                            | Default selected range          |
| onChange         | `(dates: [Dayjs, Dayjs] \| null, dateStrings: [string, string] \| null) => void`                                    | -                            | Callback when range changes     |
| placeholder      | `[string, string]`                                                                                                  | `['Start date', 'End date']` | Placeholder text                |
| separator        | `ReactNode`                                                                                                         | `→`                          | Separator between inputs        |
| disabled         | `boolean \| [boolean, boolean]`                                                                                     | `false`                      | Disable start/end inputs        |
| onCalendarChange | `(dates: [Dayjs \| null, Dayjs \| null], dateStrings: [string, string], info: { range: 'start' \| 'end' }) => void` | -                            | Callback during range selection |

All other DatePicker props are also supported.

### ShowTimeConfig

| Property         | Type      | Default | Description                 |
| ---------------- | --------- | ------- | --------------------------- |
| showSecond       | `boolean` | `true`  | Show seconds in time picker |
| format           | `string`  | -       | Time format                 |
| defaultOpenValue | `Dayjs`   | -       | Default open time value     |

### PresetValue

```ts
interface PresetValue {
  label: ReactNode;
  value: Dayjs | (() => Dayjs) | [Dayjs, Dayjs] | (() => [Dayjs, Dayjs]);
}
```

## Layout Structure

### DatePicker Layout

```
┌─────────────────────────────────────┐
│ Input Field with Calendar Icon     │
└─────────────────────────────────────┘
         ↓ (click to open)
┌─────────────────────────────────────┐
│ [Presets]  │  Calendar               │
│            │  ┌───────────────────┐  │
│  Today     │  │   Month/Year      │  │
│  Yesterday │  │   Su Mo Tu We Th  │  │
│  Last Week │  │   [date cells]    │  │
│            │  └───────────────────┘  │
│            │  Time Picker (optional)│
│            │  ┌─────┬─────┬─────┐  │
│            │  │ HH  │ MM  │ SS  │  │
│            │  └─────┴─────┴─────┘  │
│            │  [Now] [OK] (optional)│
└─────────────────────────────────────┘
```

### RangePicker Layout

```
┌───────────────────────────────────────────────┐
│ [Start Input] → [End Input] Calendar Icon    │
└───────────────────────────────────────────────┘
         ↓ (click to open)
┌───────────────────────────────────────────────┐
│ [Presets]  │  Start Calendar  │ End Calendar  │
│            │  ┌────────────┐  │ ┌──────────┐ │
│  Last 7    │  │  Calendar  │  │ │ Calendar │ │
│  Last 30   │  └────────────┘  │ └──────────┘ │
│  This Mth  │  Time Picker     │ Time Picker  │
│            │  (optional)      │ (optional)   │
│            │                  │ [OK]         │
└───────────────────────────────────────────────┘
```

## Dependencies

- React 19.2.1+
- dayjs 1.11.19+
- @tabler/icons-react
- shadcn/ui components:
  - Popover
  - Calendar
  - Input
  - Button
  - ScrollArea

## Notes

- The component uses dayjs for all date operations
- Full bidirectional binding between input fields and calendar
- Time picker supports both HH:mm and HH:mm:ss formats
- Range picker shows two calendars side by side
- All styling is done with Tailwind CSS classes
- TypeScript types are comprehensive and follow Ant Design's API

## Examples

See the demo page at `/components/date-picker` for:

- Basic usage
- DateTime selection
- Range selection
- Presets
- Size variants
- Status variants
- Date constraints
- Advanced features

## License

MIT
