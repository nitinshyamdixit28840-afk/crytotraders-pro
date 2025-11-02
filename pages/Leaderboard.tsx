
import React from 'react';
import PageWrapper from '../components/PageWrapper';

const mockLeaderboard = [
    { rank: 1, name: 'CryptoKing', profitRatio: '256.7%', totalProfit: '$1,567,890' },
    { rank: 2, name: 'Satoshi Jr.', profitRatio: '212.3%', totalProfit: '$1,212,345' },
    { rank: 3, name: 'MoonLambo', profitRatio: '189.1%', totalProfit: '$989,101' },
    { rank: 4, name: 'DiamondHands', profitRatio: '155.8%', totalProfit: '$855,823' },
    { rank: 5, name: 'ToTheMars', profitRatio: '123.4%', totalProfit: '$723,456' },
    { rank: 6, name: 'EtherWizard', profitRatio: '111.0%', totalProfit: '$611,000' },
    { rank: 7, name: 'BitcoinBillionaire', profitRatio: '98.5%', totalProfit: '$598,500' },
];

const Leaderboard: React.FC = () => {
    return (
        <PageWrapper title="Leaderboard">
            <p className="text-navy-600 mb-6">See how you stack up against the top traders. Rankings are based on weekly profit ratios.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-navy-900 rounded-lg">
                    <thead>
                        <tr className="border-b border-navy-700">
                            <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">Trader</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">Profit Ratio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">Total Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-700">
                        {mockLeaderboard.map((trader) => (
                            <tr key={trader.rank} className="hover:bg-navy-700/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-lg font-bold ${trader.rank <= 3 ? 'text-positive-400' : 'text-white'}`}>
                                        #{trader.rank}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{trader.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-positive-400 font-semibold">{trader.profitRatio}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trader.totalProfit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageWrapper>
    );
};

export default Leaderboard;