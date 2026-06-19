import { Page } from '@playwright/test';

export const MOCK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
  INR: 83.5,
  JPY: 110,
  AUD: 1.35,
  CAD: 1.25,
  SGD: 1.35,
  CHF: 0.9,
  CNY: 6.4,
};

const buildFxApiResponse = (baseCurrency: string) => ({
  status: 200,
  data: {
    baseCurrency,
    rates: MOCK_RATES,
    fetchedAt: new Date().toISOString(),
  },
  message: 'FX rates retrieved',
});

export const mockFxRates = async (page: Page, baseCurrency: string = 'USD') => {
  // v3: FX fetched via backend API (proxied through Vite)
  await page.route(`**/api/v1/fx/rates/${baseCurrency}**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: buildFxApiResponse(baseCurrency),
    });
  });

  // Fallback: mock external API for un-mocked server-side fetches
  await page.route(`https://open.er-api.com/v6/latest/${baseCurrency}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      json: {
        result: 'success',
        base_code: baseCurrency,
        rates: MOCK_RATES,
      },
    });
  });
};

export const mockFxOffline = async (page: Page, baseCurrency: string = 'USD') => {
  await page.route(`**/api/v1/fx/rates/${baseCurrency}**`, async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      json: { status: 503, data: null, message: 'FX API unavailable' },
    });
  });
  await page.route(`https://open.er-api.com/v6/latest/${baseCurrency}`, async (route) => {
    await route.abort('internetdisconnected');
  });
};
