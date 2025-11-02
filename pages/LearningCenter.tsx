
import React, { useState, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import { fetchLearningContent } from '../services/geminiService';

const predefinedTopics = [
    "What is Bitcoin?",
    "How does Ethereum work?",
    "Explain candlestick chart patterns",
    "What is a blockchain?",
    "Beginner crypto trading strategies",
    "What is DeFi (Decentralized Finance)?",
];

const LearningCenter: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [content, setContent] = useState<string>('');
    const [sources, setSources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async (topic: string) => {
        if (!topic) return;
        setIsLoading(true);
        setError(null);
        setContent('');
        setSources([]);
        try {
            const result = await fetchLearningContent(topic);
            setContent(result.text);
            setSources(result.sources);
        } catch (err) {
            setError('Failed to fetch content. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchTerm);
    };

    return (
        <PageWrapper title="Learning Center">
            <p className="text-navy-600 mb-6">Expand your crypto knowledge. Search for a topic or select one of the popular queries below.</p>
            
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g., 'What is market cap?'"
                    className="flex-grow bg-navy-900/50 border border-navy-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-positive-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-positive-500 hover:bg-positive-400 text-navy-900 font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Popular Topics:</h3>
                <div className="flex flex-wrap gap-2">
                    {predefinedTopics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => {
                                setSearchTerm(topic);
                                handleSearch(topic);
                            }}
                            className="bg-navy-700 hover:bg-navy-600 text-gray-200 text-sm py-1 px-3 rounded-full transition-colors"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 min-h-[300px]">
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-positive-400"></div>
                    </div>
                )}
                {error && <p className="text-negative-400 text-center">{error}</p>}
                {content && (
                    <div className="bg-navy-900/50 p-6 rounded-lg prose prose-invert max-w-none prose-p:text-gray-200 prose-headings:text-white">
                        <div className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed">{content}</div>
                        {sources.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-navy-700">
                                <h4 className="font-semibold text-gray-200 mb-2">Sources:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    {sources.map((source, index) => (
                                        <li key={index}>
                                            <a 
                                                href={source.web.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-positive-400 hover:underline"
                                            >
                                                {source.web.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default LearningCenter;