const TOKEN_EXPIRATION_THRESHOLD = 5 * 60 * 1000; // 5 minutes (in milliseconds)

export const isTokenExpiring = () => {
  const tokenExpiration = localStorage.getItem("tokenExpiration");
  if (!tokenExpiration) return true;

  return Date.now() >= parseInt(tokenExpiration) - TOKEN_EXPIRATION_THRESHOLD;
};
