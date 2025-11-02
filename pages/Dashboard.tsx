
import React, { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import useCryptoData from '../hooks/useCryptoData';
import { Page, Transaction } from '../types';
import CryptoCard from '../components/CryptoCard';
import PortfolioPieChart from '../components/PortfolioPieChart';
import { CRYPTOCURRENCIES } from '../constants';

interface DashboardProps {
    navigateTo: (page: Page, cryptoId?: string) => void;
}

const RecentTransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const crypto = CRYPTOCURRENCIES.find(c => c.id === transaction.cryptoId);
    const isCredit = transaction.type === 'sell' || transaction.type === 'borrow';
    const sign = isCredit ? '+' : '-';
    
    const title = {
        buy: `Bought ${crypto?.symbol}`,
        sell: `Sold ${crypto?.symbol}`,
        borrow: 'Borrowed from Bank',
        repay: 'Repaid to Bank'
    }[transaction.type];

    const value = transaction.price ? transaction.amount * transaction.price : transaction.amount;

    return (
        <div className="flex justify-between items-center py-2 text-sm">
            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-xs text-navy-600">{new Date(transaction.date).toLocaleString()}</p>
            </div>
            <div className={`font-bold ${isCredit ? 'text-positive-400' : 'text-negative-400'}`}>
                {sign} {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
        </div>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
    const portfolioContext = useContext(PortfolioContext);
    const cryptoData = useCryptoData();

    if (!portfolioContext) return null;
    const { portfolioState } = portfolioContext;

    const portfolioValue = portfolioState.holdings.reduce((total, holding) => {
        const crypto = cryptoData.find(c => c.id === holding.cryptoId);
        return total + (crypto ? crypto.price * holding.amount : 0);
    }, 0);

    const totalAssets = portfolioValue + portfolioState.walletBalance;
    const initialTotalAssets = 10000;
    const profitLoss = totalAssets - initialTotalAssets - portfolioState.bankLoan;
    const isProfit = profitLoss >= 0;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-navy-800/50 backdrop-blur-sm p-6 rounded-xl border border-navy-700/80">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Total Portfolio Value</h3>
                    <p className="text-4xl font-bold text-white">{totalAssets.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="bg-navy-800/50 backdrop-blur-sm p-6 rounded-xl border border-navy-700/80">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Unrealized P/L</h3>
                    <p className={`text-4xl font-bold ${isProfit ? 'text-positive-400' : 'text-negative-400'}`}>
                       {isProfit ? '+' : ''}{profitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                <div className="bg-navy-800/50 backdrop-blur-sm p-6 rounded-xl border border-positive-500/50 shadow-positive-glow">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Available to Trade</h3>
                    <p className="text-4xl font-bold text-positive-400">{portfolioState.walletBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-4">Market Movers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cryptoData.slice(0, 4).map(crypto => (
                            <CryptoCard key={crypto.id} crypto={crypto} navigateTo={navigateTo} />
                        ))}
                    </div>
                </div>
                 <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Asset Distribution</h2>
                         <div className="bg-navy-800/50 backdrop-blur-sm p-4 rounded-xl border border-navy-700/80 h-[244px]">
                             <PortfolioPieChart holdings={portfolioState.holdings} cryptoData={cryptoData} />
                         </div>
                    </div>
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
                         <div className="bg-navy-800/50 backdrop-blur-sm p-4 rounded-xl border border-navy-700/80">
                             {portfolioState.tradeHistory.length > 0 ? (
                                <div className="divide-y divide-navy-700">
                                    {portfolioState.tradeHistory.slice(-4).reverse().map((tx, i) => <RecentTransactionRow key={i} transaction={tx} />)}
                                </div>
                             ) : (
                                <p className="text-navy-600 text-center py-8">No recent transactions.</p>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;