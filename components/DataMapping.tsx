import React, { useState, useCallback, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { useAuth, WorkspaceConfig } from '../AuthContext';
import { db } from '../firebaseConfig';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Upload, FileSpreadsheet, AlertCircle, Spinner, LogOut, ArrowRight } from './Icons';
import { Logo } from './Logo';
import { auth } from '../firebaseConfig';

// Define the structure for mapping fields, including labels for the UI
const MAPPING_FIELDS = [
  // Main Data Sheet
  { id: 'incomeField', label: 'Income Amount', required: true, sheet: 'Main Data' },
  { id: 'expenseField', label: 'Expense Amount', required: true, sheet: 'Main Data' },
  { id: 'dateField', label: 'Transaction Date', required: true, sheet: 'Main Data' },
  { id: 'departmentField', label: 'Department/Unit', required: true, sheet: 'Main Data' },
  { id: 'paymentModeField', label: 'Payment Method', required: true, sheet: 'Main Data' },
  { id: 'purposeField', label: 'Purpose/Description', required: true, sheet: 'Main Data' },
  { id: 'nameField', label: 'Patient/Client Name', required: true, sheet: 'Main Data' },
  { id: 'balanceField', label: 'Outstanding Balance', required: true, sheet: 'Main Data' },
  { id: 'workersField', label: 'Staff/Worker Costs', required: false, sheet: 'Main Data' },
  { id: 'serialNumberField', label: 'Serial Number (S/N)', required: false, sheet: 'Main Data' },
  // Expense Categories Sheet
  { id: 'expenseCategoryDateField', label: 'Expense Date', required: false, sheet: 'Expenses' },
  { id: 'expenseCategoryDepartmentField', label: 'Expense Department', required: false, sheet: 'Expenses' },
  { id: 'expenseCategoryPurposeField', label: 'Expense Purpose', required: false, sheet: 'Expenses' },
];

export default function DataMapping() {
  const { currentUser, reloadConfig } = useAuth();
  const [columns, setColumns] = useState<string[]>([]);
  const [expenseColumns, setExpenseColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [mapping, setMapping] = useState<Partial<WorkspaceConfig>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          throw new Error("The uploaded file contains no sheets.");
        }

        // Extract columns from the first sheet (Main Data)
        const mainSheetName = workbook.SheetNames[0];
        const mainWorksheet = workbook.Sheets[mainSheetName];
        const mainData = XLSX.utils.sheet_to_json<{[key: string]: any}>(mainWorksheet, { header: 1 });
        const mainHeaders = mainData[0] ? mainData[0].map(String) : [];
        setColumns(mainHeaders);

        // Extract columns from the second sheet (Expenses), if it exists
        if (workbook.SheetNames.length > 1) {
          const expenseSheetName = workbook.SheetNames[1];
          const expenseWorksheet = workbook.Sheets[expenseSheetName];
          const expenseData = XLSX.utils.sheet_to_json<{[key: string]: any}>(expenseWorksheet, { header: 1 });
          const expenseHeaders = expenseData[0] ? expenseData[0].map(String) : [];
          setExpenseColumns(expenseHeaders);
        } else {
          setExpenseColumns([]); // No second sheet
        }

      } catch (err: any) {
        setError(err.message || 'Failed to process the Excel file.');
        setColumns([]);
        setExpenseColumns([]);
        setFileName('');
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleMappingChange = (fieldId: keyof WorkspaceConfig, value: string) => {
    setMapping(prev => ({ ...prev, [fieldId]: value }));
  };
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("You are not signed in.");
      return;
    }

    // Validate required fields
    for (const field of MAPPING_FIELDS) {
      if (field.required && !mapping[field.id as keyof WorkspaceConfig]) {
        setError(`Please map the required field: "${field.label}"`);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    
    const configToSave: WorkspaceConfig = {
      // Set defaults for identifiers
      expenseModeIdentifier: 'EXP',
      cashBfIdentifier: 'cash b/f',
      cashBalanceIdentifier: 'cash balance',
      // Fill in mapped fields, using empty strings for unmapped optional fields
      ...MAPPING_FIELDS.reduce((acc, field) => {
        acc[field.id as keyof WorkspaceConfig] = mapping[field.id as keyof WorkspaceConfig] || '';
        return acc;
      }, {} as any)
    };

    try {
      await db.collection('mappings').doc(currentUser.uid).set(configToSave);
      // Trigger a reload of the auth context to fetch the new config and redirect
      reloadConfig();
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration. Please try again.');
      setIsLoading(false);
    }
  };
  
  const isMappingComplete = MAPPING_FIELDS.every(field => !field.required || !!mapping[field.id as keyof WorkspaceConfig]);

  return (
    <div className="min-h-screen bg-[#101010] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-6 right-6">
          <Button 
            onClick={handleSignOut} 
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Logo />
          <h2 className="text-4xl font-extrabold mt-4">One-Time Workspace Setup</h2>
          <p className="text-lg text-zinc-400 mt-2 max-w-2xl mx-auto">
            Let's configure Miracle Analytics to understand your data. Please upload a sample Excel file.
          </p>
        </div>

        {!fileName ? (
          <div className="text-center">
            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
              <Upload className="h-6 w-6" />
              Upload Your Excel File
            </label>
            <input id="file-upload" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="bg-black/70 backdrop-blur-2xl rounded-2xl border border-zinc-800 p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-zinc-400 text-sm">File Loaded</p>
                  <p className="font-semibold text-white">{fileName}</p>
                </div>
              </div>
              <label htmlFor="file-upload" className="text-sm text-purple-400 hover:text-purple-300 underline cursor-pointer">
                Change File
              </label>
              <input id="file-upload" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
            </div>

            <h3 className="text-2xl font-bold mb-6">Map Your Data Columns</h3>
            <p className="text-zinc-400 mb-6">Match the fields our system needs with the corresponding column names from your file.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {MAPPING_FIELDS.map(field => {
                const availableColumns = field.sheet === 'Expenses' ? expenseColumns : columns;
                return (
                  <div key={field.id} className="flex flex-col gap-2">
                    <label htmlFor={field.id} className="text-sm font-medium text-zinc-300 flex items-center">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                      <span className="text-xs text-zinc-500 ml-2">({field.sheet})</span>
                    </label>
                    <Select onValueChange={(value) => handleMappingChange(field.id as keyof WorkspaceConfig, value)} value={mapping[field.id as keyof WorkspaceConfig] || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=""><em>None</em></SelectItem>
                        {availableColumns.map(col => (
                          <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
            
            {error && (
              <div className="mt-6 flex items-center gap-3 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!isMappingComplete || isLoading}
                className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-8 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {isLoading ? <><Spinner className="h-5 w-5 animate-spin" /> Saving...</> : <>Save & Build Dashboard <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
