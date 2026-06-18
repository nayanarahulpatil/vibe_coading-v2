import { Page } from '@playwright/test';

export const mockFxRates = async (page: Page, baseCurrency: string = 'USD') => {
  await page.route(`https://open.er-api.com/v6/latest/${baseCurrency}`, async (route) => {
    const json = {
      result: "success",
      provider: "https://www.exchangerate-api.com",
      documentation: "https://www.exchangerate-api.com/docs/free",
      terms_of_use: "https://www.exchangerate-api.com/terms",
      time_last_update_unix: 1718236800,
      time_last_update_utc: "Thu, 13 Jun 2026 00:00:00 +0000",
      time_next_update_unix: 1718323200,
      time_next_update_utc: "Fri, 14 Jun 2026 00:00:00 +0000",
      time_eol_unix: 0,
      base_code: baseCurrency,
      rates: {
        "USD": 1,
        "EUR": 0.85,
        "GBP": 0.75,
        "INR": 83.5,
        "JPY": 110,
        "AUD": 1.35,
        "CAD": 1.25,
        "SGD": 1.35,
        "CHF": 0.9,
        "CNY": 6.4
      }
    };
    await route.fulfill({ 
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      json 
    });
  });
};

export const mockFxOffline = async (page: Page, baseCurrency: string = 'USD') => {
  await page.route(`https://open.er-api.com/v6/latest/${baseCurrency}`, async (route) => {
    await route.abort('internetdisconnected');
  });
};
