
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Cryptocurrency, Holding } from '../types';

interface PortfolioPieChartProps {
    holdings: Holding[];
    cryptoData: Cryptocurrency[];
}

const COLORS = ['#2dd4bf', '#8b5cf6', '#3b82f6', '#f97316', '#ec4899', '#f59e0b', '#f43f5e'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-navy-800/80 backdrop-blur-sm p-3 rounded-lg border border-navy-600 shadow-lg text-sm">
                <p className="font-bold">{data.name}</p>
                <p>Value: <span className="font-semibold">{data.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></p>
                <p>Percentage: <span className="font-semibold">{data.percent.toFixed(2)}%</span></p>
            </div>
        );
    }
    return null;
};

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ holdings, cryptoData }) => {
    // FIX: Replaced Map with find to avoid type inference issues.
    const chartData = holdings.map(holding => {
        const crypto = cryptoData.find(c => c.id === holding.cryptoId);
        if (!crypto) return null;
        return {
            name: crypto.symbol,
            value: holding.amount * crypto.price,
        };
    }).filter(Boolean) as { name: string; value: number }[];

    const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

    const dataWithPercent = chartData.map(item => ({
        ...item,
        percent: totalValue > 0 ? (item.value / totalValue) * 100 : 0
    }));


    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-navy-600">No assets to display in chart.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                    data={dataWithPercent}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {dataWithPercent.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PortfolioPieChart;