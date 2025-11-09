
import React, { useState } from 'react';
import { TextAnalysis } from '../types';
import { analyzeText } from '../services/geminiService';
import Loader from './Loader';
import { Icon } from './Icon';

interface TextAnalyzerProps {
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

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="bg-slate-700/50 p-3 rounded-lg">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-100">{value}</p>
    </div>
);

const TextAnalyzer: React.FC<TextAnalyzerProps> = ({ onBack }) => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<TextAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeText(text);
            setAnalysis(result);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Analysis failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl flex flex-col gap-4">
            <BackButton onClick={onBack} />
            <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
                <h2 className="text-lg font-semibold text-slate-300 mb-2">Enter Text to Analyze</h2>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full h-48 bg-slate-900/50 rounded-md p-3 font-sans text-base border border-slate-700 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !text.trim()}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <><Loader /> Analyzing...</> : <><Icon name="sparkles" className="w-5 h-5" /> Analyze with AI</>}
                </button>
            </div>
            
            {error && <div className="p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md text-sm">{error}</div>}
            
            {analysis && (
                <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl space-y-4">
                    <h2 className="text-xl font-bold text-slate-200">Analysis Results</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Words" value={analysis.wordCount.toLocaleString()} />
                        <StatCard label="Characters" value={analysis.charCount.toLocaleString()} />
                        <StatCard label="Sentences" value={analysis.sentenceCount.toLocaleString()} />
                        <StatCard label="Read Time" value={`${Math.ceil(analysis.readingTimeSeconds / 60)} min`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-300">Sentiment</h3>
                        <p className="capitalize text-lg text-brand-secondary">{analysis.sentiment}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-slate-300">Summary</h3>
                        <p className="text-slate-400 bg-slate-900/50 p-3 rounded-md">{analysis.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-300">Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {analysis.keywords.map(kw => <span key={kw} className="bg-slate-700 text-slate-300 text-sm px-2 py-1 rounded-full">{kw}</span>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextAnalyzer;
