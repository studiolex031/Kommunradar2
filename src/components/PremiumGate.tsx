import { PlanType } from './PremiumPricing';

interface Props {
  currentPlan: PlanType;
  onUpgrade: () => void;
  feature: 'views' | 'filters' | 'ai-match' | 'monitoring' | 'marketing' | 'export' | 'api' | 'analytics';
  children: React.ReactNode;
}

// Definiera vilka features som kräver vilken plan
const featureRequirements: Record<string, PlanType> = {
  views: 'free',        // Gratis: 5/dag, Pro: obegränsat
  filters: 'pro',       // Avancerade filter kräver Pro
  'ai-match': 'pro',    // AI-matchning kräver Pro
  monitoring: 'pro',    // Bevakningar kräver Pro
  marketing: 'pro',     // Marknadsföringspaket kräver Pro
  export: 'pro',        // Export kräver Pro
  api: 'enterprise',    // API kräver Enterprise
  analytics: 'enterprise', // Avancerad analys kräver Enterprise
};

export default function PremiumGate({ currentPlan, onUpgrade, feature, children }: Props) {
  const requiredPlan = featureRequirements[feature];
  
  // Kontrollera om användaren har tillgång
  const planLevels: PlanType[] = ['free', 'pro', 'enterprise'];
  const userLevel = planLevels.indexOf(currentPlan);
  const requiredLevel = planLevels.indexOf(requiredPlan);
  const hasAccess = userLevel >= requiredLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  // Visa premium-gate
  const featureNames: Record<string, string> = {
    views: 'Obegränsade kontraktvisningar',
    filters: 'Avancerade filter',
    'ai-match': 'AI-baserad matchning',
    monitoring: 'Obegränsade bevakningar',
    marketing: 'Marknadsföringspaket',
    export: 'Export till Excel/PDF',
    api: 'API-åtkomst',
    analytics: 'Avancerad analys',
  };

  const planNames: Record<string, string> = {
    free: 'Gratis',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="filter blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>
      
      {/* Premium gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-6 max-w-sm text-center border-purple-500/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {featureNames[feature]}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Denna funktion kräver <span className="text-purple-300 font-medium">{planNames[requiredPlan]}</span>-planen
          </p>
          <button
            onClick={onUpgrade}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all"
          >
            Uppgradera nu
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Från 299 kr/mån
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook för att kolla om en feature är tillgänglig
export function usePremiumFeature(currentPlan: PlanType, feature: string): boolean {
  const requiredPlan = featureRequirements[feature];
  const planLevels: PlanType[] = ['free', 'pro', 'enterprise'];
  const userLevel = planLevels.indexOf(currentPlan);
  const requiredLevel = planLevels.indexOf(requiredPlan);
  return userLevel >= requiredLevel;
}
