// FIX: Added 'React' import to fix JSX parsing issue.
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Button } from './ui/Button';
import { Filter, X } from './Icons';

interface DashboardFiltersProps {
  selectedDuty: string | null;
  onDutyChange: (duty: string | null) => void;
  availableDuties: string[];
  dateRange: { start: string | null; end: string | null };
  onDateChange: (range: { start: string | null; end: string | null }) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  selectedCompareMonth: string | null;
  onCompareMonthChange: (month: string | null) => void;
}

export const DashboardFilters = ({ 
  selectedDuty, onDutyChange, availableDuties, 
  dateRange, onDateChange, 
  selectedMonth, onMonthChange, availableMonths,
  selectedCompareMonth, onCompareMonthChange
}: DashboardFiltersProps) => {
  const handleDateChange = (part: 'start' | 'end', value: string) => {
    onDateChange({ ...dateRange, [part]: value || null });
  };
  
  const clearDates = () => {
    onDateChange({ start: null, end: null });
  };

  const dateInputClasses = "bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                    <Filter className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Smart Filters ✨</h3>
            </div>
            
            {availableMonths.length > 1 && (
                <>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-zinc-300">Month:</label>
                        <Select value={selectedMonth} onValueChange={onMonthChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-zinc-300">Compare to:</label>
                        <Select 
                            value={selectedCompareMonth || 'none'} 
                            onValueChange={(value) => onCompareMonthChange(value === 'none' ? null : value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {availableMonths.filter(m => m !== selectedMonth).map(month => (
                                    <SelectItem key={month} value={month}>
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-300">Department:</label>
                <Select value={selectedDuty || 'all'} onValueChange={(value) => onDutyChange(value === 'all' ? null : value)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {availableDuties.map(duty => (
                            <SelectItem key={duty} value={duty}>{duty}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-300">Date Range:</label>
                <input type="date" value={dateRange.start || ''} onChange={(e) => handleDateChange('start', e.target.value)} className={dateInputClasses} />
                <span className="text-zinc-500">-</span>
                <input type="date" value={dateRange.end || ''} onChange={(e) => handleDateChange('end', e.target.value)} className={dateInputClasses} min={dateRange.start || undefined} />
                {(dateRange.start || dateRange.end) && (
                  <Button onClick={clearDates} className="p-1 h-auto bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                )}
            </div>
        </div>
        
        <div className="text-xs text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30 whitespace-nowrap">
            {availableDuties.length} departments available
        </div>
    </div>
  );
};