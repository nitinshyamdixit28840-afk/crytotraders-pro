
import { useState, useEffect } from 'react';
import { Cryptocurrency } from '../types';
import { CRYPTOCURRENCIES, generateInitialHistory } from '../constants';

const useCryptoData = () => {
    const [cryptoData, setCryptoData] = useState<Cryptocurrency[]>(() => {
        return CRYPTOCURRENCIES.map(crypto => {
            const history = generateInitialHistory(crypto.symbol);
            const initialPrice = history[history.length - 1].close;
            return {
                ...crypto,
                price: initialPrice,
                change24h: (history[history.length - 1].close / history[0].open - 1) * 100,
                high24h: Math.max(...history.map(h => h.high)),
                low24h: Math.min(...history.map(h => h.low)),
                volume24h: Math.random() * 1000000000,
                history,
            };
        });
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCryptoData(prevData =>
                prevData.map(crypto => {
                    const lastHistory = crypto.history[crypto.history.length - 1];
                    const changePercent = (Math.random() - 0.495) * 0.01; // Small random change
                    const newPrice = lastHistory.close * (1 + changePercent);

                    const newHistoryEntry = {
                        time: Date.now(),
                        open: lastHistory.close,
                        high: Math.max(lastHistory.close, newPrice) * (1 + Math.random() * 0.005),
                        low: Math.min(lastHistory.close, newPrice) * (1 - Math.random() * 0.005),
                        close: newPrice,
                    };
                    
                    const newHistory = [...crypto.history.slice(1), newHistoryEntry];
                    const change24h = (newPrice / newHistory[0].open - 1) * 100;

                    return {
                        ...crypto,
                        price: newPrice,
                        change24h,
                        high24h: Math.max(crypto.high24h, newPrice),
                        low24h: Math.min(crypto.low24h, newPrice),
                        history: newHistory,
                    };
                })
            );
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return cryptoData;
};

export default useCryptoData;
