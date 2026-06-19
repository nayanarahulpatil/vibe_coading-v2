import type { Trip, Member, Expense } from '../types';
import { apiRequest } from './apiClient';

export interface TripSummary {
  id: string;
  title: string;
  baseCurrency: string;
  updatedAt: string;
}

export const tripApi = {
  listTrips: () => apiRequest<TripSummary[]>('/trips'),

  getTrip: (tripId: string) => apiRequest<Trip>(`/trips/${tripId}`),

  createTrip: (title: string, baseCurrency: string) =>
    apiRequest<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify({ title, baseCurrency }),
    }),

  addMember: (tripId: string, member: Omit<Member, 'id'>) =>
    apiRequest<Member>(`/trips/${tripId}/members`, {
      method: 'POST',
      body: JSON.stringify({
        name: member.name,
        upiId: member.upiId,
        paypalUsername: member.paypalUsername,
      }),
    }),

  addExpense: (tripId: string, expense: Expense, receiptFile?: File | null) => {
    const formData = new FormData();
    formData.append('payerId', expense.payerId);
    formData.append('amountOriginal', String(expense.amountOriginal));
    formData.append('currency', expense.currency);
    formData.append('amountBase', String(expense.amount));
    formData.append('fxRate', String(expense.fxRate));
    formData.append('category', expense.category);
    formData.append('description', expense.description);
    formData.append('expenseDate', expense.date);
    formData.append('isOfflineRate', String(!!expense.isOfflineRate));
    if (expense.rateFetchedAt) formData.append('rateFetchedAt', expense.rateFetchedAt);
    if (receiptFile) formData.append('receipt', receiptFile);

    return apiRequest<Expense>(`/trips/${tripId}/expenses`, {
      method: 'POST',
      body: formData,
    });
  },
};
