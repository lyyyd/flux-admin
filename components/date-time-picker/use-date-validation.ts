import dayjs, { Dayjs } from "dayjs";

/**
 * 智能日期解析和纠正
 * @param input 输入的日期字符串
 * @returns 解析后的 Dayjs 对象，失败返回 null
 */
export const parseDateWithCorrection = (input: string): Dayjs | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const now = dayjs();
  const parts = trimmed.split(/[-\/\s]/).filter((p) => p);

  if (parts.length === 0) return null;

  let year = now.year();
  let month = now.month() + 1; // dayjs month is 0-indexed
  let day = now.date();

  // 解析各部分
  if (parts.length >= 1) {
    const yearVal = parseInt(parts[0], 10);
    if (!isNaN(yearVal)) {
      // 如果是4位数，作为年份
      if (parts[0].length === 4) {
        year = yearVal;
      } else if (parts.length === 1) {
        // 只有一个数字，且 <= 31，当作日期
        if (yearVal <= 31) {
          day = yearVal;
        } else {
          // 大于31，可能是年份（如 2025）
          year = yearVal;
        }
      } else {
        // 多个部分，第一个当作年份
        if (yearVal < 100) {
          // 两位数年份，转换为20xx
          year = 2000 + yearVal;
        } else {
          year = yearVal;
        }
      }
    }
  }

  if (parts.length >= 2) {
    const monthVal = parseInt(parts[1], 10);
    if (!isNaN(monthVal)) {
      month = monthVal;
    }
  }

  if (parts.length >= 3) {
    const dayVal = parseInt(parts[2], 10);
    if (!isNaN(dayVal)) {
      day = dayVal;
    }
  }

  // 纠正年份：如果小于1900，使用当前年份
  if (year < 1900) {
    year = now.year();
  }

  // 纠正月份：1-12
  if (month < 1 || month > 12) {
    month = Math.max(1, Math.min(12, month));
  }

  // 纠正日期：检查当月最大天数
  const maxDay = dayjs(
    `${year}-${String(month).padStart(2, "0")}-01`
  ).daysInMonth();
  if (day < 1 || day > maxDay) {
    day = Math.max(1, Math.min(maxDay, day));
  }

  const result = dayjs(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );
  return result.isValid() ? result : null;
};

/**
 * 智能时间解析和纠正
 * @param input 输入的时间字符串 (HH:mm:ss 或 HH:mm)
 * @returns 解析后的时间对象 { hour, minute, second }，失败返回 null
 */
export const parseTimeWithCorrection = (
  input: string
): { hour: number; minute: number; second: number } | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":");
  if (parts.length < 2) return null;

  let hour = parts[0] ? parseInt(parts[0], 10) : 0;
  let minute =
    parts[1] !== undefined ? (parts[1] ? parseInt(parts[1], 10) : 0) : 0;
  let second =
    parts[2] !== undefined ? (parts[2] ? parseInt(parts[2], 10) : 0) : 0;

  if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
    return null;
  }

  // 自动纠正到合法范围
  hour = Math.max(0, Math.min(23, hour));
  minute = Math.max(0, Math.min(59, minute));
  second = Math.max(0, Math.min(59, second));

  return { hour, minute, second };
};

/**
 * 解析完整的日期时间字符串
 * @param input 输入的日期时间字符串 (YYYY-MM-DD HH:mm:ss)
 * @returns 解析后的 Dayjs 对象，失败返回 null
 */
export const parseDateTimeWithCorrection = (input: string): Dayjs | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 尝试分离日期和时间部分
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0) return null;

  // 解析日期部分
  const datePart = parts[0];
  const parsedDate = parseDateWithCorrection(datePart);

  if (!parsedDate) return null;

  // 如果有时间部分，解析时间
  if (parts.length >= 2) {
    const timePart = parts[1];
    const parsedTime = parseTimeWithCorrection(timePart);

    if (parsedTime) {
      return parsedDate
        .hour(parsedTime.hour)
        .minute(parsedTime.minute)
        .second(parsedTime.second);
    }
  }

  return parsedDate;
};

/**
 * Hook: 使用日期验证和纠正
 */
export const useDateValidation = () => {
  return {
    parseDateWithCorrection,
    parseTimeWithCorrection,
    parseDateTimeWithCorrection
  };
};
