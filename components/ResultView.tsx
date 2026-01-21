
import React from 'react';
import { ConversionResult } from '../types';

interface ResultViewProps {
  result: ConversionResult;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const downloadXml = () => {
    // Ensure the content is treated as XML
    const finalXml = result.xmlContent.startsWith('<?xml') 
      ? result.xmlContent 
      : `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${result.xmlContent}`;
      
    const blob = new Blob([finalXml], { type: 'application/vnd.recordare.musicxml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'musiqa_notasi.musicxml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-50 to-white gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Muvaffaqiyatli yakunlandi!</h3>
            <p className="text-gray-500">Musiqa raqamli formatga o'tkazildi.</p>
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
             <button 
              onClick={onReset}
              className="flex-1 md:flex-none px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold transition-all active:scale-95"
            >
              Yangi rasm
            </button>
            <button 
              onClick={downloadXml}
              className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>XML yuklab olish</span>
            </button>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center text-lg">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              AI Tahlili (O'zbekcha)
            </h4>
            <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed shadow-inner min-h-[150px]">
              {result.summary}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center text-lg">
              <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              </div>
              MusicXML Prevyu
            </h4>
            <div className="bg-gray-900 rounded-2xl p-6 overflow-auto max-h-[350px] shadow-inner font-mono">
              <pre className="text-xs text-emerald-400">
                <code>{result.xmlContent.substring(0, 2000)}{result.xmlContent.length > 2000 ? '...' : ''}</code>
              </pre>
            </div>
            <p className="text-xs text-gray-400 italic text-center">Musiqa tahrirlovchilarda ochish uchun to'liq faylni yuklab oling.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
