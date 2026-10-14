import { useState, useEffect } from 'react';
import { PlanType } from './PremiumPricing';

interface Props {
  currentPlan: PlanType;
  onUpgrade: () => void;
}

export default function UsageTracker({ currentPlan, onUpgrade }: Props) {
  const [viewsToday, setViewsToday] = useState(0);
  const maxViews = currentPlan === 'free' ? 5 : Infinity;

  // Ladda sparad data från localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kommunradar_views');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setViewsToday(data.count);
      } else {
        // Nya dagen, nollställ
        setViewsToday(0);
        localStorage.setItem('kommunradar_views', JSON.stringify({ date: today, count: 0 }));
      }
    }
  }, []);

  const incrementView = () => {
    if (currentPlan === 'free' && viewsToday >= maxViews) {
      return false; // Blockera
    }
    const newCount = viewsToday + 1;
    setViewsToday(newCount);
    const today = new Date().toDateString();
    localStorage.setItem('kommunradar_views', JSON.stringify({ date: today, count: newCount }));
    return true;
  };

  if (currentPlan !== 'free') {
    return null; // Visa inte för betalande användare
  }

  const remaining = maxViews - viewsToday;
  const percentage = (viewsToday / maxViews) * 100;

  return (
    <div className="glass-card rounded-lg p-3 border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs text-gray-400">Kontraktvisningar idag</span>
        </div>
        <span className="text-xs font-medium text-white">
          {viewsToday}/{maxViews}
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            percentage >= 80 ? 'bg-red-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-purple-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {remaining <= 2 && remaining > 0 && (
        <p className="text-xs text-yellow-400 mt-2">
          ⚠️ Du har bara {remaining} visningar kvar idag
        </p>
      )}
      {remaining === 0 && (
        <div className="mt-2">
          <p className="text-xs text-red-400 mb-2">
            ❌ Du har använt alla dina visningar för idag
          </p>
          <button
            onClick={onUpgrade}
            className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded text-xs font-medium text-white transition-all"
          >
            Uppgradera för obegränsat
          </button>
        </div>
      )}
    </div>
  );
}

// Exportera funktion för att kolla om användaren kan visa fler kontrakt
export function canViewContract(currentPlan: PlanType): boolean {
  if (currentPlan !== 'free') return true;
  
  const saved = localStorage.getItem('kommunradar_views');
  if (!saved) return true;
  
  const data = JSON.parse(saved);
  const today = new Date().toDateString();
  
  if (data.date !== today) return true; // Ny dag
  
  return data.count < 5;
}

export function trackContractView(): void {
  const saved = localStorage.getItem('kommunradar_views');
  const today = new Date().toDateString();
  
  let count = 0;
  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) {
      count = data.count;
    }
  }
  
  count++;
  localStorage.setItem('kommunradar_views', JSON.stringify({ date: today, count }));
}
