export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
    if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};
export const getDuration = (start?: string, end?: string): string => {
  if (!start || !end) return '';
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  
  return `${diffDays} дн.`;
};