
export async function executeWithRetry<T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      
      // Check for fatal errors (like 401 Auth) which shouldn't be retried
      if (error?.status === 401 || error?.status === 403) {
         throw error;
      }

      if (attempt >= maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1); // 1s, 2s, 4s...
      console.warn(`[AI] Retry attempt ${attempt} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}
