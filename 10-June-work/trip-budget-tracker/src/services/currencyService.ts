import { apiRequest } from './apiClient';

export interface FXCache {
  baseCurrency: string;
  rates: Record<string, number>;
  fetchedAt: string;
}

export const fetchRates = async (baseCurrency: string): Promise<FXCache> => {
  try {
    return await apiRequest<FXCache>(`/fx/rates/${baseCurrency}?refresh=true`);
  } catch (err) {
    console.warn('FX live fetch failed, trying cached rates...', err);
    return apiRequest<FXCache>(`/fx/rates/${baseCurrency}`);
  }
};

export const convertToBaseCurrency = (
  amount: number,
  fromCurrency: string,
  baseCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === baseCurrency) return amount;

  const rate = rates[fromCurrency];
  if (!rate) {
    throw new Error(`Rate for currency ${fromCurrency} not found`);
  }

  return Number((amount / rate).toFixed(4));
};

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'CHF', 'CNY',
];
