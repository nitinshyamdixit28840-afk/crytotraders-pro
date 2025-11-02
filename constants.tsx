
import React from 'react';
// FIX: Import Page type
import { Cryptocurrency, Page } from './types';
import { BtcIcon, EthIcon, XrpIcon, DogeIcon, SolIcon, AdaIcon, LtcIcon } from './components/Icon';

export const INITIAL_WALLET_BALANCE = 10000;
export const MAX_BANK_LOAN = 10000000;

export const CRYPTOCURRENCIES: Omit<Cryptocurrency, 'price' | 'change24h' | 'high24h' | 'low24h' | 'volume24h' | 'history'>[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: <BtcIcon /> },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: <EthIcon /> },
    { id: 'ripple', name: 'Ripple', symbol: 'XRP', icon: <XrpIcon /> },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', icon: <DogeIcon /> },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: <SolIcon /> },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: <AdaIcon /> },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', icon: <LtcIcon /> },
];

export const PAGES: { name: Page }[] = [
    { name: 'Dashboard' },
    { name: 'Market' },
    { name: 'Holdings' },
    { name: 'Trade Bank' },
    { name: 'Learning Center' },
    { name: 'Leaderboard' },
    { name: 'Settings' }
];

// Helper for initial mock data generation
const generateInitialPrice = (symbol: string): number => {
    switch (symbol) {
        case 'BTC': return 50000;
        case 'ETH': return 3000;
        case 'XRP': return 0.52;
        case 'DOGE': return 0.12;
        case 'SOL': return 130;
        case 'ADA': return 0.40;
        case 'LTC': return 75;
        default: return 100;
    }
};

export const generateInitialHistory = (symbol: string) => {
    const basePrice = generateInitialPrice(symbol);
    let lastClose = basePrice;
    const history = [];
    for (let i = 0; i < 60; i++) {
        const open = lastClose;
        const high = open * (1 + (Math.random() - 0.45) * 0.02);
        const low = open * (1 + (Math.random() - 0.55) * 0.02);
        const close = (high + low) / 2 * (1 + (Math.random() - 0.5) * 0.01);
        history.push({ time: Date.now() - (60 - i) * 60000, open, high, low, close });
        lastClose = close;
    }
    return history;
};