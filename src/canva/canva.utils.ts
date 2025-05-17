export async function pollWithExponentialBackoff<T>(
  getStatusFn: () => Promise<T>,
  isDone: (status: T) => boolean,
  baseDelayMs = 1000,
  maxRetries = 6,
  maxDelayMs = 30000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkStatus = () => {
      getStatusFn()
        .then((status) => {
          if (isDone(status)) {
            resolve(status);
          } else {
            attempts++;
            if (attempts >= maxRetries) {
              reject(new Error('Max retries with backoff exceeded'));
            } else {
              const delay = Math.min(baseDelayMs * 2 ** attempts, maxDelayMs);
              setTimeout(checkStatus, delay);
            }
          }
        })
        .catch((err) => {
          // Always reject with an Error instance
          reject(err instanceof Error ? err : new Error(String(err)));
        });
    };

    checkStatus();
  });
}
