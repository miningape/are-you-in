import { useMemo } from "react";

export function useTimezones() {
  return useMemo(() => {
    const timezones = new Set<string>();
    timezones.add("UTC");
    timezones.add("CET");
    timezones.add("CEST");
    timezones.add("GMT");

    for (let i = 0; i <= 24; i++) {
      const offset = 12 - i;

      if (offset === 0) {
        timezones.add("GMT");
      }

      if (offset > 0) {
        timezones.add("GMT+" + offset);
      }

      if (offset < 0) {
        timezones.add("GMT" + offset);
      }
    }

    return Array.from(timezones);
  }, []);
}
