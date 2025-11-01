const NodeCache = require('node-cache');

/**
 * In-memory cache wrapper with TTL support
 * For production, consider Redis for distributed caching
 */
class CacheManager {
  constructor(ttlSeconds = 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
    this.inFlightRequests = new Map(); // Request coalescing
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  has(key) {
    return this.cache.has(key);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  /**
   * Request coalescing: if same request is in-flight, wait for it
   * instead of making duplicate external API calls
   */
  async getOrFetch(key, fetchFn, ttl) {
    // Check cache first
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    // Check if request is in-flight
    if (this.inFlightRequests.has(key)) {
      return await this.inFlightRequests.get(key);
    }

    // Start new request
    const promise = (async () => {
      try {
        const result = await fetchFn();
        this.set(key, result, ttl);
        return result;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, promise);
    return await promise;
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = CacheManager;
