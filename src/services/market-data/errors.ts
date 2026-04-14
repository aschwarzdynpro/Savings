/** Thrown when the provider responds with HTTP 429 (rate limit). */
export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/** Thrown when the provider responds with HTTP 401/403 (bad key / tier). */
export class AuthError extends Error {
  constructor(message = 'Unauthorized — check API key / plan tier') {
    super(message);
    this.name = 'AuthError';
  }
}

/** Thrown when the response is structurally valid but contains no data. */
export class NoDataError extends Error {
  constructor(message = 'No data for requested symbol') {
    super(message);
    this.name = 'NoDataError';
  }
}

/** Thrown when an endpoint has not been wired yet. */
export class NotImplementedError extends Error {
  constructor(method: string) {
    super(`${method} is not implemented.`);
    this.name = 'NotImplementedError';
  }
}
