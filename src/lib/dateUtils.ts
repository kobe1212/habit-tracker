export const dateUtils = {
  // Get today's date in YYYY-MM-DD format
  today: (): string => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  },

  // Format date object to YYYY-MM-DD
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Parse YYYY-MM-DD to Date object
  parseDate: (dateStr: string): Date => {
    return new Date(dateStr + 'T00:00:00');
  },

  // Get the day of week (0-6, where 0 = Sunday)
  getDayOfWeek: (dateStr: string): number => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDay();
  },

  // Get number of days in a month
  getDaysInMonth: (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  },

  // Get the first day of the month (0-6)
  getMonthStartDay: (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  },

  // Add days to a date
  addDays: (dateStr: string, days: number): string => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return dateUtils.formatDate(date);
  },

  // Subtract days from a date
  subtractDays: (dateStr: string, days: number): string => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() - days);
    return dateUtils.formatDate(date);
  },

  // Check if a date matches a frequency
  matchesFrequency: (dateStr: string, frequency: 'daily' | number[]): boolean => {
    if (frequency === 'daily') return true;
    const dayOfWeek = dateUtils.getDayOfWeek(dateStr);
    return frequency.includes(dayOfWeek);
  },

  // Get current month and year
  getCurrentMonth: (): { year: number; month: number } => {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  },

  // Get previous month
  getPreviousMonth: (year: number, month: number): { year: number; month: number } => {
    if (month === 0) {
      return { year: year - 1, month: 11 };
    }
    return { year, month: month - 1 };
  },

  // Get next month
  getNextMonth: (year: number, month: number): { year: number; month: number } => {
    if (month === 11) {
      return { year: year + 1, month: 0 };
    }
    return { year, month: month + 1 };
  },

  // Get all dates in a month in YYYY-MM-DD format
  getMonthDates: (year: number, month: number): string[] => {
    const dates: string[] = [];
    const daysInMonth = dateUtils.getDaysInMonth(year, month);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.push(dateStr);
    }
    return dates;
  },

  // Get all dates in the current week (Mon-Sun)
  getCurrentWeekDates: (): string[] => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(dateUtils.formatDate(date));
    }
    return dates;
  },

  // Get month name
  getMonthName: (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  },

  // Get day name
  getDayName: (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  },

  // Get short day name
  getShortDayName: (day: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  },
};
