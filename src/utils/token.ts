// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate token expiry time (10 minutes from now)
export const getTokenExpiry = (): Date => {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
};
