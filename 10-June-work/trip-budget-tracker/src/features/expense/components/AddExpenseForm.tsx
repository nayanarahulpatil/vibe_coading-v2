import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addExpenseLocal } from '../../trip/tripSlice';
import { tripApi } from '../../../services/tripApi';
import { ApiError } from '../../../services/apiClient';
import { Receipt, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchRates, convertToBaseCurrency, SUPPORTED_CURRENCIES } from '../../../services/currencyService';

export const AddExpenseForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  const [rates, setRates] = React.useState<Record<string, number> | null>(null);
  const [rateFetchedAt, setRateFetchedAt] = React.useState<string | null>(null);
  const [isOfflineRate, setIsOfflineRate] = React.useState<boolean>(false);
  const [ratesError, setRatesError] = React.useState<string | null>(null);
  const [isLoadingRates, setIsLoadingRates] = React.useState<boolean>(false);

  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [showToast, setShowToast] = React.useState<boolean>(false);
  const [toastHasReceipt, setToastHasReceipt] = React.useState<boolean>(false);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!currentTrip?.baseCurrency) return;

    setIsLoadingRates(true);
    setRatesError(null);

    fetchRates(currentTrip.baseCurrency)
      .then((cache) => {
        setRates(cache.rates);
        setRateFetchedAt(cache.fetchedAt);
        const ageInMs = Date.now() - new Date(cache.fetchedAt).getTime();
        setIsOfflineRate(ageInMs > 60000);
      })
      .catch((err) => {
        setRatesError('Failed to fetch live FX rates. Using local cached fallback.');
        console.error(err);
      })
      .finally(() => {
        setIsLoadingRates(false);
      });
  }, [currentTrip?.baseCurrency]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setReceiptFile(null);
      return;
    }

    const validFormats = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['jpg', 'jpeg', 'png', 'heic', 'heif'].includes(fileExtension || '');
    
    if (!validFormats.includes(file.type) && !isValidExtension) {
      setPhotoError('Invalid format. Accepts JPEG, PNG, HEIC.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('File size exceeds 10MB limit.');
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      payerId: '',
      amount: '',
      currency: currentTrip?.baseCurrency || 'USD',
      category: 'Food',
      description: '',
    },
    validationSchema: Yup.object({
      payerId: Yup.string().required('Select who paid'),
      amount: Yup.number()
        .typeError('Must be a number')
        .positive('Amount must be greater than 0')
        .required('Amount is required'),
      currency: Yup.string().required('Select currency'),
      category: Yup.string().required('Select category'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!currentTrip) return;
      setSubmitError(null);

      if (!rates) {
        setSubmitError('Exchange rates are unavailable. Cannot compute conversion.');
        return;
      }

      if (isOfflineRate && rateFetchedAt) {
        const cacheAgeMs = Date.now() - new Date(rateFetchedAt).getTime();
        if (cacheAgeMs > 24 * 60 * 60 * 1000) {
          setSubmitError('FX Rates are older than 24 hours and cannot be used offline.');
          return;
        }
      }

      try {
        const rate = rates[values.currency];
        if (!rate) {
          throw new Error(`FX rate for ${values.currency} is missing.`);
        }

        const amountOriginal = parseFloat(values.amount);
        const amountBase = convertToBaseCurrency(
          amountOriginal,
          values.currency,
          currentTrip.baseCurrency,
          rates
        );

        const expensePayload = {
          id: crypto.randomUUID(),
          payerId: values.payerId,
          amount: amountBase,
          amountOriginal,
          currency: values.currency,
          fxRate: rate,
          category: values.category as 'Food' | 'Transport' | 'Accommodation' | 'Entertainment' | 'Other',
          description: values.description,
          date: new Date().toISOString(),
          isOfflineRate,
          rateFetchedAt: rateFetchedAt || undefined,
        };

        setIsSubmitting(true);
        const saved = await tripApi.addExpense(currentTrip.id, expensePayload, receiptFile);
        dispatch(addExpenseLocal(saved));

        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToastHasReceipt(!!receiptFile);
        setShowToast(true);
        toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);

        resetForm();
        setPhotoPreview(null);
        setReceiptFile(null);
        const fileInput = document.getElementById('receiptPhoto') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (err) {
        setSubmitError(err instanceof ApiError ? err.message : (err as Error).message || 'Failed to save expense');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!currentTrip || currentTrip.members.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 mt-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2.5 mb-5 text-slate-800 font-bold text-lg">
        <Receipt size={20} className="text-secondary" />
        <h2>Add an Expense</h2>
      </div>

      {isLoadingRates && (
        <div className="text-xs text-primary font-bold mb-4 animate-pulse flex items-center gap-1.5">
          Fetching exchange rates...
        </div>
      )}
      
      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-800 text-xs px-3.5 py-2.5 rounded-xl border border-red-200/60 mb-4 font-medium">
          <AlertCircle size={15} />
          <span>{submitError}</span>
        </div>
      )}

      {ratesError && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200/60 mb-4 font-medium shadow-sm">
          <AlertCircle size={15} />
          <span>{ratesError}</span>
        </div>
      )}

      {isOfflineRate && rateFetchedAt && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 text-xs px-3.5 py-2.5 rounded-xl border border-amber-200/60 mb-4 font-medium shadow-sm">
          <AlertCircle size={15} />
          <span>Rates offline (Cached: {new Date(rateFetchedAt).toLocaleDateString()})</span>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Who paid?
            </label>
            <select
              id="payerId"
              name="payerId"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner cursor-pointer ${
                formik.touched.payerId && formik.errors.payerId 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-secondary/50 focus:ring-secondary/20'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.payerId}
            >
              <option value="" disabled className="bg-white">Select a member</option>
              {currentTrip.members.map((member) => (
                <option key={member.id} value={member.id} className="bg-white">
                  {member.name}
                </option>
              ))}
            </select>
            {formik.touched.payerId && formik.errors.payerId ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.payerId}</div>
            ) : null}
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              id="category"
              name="category"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner cursor-pointer ${
                formik.touched.category && formik.errors.category 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-secondary/50 focus:ring-secondary/20'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
            >
              <option value="Food" className="bg-white">Food</option>
              <option value="Transport" className="bg-white">Transport</option>
              <option value="Accommodation" className="bg-white">Accommodation</option>
              <option value="Entertainment" className="bg-white">Entertainment</option>
              <option value="Other" className="bg-white">Other</option>
            </select>
            {formik.touched.category && formik.errors.category ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.category}</div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-28">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 border-slate-200 focus:border-secondary/50 focus:ring-secondary/20 transition-all shadow-inner font-bold cursor-pointer"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currency}
            >
              {SUPPORTED_CURRENCIES.map((cur) => (
                <option key={cur} value={cur} className="bg-white font-normal">
                  {cur}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="text"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${
                formik.touched.amount && formik.errors.amount 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-secondary/50 focus:ring-secondary/20'
              }`}
              placeholder="0.00"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.amount}</div>
            ) : null}
          </div>

          <div className="flex-[2]">
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all shadow-inner ${
                formik.touched.description && formik.errors.description 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-secondary/50 focus:ring-secondary/20'
              }`}
              placeholder="e.g. Dinner, Taxi"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.description}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            Attach Receipt Photo
          </label>
          <div className="relative flex items-center justify-center gap-2.5 border-2 border-dashed border-slate-200 hover:border-secondary bg-slate-50 hover:bg-slate-100/50 rounded-xl p-4.5 cursor-pointer transition-all text-slate-500 hover:text-slate-700 select-none group">
            <Camera size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            <input
              id="receiptPhoto"
              name="receiptPhoto"
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={handlePhotoChange}
            />
            <span className="text-xs font-semibold tracking-wide uppercase">
              {photoPreview ? 'Photo attached!' : 'Upload JPEG, PNG or HEIC (max 10MB)'}
            </span>
          </div>
          {photoError && <div className="text-red-500 text-xs mt-1.5 font-medium">{photoError}</div>}
          {photoPreview && (
            <div className="mt-3 flex justify-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <img src={photoPreview} alt="Receipt Thumbnail" className="max-h-32 object-contain rounded-lg shadow-sm border border-slate-200" />
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-secondary to-pink-600 hover:from-pink-500 hover:to-pink-650 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-secondary/10 hover:shadow-lg disabled:opacity-60 transition-all mt-4 cursor-pointer text-sm tracking-wide uppercase"
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </div>

    {/* Success Toast */}
    {showToast && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4.5 py-3 rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-500/20 animate-in slide-in-from-bottom-5 duration-300 text-sm font-semibold select-none">
        <CheckCircle2 size={16} className="text-white shrink-0" />
        <span>Expense saved successfully!</span>
        {toastHasReceipt && (
          <span className="flex items-center gap-0.5 bg-emerald-700/60 text-[10px] text-emerald-100 font-bold uppercase px-1.5 py-0.5 rounded-lg border border-emerald-500/20 ml-1">
            📎 Receipt
          </span>
        )}
      </div>
    )}
  </>
);
};
