import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateTryOnImage, refineGeneratedImage } from './services/geminiService';
import type { Background } from './types';
import { INITIAL_PROMPT, getRefinementPrompt } from './constants';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = useCallback(async () => {
    if (!userImage || !outfitImage) {
      setError('Please upload both a selfie and an outfit image.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage('✨ Styling your look…');
    setGeneratedImage(null);

    try {
      const result = await generateTryOnImage(userImage, outfitImage, INITIAL_PROMPT);
      if (result.image) {
        setGeneratedImage(result.image);
      } else {
        setError('Failed to generate image. The AI could not process the request.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while generating your try-on. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [userImage, outfitImage]);

  const handleRefinement = useCallback(async (type: 'prompt' | 'background', value: string | Background) => {
    if (!generatedImage) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(type === 'background' ? `Changing background...` : 'Applying your edits...');

    try {
      const prompt = getRefinementPrompt(type, value);
      const result = await refineGeneratedImage(generatedImage, prompt);
       if (result.image) {
        setGeneratedImage(result.image);
      } else {
        setError(`Failed to apply refinement. The AI could not process the request.`);
      }
    } catch (err) {
       console.error(err);
       setError(`An unexpected error occurred while refining the image. Please try again.`);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [generatedImage]);


  return (
    <div className="min-h-screen bg-brand-dark font-sans text-brand-light bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900 bg-[length:200%_200%] animate-gradient">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="bg-brand-card backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 sticky top-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-brand-light">Create Your Virtual Look</h2>
              <p className="text-brand-secondary mt-2">Upload your photo and an outfit to see the magic happen.</p>
            </div>

            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                id="user-uploader"
                title="Upload your selfie 📸"
                tip="Well-lit, front-facing photo"
                onImageUpload={setUserImage}
              />
              <ImageUploader
                id="outfit-uploader"
                title="Upload outfit 🧥"
                tip="Flat-lay image works best"
                onImageUpload={setOutfitImage}
              />
            </div>

            <button
              onClick={handleGeneration}
              disabled={!userImage || !outfitImage || isLoading}
              className="w-full bg-brand-action hover:bg-brand-action-hover text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading && loadingMessage.includes('Styling') ? (
                 <LoadingSpinner />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              )}
              Generate Try-On
            </button>
          </div>

          <div className="bg-brand-card backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl p-6 md:p-8 min-h-[60vh] flex flex-col justify-center items-center">
            {isLoading ? (
              <div className="text-center flex flex-col items-center justify-center h-full">
                <svg className="animate-spin h-16 w-16 text-brand-action" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg font-semibold text-brand-secondary animate-pulse">{loadingMessage}</p>
              </div>
            ) : (
              <ResultDisplay
                userImage={userImage}
                generatedImage={generatedImage}
                onRefine={handleRefinement}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;