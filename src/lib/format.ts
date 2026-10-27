/** 서버·브라우저 시간대 차이로 인한 hydration 불일치를 막기 위해 시간대를 고정한다. */
const TIME_ZONE = "Asia/Seoul";

const dateTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateLong = new Intl.DateTimeFormat("ko-KR", {
  timeZone: TIME_ZONE,
  dateStyle: "long",
  timeStyle: "short",
});

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export function formatDateLong(iso: string): string {
  return dateLong.format(new Date(iso));
}
