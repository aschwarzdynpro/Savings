/**
 * Simple sliding-window rate limiter.
 *
 * Each `acquire()` call resolves as soon as there is room within the
 * configured window. Calls made while the window is saturated are delayed
 * until the oldest request falls out of the window.
 *
 * This is deliberately tiny — no token bucket, no priorities, no queue
 * reordering. Good enough for client-side polling at a handful of
 * requests/second.
 */
export class SlidingWindowLimiter {
  private readonly timestamps: number[] = [];

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  async acquire(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const now = Date.now();
      while (this.timestamps.length && this.timestamps[0] <= now - this.windowMs) {
        this.timestamps.shift();
      }
      if (this.timestamps.length < this.maxRequests) {
        this.timestamps.push(now);
        return;
      }
      const wait = this.timestamps[0] + this.windowMs - now;
      await sleep(Math.max(25, wait));
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
