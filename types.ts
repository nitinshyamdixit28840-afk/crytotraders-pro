import React from 'react';

export interface Cryptocurrency {
    id: string;
    name: string;
    symbol: string;
    // FIX: Using React.ReactElement instead of JSX.Element to avoid issues with the JSX namespace not being found.
    icon: React.ReactElement;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    history: { time: number; open: number; high: number; low: number; close: number }[];
}

export interface Holding {
    cryptoId: string;
    amount: number;
    avgBuyPrice: number;
}

export interface Portfolio {
    holdings: Holding[];
    walletBalance: number;
    bankLoan: number;
    tradeHistory: Transaction[];
}

export interface Transaction {
    type: 'buy' | 'sell' | 'borrow' | 'repay';
    cryptoId?: string;
    amount: number;
    price?: number;
    date: number;
}

export type Page = 'Dashboard' | 'Market' | 'Trade' | 'Holdings' | 'Trade Bank' | 'Learning Center' | 'Leaderboard' | 'Settings';