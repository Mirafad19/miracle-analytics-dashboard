import { TrendingUp, TrendingDown, DollarSign, Users, Percent } from './Icons';

interface KPICardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'profit' | 'margin' | 'receivables';
  count?: number;
  compareValue?: number;
  compareLabel?: string | null;
}

export const KPICard = ({ title, value, type, count, compareValue, compareLabel }: KPICardProps) => {
  const formatValue = (val: number) => {
    if (type === 'margin') return `${val.toFixed(1)}%`;
    return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const theme = {
    income: { icon: <TrendingUp className="h-6 w-6 text-white" />, bgColor: 'bg-emerald-500/80', barColor: 'bg-emerald-500', dotColor: 'bg-emerald-500' },
    expense: { icon: <TrendingDown className="h-6 w-6 text-white" />, bgColor: 'bg-red-500/80', barColor: 'bg-red-500', dotColor: 'bg-red-500' },
    profit: { icon: <DollarSign className="h-6 w-6 text-white" />, bgColor: 'bg-blue-500/80', barColor: 'bg-blue-500', dotColor: 'bg-blue-500' },
    margin: { icon: <Percent className="h-6 w-6 text-white" />, bgColor: 'bg-purple-500/80', barColor: 'bg-purple-500', dotColor: 'bg-purple-500' },
    receivables: { icon: <Users className="h-6 w-6 text-white" />, bgColor: 'bg-orange-500/80', barColor: 'bg-orange-500', dotColor: 'bg-orange-500' },
  };

  const { icon, bgColor, barColor, dotColor } = theme[type];

  const hasCompare = typeof compareValue === 'number' && compareLabel;
  let percentageChange: number | null = null;
  if (hasCompare && compareValue !== undefined) {
      if (Math.abs(compareValue) < 1e-6) { // Check if compareValue is effectively zero
          percentageChange = value > 0 ? 1000 : 0; // Use a large number to indicate significant change from zero
      } else {
          percentageChange = ((value - compareValue) / Math.abs(compareValue)) * 100;
      }
  }

  return (
    <div className="bg-black rounded-2xl p-4 flex flex-col justify-between min-h-40 relative overflow-hidden border border-zinc-800">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-zinc-200">{title}</p>
        <p className="text-3xl font-extrabold text-white">{formatValue(value)}</p>
        {count && (<p className="text-xs text-zinc-300 mt-1">{count} {count === 1 ? 'patient' : 'patients'}</p>)}

        {hasCompare && percentageChange !== null && (
          <div className={`flex items-center text-xs mt-1 ${percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {percentageChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span>{Math.abs(percentageChange).toFixed(1)}% vs {compareLabel?.substring(0, 3)}</span>
          </div>
        )}
      </div>
      <div className="w-full bg-zinc-800 h-1 rounded-full mt-auto">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${type === 'margin' ? Math.min(Math.abs(value), 100) : 100}%`}}></div>
      </div>
    </div>
  );
};