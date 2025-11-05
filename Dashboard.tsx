
import { useState, useMemo, useRef, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { auth } from './firebaseConfig';
import { FileUpload, AllMonthsData } from './components/FileUpload';
import { KPICard } from './components/KPICard';
import { TrendChart, MergedTrendData } from './components/TrendChart';
import { PieChartComponent } from './components/PieChart';
import { BarChartComponent } from './components/BarChart';
import { DashboardFilters } from './components/DashboardFilters';
import { Sidebar } from './components/Sidebar';
import { LogoIconOnly } from './components/Logo';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, Filter, MousePointer, LogOut, Upload, Sun, Moon, DollarSign, Spinner } from './components/Icons';
import { Button } from './components/ui/Button';
import { AiChatButton, AiChatModal } from './components/AiChat';
import { CreatorModal } from './components/CreatorModal';
import { useTheme } from './ThemeContext';
import { useCurrency } from './CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/Select';
import { useAuth } from './AuthContext';

// These interfaces are now generic, as the specific keys are dynamic
interface FinancialRecord {
  [key: string]: any;
}

interface ExpenseCategoryRecord {
  [key: string]: any; 
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
  const { workspaceConfig } = useAuth();
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, formatCurrency } = useCurrency();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
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
  
  const handleNewFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (event.target) {
          event.target.value = '';
      }

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              
              const allMonthsData: AllMonthsData = {};
              const monthMap = {
                'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
                'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
                'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
              };
              const monthOrder = Object.values(monthMap);
      
              const dataSheetRegex = /^([a-zA-Z]+)_Data$/i;
              const foundMonths: { name: string; abbr: string; originalSheetName: string }[] = [];
              const monthKeys = Object.keys(monthMap);
      
              workbook.SheetNames.forEach(sheetName => {
                const match = sheetName.match(dataSheetRegex);
                if (match) {
                  const originalAbbr = match[1];
                  const foundMonthKey = monthKeys.find(key => originalAbbr.toLowerCase().startsWith(key.toLowerCase()));
      
                  if (foundMonthKey) {
                    const monthFullName = monthMap[foundMonthKey as keyof typeof monthMap];
                    foundMonths.push({ name: monthFullName, abbr: originalAbbr, originalSheetName: sheetName });
                  }
                }
              });
      
              if (foundMonths.length > 0) {
                foundMonths.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
                foundMonths.forEach(month => {
                  const worksheet = workbook.Sheets[month.originalSheetName];
                  const jsonData = XLSX.utils.sheet_to_json(worksheet);
                  allMonthsData[month.name] = { data: jsonData };
                  const expenseSheetName = `${month.abbr}_Expenses`;
                  const expenseSheetKey = Object.keys(workbook.Sheets).find(s => s.toLowerCase() === expenseSheetName.toLowerCase());
                  if (expenseSheetKey) {
                    const expenseWorksheet = workbook.Sheets[expenseSheetKey];
                    allMonthsData[month.name].expenseCategories = XLSX.utils.sheet_to_json(expenseWorksheet);
                  }
                });
              }
      
              if (Object.keys(allMonthsData).length === 0 && workbook.SheetNames.length > 0) {
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                let expenseCategoryData = undefined;
                if (workbook.SheetNames.length > 1) {
                  const secondSheetName = workbook.SheetNames[1];
                  const expenseWorksheet = workbook.Sheets[secondSheetName];
                  expenseCategoryData = XLSX.utils.sheet_to_json(expenseWorksheet);
                }
                allMonthsData['DefaultMonth'] = { data: jsonData, expenseCategories: expenseCategoryData };
              }
              
              if (Object.keys(allMonthsData).length === 0) {
                  throw new Error('No valid data sheets found.');
              }
              handleDataUpload(allMonthsData);
          } catch (error) {
              console.error('Error processing new Excel file:', error);
          }
      };
      reader.readAsArrayBuffer(file);
  };
  
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
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

  const processRawData = (rawData: FinancialRecord[], config: any) => {
    if (rawData.length === 0 || !config) return [];
    // This function now primarily ensures numeric types, as keys are dynamic.
    return rawData.map(record => ({
      ...record,
      [config.incomeField]: Number(record[config.incomeField]) || 0,
      [config.expenseField]: Number(record[config.expenseField]) || 0,
      [config.balanceField]: Number(record[config.balanceField]) || 0,
      [config.workersField]: Number(record[config.workersField]) || 0,
    }));
  };
  
  const processedData = useMemo(() => processRawData(currentRawData, workspaceConfig), [currentRawData, workspaceConfig]);
  const processedComparisonData = useMemo(() => processRawData(comparisonRawData, workspaceConfig), [comparisonRawData, workspaceConfig]);

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
    if (!workspaceConfig) return [];
    let dataToFilter = processedData;

    if (selectedDuty) {
      dataToFilter = dataToFilter.filter(record => record[workspaceConfig.departmentField] === selectedDuty);
    }
    
    const { start, end } = dateRange;
    if (start || end) {
      const startDate = start ? new Date(`${start}T00:00:00.000Z`) : null;
      const endDate = end ? new Date(`${end}T23:59:59.999Z`) : null;
      
      dataToFilter = dataToFilter.filter(record => {
        const recordDate = parseDate(record[workspaceConfig.dateField]);
        if (!recordDate) return false;

        const isAfterStart = startDate ? recordDate.getTime() >= startDate.getTime() : true;
        const isBeforeEnd = endDate ? recordDate.getTime() <= endDate.getTime() : true;

        return isAfterStart && isBeforeEnd;
      });
    }

    return dataToFilter;
  }, [processedData, selectedDuty, dateRange, workspaceConfig]);

  const calculateKpis = (data: FinancialRecord[], config: any) => {
    if (!config) return { income: 0, expenses: 0, netProfit: 0, profitMargin: 0 };
    
    const income = data.reduce((sum, record) => {
      const mode = record[config.paymentModeField];
      if (mode?.toLowerCase().includes(config.cashBfIdentifier) || 
          mode?.toLowerCase().includes(config.cashBalanceIdentifier) ||
          mode === config.expenseModeIdentifier) {
        return sum;
      }
      return sum + (record[config.incomeField] || 0);
    }, 0);

    const expenses = data.reduce((sum, record) => {
      let expenseAmount = record[config.expenseField] || 0;
      if (record[config.paymentModeField] === config.expenseModeIdentifier) { 
        expenseAmount += (record[config.incomeField] || 0); 
      }
      expenseAmount += (record[config.workersField] || 0);
      return sum + expenseAmount;
    }, 0);

    const netProfit = income - expenses;
    const profitMargin = income > 0 ? (netProfit / income) * 100 : 0;

    return { income, expenses, netProfit, profitMargin };
  };

  const kpis = useMemo(() => calculateKpis(filteredData, workspaceConfig), [filteredData, workspaceConfig]);
  const comparisonKpis = useMemo(() => calculateKpis(processedComparisonData, workspaceConfig), [processedComparisonData, workspaceConfig]);

  const availableDuties = useMemo(() => {
    if (!workspaceConfig) return [];
    const duties = [...new Set(processedData.map(record => record[workspaceConfig.departmentField]))];
    return duties.filter(duty => duty && String(duty).trim() !== '');
  }, [processedData, workspaceConfig]);
  
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

  const calculateTrendData = (data: FinancialRecord[], config: any) => {
    if (!config) return [];
    const dailyData: Record<string, { income: number; expenses: number }> = {};
    data.forEach(record => {
      const dateValue = record[config.dateField];
      if (!dateValue) return;
      const normalizedDate = normalizeDate(dateValue);

      if (!dailyData[normalizedDate]) {
        dailyData[normalizedDate] = { income: 0, expenses: 0 };
      }
      const mode = record[config.paymentModeField];
      if (!mode?.toLowerCase().includes(config.cashBfIdentifier) && 
          !mode?.toLowerCase().includes(config.cashBalanceIdentifier) &&
          mode !== config.expenseModeIdentifier) {
        dailyData[normalizedDate].income += (record[config.incomeField] || 0);
      }
      let expenseAmount = record[config.expenseField] || 0;
      if (mode === config.expenseModeIdentifier) { 
        expenseAmount += (record[config.incomeField] || 0); 
      }
      expenseAmount += (record[config.workersField] || 0);
      dailyData[normalizedDate].expenses += expenseAmount;
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      day: date.split('-')[0],
      income: data.income,
      expenses: data.expenses,
      netProfit: data.income - data.expenses,
    }));
  };

  const trendData = useMemo(() => calculateTrendData(filteredData, workspaceConfig), [filteredData, workspaceConfig]);
  const comparisonTrendData = useMemo(() => calculateTrendData(processedComparisonData, workspaceConfig), [processedComparisonData, workspaceConfig]);

  const mergedTrendData = useMemo<MergedTrendData[]>(() => {
    const dataMap = new Map<string, { day: string; income: number; expenses: number; netProfit: number; }>(trendData.map(d => [d.day, d]));
    
    if (!selectedCompareMonth) {
      return Array.from(dataMap.values()).map(d => ({
        ...d,
        compareIncome: null,
        compareExpenses: null,
        compareNetProfit: null,
      })).sort((a,b) => Number(a.day) - Number(b.day));
    }
    
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

  const calculateIncomeByPayment = (data: FinancialRecord[], config: any) => {
    if (!config) return [];
    const paymentData: Record<string, number> = {};
    
    data.forEach(record => {
      const mode = record[config.paymentModeField];
      const amount = record[config.incomeField];
      
      if (mode?.toLowerCase().includes(config.cashBfIdentifier) || 
          mode?.toLowerCase().includes(config.cashBalanceIdentifier) ||
          mode === config.expenseModeIdentifier ||
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

  const incomeByPayment = useMemo(() => calculateIncomeByPayment(filteredData, workspaceConfig), [filteredData, workspaceConfig]);
  const comparisonIncomeByPayment = useMemo(() => calculateIncomeByPayment(processedComparisonData, workspaceConfig), [processedComparisonData, workspaceConfig]);

  const calculateExpensesByCategory = (expenseData: ExpenseCategoryRecord[], duty: string | null, config: any) => {
    if (!config || expenseData.length === 0) return [];
      
    const categoryTotals: Record<string, number> = {};
    const excludedColumns = [config.expenseCategoryDateField, config.expenseCategoryDepartmentField, config.expenseCategoryPurposeField, 's/n'].map(c => c.toLowerCase());

    expenseData.forEach(record => {
      const recordDuty = record[config.expenseCategoryDepartmentField];
      if (duty && recordDuty && recordDuty.trim().toLowerCase() !== duty.trim().toLowerCase()) {
        return;
      }
      
      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          const trimmedKey = key.trim();
          
          if (!excludedColumns.includes(trimmedKey.toLowerCase())) {
            const value = Number(record[key]) || 0;
            
            if (value > 0) {
              if (!categoryTotals[trimmedKey]) {
                categoryTotals[trimmedKey] = 0;
              }
              categoryTotals[trimmedKey] += value;
            }
          }
        }
      }
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  const expensesByCategory = useMemo(() => calculateExpensesByCategory(currentExpenseData, selectedDuty, workspaceConfig), [currentExpenseData, selectedDuty, workspaceConfig]);
  const comparisonExpensesByCategory = useMemo(() => calculateExpensesByCategory(comparisonExpenseCategories, selectedDuty, workspaceConfig), [comparisonExpenseCategories, selectedDuty, workspaceConfig]);

  const accountsReceivable = useMemo(() => {
    if (!workspaceConfig) return [];
    return filteredData
      .filter(record => record[workspaceConfig.balanceField] > 0)
      .map(record => ({
        name: record[workspaceConfig.nameField] || 'Unknown Patient',
        service: record[workspaceConfig.purposeField] || 'Service Not Specified',
        amount: record[workspaceConfig.balanceField],
        date: record[workspaceConfig.dateField],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredData, workspaceConfig]);

  const comparisonAccountsReceivable = useMemo(() => {
    if (!selectedCompareMonth || !workspaceConfig) return [];
    return processedComparisonData
      .filter(record => record[workspaceConfig.balanceField] > 0)
      .map(record => ({
        name: record[workspaceConfig.nameField] || 'Unknown Patient',
        service: record[workspaceConfig.purposeField] || 'Service Not Specified',
        amount: record[workspaceConfig.balanceField],
        date: record[workspaceConfig.dateField],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [processedComparisonData, selectedCompareMonth, workspaceConfig]);

  const totalReceivables = useMemo(() => {
    return accountsReceivable.reduce((sum, item) => sum + item.amount, 0);
  }, [accountsReceivable]);

  const financialSummary = useMemo(() => {
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
        return generateSingleMonthSummary(selectedMonth, kpis, incomeByPayment, expensesByCategory, accountsReceivable, totalReceivables).substring(1);
    }
  }, [
    kpis, incomeByPayment, expensesByCategory, accountsReceivable, totalReceivables, selectedDuty, selectedMonth,
    selectedCompareMonth, comparisonKpis, comparisonIncomeByPayment, comparisonExpensesByCategory, comparisonAccountsReceivable,
    formatCurrency
  ]);


  const handleSegmentClick = (type: 'payment' | 'expense', segment: string | null, monthContext: 'primary' | 'compare') => {
    if (!workspaceConfig) return;
    setActiveSection(type);
    setSidebarOpen(true);
    setSelectedSegment(segment);
    setDetailsContext(segment ? monthContext : null);

    const dataToFilter = monthContext === 'primary' ? filteredData : processedComparisonData;
    const expenseCategoriesToFilter = monthContext === 'primary' ? currentExpenseData : comparisonExpenseCategories;
    
    if (type === 'expense' && segment) {
      const matchingRecords: ExpenseTransactionRecord[] = [];
      expenseCategoriesToFilter.forEach(record => {
        if (selectedDuty && record[workspaceConfig.expenseCategoryDepartmentField] !== selectedDuty) return;
        
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
            Date: record[workspaceConfig.expenseCategoryDateField] || '', 
            Purpose: record[workspaceConfig.expenseCategoryPurposeField] || 'Expense Transaction',
            Category: segment, 
            ExpenseAmount: expenseAmount, 
            'Mode': workspaceConfig.expenseModeIdentifier,
            Duty: record[workspaceConfig.expenseCategoryDepartmentField] || '', 
            Names: ''
          });
        }
      });
      setSelectedSegmentData(matchingRecords);

    } else if (type === 'payment' && segment) {
      const normalizedSegment = normalizePaymentMethod(segment);
      const matchingRecords = dataToFilter.filter(record => {
        const mode = record[workspaceConfig.paymentModeField];
        const amount = record[workspaceConfig.incomeField];
        if (mode?.toLowerCase().includes(workspaceConfig.cashBfIdentifier) || mode?.toLowerCase().includes(workspaceConfig.cashBalanceIdentifier) || mode === workspaceConfig.expenseModeIdentifier || amount <= 0) {
          return false;
        }
        return normalizePaymentMethod(mode) === normalizedSegment;
      });
      setSelectedSegmentData(matchingRecords);
    } else {
      setSelectedSegmentData([]);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!monthlyData) {
    // This check is now safe because App.tsx guarantees workspaceConfig is loaded.
    if (!workspaceConfig) {
      // This should theoretically not be reached due to the logic in App.tsx,
      // but it's good practice as a fallback.
      return null;
    }
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-6 right-6">
          <Button 
            onClick={handleSignOut} 
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        <div className="text-center mb-8">
            <LogoIconOnly />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 mt-4">
                Miracle Analytics
            </h1>
            <p className="text-lg text-blue-200">Financial Intelligence Dashboard</p>
        </div>
        <FileUpload onDataUploaded={handleDataUpload} />
      </div>
    );
  }

  const selectedMonthLabel = selectedMonth === 'DefaultMonth' ? 'Current Period' : selectedMonth;
  const compareMonthLabel = selectedCompareMonth === 'DefaultMonth' ? 'Previous Period' : selectedCompareMonth;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <span>{filteredData.length} Records</span>
              </div>
              <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <span>{selectedMonthLabel} Analysis</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-32">
                <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
                    <SelectTrigger className="!py-2">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400"/>
                            <SelectValue placeholder="Currency" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button
                onClick={toggleTheme}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors p-2 h-auto"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
              >
                  <Upload className="h-4 w-4" />
                  Upload New File
              </Button>
              <Button onClick={handleSignOut} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
          </div>
        </header>

        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-8 relative z-20">
            <DashboardFilters 
                selectedDuty={selectedDuty}
                onDutyChange={setSelectedDuty}
                availableDuties={availableDuties}
                dateRange={dateRange}
                onDateChange={setDateRange}
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                availableMonths={availableMonths}
                selectedCompareMonth={selectedCompareMonth}
                onCompareMonthChange={setSelectedCompareMonth}
            />
        </div>

        <main className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard title="Total Income" value={kpis.income} type="income" compareValue={comparisonKpis?.income} compareLabel={compareMonthLabel} />
            <KPICard title="Total Expenses" value={kpis.expenses} type="expense" compareValue={comparisonKpis?.expenses} compareLabel={compareMonthLabel} />
            <KPICard title="Net Profit" value={kpis.netProfit} type="profit" compareValue={comparisonKpis?.netProfit} compareLabel={compareMonthLabel} />
            <KPICard title="Profit Margin" value={kpis.profitMargin} type="margin" compareValue={comparisonKpis?.profitMargin} compareLabel={compareMonthLabel} />
            <KPICard title="Total A/R" value={totalReceivables} type="receivables" count={accountsReceivable.length} />
          </section>

          <section className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4 flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><TrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" /></div>Financial Performance Trends</h2>
            <TrendChart data={mergedTrendData} compareLabel={compareMonthLabel} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 xl:col-span-1">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><PieChartIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" /></div>Revenue by Payment Mode</h2>
                    <Button onClick={() => handleSegmentClick('payment', null, 'primary')} className="bg-transparent text-purple-500 dark:text-purple-300 hover:text-black dark:hover:text-white hover:bg-purple-500/10 text-xs px-3 py-1 h-auto">View Analysis</Button>
                </div>
              <PieChartComponent title="Revenue by Payment Mode" data={incomeByPayment} onSegmentClick={(segment) => handleSegmentClick('payment', segment, 'primary')} />
            </div>
            
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 xl:col-span-2">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4 flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><Filter className="h-5 w-5 text-purple-500 dark:text-purple-400" /></div>Accounts Receivable</h2>
              <BarChartComponent 
                title="Accounts Receivable by Patient" 
                data={accountsReceivable} 
                compareData={comparisonAccountsReceivable} 
                primaryLabel={selectedMonthLabel}
                compareLabel={compareMonthLabel}
              />
            </div>
          </section>

           <section className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3"><div className="p-2 bg-gray-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"><BarChart3 className="h-5 w-5 text-purple-500 dark:text-purple-400" /></div>Expense Distribution</h2>
                <Button onClick={() => handleSegmentClick('expense', null, 'primary')} className="bg-transparent text-purple-500 dark:text-purple-300 hover:text-black dark:hover:text-white hover:bg-purple-500/10 text-xs px-3 py-1 h-auto">View Analysis</Button>
              </div>
            <PieChartComponent title="Expense Distribution" data={expensesByCategory} onSegmentClick={(segment) => handleSegmentClick('expense', segment, 'primary')} />
          </section>
        </main>

        <footer className="text-center pt-12 text-sm text-zinc-600 dark:text-zinc-500">
          <p>
            © 2025 Miracle Analytics. All Rights Reserved. Dashboard by{' '}
            <button onClick={() => setIsCreatorModalOpen(true)} className="text-zinc-800 dark:text-zinc-300 hover:text-purple-500 dark:hover:text-purple-400 underline underline-offset-2 transition-colors">
              Fadahunsi Miracle
            </button>.
          </p>
        </footer>

        <AiChatButton onClick={() => setIsChatOpen(true)} />
        <AiChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} financialData={financialSummary} />
        <CreatorModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />
      </div>
      
      <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => { setSidebarOpen(false); setSelectedSegment(null); setDetailsContext(null); }}
          activeSection={activeSection}
          primaryMonthLabel={selectedMonthLabel}
          paymentData={incomeByPayment}
          expenseData={expensesByCategory}
          onSegmentClick={handleSegmentClick}
          selectedSegmentData={selectedSegmentData}
          selectedSegment={selectedSegment}
          compareMonthLabel={compareMonthLabel}
          comparePaymentData={comparisonIncomeByPayment}
          compareExpenseData={comparisonExpensesByCategory}
          detailsContext={detailsContext}
      />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleNewFileUpload} 
        className="hidden" 
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
  );
}