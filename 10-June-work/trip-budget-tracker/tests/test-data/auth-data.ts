export const TEST_PASSWORD = 'TestPass123!';
export const WEAK_PASSWORD = 'short';

export const uniqueEmail = (prefix = 'qa'): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@trip-test.local`;

export const mockUser = {
  email: 'qa-user@trip-test.local',
  password: TEST_PASSWORD,
};

export const testTrip = {
  title: 'Summer Vacation 2026',
  baseCurrency: 'USD',
  members: [
    { name: 'Alice', upi: 'alice@upi', paypal: 'alice_pp' },
    { name: 'Bob', upi: 'bob@upi', paypal: 'bob_pp' },
    { name: 'Charlie', upi: 'charlie@upi', paypal: 'charlie_pp' },
  ],
};
