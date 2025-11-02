
import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { MAX_BANK_LOAN } from '../constants';
import PageWrapper from '../components/PageWrapper';

const TradeBank: React.FC = () => {
    const portfolioContext = useContext(PortfolioContext);
    const [borrowAmount, setBorrowAmount] = useState('');
    const [repayAmount, setRepayAmount] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    if (!portfolioContext) return <PageWrapper title="Trade Bank">Loading...</PageWrapper>;

    const { portfolioState, borrowFromBank, repayBank } = portfolioContext;
    const { walletBalance, bankLoan } = portfolioState;

    const availableCredit = MAX_BANK_LOAN - bankLoan;
    const loanPercentage = (bankLoan / MAX_BANK_LOAN) * 100;

    const handleTransaction = (action: 'borrow' | 'repay') => {
        const amountStr = action === 'borrow' ? borrowAmount : repayAmount;
        const setAmountStr = action === 'borrow' ? setBorrowAmount : setRepayAmount;
        const func = action === 'borrow' ? borrowFromBank : repayBank;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            setMessage({ type: 'error', text: `Please enter a valid amount to ${action}.` });
            return;
        }

        if (func(amount)) {
            setMessage({ type: 'success', text: `Successfully ${action === 'borrow' ? 'borrowed' : 'repaid'} ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.` });
            setAmountStr('');
        } else {
            const errorMsg = action === 'borrow' 
                ? 'Borrow failed. Amount exceeds available credit.' 
                : 'Repay failed. Check your wallet balance and loan amount.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <PageWrapper title="Trade Bank">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-navy-800/50 p-6 rounded-lg border border-navy-700">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Wallet Balance</h3>
                    <p className="text-3xl font-bold text-positive-400">{walletBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="bg-navy-800/50 p-6 rounded-lg border border-navy-700">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Current Loan</h3>
                    <p className="text-3xl font-bold text-negative-400">{bankLoan.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="bg-navy-800/50 p-6 rounded-lg border border-navy-700">
                    <h3 className="text-navy-600 text-sm font-medium mb-2">Available Credit</h3>
                    <p className="text-3xl font-bold text-white">{availableCredit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Loan Status</h3>
                <div className="w-full bg-navy-900/50 rounded-full h-4 border border-navy-700">
                    <div 
                        className="bg-gradient-to-r from-negative-500 to-red-500 h-full rounded-full" 
                        style={{ width: `${loanPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-navy-600 mt-1">
                    <span>$0</span>
                    <span>{MAX_BANK_LOAN.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-md text-sm ${message.type === 'success' ? 'bg-positive-500/20 text-positive-300' : 'bg-negative-500/20 text-negative-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-navy-800/50 p-6 rounded-lg border border-navy-700">
                    <h3 className="text-xl font-semibold mb-4 text-white">Borrow Funds</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="borrow-amount" className="block text-sm font-medium text-navy-600">Amount to Borrow ($)</label>
                            <input
                                type="number"
                                id="borrow-amount"
                                value={borrowAmount}
                                onChange={(e) => setBorrowAmount(e.target.value)}
                                placeholder="0.00"
                                className="mt-1 w-full bg-navy-800 border border-navy-700 rounded-md p-2 focus:ring-positive-500 focus:border-positive-500"
                            />
                        </div>
                        <button onClick={() => handleTransaction('borrow')} className="w-full bg-positive-600 hover:bg-positive-500 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            Borrow
                        </button>
                    </div>
                </div>
                <div className="bg-navy-800/50 p-6 rounded-lg border border-navy-700">
                     <h3 className="text-xl font-semibold mb-4 text-white">Repay Loan</h3>
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="repay-amount" className="block text-sm font-medium text-navy-600">Amount to Repay ($)</label>
                            <input
                                type="number"
                                id="repay-amount"
                                value={repayAmount}
                                onChange={(e) => setRepayAmount(e.target.value)}
                                placeholder="0.00"
                                className="mt-1 w-full bg-navy-800 border border-navy-700 rounded-md p-2 focus:ring-positive-500 focus:border-positive-500"
                            />
                        </div>
                        <button onClick={() => handleTransaction('repay')} className="w-full bg-negative-600 hover:bg-negative-500 text-white font-bold py-3 px-4 rounded-md transition-colors">
                            Repay
                        </button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default TradeBank;