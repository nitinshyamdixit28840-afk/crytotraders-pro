
import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Cryptocurrency } from '../types';

interface SparklineChartProps {
    data: Cryptocurrency['history'];
    isPositive: boolean;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, isPositive }) => {
    const strokeColor = isPositive ? '#10b981' : '#ef4444';
    
    const yDomain = data.reduce((acc, cur) => {
        return [Math.min(acc[0], cur.low), Math.max(acc[1], cur.high)];
    }, [Infinity, -Infinity]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                    <linearGradient id={`colorGradient-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Line
                    type="monotone"
                    dataKey="close"
                    stroke={strokeColor}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SparklineChart;