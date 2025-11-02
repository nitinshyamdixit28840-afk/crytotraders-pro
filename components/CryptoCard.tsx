
import React from 'react';
import { Cryptocurrency, Page } from '../types';
import SparklineChart from './SparklineChart';

interface CryptoCardProps {
    crypto: Cryptocurrency;
    navigateTo: (page: Page, cryptoId: string) => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, navigateTo }) => {
    const isPositive = crypto.change24h >= 0;

    return (
        <div 
            className="bg-navy-800/50 backdrop-blur-sm p-4 rounded-xl border border-navy-700 hover:border-positive-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
            onClick={() => navigateTo('Trade', crypto.id)}
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">{crypto.icon}</div>
                        <div>
                            <h3 className="text-md font-bold text-white">{crypto.name}</h3>
                            <p className="text-xs text-navy-600">{crypto.symbol}</p>
                        </div>
                    </div>
                     <div
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            isPositive ? 'bg-positive-500/20 text-positive-400' : 'bg-negative-500/20 text-negative-400'
                        }`}
                    >
                        {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-white mb-2">{crypto.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                    <div className="w-24 h-10 mb-2">
                        <SparklineChart data={crypto.history.slice(-30)} isPositive={isPositive} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoCard;