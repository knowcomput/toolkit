
import React, { useState } from 'react';
import { ConversionSettings, UploadedFile, ImageFormat } from '../types';
import { Icon } from './Icon';

interface ConversionPanelProps {
  originalFile: UploadedFile;
  convertedImage: { url: string; format: string; originalSize: number, newSize: number } | null;
  onConvert: (settings: ConversionSettings) => void;
  onReset: () => void;
  error: string | null;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ConversionPanel: React.FC<ConversionPanelProps> = ({ originalFile, convertedImage, onConvert, onReset, error }) => {
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'jpeg',
    quality: 80,
  });

  const handleSettingsChange = <K extends keyof ConversionSettings>(key: K, value: ConversionSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const compressionPercentage = convertedImage ? 
    Math.round(((convertedImage.originalSize - convertedImage.newSize) / convertedImage.originalSize) * 100) : 0;

  return (
    <div className="w-full max-w-4xl p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Original Image & Options */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-300">Original Image</h2>
          <div className="relative aspect-video bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={originalFile.previewUrl} alt="Original preview" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="text-sm text-slate-400">
            {originalFile.file.name} ({formatFileSize(originalFile.file.size)})
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-slate-400 mb-1">Format</label>
              <select
                id="format"
                value={settings.format}
                onChange={(e) => handleSettingsChange('format', e.target.value as ImageFormat)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-slate-400 mb-1">Quality: {settings.quality}</label>
              <input
                id="quality"
                type="range"
                min="1"
                max="100"
                value={settings.quality}
                onChange={(e) => handleSettingsChange('quality', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
              />
            </div>
          </div>
          <button
              onClick={() => onConvert(settings)}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="sparkles" className="w-5 h-5" />
              Convert with AI
            </button>
        </div>

        {/* Right Side: Converted Image */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-300">Converted Image</h2>
          <div className="relative aspect-video bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center">
            {convertedImage ? (
              <img src={convertedImage.url} alt="Converted preview" className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="text-slate-500">Your converted image will appear here.</div>
            )}
          </div>
          {convertedImage && (
            <div className="text-sm text-slate-400 flex justify-between">
              <span>{`converted.${convertedImage.format}`} ({formatFileSize(convertedImage.newSize)})</span>
              {compressionPercentage > 0 && <span className="font-semibold text-green-400">{compressionPercentage}% smaller</span>}
              {compressionPercentage < 0 && <span className="font-semibold text-red-400">{Math.abs(compressionPercentage)}% larger</span>}
            </div>
          )}
          {convertedImage && (
            <div className="mt-auto pt-4 border-t border-slate-700 flex flex-col sm:flex-row gap-3">
               <a
                href={convertedImage.url}
                download={`converted_image.${convertedImage.format}`}
                className="flex-1 text-center flex items-center justify-center gap-2 bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                <Icon name="download" className="w-5 h-5"/>
                Download
              </a>
              <button
                onClick={onReset}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Convert Another
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-md text-sm">{error}</div>}
    </div>
  );
};

export default ConversionPanel;
