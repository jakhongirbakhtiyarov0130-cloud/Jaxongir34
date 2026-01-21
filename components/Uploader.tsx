
import React, { useRef } from 'react';

interface UploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        onClick={!isLoading ? handleClick : undefined}
        className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center cursor-pointer
          ${isLoading ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'bg-white border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/30'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />
        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Musiqa notasi rasmini yuklang</h3>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          JPG, PNG formatidagi varaqlarni yuklang. Sun'iy intellekt ularni avtomatik ravishda raqamli MusicXML-ga aylantiradi.
        </p>
        <button 
          disabled={isLoading}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors disabled:bg-gray-400"
        >
          Faylni tanlash
        </button>
      </div>
    </div>
  );
};

export default Uploader;
