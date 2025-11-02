
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { Portfolio, Holding, Transaction } from '../types';
import { INITIAL_WALLET_BALANCE, MAX_BANK_LOAN } from '../constants';

interface PortfolioContextType {
    portfolioState: Portfolio;
    buyCrypto: (cryptoId: string, amount: number, price: number) => boolean;
    sellCrypto: (cryptoId: string, amount: number, price: number) => boolean;
    borrowFromBank: (amount: number) => boolean;
    repayBank: (amount: number) => boolean;
}

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [portfolioState, setPortfolioState] = useState<Portfolio>({
        holdings: [],
        walletBalance: INITIAL_WALLET_BALANCE,
        bankLoan: 0,
        tradeHistory: [],
    });

    const addTransaction = useCallback((transaction: Transaction) => {
        setPortfolioState(prevState => ({
            ...prevState,
            tradeHistory: [...prevState.tradeHistory, transaction],
        }));
    }, []);

    const buyCrypto = useCallback((cryptoId: string, amount: number, price: number): boolean => {
        const cost = amount * price;
        if (portfolioState.walletBalance < cost) {
            return false;
        }

        setPortfolioState(prevState => {
            const existingHolding = prevState.holdings.find(h => h.cryptoId === cryptoId);
            let newHoldings: Holding[];

            if (existingHolding) {
                const totalAmount = existingHolding.amount + amount;
                const totalCost = (existingHolding.avgBuyPrice * existingHolding.amount) + cost;
                const newAvgPrice = totalCost / totalAmount;
                newHoldings = prevState.holdings.map(h =>
                    h.cryptoId === cryptoId ? { ...h, amount: totalAmount, avgBuyPrice: newAvgPrice } : h
                );
            } else {
                newHoldings = [...prevState.holdings, { cryptoId, amount, avgBuyPrice: price }];
            }

            return {
                ...prevState,
                walletBalance: prevState.walletBalance - cost,
                holdings: newHoldings,
            };
        });

        addTransaction({ type: 'buy', cryptoId, amount, price, date: Date.now() });
        return true;
    }, [portfolioState.walletBalance, addTransaction]);

    const sellCrypto = useCallback((cryptoId: string, amount: number, price: number): boolean => {
        const existingHolding = portfolioState.holdings.find(h => h.cryptoId === cryptoId);
        if (!existingHolding || existingHolding.amount < amount) {
            return false;
        }

        const proceeds = amount * price;

        setPortfolioState(prevState => {
            const newHoldings = prevState.holdings
                .map(h =>
                    h.cryptoId === cryptoId ? { ...h, amount: h.amount - amount } : h
                )
                .filter(h => h.amount > 0.000001); // Remove if amount is negligible

            return {
                ...prevState,
                walletBalance: prevState.walletBalance + proceeds,
                holdings: newHoldings,
            };
        });

        addTransaction({ type: 'sell', cryptoId, amount, price, date: Date.now() });
        return true;
    }, [portfolioState.holdings, addTransaction]);

    const borrowFromBank = useCallback((amount: number): boolean => {
        if (portfolioState.bankLoan + amount > MAX_BANK_LOAN) {
            return false;
        }

        setPortfolioState(prevState => ({
            ...prevState,
            walletBalance: prevState.walletBalance + amount,
            bankLoan: prevState.bankLoan + amount,
        }));

        addTransaction({ type: 'borrow', amount, date: Date.now() });
        return true;
    }, [portfolioState.bankLoan, addTransaction]);

    const repayBank = useCallback((amount: number): boolean => {
        if (amount > portfolioState.walletBalance || amount > portfolioState.bankLoan) {
            return false;
        }

        setPortfolioState(prevState => ({
            ...prevState,
            walletBalance: prevState.walletBalance - amount,
            bankLoan: prevState.bankLoan - amount,
        }));

        addTransaction({ type: 'repay', amount, date: Date.now() });
        return true;
    }, [portfolioState.walletBalance, portfolioState.bankLoan, addTransaction]);

    return (
        <PortfolioContext.Provider value={{ portfolioState, buyCrypto, sellCrypto, borrowFromBank, repayBank }}>
            {children}
        </PortfolioContext.Provider>
    );
};
