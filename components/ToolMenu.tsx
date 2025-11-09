
import React from 'react';
import { Tool } from '../types';
import { Icon } from './Icon';

interface ToolCardProps {
  iconName: 'image' | 'file-code' | 'text-search';
  title: string;
  description: string;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ iconName, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-brand-secondary hover:bg-slate-700/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="flex items-center gap-4 mb-3">
        <Icon name={iconName} className="w-8 h-8 text-brand-secondary" />
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
      </div>
      <p className="text-slate-400">{description}</p>
    </div>
  );
};

interface ToolMenuProps {
  onSelectTool: (tool: Tool) => void;
}

const ToolMenu: React.FC<ToolMenuProps> = ({ onSelectTool }) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
      <ToolCard
        iconName="image"
        title="Image Converter"
        description="Convert, compress, and optimize your images into different formats like JPG, PNG, and WEBP."
        onClick={() => onSelectTool('imageConverter')}
      />
      <ToolCard
        iconName="file-code"
        title="File Converter"
        description="Transform text-based files between formats such as JSON, CSV, Markdown, and more with AI."
        onClick={() => onSelectTool('fileConverter')}
      />
      <ToolCard
        iconName="text-search"
        title="Text Analyzer"
        description="Get detailed insights from your text, including word count, sentiment, summary, and keywords."
        onClick={() => onSelectTool('textAnalyzer')}
      />
    </div>
  );
};

export default ToolMenu;
