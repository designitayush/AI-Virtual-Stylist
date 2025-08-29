import React, { useState } from 'react';
import type { Background } from '../types';

interface ResultDisplayProps {
  userImage: string | null;
  generatedImage: string | null;
  onRefine: (type: 'prompt' | 'background', value: string | Background) => void;
}

const backgrounds: { name: Background; icon: JSX.Element }[] = [
  { name: 'White Studio', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg> },
  { name: 'City Street', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg> },
  { name: 'Runway', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg> }
];


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ userImage, generatedImage, onRefine }) => {
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [editText, setEditText] = useState('');

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = 'virtual-try-on.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!generatedImage) {
    return (
      <div className="text-center text-brand-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-xl font-semibold">Your virtual try-on will appear here.</p>
        <p className="mt-1 text-sm">Fill in the details on the left and click "Generate".</p>
      </div>
    );
  }

  const userImageUrl = userImage ? `data:image/jpeg;base64,${userImage}` : '';
  const generatedImageUrl = `data:image/png;base64,${generatedImage}`;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full relative">
         {userImage && (
             <div className="flex justify-center mb-4">
                <div className="bg-brand-dark/50 border border-brand-border p-1 rounded-xl flex gap-1 backdrop-blur-sm">
                    <button 
                        onClick={() => setShowBeforeAfter(false)} 
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors w-28 ${!showBeforeAfter ? 'bg-brand-action text-white shadow-md' : 'text-brand-secondary hover:bg-white/10'}`}>
                        Result
                    </button>
                    <button 
                        onClick={() => setShowBeforeAfter(true)} 
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors w-28 ${showBeforeAfter ? 'bg-brand-action text-white shadow-md' : 'text-brand-secondary hover:bg-white/10'}`}>
                        Compare
                    </button>
                </div>
            </div>
        )}
        <div className={`grid gap-4 transition-all duration-500 ${showBeforeAfter ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {showBeforeAfter && userImageUrl && (
            <div className="flex flex-col items-center">
              <img src={userImageUrl} alt="Original" className="w-full max-w-md rounded-lg shadow-md object-contain" />
              <p className="mt-2 font-semibold text-brand-secondary">Before</p>
            </div>
          )}
          <div className={`flex flex-col items-center ${showBeforeAfter ? '' : 'col-span-1'}`}>
            <img src={generatedImageUrl} alt="Generated Try-On" className="w-full max-w-md rounded-lg shadow-md object-contain" />
            <p className="mt-2 font-semibold text-brand-secondary">{showBeforeAfter ? 'After' : 'Your Styled Look'}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-6">
        <div>
            <p className="text-sm font-semibold text-brand-secondary mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit with Text
            </p>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="e.g., 'add a red scarf'"
                    className="flex-grow bg-white/5 border border-brand-border rounded-lg px-4 py-2 text-brand-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-action transition-shadow"
                    aria-label="Edit your look with text"
                />
                 <button
                    onClick={() => { if(editText.trim()) { onRefine('prompt', editText) } }}
                    disabled={!editText.trim()}
                    className="px-5 py-2 font-bold text-white bg-brand-action rounded-lg hover:bg-brand-action-hover disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                 >
                    Update
                 </button>
            </div>
             <button
                onClick={() => setEditText('Add a stylish necklace and sunglasses')}
                className="w-full mt-3 px-4 py-2 text-sm text-center font-medium text-brand-action bg-brand-action/10 rounded-lg hover:bg-brand-action/20 transition-colors"
            >
                Wear Accessories ✨ (Try a suggestion)
            </button>
        </div>
        
        <div>
            <p className="text-sm font-semibold text-brand-secondary mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Swap Background 🌆
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {backgrounds.map(({ name, icon }) => (
                     <button key={name} onClick={() => onRefine('background', name)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-brand-light bg-white/5 border border-brand-border rounded-md shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-action transition-colors">
                        {icon} {name}
                     </button>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full max-w-xl pt-4 border-t border-brand-border flex flex-col sm:flex-row gap-3">
        <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-brand-light bg-white/10 border border-brand-border rounded-lg shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-action transition-colors"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Save/Share 📤
        </button>
        <button
            onClick={() => alert('Redirecting to purchase page... (demo)')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-brand-action rounded-lg shadow-sm hover:bg-brand-action-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-blue-500 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Buy Now 🛒
        </button>
      </div>
    </div>
  );
};