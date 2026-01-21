
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Uploader from './components/Uploader';
import ResultView from './components/ResultView';
import { analyzeSheetMusic } from './services/geminiService';
import { AppStatus, ConversionResult } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<string>("");

  const phases = [
    "Rasm AI'ga yuborilmoqda...",
    "Notalar qatorlari aniqlanmoqda...",
    "Ritm va temp tahlil qilinmoqda...",
    "Har bir nota MusicXML ga o'girilmoqda...",
    "Struktura tekshirilmoqda...",
    "Dastur javobini kuting, bu biroz vaqt olishi mumkin..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === AppStatus.ANALYZING) {
      let step = 0;
      setLoadingPhase(phases[0]);
      interval = setInterval(() => {
        step = (step + 1) % phases.length;
        setLoadingPhase(phases[step]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleFileSelect = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Fayl hajmi juda katta (maksimum 10MB).");
      setStatus(AppStatus.ERROR);
      return;
    }

    setStatus(AppStatus.UPLOADING);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      
      setStatus(AppStatus.ANALYZING);
      
      try {
        const data = await analyzeSheetMusic(base64String);
        setResult(data);
        setStatus(AppStatus.SUCCESS);
      } catch (err: any) {
        console.error("Conversion failed:", err);
        setErrorMessage(err.message || "Tahlil jarayonida xatolik yuz berdi.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Faylni o'qishda xatolik yuz berdi.");
      setStatus(AppStatus.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setLoadingPhase("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Notalarni <span className="text-indigo-600">Raqamlashtiring</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Qog'ozdagi nota varaqlaringizni professional MusicXML formatiga aylantiring.
          </p>
        </div>

        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center">
             <Uploader onFileSelect={handleFileSelect} isLoading={false} />
             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                <FeatureCard 
                  step="1" 
                  title="Yuklang" 
                  desc="Nota varag'i rasmini (JPG/PNG) yuklang." 
                  color="blue"
                />
                <FeatureCard 
                  step="2" 
                  title="Tahlil" 
                  desc="Gemini 3 Pro notalarni o'qiydi." 
                  color="indigo"
                />
                <FeatureCard 
                  step="3" 
                  title="Yuklab oling" 
                  desc="MusicXML faylini oling." 
                  color="purple"
                />
             </div>
          </div>
        )}

        {(status === AppStatus.UPLOADING || status === AppStatus.ANALYZING) && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center px-4">
              {loadingPhase}
            </h3>
            <p className="text-gray-500 text-sm md:text-base italic text-center max-w-md">
              Murakkab asarlar tahlili 1-2 daqiqa vaqt olishi mumkin...
            </p>
            {previewUrl && (status === AppStatus.ANALYZING) && (
              <div className="mt-12 relative">
                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20"></div>
                 <img src={previewUrl} alt="Preview" className="relative max-w-xs md:max-w-sm rounded-xl shadow-2xl border border-white/50 grayscale opacity-40" />
              </div>
            )}
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <ResultView result={result} onReset={resetApp} />
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-xl mx-auto bg-white border border-red-100 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-3">Xatolik yuz berdi</h3>
            <p className="text-red-600 mb-8 font-medium">
              {errorMessage}
            </p>
            <button 
              onClick={resetApp}
              className="w-full bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Qayta urinish
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2024 NotaScan AI. O'zbekiston uchun mahsus ishlab chiqilgan.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ step, title, desc, color }: { step: string, title: string, desc: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className={`bg-${color}-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
      <span className={`text-${color}-600 font-bold text-lg`}>{step}</span>
    </div>
    <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default App;
