import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { X, Table, PieChart as PieChartIcon, BarChart3, TrendingUp, FileText } from './Icons';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Legend } from 'recharts';
import { useCurrency } from '../CurrencyContext';
import { useAuth, WorkspaceConfig } from '../AuthContext';

interface FinancialRecord {
  [key: string]: any;
}

interface ExpenseTransactionRecord {
  Date: string | number;
  Purpose: string;
  ExpenseAmount: number;
  Duty: string;
  [key: string]: any;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: 'payment' | 'expense' | null;
  primaryMonthLabel: string;
  paymentData: Array<{ name: string; value: number }>;
  expenseData: Array<{ name: string; value: number }>;
  onSegmentClick: (type: 'payment' | 'expense', segment: string | null, monthContext: 'primary' | 'compare') => void;
  selectedSegmentData: (FinancialRecord | ExpenseTransactionRecord)[];
  selectedSegment: string | null;
  compareMonthLabel: string | null;
  comparePaymentData: Array<{ name: string; value: number }>;
  compareExpenseData: Array<{ name: string; value: number }>;
  detailsContext: 'primary' | 'compare' | null;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

const ActiveShapeWithTooltip = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const { formatCurrency } = useCurrency();
    const RADIAN = Math.PI / 180;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    
    const isRightSide = cos >= 0;

    const tooltipRadius = outerRadius + 35; 
    const x = cx + tooltipRadius * cos;
    const y = cy + tooltipRadius * sin;

    const foreignObjectWidth = 160;
    const foreignObjectHeight = 70;

    const foreignObjectX = isRightSide ? x : x - foreignObjectWidth;
    const foreignObjectY = y - foreignObjectHeight / 2;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke="#000000"
                className="dark:stroke-white"
                strokeWidth={2}
            />
            <foreignObject x={foreignObjectX} y={foreignObjectY} width={foreignObjectWidth} height={foreignObjectHeight} overflow="visible">
              <div
                   className="bg-white/80 dark:bg-black/80 backdrop-blur-xl p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl text-zinc-900 dark:text-white"
                   style={{ textAlign: isRightSide ? 'left' : 'right' }}>
                  <p className="font-medium">{payload.name}</p>
                  <p className="text-blue-500 dark:text-blue-300">{formatCurrency(value)}</p>
              </div>
            </foreignObject>
        </g>
    );
};


const AnalysisBlock = ({
  title,
  paymentData,
  expenseData,
  onPaymentClick,
  onExpenseClick,
  activeSection,
  selectedSegment,
}: {
  title: string;
  paymentData: Array<{ name: string; value: number }>;
  expenseData: Array<{ name: string; value: number }>;
  onPaymentClick: (segment: string) => void;
  onExpenseClick: (segment: string) => void;
  activeSection: 'payment' | 'expense' | null;
  selectedSegment: string | null;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const [clickedIndex, setClickedIndex] = useState<number | undefined>(undefined);

  const activeIndex = clickedIndex !== undefined ? clickedIndex : hoveredIndex;
  const chartData = activeSection === 'payment' ? paymentData : expenseData;

  const handleClick = (name: string, index: number) => {
      const isCurrentlyClicked = clickedIndex === index && selectedSegment === name;
      
      if (isCurrentlyClicked) {
          setClickedIndex(undefined);
          if (activeSection === 'payment') onPaymentClick('');
          else onExpenseClick('');
      } else {
          setClickedIndex(index);
          if (activeSection === 'payment') onPaymentClick(name);
          else onExpenseClick(name);
      }
  };
  
  const handleLegendClick = (data: any) => {
    const { value } = data; // legend name
    const index = chartData.findIndex(item => item.name === value);
    if (index !== -1) {
      handleClick(value, index);
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black dark:text-white mb-0 text-center">{title}</h3>
      {activeSection === 'payment' && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-green-500 dark:text-green-400"/>Revenue by Payment Method</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart onMouseLeave={() => setHoveredIndex(undefined)}><Pie data={paymentData} cx="50%" cy="45%" outerRadius={90} innerRadius={55} dataKey="value" onClick={(_, index) => handleClick(paymentData[index].name, index)} onMouseEnter={(_, index) => setHoveredIndex(index)} activeIndex={activeIndex} activeShape={ActiveShapeWithTooltip} className="cursor-pointer" paddingAngle={2}>{paymentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" className="hover:opacity-80 transition-opacity" />))}</Pie><Legend verticalAlign="bottom" align="center" iconType="square" iconSize={10} wrapperStyle={{ paddingTop: '20px', paddingBottom: '0px' }} formatter={(value) => <span className="text-black dark:text-white text-xs pl-2 pr-4 cursor-pointer">{value}</span>} onClick={handleLegendClick} /></PieChart></ResponsiveContainer></div></CardContent>
        </Card>
      )}
      {activeSection === 'expense' && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-red-500 dark:text-red-400"/>Expense Distribution</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart onMouseLeave={() => setHoveredIndex(undefined)}><Pie data={expenseData} cx="50%" cy="45%" outerRadius={90} innerRadius={55} dataKey="value" onClick={(_, index) => handleClick(expenseData[index].name, index)} onMouseEnter={(_, index) => setHoveredIndex(index)} activeIndex={activeIndex} activeShape={ActiveShapeWithTooltip} className="cursor-pointer" paddingAngle={2}>{expenseData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" className="hover:opacity-80 transition-opacity"/>))}</Pie><Legend verticalAlign="bottom" align="center" iconType="square" iconSize={10} wrapperStyle={{ paddingTop: '20px', paddingBottom: '0px' }} formatter={(value) => <span className="text-black dark:text-white text-xs pl-2 pr-4 cursor-pointer">{value}</span>} onClick={handleLegendClick} /></PieChart></ResponsiveContainer></div></CardContent>
        </Card>
      )}
    </div>
  );
};


export const Sidebar = ({ 
  isOpen, onClose, activeSection, 
  primaryMonthLabel, paymentData, expenseData, onSegmentClick, 
  selectedSegmentData, selectedSegment, 
  compareMonthLabel, comparePaymentData, compareExpenseData,
  detailsContext
}: SidebarProps) => {
  const { formatCurrency } = useCurrency();
  const { workspaceConfig } = useAuth();

  const formatDate = (dateValue: unknown): string => {
    if (!dateValue) return 'N/A';
    if (typeof dateValue === 'string' && /^\d{1,2}-[A-Za-z]{3}$/.test(dateValue)) return dateValue;
    if (typeof dateValue === 'number' && dateValue > 0) {
      try {
        const date = XLSX.SSF.parse_date_code(dateValue);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.d}-${monthNames[date.m - 1]}`;
      } catch (e) { return String(dateValue); }
    }
    return String(dateValue);
  };
  
  const handleSegmentClick = (type: 'payment' | 'expense', segment: string | null, context: 'primary' | 'compare') => {
      const isCurrentlySelected = detailsContext === context && selectedSegment === segment;
      const newSegment = isCurrentlySelected ? null : segment;
      onSegmentClick(type, newSegment, context);
  };
  
  const handleSectionChange = (section: 'payment' | 'expense') => {
      onSegmentClick(section, null, 'primary'); // Reset selection when changing section
  }

  const isExpenseRecord = (record: any): record is ExpenseTransactionRecord => 'ExpenseAmount' in record;
  const isCompareMode = !!compareMonthLabel;
  
  const totalSelectedAmount = selectedSegmentData.reduce((sum, record) => {
    if (workspaceConfig && !isExpenseRecord(record) && record[workspaceConfig.incomeField]) {
      return sum + record[workspaceConfig.incomeField];
    }
    if (isExpenseRecord(record)) {
      return sum + record.ExpenseAmount;
    }
    return sum;
  }, 0);

  if (!isOpen) return null;

  const totalPrimaryRevenue = paymentData.reduce((s, i) => s + i.value, 0);
  const totalPrimaryExpenses = expenseData.reduce((s, i) => s + i.value, 0);
  const totalCompareRevenue = isCompareMode ? comparePaymentData.reduce((s, i) => s + i.value, 0) : 0;
  const totalCompareExpenses = isCompareMode ? compareExpenseData.reduce((s, i) => s + i.value, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-white dark:bg-black shadow-2xl overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><BarChart3 className="h-6 w-6 text-purple-500 dark:text-purple-400" /></div><h2 className="text-2xl font-bold text-black dark:text-white">Detailed Analytics</h2></div>
          <Button onClick={onClose} className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-2 h-auto"><X className="h-5 w-5" /></Button>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => handleSectionChange('payment')} className={`${activeSection === 'payment' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white'} transition-all`}><PieChartIcon className="h-4 w-4 mr-2" />Payment Mode Analysis</Button>
          <Button onClick={() => handleSectionChange('expense')} className={`${activeSection === 'expense' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : 'bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white'} transition-all`}><TrendingUp className="h-4 w-4 mr-2" />Expenditures Analysis</Button>
        </div>

        <div className={isCompareMode ? "grid md:grid-cols-2 gap-6" : ""}>
          <AnalysisBlock 
            title={primaryMonthLabel}
            paymentData={paymentData}
            expenseData={expenseData}
            onPaymentClick={(segment) => handleSegmentClick('payment', segment, 'primary')}
            onExpenseClick={(segment) => handleSegmentClick('expense', segment, 'primary')}
            activeSection={activeSection}
            selectedSegment={detailsContext === 'primary' ? selectedSegment : null}
          />
          {isCompareMode && compareMonthLabel && (
             <AnalysisBlock 
              title={compareMonthLabel}
              paymentData={comparePaymentData}
              expenseData={compareExpenseData}
              onPaymentClick={(segment) => handleSegmentClick('payment', segment, 'compare')}
              onExpenseClick={(segment) => handleSegmentClick('expense', segment, 'compare')}
              activeSection={activeSection}
              selectedSegment={detailsContext === 'compare' ? selectedSegment : null}
            />
          )}
        </div>
            
        {selectedSegment && selectedSegmentData.length > 0 && workspaceConfig && (
          <div className="mt-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <CardTitle className="flex items-center gap-2">
                            <Table className="h-5 w-5 text-blue-500 dark:text-blue-400"/>
                            {selectedSegment} Transactions for {detailsContext === 'primary' ? primaryMonthLabel : compareMonthLabel} ({selectedSegmentData.length})
                        </CardTitle>
                        <div className={`text-xl font-bold ${activeSection === 'payment' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            Total: {formatCurrency(totalSelectedAmount)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                            {activeSection === 'payment' ? (
                                <>
                                    <thead><tr className="sticky top-0 bg-gray-100 dark:bg-zinc-950 backdrop-blur-sm"><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Date</th><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Patient Name</th><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Purpose</th><th className="p-3 text-right text-zinc-600 dark:text-zinc-300">Amount</th></tr></thead>
                                    <tbody>{selectedSegmentData.map((record, index) => !isExpenseRecord(record) && (<tr key={index} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 even:bg-gray-50/40 dark:even:bg-black/40"><td className="p-3 text-blue-600 dark:text-blue-300">{formatDate(record[workspaceConfig.dateField])}</td><td className="p-3 text-black dark:text-white">{record[workspaceConfig.nameField] || 'N/A'}</td><td className="p-3 text-zinc-700 dark:text-zinc-300">{record[workspaceConfig.purposeField] || 'N/A'}</td><td className="p-3 text-right text-green-600 dark:text-green-400 font-medium">{formatCurrency(record[workspaceConfig.incomeField])}</td></tr>))}</tbody>
                                </>
                            ) : (
                                <>
                                    <thead><tr className="sticky top-0 bg-gray-100 dark:bg-zinc-950 backdrop-blur-sm"><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Date</th><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Duty</th><th className="p-3 text-left text-zinc-600 dark:text-zinc-300">Purpose</th><th className="p-3 text-right text-zinc-600 dark:text-zinc-300">Amount</th></tr></thead>
                                    <tbody>{selectedSegmentData.map((record, index) => isExpenseRecord(record) && (<tr key={index} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 even:bg-gray-50/40 dark:even:bg-black/40"><td className="p-3 text-blue-600 dark:text-blue-300">{formatDate(record.Date)}</td><td className="p-3 text-black dark:text-white">{record.Duty || 'N/A'}</td><td className="p-3 text-zinc-700 dark:text-zinc-300">{record.Purpose || 'N/A'}</td><td className="p-3 text-right text-red-500 dark:text-red-400 font-medium">{formatCurrency(record.ExpenseAmount)}</td></tr>))}</tbody>
                                </>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-purple-500 dark:text-purple-400"/>Quick Statistics</CardTitle></CardHeader>
            <CardContent>
                <div className={isCompareMode ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"}>
                    <div className={isCompareMode ? "text-center border-r border-zinc-200 dark:border-zinc-700 pr-4" : "text-center"}>
                        {isCompareMode && <h4 className="text-lg font-semibold text-black dark:text-white mb-2">{primaryMonthLabel}</h4>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="text-center"><div className="text-2xl font-bold text-green-500 dark:text-green-400">{formatCurrency(totalPrimaryRevenue)}</div><div className="text-sm text-zinc-600 dark:text-zinc-400">Total Revenue</div></div>
                          <div className="text-center"><div className="text-2xl font-bold text-red-500 dark:text-red-400">{formatCurrency(totalPrimaryExpenses)}</div><div className="text-sm text-zinc-600 dark:text-zinc-400">Total Expenses</div></div>
                        </div>
                    </div>
                    {isCompareMode && (
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-black dark:text-white mb-2">{compareMonthLabel}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="text-center"><div className="text-2xl font-bold text-green-500 dark:text-green-400">{formatCurrency(totalCompareRevenue)}</div><div className="text-sm text-zinc-600 dark:text-zinc-400">Total Revenue</div></div>
                              <div className="text-center"><div className="text-2xl font-bold text-red-500 dark:text-red-400">{formatCurrency(totalCompareExpenses)}</div><div className="text-sm text-zinc-600 dark:text-zinc-400">Total Expenses</div></div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
