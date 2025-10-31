import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../ThemeContext';
import { useCurrency } from '../CurrencyContext';

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
  const { theme } = useTheme();
  const { formatCurrency, currencySymbol } = useCurrency();

  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-white">
          <p className="font-semibold mb-2">{`Day: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.stroke, opacity: entry.strokeDasharray ? 0.8 : 1 }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value || 0)}`}
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
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="day" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} />
          <YAxis stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} tickFormatter={(value: number) => `${currencySymbol}${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-black/80 dark:text-white/80">{value}</span>} />
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
