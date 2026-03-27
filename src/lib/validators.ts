export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function validatePhone(phone: string) {
  if (!phone) return true;
  return /^[\d+()\-\s]{7,20}$/.test(phone);
}