import { Settings } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

function isAfterTime(datetime: Dayjs, time: string, timezone: string) {
  const [hour, minute] = time.split(":");
  const denyTime = dayjs.tz(
    datetime.format(`YYYY-MM-DDT${hour}:${minute}:00.00`),
    timezone
  );

  return datetime.isAfter(denyTime);
}

export function isNowAfterTime(time: string, timezone: string) {
  return isAfterTime(dayjs(), time, timezone);
}

// ? Weird type fuckery to enforce this method is compliant with Settings
export function shouldPerform(
  s: keyof Pick<Settings, "auto_deny_at" | "push_notifications_at">,
  settings: Pick<
    Settings,
    "auto_deny_at" | "push_notifications_at" | "timezone"
  >
) {
  return isNowAfterTime(settings[s], settings.timezone);
}
