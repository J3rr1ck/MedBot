import React from 'react';
import { DiagnosisResult, UrgencyLevel } from '../types';
import { 
  LucideAlertOctagon, 
  LucideAlertTriangle, 
  LucideCheckCircle, 
  LucideInfo, 
  LucideRefreshCw,
  LucideActivity,
  LucideStethoscope,
  LucideClipboardCheck,
  LucideHelpCircle,
  LucideArrowRight
} from 'lucide-react';

interface DiagnosisReportProps {
  result: DiagnosisResult;
  onReset: () => void;
}

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({ result, onReset }) => {
  
  const getUrgencyTheme = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.EMERGENCY:
        return {
          gradient: "from-red-600 to-rose-700",
          icon: <LucideAlertOctagon className="text-white" size={40} />,
          shadow: "shadow-red-200",
          text: "text-white",
          subtext: "text-red-100"
        };
      case UrgencyLevel.HIGH:
        return {
          gradient: "from-orange-500 to-amber-600",
          icon: <LucideAlertTriangle className="text-white" size={40} />,
          shadow: "shadow-orange-200",
          text: "text-white",
          subtext: "text-orange-100"
        };
      case UrgencyLevel.MEDIUM:
        return {
          gradient: "from-amber-400 to-yellow-500",
          icon: <LucideInfo className="text-white" size={40} />,
          shadow: "shadow-yellow-200",
          text: "text-white",
          subtext: "text-yellow-100"
        };
      case UrgencyLevel.LOW:
      default:
        return {
          gradient: "from-emerald-500 to-teal-600",
          icon: <LucideCheckCircle className="text-white" size={40} />,
          shadow: "shadow-emerald-200",
          text: "text-white",
          subtext: "text-emerald-100"
        };
    }
  };

  const getProbabilityColor = (prob: string) => {
    const p = prob.toLowerCase();
    if (p.includes('high')) return 'bg-blue-600 w-3/4';
    if (p.includes('medium') || p.includes('moderate')) return 'bg-amber-500 w-1/2';
    return 'bg-slate-400 w-1/4';
  };

  const theme = getUrgencyTheme(result.urgency);

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      
      {/* Hero / Urgency Header */}
      <div className={`rounded-3xl bg-gradient-to-br ${theme.gradient} p-8 shadow-xl ${theme.shadow} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black opacity-5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
            {theme.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                {result.urgency} Urgency
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight tracking-tight">Analysis Complete</h2>
            <p className={`text-lg ${theme.subtext} leading-relaxed max-w-2xl`}>
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Conditions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <LucideActivity size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Potential Conditions</h3>
          </div>

          <div className="space-y-4">
            {result.potentialConditions.map((condition, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {condition.name}
                        </h4>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {condition.probability}
                        </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${getProbabilityColor(condition.probability)}`} />
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4 border-l-2 border-slate-100 pl-4">
                  {condition.description}
                </p>
                
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <LucideStethoscope size={12} /> Matches Symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {condition.commonSymptomsMatched.map((sym, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actions & Guidance */}
        <div className="space-y-8">
          {/* Recommended Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100/50 flex items-center gap-2">
              <LucideClipboardCheck className="text-emerald-600" size={20} />
              <h3 className="font-bold text-slate-800">Recommended Actions</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {result.recommendedActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <LucideCheckCircle size={12} />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions for Doctor */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-purple-50/50 px-6 py-4 border-b border-purple-100/50 flex items-center gap-2">
              <LucideHelpCircle className="text-purple-600" size={20} />
              <h3 className="font-bold text-slate-800">Ask Your Doctor</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {result.questionsToAskDoctor.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <LucideArrowRight className="mt-1 flex-shrink-0 text-purple-300 group-hover:text-purple-500 transition-colors" size={16} />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 italic transition-colors">"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto">
          <span className="font-bold text-slate-700 block mb-1">Disclaimer</span>
          {result.disclaimer}
        </p>
      </div>

      <div className="flex justify-center pt-2">
        <button 
          onClick={onReset}
          className="group flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          <LucideRefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Start New Analysis
        </button>
      </div>
    </div>
  );
};
