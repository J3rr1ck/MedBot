import React from 'react';
import { LucideAlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-100 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <LucideAlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Important Medical Disclaimer</h2>
        </div>
        <div className="p-6 space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>MediAssist AI is not a doctor.</strong> The information provided by this application is for educational and informational purposes only.
          </p>
          <p>
            It is <strong>not</strong> intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="text-red-600 font-medium">
            If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </p>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm active:scale-[0.98]"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};