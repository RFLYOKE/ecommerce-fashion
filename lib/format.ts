import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}


dayjs.extend(utc);

function clampMicrosToMillis(s: string) {
  // "2025-08-22T22:23:00.000000Z" -> "2025-08-22T22:23:00.000Z"
  return s.replace(/\.(\d{3})\d*(Z)$/, ".$1$2");
}

export function toDatetimeLocalInput(
  value?: string | Date | null
): string {
  if (!value) return "";
  if (typeof value === "string") {
    const cleaned = clampMicrosToMillis(value);
    const d = /Z$/.test(cleaned) ? dayjs.utc(cleaned).local() : dayjs(cleaned);
    return d.isValid() ? d.format("YYYY-MM-DDTHH:mm") : "";
  }
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DDTHH:mm") : "";
}

export function toApiUtcIso(value?: string | null): string {
  if (!value) return "";
  const d = dayjs(value); // value dari input adalah waktu lokal
  return d.isValid() ? d.utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : "";
}

export function toApiLocalSql(value?: string | null): string {
  if (!value) return "";
  const d = dayjs(value); // local
  return d.isValid() ? d.format("YYYY-MM-DD HH:mm:ss") : "";
}