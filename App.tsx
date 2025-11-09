
import React, { useState } from 'react';
import { Tool } from './types';
import Header from './components/Header';
import ToolMenu from './components/ToolMenu';
import ImageConverter from './components/ImageConverter';
import FileConverter from './components/FileConverter';
import TextAnalyzer from './components/TextAnalyzer';

function App() {
  const [currentTool, setCurrentTool] = useState<Tool>('menu');

  const renderTool = () => {
    switch (currentTool) {
      case 'imageConverter':
        return <ImageConverter onBack={() => setCurrentTool('menu')} />;
      case 'fileConverter':
        return <FileConverter onBack={() => setCurrentTool('menu')} />;
      case 'textAnalyzer':
        return <TextAnalyzer onBack={() => setCurrentTool('menu')} />;
      case 'menu':
      default:
        return <ToolMenu onSelectTool={setCurrentTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center">
        {renderTool()}
      </main>
      <footer className="w-full text-center py-4 mt-8">
        <p className="text-sm text-slate-500">Powered by Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;
