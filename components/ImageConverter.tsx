
import React, { useState, useCallback } from 'react';
import { AppState, ConversionSettings, UploadedFile } from '../types';
import { convertImage } from '../services/geminiService';
import FileUpload from './FileUpload';
import ConversionPanel from './ConversionPanel';
import Loader from './Loader';
import { Icon } from './Icon';

interface ImageConverterProps {
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

const ImageConverter: React.FC<ImageConverterProps> = ({ onBack }) => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [convertedImage, setConvertedImage] = useState<{ url: string; format: string; originalSize: number, newSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile({ file, previewUrl: reader.result as string });
      setAppState(AppState.FILE_UPLOADED);
      setConvertedImage(null);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the selected file.');
      setAppState(AppState.ERROR);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleConvert = useCallback(async (settings: ConversionSettings) => {
    if (!uploadedFile) return;

    setAppState(AppState.CONVERTING);
    setError(null);
    try {
      const base64Data = uploadedFile.previewUrl.split(',')[1];
      const resultBase64 = await convertImage(base64Data, uploadedFile.file.type, settings);
      
      const newUrl = `data:image/${settings.format};base64,${resultBase64}`;
      const newSize = resultBase64.length * 0.75;

      setConvertedImage({ 
        url: newUrl, 
        format: settings.format, 
        originalSize: uploadedFile.file.size,
        newSize: newSize
      });
      setAppState(AppState.RESULT_READY);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during conversion.';
      setError(`Conversion failed: ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, [uploadedFile]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setUploadedFile(null);
    setConvertedImage(null);
    setError(null);
  }, []);

  return (
    <div className="w-full">
      <BackButton onClick={onBack} />
      {appState === AppState.IDLE && <FileUpload onFileSelect={handleFileSelect} />}
      
      {(appState === AppState.FILE_UPLOADED || appState === AppState.RESULT_READY || appState === AppState.ERROR) && uploadedFile && (
        <ConversionPanel
          originalFile={uploadedFile}
          convertedImage={convertedImage}
          onConvert={handleConvert}
          onReset={handleReset}
          error={error}
        />
      )}

      {appState === AppState.CONVERTING && (
          <div className="w-full text-center p-8 bg-slate-800 border border-slate-700 rounded-lg">
              <Loader />
              <p className="text-lg text-slate-300 mt-4">AI is converting your image...</p>
              <p className="text-sm text-slate-400">This may take a moment.</p>
          </div>
      )}
    </div>
  );
};

export default ImageConverter;
