import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface MergedTrendData {
  day: string;
  income: number | null;
  expenses: number | null;
  netProfit: number | null;
  compareIncome: number | null;
  compareExpenses: number | null;
  compareNetProfit: number | null;
}

interface TrendChartProps {
  data: MergedTrendData[];
  compareLabel: string | null;
}

export const TrendChart = ({ data, compareLabel }: TrendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-2xl">
          <p className="text-white font-semibold mb-2">{`Day: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.stroke, opacity: entry.strokeDasharray ? 0.8 : 1 }} className="text-sm">
              {`${entry.name}: ₦${(entry.value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const compareLabelShort = compareLabel?.substring(0, 3);

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} />
          <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tick={{ fill: 'rgba(255,255,255,0.7)' }} tickFormatter={(value: number) => `₦${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-white/80">{value}</span>} />
          <Line connectNulls type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8, style: { filter: 'url(#glow)', stroke: '#10B981' } }} />
          <Line connectNulls type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8, style: { filter: 'url(#glow)', stroke: '#EF4444' } }} />
          <Line connectNulls type="monotone" dataKey="netProfit" name="Net Profit" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 8, style: { filter: 'url(#glow)', stroke: '#3B82F6' } }} />
          
          {compareLabel && (
            <>
              <Line connectNulls type="monotone" dataKey="compareIncome" name={`Income (${compareLabelShort})`} stroke="#10B981" strokeDasharray="5 5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line connectNulls type="monotone" dataKey="compareExpenses" name={`Expenses (${compareLabelShort})`} stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line connectNulls type="monotone" dataKey="compareNetProfit" name={`Net Profit (${compareLabelShort})`} stroke="#3B82F6" strokeDasharray="5 5" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};