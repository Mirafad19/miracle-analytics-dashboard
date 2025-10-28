
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  onSegmentClick?: (segment: string) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

export const PieChartComponent = ({ title, data, onSegmentClick }: PieChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-xl">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-blue-300">₦{data.value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = (props: any) => {
    const { value } = props;
    if (onSegmentClick) {
      onSegmentClick(value);
    }
  };

  return (
    <div className="h-80 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius="85%"
            innerRadius="50%"
            dataKey="value"
            onClick={(data) => onSegmentClick?.(data.name)}
            className="cursor-pointer"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity"
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom"
            align="center"
            iconType="square"
            iconSize={10}
            wrapperStyle={{ paddingTop: '20px', paddingBottom: '0px' }}
            formatter={(value) => <span className="text-white text-xs pl-2 pr-4 cursor-pointer">{value}</span>}
            onClick={handleLegendClick}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};