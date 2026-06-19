import { env } from '../config/env.js';
import { fxRepository } from '../repositories/fx.repository.js';

export interface FXCacheDto {
  baseCurrency: string;
  rates: Record<string, number>;
  fetchedAt: string;
}

export const fxService = {
  async getRates(baseCurrency: string): Promise<FXCacheDto> {
    const cached = fxRepository.get(baseCurrency);
    if (cached) {
      return {
        baseCurrency: cached.base_currency,
        rates: JSON.parse(cached.rates_json),
        fetchedAt: cached.fetched_at,
      };
    }

    try {
      const res = await fetch(`${env.fxApiUrl}/${baseCurrency}`);
      if (!res.ok) throw new Error('Failed to fetch live FX rates');
      const data = (await res.json()) as { result: string; rates: Record<string, number>; 'error-type'?: string };
      if (data.result !== 'success') throw new Error(data['error-type'] || 'Failed to fetch rates');

      const fetchedAt = new Date().toISOString();
      fxRepository.upsert(baseCurrency, JSON.stringify(data.rates), fetchedAt);

      return { baseCurrency, rates: data.rates, fetchedAt };
    } catch (err) {
      const stale = fxRepository.get(baseCurrency);
      if (stale) {
        return {
          baseCurrency: stale.base_currency,
          rates: JSON.parse(stale.rates_json),
          fetchedAt: stale.fetched_at,
        };
      }
      throw err;
    }
  },

  async refreshRates(baseCurrency: string): Promise<FXCacheDto> {
    const res = await fetch(`${env.fxApiUrl}/${baseCurrency}`);
    if (!res.ok) throw new Error('Failed to fetch live FX rates');
    const data = (await res.json()) as { result: string; rates: Record<string, number> };
    if (data.result !== 'success') throw new Error('Failed to fetch rates');

    const fetchedAt = new Date().toISOString();
    fxRepository.upsert(baseCurrency, JSON.stringify(data.rates), fetchedAt);
    return { baseCurrency, rates: data.rates, fetchedAt };
  },
};
