
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { useTheme } from '../ThemeContext';
import { useCurrency } from '../CurrencyContext';

interface BarChartData {
  name: string;
  service: string;
  amount: number;
  date?: string | number;
}

interface MergedChartData {
  name: string;
  fullName: string;
  primaryAmount: number | null;
  compareAmount: number | null;
  primaryService: string;
  compareService: string;
  primaryDate: string | number | null;
  compareDate: string | number | null;
}

interface BarChartProps {
  title: string;
  data: BarChartData[];
  compareData?: BarChartData[];
  primaryLabel?: string;
  compareLabel?: string | null;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: MergedChartData;
  }>;
  label?: string;
}

export const BarChartComponent = ({ title, data, compareData, primaryLabel, compareLabel }: BarChartProps) => {
  const { theme } = useTheme();
  const { formatCurrency, currencySymbol } = useCurrency();

  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const chartData: MergedChartData[] = useMemo(() => {
    const dataMap = new Map(data.map(item => [item.name, item]));
    const compareMap = new Map(compareData?.map(item => [item.name, item]) || []);
    
    const topPrimaryNames = data.slice().sort((a,b) => b.amount - a.amount).slice(0, 10).map(d => d.name);
    let allTopNames = new Set(topPrimaryNames);

    if (compareData) {
      compareData.slice().sort((a,b) => b.amount - a.amount).slice(0, 10).forEach(d => allTopNames.add(d.name));
    }
    
    return Array.from(allTopNames).map(name => {
        const primary = dataMap.get(name);
        const compare = compareMap.get(name);
        return {
            name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
            fullName: name,
            primaryAmount: primary?.amount ?? null,
            compareAmount: compare?.amount ?? null,
            primaryService: primary?.service ?? 'N/A',
            compareService: compare?.service ?? 'N/A',
            primaryDate: primary?.date ?? null,
            compareDate: compare?.date ?? null,
        };
    }).sort((a,b) => (b.primaryAmount || 0) - (a.primaryAmount || 0));
  }, [data, compareData]);

  const formatDate = (dateValue: any): string => {
      if (!dateValue) return 'N/A';
      if (typeof dateValue === 'number' && dateValue > 0) {
          try {
              const date = XLSX.SSF.parse_date_code(dateValue);
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${date.d}-${monthNames[date.m - 1]}`;
          } catch (e) { /* fall through */ }
      }
      return String(dateValue);
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-xs text-zinc-900 dark:text-white">
          <p className="font-semibold mb-2">{data.fullName}</p>
          {data.primaryAmount !== null && (
            <div className="mb-1">
              <p className="text-blue-500 dark:text-blue-300 text-sm">{data.primaryService}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Date: {formatDate(data.primaryDate)}</p>
              <p className="text-orange-500 dark:text-orange-400 font-medium">
                {primaryLabel}: {formatCurrency(data.primaryAmount)}
              </p>
            </div>
          )}
           {data.compareAmount !== null && compareLabel && (
            <div>
              <p className="text-blue-500/80 dark:text-blue-300/80 text-sm">{data.compareService}</p>
              <p className="text-zinc-500/80 dark:text-zinc-400/80 text-xs mb-1">Date: {formatDate(data.compareDate)}</p>
              <p className="text-orange-500/80 dark:text-orange-400/80 font-medium">
                {compareLabel}: {formatCurrency(data.compareAmount)}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const isCompareMode = !!(compareData && compareLabel);

  return (
    <div className="h-96 relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barGap={4}
        >
          <defs>
            <linearGradient id="primaryBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EA580C" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="compareBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#D97706" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            stroke={axisColor}
            fontSize={12}
            tick={{ fill: axisColor }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            stroke={axisColor}
            fontSize={12}
            tick={{ fill: axisColor }}
            tickFormatter={(value: number) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
          {isCompareMode && <Legend formatter={(value) => <span className="text-zinc-800 dark:text-white/80">{value}</span>} verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}}/>}
          <Bar 
            dataKey="primaryAmount" 
            name={primaryLabel || 'Amount'}
            fill="url(#primaryBarGradient)"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-300"
          />
          {isCompareMode && (
            <Bar 
              dataKey="compareAmount" 
              name={compareLabel || 'Compare Amount'}
              fill="url(#compareBarGradient)"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity duration-300"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
