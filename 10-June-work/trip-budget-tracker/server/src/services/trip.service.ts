import { v4 as uuidv4 } from 'uuid';
import { tripRepository } from '../repositories/trip.repository.js';

const mapMember = (m: ReturnType<typeof tripRepository.getMembers>[number]) => ({
  id: m.id,
  name: m.name,
  upiId: m.upi_id ?? undefined,
  paypalUsername: m.paypal_username ?? undefined,
});

const mapExpense = (e: ReturnType<typeof tripRepository.getExpenses>[number]) => ({
  id: e.id,
  payerId: e.paid_by_member_id,
  amount: e.amount_base,
  amountOriginal: e.amount_original,
  currency: e.currency,
  fxRate: e.fx_rate,
  category: e.category,
  description: e.description,
  date: e.expense_date,
  receiptPhotoUrl: e.receipt_photo_path ? `/api/v1/receipts/${e.id}` : undefined,
  isOfflineRate: e.is_offline_rate === 1,
  rateFetchedAt: e.rate_fetched_at ?? undefined,
});

const buildTripDto = (tripId: string) => {
  const trip = tripRepository.findById(tripId);
  if (!trip) throw new Error('Trip not found');

  return {
    id: trip.id,
    title: trip.name,
    baseCurrency: trip.base_currency,
    members: tripRepository.getMembers(tripId).map(mapMember),
    expenses: tripRepository.getExpenses(tripId).map(mapExpense),
  };
};

export const tripService = {
  listTrips(userId: string) {
    return tripRepository.listByUser(userId).map((t) => ({
      id: t.id,
      title: t.name,
      baseCurrency: t.base_currency,
      updatedAt: t.updated_at,
    }));
  },

  getTrip(userId: string, tripId: string) {
    const trip = tripRepository.findById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.user_id !== userId) throw new Error('Forbidden');
    return buildTripDto(tripId);
  },

  createTrip(userId: string, name: string, baseCurrency: string) {
    if (!name?.trim()) throw new Error('Trip title is required');
    if (!baseCurrency) throw new Error('Base currency is required');

    const now = new Date().toISOString();
    const id = uuidv4();
    tripRepository.create(id, userId, name.trim(), baseCurrency, now);
    return buildTripDto(id);
  },

  addMember(
    userId: string,
    tripId: string,
    name: string,
    upiId?: string,
    paypalUsername?: string
  ) {
    const trip = tripRepository.findById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.user_id !== userId) throw new Error('Forbidden');
    if (!name?.trim()) throw new Error('Member name is required');
    if (tripRepository.memberNameExists(tripId, name.trim())) {
      throw new Error('A member with this name already exists');
    }

    const now = new Date().toISOString();
    const id = uuidv4();
    tripRepository.addMember(
      id,
      tripId,
      name.trim(),
      upiId?.trim() || null,
      paypalUsername?.trim() || null,
      now
    );
    tripRepository.touch(tripId, now);
    return mapMember(tripRepository.getMemberById(id)!);
  },

  addExpense(
    userId: string,
    tripId: string,
    payload: {
      payerId: string;
      amountOriginal: number;
      currency: string;
      amountBase: number;
      fxRate: number;
      category: string;
      description: string;
      receiptPhotoPath: string | null;
      isOfflineRate: boolean;
      rateFetchedAt: string | null;
      expenseDate: string;
    }
  ) {
    const trip = tripRepository.findById(tripId);
    if (!trip) throw new Error('Trip not found');
    if (trip.user_id !== userId) throw new Error('Forbidden');

    const member = tripRepository.getMemberById(payload.payerId);
    if (!member || member.trip_id !== tripId) throw new Error('Invalid payer');

    const now = new Date().toISOString();
    const id = uuidv4();
    tripRepository.addExpense(id, tripId, payload.payerId, payload, now);
    tripRepository.touch(tripId, now);

    return mapExpense(tripRepository.getExpenseById(id)!);
  },

  getReceiptForExpense(userId: string, expenseId: string) {
    const expense = tripRepository.getExpenseById(expenseId);
    if (!expense || !expense.receipt_photo_path) throw new Error('Receipt not found');

    const trip = tripRepository.findById(expense.trip_id);
    if (!trip || trip.user_id !== userId) throw new Error('Forbidden');

    return { path: expense.receipt_photo_path };
  },
};
