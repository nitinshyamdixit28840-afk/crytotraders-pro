
import React from 'react';
import PageWrapper from '../components/PageWrapper';

const Settings: React.FC = () => {
    return (
        <PageWrapper title="Settings">
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium text-white">Profile</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-navy-600">Username</label>
                            <input type="text" name="username" id="username" defaultValue="CryptoKing" className="mt-1 block w-full bg-navy-900 border border-navy-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-positive-500 focus:border-positive-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-navy-600">Email Address</label>
                            <input type="email" name="email" id="email" defaultValue="trader@example.com" className="mt-1 block w-full bg-navy-900 border border-navy-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-positive-500 focus:border-positive-500 sm:text-sm" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-white">Theme Customization</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="flex-grow flex flex-col">
                                <span className="text-sm font-medium text-gray-200">Dark Mode</span>
                                <span className="text-sm text-navy-600">Currently enabled</span>
                            </span>
                            <button type="button" className="bg-navy-700 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-not-allowed transition-colors ease-in-out duration-200">
                                <span className="sr-only">Use setting</span>
                                <span aria-hidden="true" className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-positive-400 shadow transform ring-0 transition ease-in-out duration-200"></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                             <label htmlFor="chart-color" className="block text-sm font-medium text-gray-200">Chart Color</label>
                             <select id="chart-color" name="chart-color" className="mt-1 block w-1/2 bg-navy-900 border border-navy-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-positive-500 focus:border-positive-500 sm:text-sm">
                                <option>Teal (Default)</option>
                                <option>Emerald</option>
                                <option>Violet</option>
                             </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="button" className="bg-positive-500 hover:bg-positive-400 text-navy-900 font-bold py-2 px-6 rounded-md transition-colors duration-300">
                        Save Changes
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Settings;