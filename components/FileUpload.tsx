
import React, { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from './Icons';

// New interface for monthly data
interface MonthlyData {
  data: any[];
  expenseCategories?: any[];
}

export interface AllMonthsData {
  [month: string]: MonthlyData;
}

interface FileUploadProps {
  onDataUploaded: (data: AllMonthsData) => void;
}

export const FileUpload = ({ onDataUploaded }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processExcelFile = useCallback((file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');
    
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

        const dataSheetRegex = /^([a-zA-Z]+)_Data$/i; // More flexible regex
        const foundMonths: { name: string; abbr: string; originalSheetName: string }[] = [];
        const monthKeys = Object.keys(monthMap);

        // Step 1: Find all valid month data sheets
        workbook.SheetNames.forEach(sheetName => {
          const match = sheetName.match(dataSheetRegex);
          if (match) {
            const originalAbbr = match[1]; // e.g., "Sept"
            
            // Find the correct month by checking if the sheet name's abbreviation starts with a known month key
            const foundMonthKey = monthKeys.find(key => 
                originalAbbr.toLowerCase().startsWith(key.toLowerCase())
            );

            if (foundMonthKey) { // e.g., foundMonthKey will be "Sep"
              const monthFullName = monthMap[foundMonthKey as keyof typeof monthMap];
              foundMonths.push({
                name: monthFullName,
                abbr: originalAbbr, // Use the original abbreviation ("Sept") to find the matching expense sheet
                originalSheetName: sheetName,
              });
            }
          }
        });

        // Step 2: If multi-month sheets were found, sort them and build the data object
        if (foundMonths.length > 0) {
          // Sort months chronologically
          foundMonths.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
          
          // Build the allMonthsData object in the correct order
          foundMonths.forEach(month => {
            const worksheet = workbook.Sheets[month.originalSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            allMonthsData[month.name] = { data: jsonData };

            const expenseSheetName = `${month.abbr}_Expenses`;
            // Find expense sheet case-insensitively
            const expenseSheetKey = Object.keys(workbook.Sheets).find(s => s.toLowerCase() === expenseSheetName.toLowerCase());
            
            if (expenseSheetKey) {
              const expenseWorksheet = workbook.Sheets[expenseSheetKey];
              allMonthsData[month.name].expenseCategories = XLSX.utils.sheet_to_json(expenseWorksheet);
            }
          });
        }

        // Step 3: Handle single-month file as a fallback
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
            throw new Error('No valid data sheets found. For multi-month files, name sheets like "Jan_Data", "Sep_Data", etc.');
        }

        onDataUploaded(allMonthsData);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000); // Auto-reset after 2 seconds
      } catch (error: any) {
        console.error('Error processing Excel file:', error);
        setErrorMessage(error.message || 'Failed to process Excel file. Please check the file format and sheet names.');
        setUploadStatus('error');
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
        setErrorMessage('Failed to read the file.');
        setUploadStatus('error');
        setIsUploading(false);
    }
    reader.readAsArrayBuffer(file);
  }, [onDataUploaded]);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      processExcelFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelFile(e.dataTransfer.files[0]);
    }
  };
  
  const acceptableFiles = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div
        onClick={() => uploadStatus !== 'success' && inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragActive ? 'border-blue-400 bg-blue-500/10 scale-105' : 'border-blue-300/50 hover:border-blue-400/70 hover:bg-blue-500/5'}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
          ${uploadStatus !== 'success' ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <input ref={inputRef} type="file" className="hidden" accept={acceptableFiles} onChange={(e) => handleFileSelect(e.target.files)} />
        
        <div className="space-y-6">
          <div className="flex justify-center">
            {uploadStatus === 'success' ? (
              <div className="relative"><div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-75 animate-pulse"></div><CheckCircle className="relative h-16 w-16 text-green-400" /></div>
            ) : uploadStatus === 'error' ? (
              <div className="relative"><div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-75 animate-pulse"></div><AlertCircle className="relative h-16 w-16 text-red-400" /></div>
            ) : isUploading ? (
              <div className="relative"><div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-75 animate-pulse"></div><Upload className="relative h-16 w-16 text-blue-400 animate-bounce" /></div>
            ) : (
              <div className="relative group"><div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div><Upload className="relative h-16 w-16 text-blue-300 group-hover:text-white transition-colors duration-300" /></div>
            )}
          </div>

          {uploadStatus === 'success' ? (
            <div className="space-y-2"><h3 className="text-2xl font-bold text-green-400">Upload Successful!</h3><p className="text-green-300">Your financial data has been processed.</p></div>
          ) : uploadStatus === 'error' ? (
            <div className="space-y-2"><h3 className="text-2xl font-bold text-red-400">Upload Failed</h3><p className="text-red-300">{errorMessage}</p></div>
          ) : isUploading ? (
            <div className="space-y-2"><h3 className="text-2xl font-bold text-blue-400">Processing...</h3><p className="text-blue-300">Analyzing your financial data, please wait.</p></div>
          ) : (
            <div className="space-y-4"><h3 className="text-2xl font-bold text-white">Upload Financial Data</h3><p className="text-blue-200 text-lg">{isDragActive ? 'Drop your Excel file here' : 'Drag and drop your Excel file here, or click to browse'}</p></div>
          )}

          {uploadStatus !== 'success' && !isUploading && (
            <div className="flex items-center justify-center gap-6 text-sm text-blue-300/80">
              <div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" /><span>.xlsx, .xls supported</span></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <div className="flex items-center gap-2"><span>Professional Analytics</span></div>
            </div>
          )}
        </div>
      </div>

      {uploadStatus === 'error' && (
        <div className="mt-6 text-center">
          <button onClick={() => setUploadStatus('idle')} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
