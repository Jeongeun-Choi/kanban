export const isNetworkError = (error: unknown): boolean => {
  if (!navigator.onLine) return true;
  if (error instanceof Error) {
    return error.message.includes("Failed to fetch") || error.message.includes("NetworkError");
  }
  return false;
};
