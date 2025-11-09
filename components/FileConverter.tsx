
import React, { useState, useCallback } from 'react';
import { TextFileFormat } from '../types';
import { convertFile } from '../services/geminiService';
import FileUpload from './FileUpload';
import Loader from './Loader';
import { Icon } from './Icon';

interface FileConverterProps {
  onBack: () => void;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
    aria-label="Back to tools menu"
  >
    <Icon name="arrow-left" className="w-4 h-4" />
    Back to Tools
  </button>
);

const fileFormats: TextFileFormat[] = ['json', 'csv', 'xml', 'yaml', 'md', 'html', 'txt'];

const FileConverter: React.FC<FileConverterProps> = ({ onBack }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fromFormat, setFromFormat] = useState<TextFileFormat>('json');
    const [toFormat, setToFormat] = useState<TextFileFormat>('csv');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileContent(reader.result as string);
            setFileName(file.name);
            setResult(null);
            setError(null);
        };
        reader.onerror = () => {
            setError('Failed to read the selected file.');
        };
        reader.readAsText(file);
    }, []);

    const handleConvert = async () => {
        if (!fileContent) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const convertedContent = await convertFile(fileContent, fromFormat, toFormat);
            setResult(convertedContent);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Conversion failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const downloadResult = () => {
        if (!result) return;
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const name = fileName?.split('.')[0] || 'converted';
        a.download = `${name}.${toFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!fileContent) {
      return (
        <div className="w-full">
          <BackButton onClick={onBack} />
          <FileUpload 
              onFileSelect={handleFileSelect} 
              accept=".txt,.json,.csv,.md,.html,.xml,.yaml"
              title="Drag & drop your text file"
              supportedFormats="Supports TXT, JSON, CSV, MD, HTML, XML, YAML"
          />
        </div>
      );
    }

    return (
        <div className="w-full max-w-4xl p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl flex flex-col gap-4">
            <BackButton onClick={onBack} />
            <div className="text-sm text-slate-400">
                File: <span className="font-medium text-slate-300">{fileName}</span>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <label htmlFor="fromFormat" className="block text-sm font-medium text-slate-400 mb-1">From</label>
                    <select
                        id="fromFormat"
                        value={fromFormat}
                        onChange={(e) => setFromFormat(e.target.value as TextFileFormat)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                    >
                        {fileFormats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="toFormat" className="block text-sm font-medium text-slate-400 mb-1">To</label>
                    <select
                        id="toFormat"
                        value={toFormat}
                        onChange={(e) => setToFormat(e.target.value as TextFileFormat)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                    >
                        {fileFormats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader /> Converting...</> : <><Icon name="sparkles" className="w-5 h-5" /> Convert with AI</>}
            </button>

            {error && <div className="mt-2 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md text-sm">{error}</div>}
            
            {result && (
                <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-300">Result</h3>
                    <textarea 
                        readOnly 
                        value={result} 
                        className="w-full h-64 bg-slate-900/50 rounded-md p-3 font-mono text-sm border border-slate-700"
                    />
                    <button
                        onClick={downloadResult}
                        className="w-full flex items-center justify-center gap-2 bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        <Icon name="download" className="w-5 h-5" />
                        Download .{toFormat}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileConverter;
