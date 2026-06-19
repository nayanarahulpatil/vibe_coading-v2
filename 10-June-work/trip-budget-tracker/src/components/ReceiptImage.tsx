import React, { useEffect, useState } from 'react';
import { fetchReceiptBlob } from '../services/apiClient';

interface ReceiptImageProps {
  expenseId: string;
  receiptUrl?: string;
  className?: string;
  onClick?: () => void;
}

export const ReceiptImage: React.FC<ReceiptImageProps> = ({
  expenseId,
  receiptUrl,
  className,
  onClick,
}) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    const load = async () => {
      if (!receiptUrl) return;
      if (receiptUrl.startsWith('data:')) {
        setSrc(receiptUrl);
        return;
      }
      const blobUrl = await fetchReceiptBlob(expenseId);
      if (!cancelled && blobUrl) {
        objectUrl = blobUrl;
        setSrc(blobUrl);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [expenseId, receiptUrl]);

  if (!receiptUrl || !src) return null;

  return (
    <img
      src={src}
      alt="Receipt"
      className={className}
      onClick={onClick}
    />
  );
};
