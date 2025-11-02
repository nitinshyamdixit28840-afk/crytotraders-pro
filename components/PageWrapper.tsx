
import React from 'react';

interface PageWrapperProps {
    title: string;
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-positive-400 pl-4">{title}</h1>
            <div className="bg-navy-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-navy-700/80">
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;