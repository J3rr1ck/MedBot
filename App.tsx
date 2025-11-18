import React, { useState } from 'react';
import { Header } from './components/Header';
import { SymptomForm } from './components/SymptomForm';
import { DiagnosisReport } from './components/DiagnosisReport';
import { DisclaimerModal } from './components/DisclaimerModal';
import { DiagnosisResult } from './types';
import { analyzeSymptoms } from './services/geminiService';
import { LucideActivity, LucideLoader2 } from 'lucide-react';

const App: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  const handleAnalyze = async (symptoms: string, images: string[]) => {
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const result = await analyzeSymptoms(symptoms, images);
      setDiagnosis(result);
    } catch (err) {
      setError("Failed to analyze symptoms. Please try again or verify your API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      <Header />

      {!disclaimerAccepted && (
        <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {!disclaimerAccepted ? (
          <div className="flex items-center justify-center h-64 text-slate-400">
            Please accept the disclaimer to continue.
          </div>
        ) : (
          <>
            {/* Input Section */}
            {!diagnosis && !loading && (
              <div className="animate-fade-in">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <LucideActivity size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Symptom Checker</h2>
                        <p className="text-slate-500 text-sm">Describe your symptoms and upload images if relevant.</p>
                      </div>
                    </div>
                    <SymptomForm onSubmit={handleAnalyze} />
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
                        {error}
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-96 animate-pulse">
                <LucideLoader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-700">Analyzing Symptoms...</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md text-center">
                  Our AI is reviewing your inputs against medical knowledge bases. This may take a few seconds.
                </p>
              </div>
            )}

            {/* Results Section */}
            {diagnosis && !loading && (
              <DiagnosisReport result={diagnosis} onReset={handleReset} />
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} MediAssist AI. For informational purposes only. Not a medical device.</p>
      </footer>
    </div>
  );
};

export default App;