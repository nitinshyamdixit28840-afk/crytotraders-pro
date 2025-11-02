
import React, { useContext, useState, useMemo } from 'react';
import useCryptoData from '../hooks/useCryptoData';
import { PortfolioContext } from '../context/PortfolioContext';
import CandleStickChart from '../components/CandleStickChart';

interface TradePageProps {
    cryptoId: string;
}

const TradePage: React.FC<TradePageProps> = ({ cryptoId }) => {
    const allCryptoData = useCryptoData();
    const portfolioContext = useContext(PortfolioContext);
    
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const crypto = useMemo(() => allCryptoData.find(c => c.id === cryptoId), [allCryptoData, cryptoId]);

    if (!crypto || !portfolioContext) {
        return <div className="text-center py-10">Loading crypto data...</div>;
    }

    const { portfolioState, buyCrypto, sellCrypto } = portfolioContext;
    const isPositive = crypto.change24h >= 0;
    
    const userHolding = portfolioState.holdings.find(h => h.cryptoId === crypto.id)?.amount || 0;
    const totalCost = parseFloat(amount) * crypto.price;

    const handleTrade = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid amount.' });
            return;
        }

        let success = false;
        if (activeTab === 'buy') {
            success = buyCrypto(crypto.id, numericAmount, crypto.price);
            setMessage(success ? { type: 'success', text: `Successfully bought ${numericAmount} ${crypto.symbol}.` } : { type: 'error', text: 'Insufficient funds.' });
        } else {
            success = sellCrypto(crypto.id, numericAmount, crypto.price);
            setMessage(success ? { type: 'success', text: `Successfully sold ${numericAmount} ${crypto.symbol}.` } : { type: 'error', text: 'Insufficient holdings.' });
        }
        if (success) {
            setAmount('');
        }
    };
    
    const setAmountByPercentage = (percentage: number) => {
        if (activeTab === 'buy') {
            const value = (portfolioState.walletBalance / crypto.price) * percentage;
            setAmount(value.toFixed(8));
        } else {
            const value = userHolding * percentage;
            setAmount(value.toFixed(8));
        }
    }

    return (
        <div className="container mx-auto">
             <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{crypto.icon}</div>
                <div>
                    <h1 className="text-4xl font-bold text-white">{crypto.name} <span className="text-2xl text-navy-600">{crypto.symbol}</span></h1>
                    <div className="flex items-baseline gap-4 mt-1">
                        <div className="text-3xl font-bold text-white">{crypto.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                        <div className={`text-lg font-semibold ${isPositive ? 'text-positive-400' : 'text-negative-400'}`}>
                            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-navy-800/50 backdrop-blur-sm p-4 rounded-xl border border-navy-700/80">
                     <div className="h-[400px] md:h-[500px]">
                        <CandleStickChart data={crypto.history} isPositive={isPositive} />
                    </div>
                </div>
                <div className="bg-navy-800/50 backdrop-blur-sm p-6 rounded-xl border border-navy-700/80 flex flex-col">
                    <div className="flex bg-navy-900/50 p-1 rounded-lg mb-6">
                        <button onClick={() => {setActiveTab('buy'); setAmount('')}} className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${activeTab === 'buy' ? 'bg-positive-500 text-white shadow' : 'text-navy-600 hover:bg-navy-700/50'}`}>Buy</button>
                        <button onClick={() => {setActiveTab('sell'); setAmount('')}} className={`flex-1 py-2 font-semibold text-sm rounded-md transition-all ${activeTab === 'sell' ? 'bg-negative-500 text-white shadow' : 'text-navy-600 hover:bg-navy-700/50'}`}>Sell</button>
                    </div>

                    <div className="space-y-4 flex-grow flex flex-col">
                         <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="amount" className="block text-sm font-medium text-navy-600">Amount</label>
                                <span className="text-xs text-navy-600">
                                    {activeTab === 'buy' ? 'Balance' : 'Holding'}: {
                                        activeTab === 'buy' 
                                        ? `${portfolioState.walletBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` 
                                        : `${userHolding.toFixed(6)} ${crypto.symbol}`
                                    }
                                </span>
                            </div>
                            <div className="relative mt-1">
                                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-navy-900/50 border border-navy-700 rounded-lg p-3 pr-16 focus:ring-2 focus:ring-positive-500 focus:outline-none" />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-navy-600 font-bold">{crypto.symbol}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between gap-2">
                            {[0.25, 0.50, 0.75, 1.0].map(pct => (
                                <button key={pct} onClick={() => setAmountByPercentage(pct)} className="flex-1 bg-navy-700/50 hover:bg-navy-700 text-xs text-gray-200 py-1 rounded-md">{pct * 100}%</button>
                            ))}
                        </div>

                        {!isNaN(totalCost) && totalCost > 0 && (
                            <div className="p-3 bg-navy-900/50 rounded-lg text-center">
                                <div className="text-sm text-navy-600">Total {activeTab === 'buy' ? 'Cost' : 'Value'}</div>
                                <div className="text-lg font-semibold text-white">{totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                            </div>
                        )}
                        <div className="flex-grow"></div>
                        <button 
                            onClick={handleTrade} 
                            className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-white text-lg shadow-lg hover:scale-105
                            ${activeTab === 'buy' 
                                ? 'bg-positive-500 hover:bg-positive-400 shadow-positive-500/20' 
                                : 'bg-negative-500 hover:bg-negative-400 shadow-negative-500/20'}`
                            }>
                            {activeTab === 'buy' ? `Buy ${crypto.symbol}` : `Sell ${crypto.symbol}`}
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.type === 'success' ? 'bg-positive-500/20 text-positive-400' : 'bg-negative-500/20 text-negative-400'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TradePage;