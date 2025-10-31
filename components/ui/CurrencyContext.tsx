import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  currencySymbol: string;
}

const currencySymbols: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
};

const currencyLocales: Record<Currency, string> = {
  NGN: 'en-NG',
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE', // Using German locale for Euro formatting as an example
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('NGN');
  
  const currencySymbol = useMemo(() => currencySymbols[currency], [currency]);

  const formatCurrency = useMemo(() => (
    (value: number, options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}) => {
      const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
      const symbol = currencySymbols[currency];
      const formattedValue = value.toLocaleString(currencyLocales[currency], {
        minimumFractionDigits,
        maximumFractionDigits,
      });
      return `${symbol}${formattedValue}`;
    }
  ), [currency]);

  const value = { currency, setCurrency, formatCurrency, currencySymbol };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
