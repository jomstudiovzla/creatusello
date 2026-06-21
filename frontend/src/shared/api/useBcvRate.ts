import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { configApi } from './firebaseRepository';

export function useBcvRate() {
  const setExchangeRates = useStore(state => state.setExchangeRates);
  const currentRates = useStore(state => state.exchangeRates);

  useEffect(() => {
    const unsubscribe = configApi.subscribeToBcvRate((rate) => {
      if (rate > 0) {
        // rate is VES per USD
        // We know USD per EUR is currentRates.USD
        const newVesRate = rate * currentRates.USD;
        setExchangeRates({
          EUR: currentRates.EUR,
          USD: currentRates.USD,
          VES: newVesRate
        });
      }
    });
    return () => unsubscribe();
  }, [setExchangeRates, currentRates.EUR, currentRates.USD]);
}
