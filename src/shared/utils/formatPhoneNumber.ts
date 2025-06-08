export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  let formatted = '';

  if (digitsOnly.length <= 3) {
    formatted = digitsOnly;
  } else if (digitsOnly.length <= 6) {
    formatted = `${digitsOnly.slice(0, 3)}/${digitsOnly.slice(3)}`;
  } else {
    formatted = `${digitsOnly.slice(0, 3)}/${digitsOnly.slice(3, 6)}/${digitsOnly.slice(6, 10)}`;
  }

  return formatted;
};