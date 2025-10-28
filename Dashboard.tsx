

import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { FileUpload, AllMonthsData } from './components/FileUpload';
import { KPICard } from './components/KPICard';
import { TrendChart, MergedTrendData } from './components/TrendChart';
import { PieChartComponent } from './components/PieChart';
import { BarChartComponent } from './components/BarChart';
import { DashboardFilters } from './components/DashboardFilters';
import { Sidebar } from './components/Sidebar';
import { Activity, TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, Filter, MousePointer, LogOut } from './components/Icons';
import { Button } from './components/ui/Button';
import { AiChatButton, AiChatModal } from './components/AiChat';
import { CreatorModal } from './components/CreatorModal';

interface FinancialRecord {
  'Amt. Paid': number;
  'Exp.': number;
  'Date': string | number;
  'Duty': string;
  'Mode': string;
  'Purpose': string;
  'Name': string;
  'To Balance': number;
  'Workers': number;
  'S/N': number;
}

interface ExpenseCategoryRecord {
  Date?: string | number;
  DUTY?: string;
  Purpose?: string;
  'Transportation/Errands'?: number;
  Refunds?: number;
  'Purchases of Drugs'?: number;
  'Payments of Services'?: number;
  Utilities?: number;
  'Equipment/Maintenance Fee'?: number;
  'Salary & Wages'?: number;
  'Miscellaneous Expense'?: number;
  [key: string]: any; // To allow for dynamic misc expense columns
}

interface ExpenseTransactionRecord {
  Date: string | number;
  Purpose: string;
  Category: string;
  ExpenseAmount: number;
  'Mode': string;
  Duty: string;
  Names: string;
}

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<AllMonthsData | null>(null);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCompareMonth, setSelectedCompareMonth] = useState<string | null>(null);


  const [selectedDuty, setSelectedDuty] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'payment' | 'expense' | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedSegmentData, setSelectedSegmentData] = useState<(FinancialRecord | ExpenseTransactionRecord)[]>([]);
  const [detailsContext, setDetailsContext] = useState<'primary' | 'compare' | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  
  const handleDataUpload = (data: AllMonthsData) => {
    const normalizeRecordKeys = (records: any[]) => {
      return records.map(record => {
        const newRecord: { [key: string]: any } = {};
        for (const key in record) {
          if (Object.prototype.hasOwnProperty.call(record, key)) {
            newRecord[key.trim()] = record[key];
          }
        }
        return newRecord;
      });
    };

    const normalizedData: AllMonthsData = {};
    for (const month in data) {
      if (Object.prototype.hasOwnProperty.call(data, month)) {
        normalizedData[month] = {
          data: normalizeRecordKeys(data[month].data) as FinancialRecord[],
          expenseCategories: data[month].expenseCategories ? normalizeRecordKeys(data[month].expenseCategories as any[]) : [],
        };
      }
    }
    
    const months = Object.keys(normalizedData);
    setMonthlyData(normalizedData);
    setAvailableMonths(months);
    setSelectedMonth(months[0] || '');
    setSelectedCompareMonth(null);
    setSelectedDuty(null);
    setDateRange({ start: null, end: null });
  };
  
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // If the new month is the same as the compare month, reset the compare month
    if (month === selectedCompareMonth) {
      setSelectedCompareMonth(null);
    }
  };

  const { currentRawData, currentExpenseData } = useMemo(() => {
    if (!monthlyData || !selectedMonth) {
      return { currentRawData: [], currentExpenseData: [] };
    }
    const monthData = monthlyData[selectedMonth];
    return {
      currentRawData: monthData?.data || [],
      currentExpenseData: monthData?.expenseCategories || []
    };
  }, [monthlyData, selectedMonth]);
  
  const { comparisonRawData, comparisonExpenseCategories } = useMemo(() => {
    if (!monthlyData || !selectedCompareMonth) {
      return { comparisonRawData: [], comparisonExpenseCategories: [] };
    }
    const monthData = monthlyData[selectedCompareMonth];
    return {
      comparisonRawData: monthData?.data || [],
      comparisonExpenseCategories: monthData?.expenseCategories || []
    };
  }, [monthlyData, selectedCompareMonth]);

  const processRawData = (rawData: FinancialRecord[]) => {
    if (rawData.length === 0) return [];
    return rawData.map(record => ({
      ...record,
      'Amt. Paid': Number(record['Amt. Paid']) || 0,
      'Exp.': Number(record['Exp.']) || 0,
      'To Balance': Number(record['To Balance']) || 0,
      'Workers': Number(record['Workers']) || 0,
      'Date': record['Date'] || '',
      'Duty': record['Duty'] || '',
      'Mode': record['Mode'] || 'Cash',
      'Purpose': record['Purpose'] || (record as any)['purpose'] || '',
      'Name': record['Name'] || '',
    }));
  };

  const processedData = useMemo(() => processRawData(currentRawData), [currentRawData]);
  const processedComparisonData = useMemo(() => processRawData(comparisonRawData), [comparisonRawData]);

  const parseDate = (dateValue: string | number): Date | null => {
    if (!dateValue) return null;
    try {
      if (typeof dateValue === 'number' && dateValue > 0) {
        const date = XLSX.SSF.parse_date_code(dateValue);
        return new Date(Date.UTC(date.y, date.m - 1, date.d));
      }
      if (typeof dateValue === 'string') {
        const monthMap: { [key: string]: number } = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const parts = dateValue.split('-');
        if (parts.length === 2 && !isNaN(parseInt(parts[0])) && monthMap[parts[1]] !== undefined) {
          const currentYear = new Date().getFullYear();
          return new Date(Date.UTC(currentYear, monthMap[parts[1]], parseInt(parts[0])));
        }
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const filteredData = useMemo(() => {
    let dataToFilter = processedData;

    if (selectedDuty) {
      dataToFilter = dataToFilter.filter(record => record.Duty === selectedDuty);
    }
    
    const { start, end } = dateRange;
    if (start || end) {
      const startDate = start ? new Date(`${start}T00:00:00.000Z`) : null;
      const endDate = end ? new Date(`${end}T23:59:59.999Z`) : null;
      
      dataToFilter = dataToFilter.filter(record => {
        const recordDate = parseDate(record.Date);
        if (!recordDate) return false;

        const isAfterStart = startDate ? recordDate.getTime() >= startDate.getTime() : true;
        const isBeforeEnd = endDate ? recordDate.getTime() <= endDate.getTime() : true;

        return isAfterStart && isBeforeEnd;
      });
    }

    return dataToFilter;
  }, [processedData, selectedDuty, dateRange]);

  const calculateKpis = (data: FinancialRecord[]) => {
    const income = data.reduce((sum, record) => {
      if (record['Mode']?.toLowerCase().includes('cash b/f') || 
          record['Mode']?.toLowerCase().includes('cash balance') ||
          record['Mode'] === 'EXP') {
        return sum;
      }
      return sum + record['Amt. Paid'];
    }, 0);

    const expenses = data.reduce((sum, record) => {
      let expenseAmount = record['Exp.'];
      if (record['Mode'] === 'EXP') { expenseAmount += record['Amt. Paid']; }
      expenseAmount += record['Workers'];
      return sum + expenseAmount;
    }, 0);

    const netProfit = income - expenses;
    const profitMargin = income > 0 ? (netProfit / income) * 100 : 0;

    return { income, expenses, netProfit, profitMargin };
  };

  const kpis = useMemo(() => calculateKpis(filteredData), [filteredData]);
  const comparisonKpis = useMemo(() => calculateKpis(processedComparisonData), [processedComparisonData]);

  const availableDuties = useMemo(() => {
    const duties = [...new Set(processedData.map(record => record.Duty))];
    return duties.filter(duty => duty && String(duty).trim() !== '');
  }, [processedData]);
  
  const normalizeDate = (dateStr: string | number): string => {
    if (!dateStr) return 'Unknown Date';
    try {
      if (typeof dateStr === 'number' && dateStr > 0) {
        const date = XLSX.SSF.parse_date_code(dateStr);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.d}-${monthNames[date.m - 1]}`;
      }
      if (typeof dateStr === 'string') return dateStr.trim();
      return String(dateStr).trim();
    } catch (error) { return String(dateStr); }
  };

  const calculateTrendData = (data: FinancialRecord[]) => {
    const dailyData: Record<string, { income: number; expenses: number }> = {};
    data.forEach(record => {
      if (!record.Date) return;
      const normalizedDate = normalizeDate(record.Date);

      if (!dailyData[normalizedDate]) {
        dailyData[normalizedDate] = { income: 0, expenses: 0 };
      }
      if (!record['Mode']?.toLowerCase().includes('cash b/f') && 
          !record['Mode']?.toLowerCase().includes('cash balance') &&
          record['Mode'] !== 'EXP') {
        dailyData[normalizedDate].income += record['Amt. Paid'];
      }
      let expenseAmount = record['Exp.'];
      if (record['Mode'] === 'EXP') { expenseAmount += record['Amt. Paid']; }
      expenseAmount += record['Workers'];
      dailyData[normalizedDate].expenses += expenseAmount;
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      day: date.split('-')[0],
      income: data.income,
      expenses: data.expenses,
      netProfit: data.income - data.expenses,
    }));
  };

  const trendData = useMemo(() => calculateTrendData(filteredData), [filteredData]);
  const comparisonTrendData = useMemo(() => calculateTrendData(processedComparisonData), [processedComparisonData]);

  const mergedTrendData = useMemo<MergedTrendData[]>(() => {
    // FIX: Explicitly typing the Map constructor ensures that TypeScript correctly infers the
    // type of the map's values, preventing them from being treated as 'unknown'. This
    // resolves subsequent errors when trying to spread or access properties on these values.
    const dataMap = new Map<string, { day: string; income: number; expenses: number; netProfit: number; }>(trendData.map(d => [d.day, d]));
    
    if (!selectedCompareMonth) {
      return Array.from(dataMap.values()).map(d => ({
        ...d,
        compareIncome: null,
        compareExpenses: null,
        compareNetProfit: null,
      })).sort((a,b) => Number(a.day) - Number(b.day));
    }
    
    // FIX: Explicitly typing this Map constructor for the same reason as above, ensuring
    // correct type inference and preventing property access errors.
    const compareMap = new Map<string, { day: string; income: number; expenses: number; netProfit: number; }>(comparisonTrendData.map(d => [d.day, d]));
    const allDays = Array.from(new Set([...dataMap.keys(), ...compareMap.keys()])).sort((a, b) => Number(a) - Number(b));

    return allDays.map(day => {
        const current = dataMap.get(day);
        const compare = compareMap.get(day);
        return {
            day,
            income: current?.income ?? null,
            expenses: current?.expenses ?? null,
            netProfit: current?.netProfit ?? null,
            compareIncome: compare?.income ?? null,
            compareExpenses: compare?.expenses ?? null,
            compareNetProfit: compare?.netProfit ?? null,
        };
    });
  }, [trendData, comparisonTrendData, selectedCompareMonth]);

  const normalizePaymentMethod = (mode: string): string => {
    if (!mode) return 'Cash';
    const trimmed = mode.trim();
    if (trimmed === "FCMB'25") return "FCMB'25";
    if (trimmed.toLowerCase().includes('fcmb')) return 'FCMB';
    if (trimmed.toLowerCase() === 'pos') return 'POS';
    if (trimmed.toLowerCase() === 'cash') return 'Cash';
    if (trimmed.toLowerCase() === 'uba') return 'UBA';
    if (trimmed.toLowerCase() === 'opay') return 'Opay';
    return trimmed;
  };

  const calculateIncomeByPayment = (data: FinancialRecord[]) => {
    const paymentData: Record<string, number> = {};
    
    data.forEach(record => {
      const mode = record['Mode'];
      const amount = record['Amt. Paid'];
      
      if (mode?.toLowerCase().includes('cash b/f') || 
          mode?.toLowerCase().includes('cash balance') ||
          mode === 'EXP' ||
          amount <= 0) {
        return;
      }

      const normalizedMode = normalizePaymentMethod(mode);
      paymentData[normalizedMode] = (paymentData[normalizedMode] || 0) + amount;
    });

    return Object.entries(paymentData)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  const incomeByPayment = useMemo(() => calculateIncomeByPayment(filteredData), [filteredData]);
  const comparisonIncomeByPayment = useMemo(() => calculateIncomeByPayment(processedComparisonData), [processedComparisonData]);

  const calculateExpensesByCategory = (expenseData: ExpenseCategoryRecord[], duty: string | null) => {
    if (expenseData.length === 0) return [];
      
    const categoryTotals: Record<string, number> = {};
    // Define a list of metadata columns to ignore, case-insensitively
    const excludedColumns = ['date', 'duty', 'purpose', 's/n'];

    expenseData.forEach(record => {
      // Apply the department (duty) filter if one is selected
      if (duty && record.DUTY && record.DUTY.trim().toLowerCase() !== duty.trim().toLowerCase()) {
        return;
      }
      
      // Iterate over all columns (keys) in the current row (record)
      for (const key in record) {
        // Ensure the key is a property of the object itself
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          const trimmedKey = key.trim();
          
          // If the column is not in our exclusion list, treat it as a dynamic expense category
          if (!excludedColumns.includes(trimmedKey.toLowerCase())) {
            const value = Number(record[key]) || 0;
            
            if (value > 0) {
              // Initialize the category total if it's the first time we've seen it
              if (!categoryTotals[trimmedKey]) {
                categoryTotals[trimmedKey] = 0;
              }
              // Add the value to the total for this category
              categoryTotals[trimmedKey] += value;
            }
          }
        }
      }
    });

    // Convert the aggregated totals into the format required by the chart
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0) // Only include categories with a total value > 0
      .sort((a, b) => b.value - a.value); // Sort for consistent chart display
  }

  const expensesByCategory = useMemo(() => calculateExpensesByCategory(currentExpenseData, selectedDuty), [currentExpenseData, selectedDuty]);
  const comparisonExpensesByCategory = useMemo(() => calculateExpensesByCategory(comparisonExpenseCategories, selectedDuty), [comparisonExpenseCategories, selectedDuty]);

  const accountsReceivable = useMemo(() => {
    return filteredData
      .filter(record => record['To Balance'] > 0)
      .map(record => ({
        name: record.Name || 'Unknown Patient',
        service: record.Purpose || 'Service Not Specified',
        amount: record['To Balance'],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredData]);

  const comparisonAccountsReceivable = useMemo(() => {
    if (!selectedCompareMonth) return [];
    return processedComparisonData
      .filter(record => record['To Balance'] > 0)
      .map(record => ({
        name: record.Name || 'Unknown Patient',
        service: record.Purpose || 'Service Not Specified',
        amount: record['To Balance'],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [processedComparisonData, selectedCompareMonth]);


  const totalReceivables = useMemo(() => {
    return accountsReceivable.reduce((sum, item) => sum + item.amount, 0);
  }, [accountsReceivable]);

  const financialSummary = useMemo(() => {
    const formatCurrency = (val: number) => `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const generateSingleMonthSummary = (monthLabel: string, kpisData: any, incomeData: any[], expenseData: any[], arData: any[], totalAr: number) => {
        let summary = `\nHospital Financial Report Summary for ${monthLabel === 'DefaultMonth' ? 'the selected period' : monthLabel}:\n`;
        if (selectedDuty) {
            summary += `Data is filtered for the ${selectedDuty} department.\n\n`;
        }
        summary += `Key Performance Indicators:\n`;
        summary += `- Total Income: ${formatCurrency(kpisData.income)}\n`;
        summary += `- Total Expenses: ${formatCurrency(kpisData.expenses)}\n`;
        summary += `- Net Profit: ${formatCurrency(kpisData.netProfit)}\n`;
        summary += `- Profit Margin: ${kpisData.profitMargin.toFixed(1)}%\n\n`;
        
        if (incomeData.length > 0) {
            summary += "Revenue by Payment Method:\n";
            incomeData.forEach(item => { summary += `- ${item.name}: ${formatCurrency(item.value)}\n`; });
            summary += "\n";
        }

        if (expenseData.length > 0) {
            summary += "Expense Distribution:\n";
            expenseData.forEach(item => { summary += `- ${item.name}: ${formatCurrency(item.value)}\n`; });
            summary += "\n";
        }

        if (arData.length > 0) {
            summary += `Accounts Receivable:\n`;
            summary += `- Total Outstanding: ${formatCurrency(totalAr)} from ${arData.length} patients.\n`;
            summary += `Top 3 Outstanding Balances:\n`;
            arData.slice(0, 3).forEach(item => { summary += `  - ${item.name}: ${formatCurrency(item.amount)}\n`; });
        }
        return summary;
    };

    if (selectedCompareMonth && comparisonKpis) {
        let summary = `This is a comparative financial analysis between ${selectedMonth} and ${selectedCompareMonth}.\n\n`;
        
        const calculateChange = (current: number, previous: number) => {
            if (Math.abs(previous) < 1e-6) return current > 0 ? " (significant increase from zero)" : "";
            const change = ((current - previous) / Math.abs(previous)) * 100;
            return ` (${change >= 0 ? '+' : ''}${change.toFixed(1)}%)`;
        };

        summary += "=== Key Performance Comparison ===\n";
        summary += `- Total Income: ${formatCurrency(kpis.income)} vs ${formatCurrency(comparisonKpis.income)}${calculateChange(kpis.income, comparisonKpis.income)}\n`;
        summary += `- Total Expenses: ${formatCurrency(kpis.expenses)} vs ${formatCurrency(comparisonKpis.expenses)}${calculateChange(kpis.expenses, comparisonKpis.expenses)}\n`;
        summary += `- Net Profit: ${formatCurrency(kpis.netProfit)} vs ${formatCurrency(comparisonKpis.netProfit)}${calculateChange(kpis.netProfit, comparisonKpis.netProfit)}\n`;
        summary += `- Profit Margin: ${kpis.profitMargin.toFixed(1)}% vs ${comparisonKpis.profitMargin.toFixed(1)}%\n`;

        summary += `\n\n=== Detailed Report for ${selectedMonth} ===`;
        summary += generateSingleMonthSummary(selectedMonth, kpis, incomeByPayment, expensesByCategory, accountsReceivable, totalReceivables);

        const totalComparisonReceivables = comparisonAccountsReceivable.reduce((sum, item) => sum + item.amount, 0);
        summary += `\n\n=== Detailed Report for ${selectedCompareMonth} ===`;
        summary += generateSingleMonthSummary(selectedCompareMonth, comparisonKpis, comparisonIncomeByPayment, comparisonExpensesByCategory, comparisonAccountsReceivable, totalComparisonReceivables);

        return summary;
    } else {
        return generateSingleMonthSummary(selectedMonth, kpis, incomeByPayment, expensesByCategory, accountsReceivable, totalReceivables).substring(1); // Remove leading newline
    }
  }, [
    kpis, incomeByPayment, expensesByCategory, accountsReceivable, totalReceivables, selectedDuty, selectedMonth,
    selectedCompareMonth, comparisonKpis, comparisonIncomeByPayment, comparisonExpensesByCategory, comparisonAccountsReceivable
  ]);


  const handleSegmentClick = (type: 'payment' | 'expense', segment: string | null, monthContext: 'primary' | 'compare') => {
    setActiveSection(type);
    setSidebarOpen(true);
    setSelectedSegment(segment);
    setDetailsContext(segment ? monthContext : null);

    const dataToFilter = monthContext === 'primary' ? filteredData : processedComparisonData;
    const expenseCategoriesToFilter = monthContext === 'primary' ? currentExpenseData : comparisonExpenseCategories;
    
    if (type === 'expense' && segment) {
      const matchingRecords: ExpenseTransactionRecord[] = [];
      expenseCategoriesToFilter.forEach(record => {
        if (selectedDuty && record.DUTY !== selectedDuty) return;
        
        let expenseAmount = 0;
        if (segment === 'Miscellaneous Expense') {
            Object.keys(record).forEach(key => {
              const lowerKey = key.toLowerCase();
              if (lowerKey.includes('miscellaneous') || lowerKey.includes('misc')) {
                expenseAmount += Number(record[key]) || 0;
              }
            });
        } else {
            expenseAmount = Number(record[segment]) || 0;
        }
        
        if (expenseAmount > 0) {
          matchingRecords.push({
            Date: record.Date || '', Purpose: record.Purpose || 'Expense Transaction',
            Category: segment, ExpenseAmount: expenseAmount, 'Mode': 'EXP',
            Duty: record.DUTY || '', Names: ''
          });
        }
      });
      setSelectedSegmentData(matchingRecords);
    } else if (type === 'payment' && segment) {
      const segmentData = dataToFilter.filter(record => {
        const mode = record['Mode'];
        const amount = record['Amt. Paid'];
        
        if (mode?.toLowerCase().includes('cash b/f') || 
            mode?.toLowerCase().includes('cash balance') ||
            mode === 'EXP' || amount <= 0) {
          return false;
        }
        
        const normalizedMode = normalizePaymentMethod(mode);
        return normalizedMode === segment;
      });
      setSelectedSegmentData(segmentData);
    } else {
      setSelectedSegmentData([]);
    }
  };

  const containerClasses = "bg-[#252849]/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6";

  return (
    <div className="min-h-screen text-white p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <Activity className="relative h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Financial Dashboard
              </h1>
            </div>
            <Button 
              onClick={() => signOut(auth)} 
              className="bg-[#252849]/50 hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
        </header>

        {monthlyData === null ? (
            <div className="text-center py-16">
              <div className={`${containerClasses} max-w-4xl mx-auto p-12`}>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  Welcome to Miracle Analytics!
                </h2>
                <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed mb-10">
                  It looks like you haven't uploaded any data yet. <br /> Drag and drop your first financial report here to begin your analysis.
                </p>
                <FileUpload onDataUploaded={handleDataUpload} />
              </div>
            </div>
        ) : (
          <>
            <div className="text-center -mt-4">
              <div className="flex items-center justify-center gap-4 text-blue-200">
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /><span>{filteredData.length} Records</span></div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{selectedMonth === 'DefaultMonth' ? 'Single Month' : selectedMonth} Analysis</span></div>
              </div>
            </div>
            
            <div className={`${containerClasses} relative z-30`}>
              <DashboardFilters 
                selectedDuty={selectedDuty} 
                onDutyChange={setSelectedDuty} 
                availableDuties={availableDuties}
                dateRange={dateRange}
                onDateChange={setDateRange}
                availableMonths={availableMonths}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                selectedCompareMonth={selectedCompareMonth}
                onCompareMonthChange={setSelectedCompareMonth}
              />
            </div>

            <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard title="Total Income" value={kpis.income} type="income" compareValue={comparisonKpis.income} compareLabel={selectedCompareMonth} />
                    <KPICard title="Total Expenses" value={kpis.expenses} type="expense" compareValue={comparisonKpis.expenses} compareLabel={selectedCompareMonth} />
                    <KPICard title="Net Profit" value={kpis.netProfit} type="profit" compareValue={comparisonKpis.netProfit} compareLabel={selectedCompareMonth} />
                    <KPICard title="Profit Margin" value={kpis.profitMargin} type="margin" compareValue={comparisonKpis.profitMargin} compareLabel={selectedCompareMonth} />
                </div>
                <div className="lg:col-span-1">
                    <KPICard title="Total A/R" value={totalReceivables} type="receivables" count={accountsReceivable.length}/>
                </div>
            </div>

            {mergedTrendData.length > 0 && (
              <div className={`${containerClasses} relative z-10`}>
                <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700"><TrendingUp className="h-5 w-5 text-purple-400" /></div><h3 className="text-xl font-semibold text-white">Financial Performance Trends</h3></div>
                <TrendChart data={mergedTrendData} compareLabel={selectedCompareMonth} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              {incomeByPayment.length > 0 && (
                <div className={`${containerClasses} min-h-0`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3"><div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700"><PieChartIcon className="h-5 w-5 text-green-400" /></div><h3 className="text-xl font-semibold text-white">Revenue by Payment Method</h3></div>
                    <div className="flex items-center gap-2 text-blue-300 "><MousePointer className="h-4 w-4" /><span className="text-sm">Click for details</span></div>
                  </div>
                  <PieChartComponent title="" data={incomeByPayment} onSegmentClick={(segment) => handleSegmentClick('payment', segment, 'primary')} />
                </div>
              )}
              {expensesByCategory.length > 0 && (
                <div className={`${containerClasses} min-h-0`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3"><div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700"><BarChart3 className="h-5 w-5 text-red-400" /></div><h3 className="text-xl font-semibold text-white">Expense Distribution Analysis</h3></div>
                    <div className="flex items-center gap-2 text-blue-300 "><MousePointer className="h-4 w-4" /><span className="text-sm">Click for details</span></div>
                  </div>
                  <PieChartComponent title="" data={expensesByCategory} onSegmentClick={(segment) => handleSegmentClick('expense', segment, 'primary')} />
                </div>
              )}
            </div>

            {(incomeByPayment.length > 0 || expensesByCategory.length > 0) && (
              <div className="text-center"><Button onClick={() => { setSidebarOpen(true); setActiveSection('payment'); setSelectedSegment(null); setSelectedSegmentData([]); setDetailsContext(null); }} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"><BarChart3 className="h-5 w-5 mr-2" />Open Detailed Analytics</Button></div>
            )}

            {accountsReceivable.length > 0 && (
              <div className="space-y-6 relative z-10">
                <div className={containerClasses}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700"><BarChart3 className="h-5 w-5 text-orange-400" /></div>
                    <h3 className="text-xl font-semibold text-white">{selectedCompareMonth ? 'Top Outstanding Balances Comparison' : 'Top 10 Outstanding Patient Balances'}</h3>
                  </div>
                  <BarChartComponent 
                    title="" 
                    data={accountsReceivable}
                    compareData={comparisonAccountsReceivable}
                    primaryLabel={selectedMonth === 'DefaultMonth' ? 'Current' : selectedMonth}
                    compareLabel={selectedCompareMonth}
                  />
                </div>
              </div>
            )}

            <div className="text-center pt-8">
              <div className={containerClasses}>
                <h3 className="text-lg font-semibold text-white mb-4">Update Analytics Data</h3>
                <FileUpload onDataUploaded={handleDataUpload} />
              </div>
            </div>
          </>
        )}
      </div>
      
      <footer className="text-center py-8 text-sm text-slate-400">
        © 2025 Miracle Analytics. All Rights Reserved. &nbsp;&bull;&nbsp;
        <button onClick={() => setIsCreatorModalOpen(true)} className="hover:text-white transition-colors underline">
            Designed & Developed by Miracle
        </button>
      </footer>

      {monthlyData !== null && (
        <>
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => { setSidebarOpen(false); setActiveSection(null); setSelectedSegment(null); setSelectedSegmentData([]); }} 
                activeSection={activeSection} 
                primaryMonthLabel={selectedMonth === 'DefaultMonth' ? 'Current Period' : selectedMonth}
                paymentData={incomeByPayment} 
                expenseData={expensesByCategory} 
                onSegmentClick={handleSegmentClick} 
                selectedSegmentData={selectedSegmentData}
                selectedSegment={selectedSegment}
                compareMonthLabel={selectedCompareMonth}
                comparePaymentData={comparisonIncomeByPayment}
                compareExpenseData={comparisonExpensesByCategory}
                detailsContext={detailsContext}
            />
            <AiChatButton onClick={() => setIsChatOpen(true)} />
            <AiChatModal 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                financialData={financialSummary}
            />
        </>
      )}
       <CreatorModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />
    </div>
  );
}