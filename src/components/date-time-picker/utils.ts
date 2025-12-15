import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";

// 初始化 dayjs 插件
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(localeData);

/**
 * 格式化日期为字符串
 */
export function formatDate(
  date: Dayjs | null | undefined,
  format: string
): string {
  if (!date) return "";
  return date.format(format);
}

/**
 * 解析字符串为日期
 */
export function parseDate(dateString: string, format: string): Dayjs | null {
  if (!dateString) return null;
  const parsed = dayjs(dateString, format, true);
  return parsed.isValid() ? parsed : null;
}

/**
 * 检查日期是否在范围内
 */
export function isInRange(
  date: Dayjs,
  minDate?: Dayjs,
  maxDate?: Dayjs
): boolean {
  if (minDate && date.isBefore(minDate, "day")) return false;
  if (maxDate && date.isAfter(maxDate, "day")) return false;
  return true;
}

/**
 * 检查日期是否相同（忽略时间）
 */
export function isSameDate(date1: Dayjs | null, date2: Dayjs | null): boolean {
  if (!date1 || !date2) return false;
  return date1.isSame(date2, "day");
}

/**
 * 检查日期是否在范围内（包含时间）
 */
export function isInRangeWithTime(
  date: Dayjs,
  start: Dayjs | null,
  end: Dayjs | null
): boolean {
  if (!start && !end) return true;
  if (start && date.isBefore(start)) return false;
  if (end && date.isAfter(end)) return false;
  return true;
}

/**
 * 获取默认格式
 */
export function getDefaultFormat(
  showTime?: boolean | object,
  picker?: string
): string {
  if (picker === "year") return "YYYY";
  if (picker === "month") return "YYYY-MM";
  if (picker === "quarter") return "YYYY-[Q]Q";
  if (picker === "week") return "YYYY-wo";

  if (showTime) {
    if (
      typeof showTime === "object" &&
      "showSecond" in showTime &&
      showTime.showSecond === false
    ) {
      return "YYYY-MM-DD HH:mm";
    }
    return "YYYY-MM-DD HH:mm:ss";
  }

  return "YYYY-MM-DD";
}

/**
 * 合并日期和时间
 */
export function mergeDateAndTime(date: Dayjs, time: Dayjs): Dayjs {
  return date
    .hour(time.hour())
    .minute(time.minute())
    .second(time.second())
    .millisecond(time.millisecond());
}

/**
 * 获取月份的所有日期
 */
export function getMonthDates(date: Dayjs): Dayjs[] {
  const daysInMonth = date.daysInMonth();
  const firstDay = date.startOf("month");
  const lastDay = date.endOf("month");

  const startDay = firstDay.day(); // 0 = Sunday

  const dates: Dayjs[] = [];

  // 填充上个月的日期
  for (let i = startDay - 1; i >= 0; i--) {
    dates.push(firstDay.subtract(i + 1, "day"));
  }

  // 填充当前月的日期
  for (let i = 0; i < daysInMonth; i++) {
    dates.push(firstDay.add(i, "day"));
  }

  // 填充下个月的日期
  const remainingDays = 42 - dates.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    dates.push(lastDay.add(i, "day"));
  }

  return dates;
}

/**
 * 检查是否为今天
 */
export function isToday(date: Dayjs): boolean {
  return date.isSame(dayjs(), "day");
}

/**
 * 检查是否为本月
 */
export function isCurrentMonth(date: Dayjs, currentDate: Dayjs): boolean {
  return date.isSame(currentDate, "month");
}

/**
 * 补零
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, "0");
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, index) => index);

export function generateHours(): number[] {
  return HOURS;
}

export function generateMinutesOrSeconds(step = 1): number[] {
  if (step <= 1) {
    return MINUTES_SECONDS;
  }

  return MINUTES_SECONDS.filter((value) => value % step === 0);
}
