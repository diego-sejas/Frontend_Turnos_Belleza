export const formatPrice = (price, currency = 'ARS') => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price / 100);
};

export const formatDuration = (minutes) => {
  if (!minutes || minutes < 1) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} h ${rest} min` : `${hours} h`;
};

export const getInitials = (firstName, lastName) =>
  `${(firstName || '').trim().charAt(0)}${(lastName || '').trim().charAt(0)}`.toUpperCase();
