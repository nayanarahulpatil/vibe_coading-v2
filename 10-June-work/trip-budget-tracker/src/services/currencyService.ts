const API_URL = 'https://open.er-api.com/v6/latest';

export interface FXCache {
  baseCurrency: string;
  rates: Record<string, number>;
  fetchedAt: string;
}

export const getCachedRates = (baseCurrency: string): FXCache | null => {
  try {
    const cached = localStorage.getItem(`trip_budget_tracker_fx_${baseCurrency}`);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (err) {
    console.error('Error reading FX cache:', err);
    return null;
  }
};

export const fetchRates = async (baseCurrency: string): Promise<FXCache> => {
  try {
    const res = await fetch(`${API_URL}/${baseCurrency}`);
    if (!res.ok) throw new Error('Failed to fetch live FX rates');
    const data = await res.json();
    
    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'Failed to fetch rates');
    }

    const fxCache: FXCache = {
      baseCurrency,
      rates: data.rates,
      fetchedAt: new Date().toISOString(),
    };

    localStorage.setItem(`trip_budget_tracker_fx_${baseCurrency}`, JSON.stringify(fxCache));
    return fxCache;
  } catch (err) {
    console.warn('FX Live Fetch failed. Checking local cache...', err);
    const cached = getCachedRates(baseCurrency);
    if (cached) {
      return cached;
    }
    throw err;
  }
};

/**
 * Converts an amount from `fromCurrency` to the trip's `baseCurrency`.
 * Standard formula:
 * rates are fetched relative to baseCurrency (1 baseCurrency = X foreignCurrency).
 * Thus, to convert from foreignCurrency to baseCurrency:
 * baseAmount = foreignAmount / rate
 */
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
  
  // Calculate and round to 4 decimal places for base, final displays will do 2.
  return Number((amount / rate).toFixed(4));
};

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'CHF', 'CNY'
];
