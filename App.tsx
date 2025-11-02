
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { PortfolioProvider } from './context/PortfolioContext';
import { Page } from './types';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import TradePage from './pages/TradePage';
import Portfolio from './pages/Portfolio';
import TradeBank from './pages/TradeBank';
import LearningCenter from './pages/LearningCenter';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import { CRYPTOCURRENCIES } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [selectedCryptoId, setSelectedCryptoId] = useState<string>(CRYPTOCURRENCIES[0].id);

    const navigateTo = useCallback((page: Page, cryptoId?: string) => {
        setCurrentPage(page);
        if (cryptoId) {
            setSelectedCryptoId(cryptoId);
        }
        window.scrollTo(0, 0);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard navigateTo={navigateTo} />;
            case 'Market':
                return <Market navigateTo={navigateTo} />;
            case 'Trade':
                return <TradePage cryptoId={selectedCryptoId} />;
            case 'Holdings':
                return <Portfolio navigateTo={navigateTo} />;
            case 'Trade Bank':
                return <TradeBank />;
            case 'Learning Center':
                return <LearningCenter />;
            case 'Leaderboard':
                return <Leaderboard />;
            case 'Settings':
                return <Settings />;
            default:
                return <Dashboard navigateTo={navigateTo} />;
        }
    };

    return (
        <PortfolioProvider>
            <div className="min-h-screen bg-navy-900 text-gray-200 flex flex-col relative overflow-hidden">
                {/* Aurora Background */}
                <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-positive-500/10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] bg-negative-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-3000"></div>
                     <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] bg-gray-200/5 rounded-full filter blur-3xl animate-pulse animation-delay-5000"></div>
                </div>
                
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Header currentPage={currentPage} navigateTo={navigateTo} />
                    <main className="flex-grow p-4 md:p-6 lg:p-8">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </PortfolioProvider>
    );
};

export default App;