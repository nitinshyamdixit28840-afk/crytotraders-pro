
import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Line, CartesianGrid, Cell } from 'recharts';
import { Cryptocurrency } from '../types';

interface CandleStickChartProps {
    data: Cryptocurrency['history'];
    isPositive: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const formatOptions = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 };
        return (
            <div className="bg-navy-800/80 backdrop-blur-sm p-3 rounded-lg border border-navy-600 shadow-lg text-sm">
                <p className="text-gray-200">{new Date(data.time).toLocaleString()}</p>
                <p>Open: <span className="font-semibold">{data.open.toLocaleString('en-US', formatOptions)}</span></p>
                <p>High: <span className="font-semibold text-positive-400">{data.high.toLocaleString('en-US', formatOptions)}</span></p>
                <p>Low: <span className="font-semibold text-negative-400">{data.low.toLocaleString('en-US', formatOptions)}</span></p>
                <p>Close: <span className="font-semibold">{data.close.toLocaleString('en-US', formatOptions)}</span></p>
            </div>
        );
    }
    return null;
};


const CandleStickChart: React.FC<CandleStickChartProps> = ({ data, isPositive }) => {
    const strokeColor = isPositive ? '#2dd4bf' : '#f43f5e';

    const dataWithRanges = data.map(d => ({
        ...d,
        wick: [d.low, d.high],
        body: [d.open, d.close],
        color: d.close >= d.open ? '#2dd4bf' : '#f43f5e',
    }));

    const yDomain = data.reduce((acc, cur) => {
        return [Math.min(acc[0], cur.low), Math.max(acc[1], cur.high)];
    }, [Infinity, -Infinity]);

    const padding = (yDomain[1] - yDomain[0]) * 0.1;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataWithRanges} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242424" />
                <XAxis 
                    dataKey="time" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    stroke="#a0a0a0"
                    tick={{ fontSize: 12 }}
                />
                <YAxis 
                    domain={[yDomain[0] - padding, yDomain[1] + padding]}
                    orientation="right"
                    stroke="#a0a0a0"
                    tickFormatter={(value) => Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <Bar dataKey="wick" barSize={1} >
                    {dataWithRanges.map((entry, index) => (
                        <Cell key={`cell-wick-${index}`} fill={entry.color} />
                    ))}
                </Bar>
                <Bar dataKey="body" barSize={7}>
                    {dataWithRanges.map((entry, index) => (
                        <Cell key={`cell-body-${index}`} fill={entry.color} />
                    ))}
                </Bar>

                <Line type="monotone" dataKey="close" stroke={strokeColor} strokeWidth={2} dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default CandleStickChart;