import { PlanType } from './PremiumPricing';

interface Props {
  currentPlan: PlanType;
  onUpgrade: () => void;
  variant?: 'banner' | 'sidebar' | 'inline';
}

export default function PremiumBanner({ currentPlan, onUpgrade, variant = 'banner' }: Props) {
  if (currentPlan !== 'free') return null;

  if (variant === 'sidebar') {
    return (
      <div className="glass-card rounded-xl p-4 border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-blue-950/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">✨</span>
          <h4 className="text-sm font-bold text-white">Uppgradera till Pro</h4>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Få AI-matchning, obegränsade bevakningar och marknadsföringspaket
        </p>
        <ul className="space-y-1.5 mb-3">
          <li className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-purple-400">✓</span>
            AI-baserad kontraktsmatchning
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-purple-400">✓</span>
            Obegränsade bevakningar
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-purple-400">✓</span>
            Marknadsföringspaket
          </li>
          <li className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-purple-400">✓</span>
            Export till Excel/PDF
          </li>
        </ul>
        <button
          onClick={onUpgrade}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-xs font-medium text-white transition-all"
        >
          Se alla planer →
        </button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="glass-card rounded-xl p-4 border-purple-500/20 bg-gradient-to-r from-purple-950/20 to-blue-950/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
            <span className="text-lg">🚀</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Lås upp alla funktioner</h4>
            <p className="text-xs text-gray-400">Få tillgång till AI-matchning, bevakningar och mer</p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-medium text-white transition-all whitespace-nowrap"
        >
          Uppgradera
        </button>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className="glass-card rounded-xl p-4 border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-blue-950/20 to-pink-950/30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Maximera din potential med Pro
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Populärast
              </span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              AI-matchning, obegränsade bevakningar, marknadsföringspaket & mer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-bold text-white">299 kr/mån</div>
            <div className="text-xs text-gray-500">eller 2 388 kr/år (spara 20%)</div>
          </div>
          <button
            onClick={onUpgrade}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all whitespace-nowrap"
          >
            Uppgradera nu →
          </button>
        </div>
      </div>
    </div>
  );
}
