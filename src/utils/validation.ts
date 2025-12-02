export const validateTripDates = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) return null; 

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return "Дата початку не може бути пізніше дати завершення!";
  }

  return null; 
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};