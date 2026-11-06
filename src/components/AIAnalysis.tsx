import { Sparkles, Brain, CheckCircle2, Lightbulb, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface AIAnalysisProps {
  title?: string;
  summary?: string;
  keywords?: string[];
  priority?: number;
  compact?: boolean;
}

export const AIAnalysis = ({ title = "AI-analys", summary, keywords = [], priority = 7, compact = false }: AIAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  return (
    <div className={`rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50/50 p-5 ${compact ? "p-4" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Sparkles size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI-insikter</h3>
            <p className="text-xs text-slate-500">Automatisk analys av upphandlingen</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing || analyzed}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            analyzed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-primary text-white hover:bg-sky-600 disabled:opacity-60"
          }`}
        >
          {analyzing ? <Loader2 size={14} className="animate-spin" /> : analyzed ? <CheckCircle2 size={14} /> : <Brain size={14} />}
          {analyzing ? "Analyserar..." : analyzed ? "Klar" : "Analysera"}
        </button>
      </div>

      {analyzed && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <div className="rounded-xl bg-white/80 p-3.5 text-sm leading-relaxed text-slate-700 shadow-sm">
            <p>{summary || "AI:n har analyserat upphandlingen och identifierat nyckelområden, risker och konkurrensfaktorer. Detta ger en snabb överblick över möjlighetens potential och vilka resurser som krävs för att lämna ett starkt anbud."}</p>
          </div>
          
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <Lightbulb size={13} />
                Möjlighet
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Stark passform för leverantörer med dokumenterad erfarenhet av liknande projekt.
              </p>
            </div>
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <Brain size={13} />
                Att tänka på
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Kontrollera kravspecifikation och tidsplan noggrant innan anbud lämnas.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/80 p-3 shadow-sm">
            <div>
              <p className="text-xs font-medium text-slate-600">Matchningsgrad</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                  style={{ width: `${priority * 10}%` }}
                />
              </div>
            </div>
            <span className="ml-4 text-lg font-bold text-primary">{priority * 10}%</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-medium text-sky-800">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {!analyzed && !analyzing && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-sky-200 bg-white/60 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            Få en automatisk analys av upphandlingens potential, risker och matchningsgrad.
          </p>
          <ArrowRight size={16} className="text-primary" />
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
