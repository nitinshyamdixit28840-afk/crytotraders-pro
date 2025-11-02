
import React, { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import useCryptoData from '../hooks/useCryptoData';
import PageWrapper from '../components/PageWrapper';
import PortfolioPieChart from '../components/PortfolioPieChart';
import { CRYPTOCURRENCIES } from '../constants';
import { Page, Transaction } from '../types';

interface PortfolioProps {
    navigateTo: (page: Page, cryptoId?: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ navigateTo }) => {
    const portfolioContext = useContext(PortfolioContext);
    const cryptoData = useCryptoData();

    if (!portfolioContext) {
        return <PageWrapper title="My Holdings">Loading...</PageWrapper>;
    }

    const { portfolioState } = portfolioContext;
    const { holdings, tradeHistory } = portfolioState;

    const cryptoInfoMap = new Map(CRYPTOCURRENCIES.map(c => [c.id, c]));

    const renderTransactionRow = (tx: Transaction, index: number) => {
        const crypto = tx.cryptoId ? cryptoInfoMap.get(tx.cryptoId) : null;
        const totalValue = tx.price ? tx.amount * tx.price : tx.amount;
        const actionStyle = {
            buy: 'text-positive-400',
            sell: 'text-negative-400',
            borrow: 'text-blue-400',
            repay: 'text-yellow-400'
        }[tx.type];
        
        return (
            <tr key={index} className="hover:bg-navy-700/30 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{new Date(tx.date).toLocaleString()}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold capitalize ${actionStyle}`}>{tx.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{crypto ? `${crypto.name} (${crypto.symbol})` : 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white text-right">{tx.amount.toFixed(6)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white text-right">{tx.price ? tx.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white text-right">{totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            </tr>
        )
    };

    return (
        <PageWrapper title="My Holdings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-white">Your Assets</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-navy-700 text-left text-xs font-semibold text-navy-600 uppercase">
                                    <th className="p-4">Asset</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right">Avg. Buy Price</th>
                                    <th className="p-4 text-right">Current Value</th>
                                    <th className="p-4 text-right">P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.length > 0 ? holdings.map(holding => {
                                    const crypto = cryptoData.find(c => c.id === holding.cryptoId);
                                    const cryptoInfo = cryptoInfoMap.get(holding.cryptoId);
                                    if (!crypto || !cryptoInfo) return null;

                                    const currentValue = holding.amount * crypto.price;
                                    const totalCost = holding.amount * holding.avgBuyPrice;
                                    const profitLoss = currentValue - totalCost;
                                    const isProfit = profitLoss >= 0;

                                    return (
                                        <tr key={holding.cryptoId} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors duration-200 cursor-pointer" onClick={() => navigateTo('Trade', crypto.id)}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{cryptoInfo.icon}</div>
                                                    <div>
                                                        <div className="font-bold text-white">{cryptoInfo.name}</div>
                                                        <div className="text-xs text-navy-600">{cryptoInfo.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-sm text-white">{holding.amount.toFixed(6)}</td>
                                            <td className="p-4 text-right text-sm text-white">{holding.avgBuyPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                            <td className="p-4 text-right text-sm font-bold text-white">{currentValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                            <td className={`p-4 text-right text-sm font-semibold ${isProfit ? 'text-positive-400' : 'text-negative-400'}`}>
                                                {isProfit ? '+' : ''}{profitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-navy-600">You have no holdings. Visit the Market to start trading.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Asset Distribution</h3>
                    <div className="bg-navy-900/50 p-4 rounded-lg h-80">
                        <PortfolioPieChart holdings={holdings} cryptoData={cryptoData} />
                    </div>
                </div>
            </div>
            <div className="mt-8">
                 <h3 className="text-xl font-semibold mb-4 text-white">Trade History</h3>
                 <div className="overflow-x-auto max-h-96">
                     <table className="min-w-full">
                        <thead className="sticky top-0 bg-navy-800">
                            <tr className="border-b border-navy-700 text-left text-xs font-semibold text-navy-600 uppercase">
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Asset</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                                <th className="px-4 py-2 text-right">Price</th>
                                <th className="px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                         <tbody>
                            {tradeHistory.length > 0 ? 
                                [...tradeHistory].reverse().map(renderTransactionRow) : 
                                <tr><td colSpan={6} className="text-center py-8 text-navy-600">No transaction history.</td></tr>
                            }
                         </tbody>
                     </table>
                 </div>
            </div>
        </PageWrapper>
    );
};

export default Portfolio;