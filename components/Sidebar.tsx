import React from 'react';
import * as XLSX from 'xlsx';
import { X, Table, PieChart as PieChartIcon, BarChart3, TrendingUp, FileText } from './Icons';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FinancialRecord {
  'Amt. Paid': number;
  'Date': string | number;
  'Purpose': string;
  'Name': string;
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-black/80 backdrop-blur-xl p-3 rounded-lg border border-zinc-800 shadow-xl">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-blue-300">₦{data.value.toLocaleString('en-NG')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-0 text-center">{title}</h3>
      {activeSection === 'payment' && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-green-400"/>Revenue by Payment Method</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" onClick={(data) => onPaymentClick(data.name)} className="cursor-pointer">{paymentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={activeSection === 'payment' && selectedSegment === entry.name ? '#ffffff' : 'transparent'} strokeWidth={3} className="hover:opacity-80 transition-opacity" />))}</Pie><Tooltip content={<CustomTooltip />} /><Legend formatter={(value) => <span className="text-white text-xs cursor-pointer">{value}</span>} iconType="square" onClick={(data) => onPaymentClick(data.value)} /></PieChart></ResponsiveContainer></div></CardContent>
        </Card>
      )}
      {activeSection === 'expense' && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-red-400"/>Expense Distribution</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expenseData} cx="50%" cy="50%" outerRadius={100} dataKey="value" onClick={(data) => onExpenseClick(data.name)} className="cursor-pointer">{expenseData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={activeSection === 'expense' && selectedSegment === entry.name ? '#ffffff' : 'transparent'} strokeWidth={3} className="hover:opacity-80 transition-opacity" />))}</Pie><Tooltip content={<CustomTooltip />} /><Legend formatter={(value) => <span className="text-white text-xs cursor-pointer">{value}</span>} iconType="square" onClick={(data) => onExpenseClick(data.value)} /></PieChart></ResponsiveContainer></div></CardContent>
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

  const isFinancialRecord = (record: any): record is FinancialRecord => 'Amt. Paid' in record;
  const isExpenseRecord = (record: any): record is ExpenseTransactionRecord => 'ExpenseAmount' in record;
  const isCompareMode = !!compareMonthLabel;

  if (!isOpen) return null;

  const totalPrimaryRevenue = paymentData.reduce((s, i) => s + i.value, 0);
  const totalPrimaryExpenses = expenseData.reduce((s, i) => s + i.value, 0);
  const totalCompareRevenue = isCompareMode ? comparePaymentData.reduce((s, i) => s + i.value, 0) : 0;
  const totalCompareExpenses = isCompareMode ? compareExpenseData.reduce((s, i) => s + i.value, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-black shadow-2xl overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800"><BarChart3 className="h-6 w-6 text-purple-400" /></div><h2 className="text-2xl font-bold text-white">Detailed Analytics</h2></div>
          <Button onClick={onClose} className="text-white hover:bg-white/10 rounded-full p-2 h-auto"><X className="h-5 w-5" /></Button>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => handleSectionChange('payment')} className={`${activeSection === 'payment' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-black border border-zinc-700 text-zinc-200 hover:bg-zinc-900 hover:text-white'} transition-all`}><PieChartIcon className="h-4 w-4 mr-2" />Payment Mode Analysis</Button>
          <Button onClick={() => handleSectionChange('expense')} className={`${activeSection === 'expense' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : 'bg-black border border-zinc-700 text-zinc-200 hover:bg-zinc-900 hover:text-white'} transition-all`}><TrendingUp className="h-4 w-4 mr-2" />Expenditures Analysis</Button>
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
            
        {selectedSegment && selectedSegmentData.length > 0 && (
          <div className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Table className="h-5 w-5 text-blue-400"/>
                        {selectedSegment} Transactions for {detailsContext === 'primary' ? primaryMonthLabel : compareMonthLabel} ({selectedSegmentData.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                            {activeSection === 'payment' ? (
                                <>
                                    <thead><tr className="sticky top-0 bg-zinc-950 backdrop-blur-sm"><th className="p-3 text-left text-zinc-300">Date</th><th className="p-3 text-left text-zinc-300">Patient Name</th><th className="p-3 text-left text-zinc-300">Purpose</th><th className="p-3 text-right text-zinc-300">Amount</th></tr></thead>
                                    <tbody>{selectedSegmentData.map((record, index) => isFinancialRecord(record) && (<tr key={index} className="border-b border-zinc-800 hover:bg-zinc-900/60 even:bg-black/40"><td className="p-3 text-blue-300">{formatDate(record.Date)}</td><td className="p-3 text-white">{record.Name || 'N/A'}</td><td className="p-3 text-zinc-300">{record.Purpose || 'N/A'}</td><td className="p-3 text-right text-green-400 font-medium">₦{record['Amt. Paid'].toLocaleString('en-NG')}</td></tr>))}</tbody>
                                </>
                            ) : (
                                <>
                                    <thead><tr className="sticky top-0 bg-zinc-950 backdrop-blur-sm"><th className="p-3 text-left text-zinc-300">Date</th><th className="p-3 text-left text-zinc-300">Duty</th><th className="p-3 text-left text-zinc-300">Purpose</th><th className="p-3 text-right text-zinc-300">Amount</th></tr></thead>
                                    <tbody>{selectedSegmentData.map((record, index) => isExpenseRecord(record) && (<tr key={index} className="border-b border-zinc-800 hover:bg-zinc-900/60 even:bg-black/40"><td className="p-3 text-blue-300">{formatDate(record.Date)}</td><td className="p-3 text-white">{record.Duty || 'N/A'}</td><td className="p-3 text-zinc-300">{record.Purpose || 'N/A'}</td><td className="p-3 text-right text-red-400 font-medium">₦{record.ExpenseAmount.toLocaleString('en-NG')}</td></tr>))}</tbody>
                                </>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}

        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-purple-400"/>Quick Statistics</CardTitle></CardHeader>
            <CardContent>
                <div className={isCompareMode ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"}>
                    <div className={isCompareMode ? "text-center border-r border-zinc-700 pr-4" : "text-center"}>
                        {isCompareMode && <h4 className="text-lg font-semibold text-white mb-2">{primaryMonthLabel}</h4>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="text-center"><div className="text-2xl font-bold text-green-400">₦{totalPrimaryRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-sm text-zinc-400">Total Revenue</div></div>
                          <div className="text-center"><div className="text-2xl font-bold text-red-400">₦{totalPrimaryExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-sm text-zinc-400">Total Expenses</div></div>
                        </div>
                    </div>
                    {isCompareMode && (
                        <div className="text-center">
                            <h4 className="text-lg font-semibold text-white mb-2">{compareMonthLabel}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="text-center"><div className="text-2xl font-bold text-green-400">₦{totalCompareRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-sm text-zinc-400">Total Revenue</div></div>
                              <div className="text-center"><div className="text-2xl font-bold text-red-400">₦{totalCompareExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div><div className="text-sm text-zinc-400">Total Expenses</div></div>
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