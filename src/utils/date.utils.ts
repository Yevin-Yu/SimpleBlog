export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  const year = date.getFullYear();
  return year >= 1900 && year <= 2100;
}

export function parseSafeDate(dateString: string, fallback: Date = new Date()): Date {
  if (!isValidDateString(dateString)) {
    return fallback;
  }
  return new Date(dateString);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateTimestamp(dateString: string): number {
  if (!isValidDateString(dateString)) {
    return 0;
  }
  return new Date(dateString).getTime();
}
