
import React from 'react';
import useCryptoData from '../hooks/useCryptoData';
import { Page } from '../types';
import SparklineChart from '../components/SparklineChart';

interface MarketProps {
    navigateTo: (page: Page, cryptoId: string) => void;
}

const Market: React.FC<MarketProps> = ({ navigateTo }) => {
    const cryptoData = useCryptoData();

    return (
        <div className="container mx-auto">
             <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-positive-400 pl-4">Market</h1>
             <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-navy-700 text-left text-xs font-semibold text-navy-600 uppercase">
                                <th className="p-4">#</th>
                                <th className="p-4">Name</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-right">24h %</th>
                                <th className="p-4 text-right">24h High</th>
                                <th className="p-4 text-right">24h Low</th>
                                <th className="p-4 w-32 text-center">Last 7 Days</th>
                                <th className="p-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoData.map((crypto, index) => {
                                const isPositive = crypto.change24h >= 0;
                                return (
                                    <tr 
                                        key={crypto.id} 
                                        className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors duration-200 cursor-pointer"
                                        onClick={() => navigateTo('Trade', crypto.id)}
                                    >
                                        <td className="p-4 text-navy-600">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{crypto.icon}</div>
                                                <div>
                                                    <div className="font-bold text-white">{crypto.name}</div>
                                                    <div className="text-xs text-navy-600">{crypto.symbol}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-semibold text-white">{crypto.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                                        <td className={`p-4 text-right font-semibold ${isPositive ? 'text-positive-400' : 'text-negative-400'}`}>
                                            {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                        </td>
                                        <td className="p-4 text-right text-gray-200">{crypto.high24h.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td className="p-4 text-right text-gray-200">{crypto.low24h.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                        <td className="p-4">
                                            <div className="h-10">
                                                <SparklineChart data={crypto.history} isPositive={isPositive} />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                className="bg-positive-500 hover:bg-positive-400 text-navy-900 font-bold py-1.5 px-4 rounded-md text-sm transition-colors"
                                                onClick={(e) => { e.stopPropagation(); navigateTo('Trade', crypto.id); }}
                                            >
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

export default Market;