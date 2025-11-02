import React, { useContext } from 'react';
import { Page } from '../types';
import { PAGES } from '../constants';
import { PortfolioContext } from '../context/PortfolioContext';
import { WalletIcon } from './Icon';

interface HeaderProps {
    currentPage: Page;
    navigateTo: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, navigateTo }) => {
    const portfolio = useContext(PortfolioContext);

    if (!portfolio) {
        return null;
    }
    
    const { portfolioState } = portfolio;

    return (
        <header className="bg-black/20 backdrop-blur-lg border-b border-navy-700/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="mr-8">
                            <h1 className="text-2xl font-bold text-white">
                              <span className="text-positive-400">Crypto</span>Trader
                            </h1>
                            <p className="text-xs text-navy-600 -mt-1">Made by divit dixit</p>
                        </div>
                        <nav className="hidden md:flex items-center space-x-2">
                            {PAGES.map(({ name }) => (
                                <button
                                    key={name}
                                    onClick={() => navigateTo(name)}
                                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        currentPage === name
                                            ? 'text-white'
                                            : 'text-navy-600 hover:text-white'
                                    }`}
                                >
                                    {name}
                                    {currentPage === name && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-positive-400 rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center bg-navy-800/50 border border-navy-700 rounded-lg px-4 py-2">
                         <WalletIcon />
                        <div className="text-right ml-3">
                            <div className="text-xs text-navy-600">Wallet Balance</div>
                            <div className="text-md font-semibold text-white">
                                {portfolioState.walletBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;