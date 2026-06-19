import { db } from '../database/db.js';

export const fxRepository = {
  get(baseCurrency: string) {
    return db
      .prepare('SELECT base_currency, rates_json, fetched_at FROM fx_rate_cache WHERE base_currency = ?')
      .get(baseCurrency) as { base_currency: string; rates_json: string; fetched_at: string } | undefined;
  },

  upsert(baseCurrency: string, ratesJson: string, fetchedAt: string) {
    db.prepare(
      `INSERT INTO fx_rate_cache (base_currency, rates_json, fetched_at)
       VALUES (?, ?, ?)
       ON CONFLICT(base_currency) DO UPDATE SET rates_json = excluded.rates_json, fetched_at = excluded.fetched_at`
    ).run(baseCurrency, ratesJson, fetchedAt);
  },
};
