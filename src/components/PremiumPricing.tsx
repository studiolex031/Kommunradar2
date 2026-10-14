import { useState } from 'react';

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    period: 'mån',
    description: 'Perfekt för att komma igång och utforska kommunala kontrakt',
    features: [
      'Sök bland alla kontrakt',
      'Grundläggande filter',
      '5 kontraktvisningar/dag',
      'Standard support',
      'Guide & dokumentation',
    ],
    cta: 'Nuvarande plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    period: 'mån',
    description: 'För aktiva leverantörer som vill vinna fler kontrakt',
    features: [
      'Obegränsade kontraktvisningar',
      'Avancerade filter & sökning',
      'AI-baserad kontraktsmatchning',
      'Obegränsade bevakningar',
      'Marknadsföringspaket',
      'Profiloptimering',
      'E-postnotifieringar',
      'Prioriterad support',
      'Export till Excel/PDF',
    ],
    highlighted: true,
    cta: 'Uppgradera till Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    period: 'mån',
    description: 'För företag och team som behöver full kraft',
    features: [
      'Allt i Pro, plus:',
      'Obegränsade användare',
      'API-åtkomst',
      'Konkurrentanalys',
      'Historisk data & trender',
      'Anpassade rapporter',
      'Dedikerad account manager',
      'SLA-garanti 99.9%',
      'White-label rapporter',
      'Integration med era system',
      'Utbildning & onboarding',
    ],
    cta: 'Kontakta oss',
  },
];

interface Props {
  currentPlan: PlanType;
  onPlanSelect: (plan: PlanType) => void;
  onClose: () => void;
}

export default function PremiumPricing({ currentPlan, onPlanSelect, onClose }: Props) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const yearlyDiscount = 0.2; // 20% rabatt vid årsbetalning

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    if (billingPeriod === 'yearly') {
      return Math.round(plan.price * 12 * (1 - yearlyDiscount));
    }
    return plan.price;
  };

  const handlePlanSelect = (planId: PlanType) => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
  };

  const handleCheckout = () => {
    if (selectedPlan) {
      // Simulera Stripe Checkout
      onPlanSelect(selectedPlan);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#1a1035] border border-purple-500/20 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl shadow-purple-500/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1035]/95 backdrop-blur-sm border-b border-white/5 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Uppgradera till Premium
            </h2>
            <p className="text-gray-400 mt-2">
              Få tillgång till kraftfulla verktyg för att vinna fler kommunala kontrakt
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Månadsvis
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Årsvis
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  Spara 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = plan.id === selectedPlan;
              const price = getPrice(plan);

              return (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/50 shadow-xl shadow-purple-500/20'
                      : 'bg-white/3 border-white/10 hover:border-purple-400/30'
                  } ${isSelected ? 'ring-2 ring-purple-400' : ''} ${isCurrentPlan ? 'opacity-60' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        MEST POPULÄR
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-500/30">
                        ✓ Nuvarande
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{price}</span>
                      <span className="text-gray-400">
                        {plan.price === 0 ? 'kr' : billingPeriod === 'yearly' ? 'kr/år' : 'kr/mån'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price > 0 && (
                      <p className="text-xs text-emerald-400 mt-1">
                        {Math.round(plan.price * 12)} kr/år → {price} kr/år (du sparar {Math.round(plan.price * 12 * yearlyDiscount)} kr)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={isCurrentPlan}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      isCurrentPlan
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : plan.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {isCurrentPlan ? 'Nuvarande plan' : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Checkout Button */}
          {selectedPlan && selectedPlan !== currentPlan && (
            <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border border-purple-400/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">Redo att uppgradera?</h4>
                  <p className="text-sm text-gray-400">
                    Du valde: <span className="text-purple-300 font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {getPrice(plans.find(p => p.id === selectedPlan)!)} kr
                  </div>
                  <div className="text-xs text-gray-400">
                    {billingPeriod === 'yearly' ? 'per år' : 'per månad'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg font-medium text-white shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Betala med Stripe
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Säker betalning via Stripe • Avbryt när du vill • Ingen bindningstid
              </p>
            </div>
          )}

          {/* FAQ */}
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Vanliga frågor</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1">Kan jag byta plan när som helst?</h4>
                <p className="text-sm text-gray-400">
                  Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringen träder i kraft omedelbart.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1">Finns det en bindningstid?</h4>
                <p className="text-sm text-gray-400">
                  Nej, du kan avsluta din prenumeration när som helst. Vid årsbetalning får du tillgång tills perioden löper ut.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1">Hur fungerar AI-matchningen?</h4>
                <p className="text-sm text-gray-400">
                  Vår AI analyserar din profil, erfarenhet och certifieringar för att matcha dig med relevanta kontrakt automatiskt. Du får en matchningspoäng (0-100%) för varje kontrakt.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1">Vad ingår i marknadsföringspaketet?</h4>
                <p className="text-sm text-gray-400">
                  Pro-planen inkluderar automatisk generering av case studies, social media-innehåll, pressmeddelanden, LinkedIn-inlägg och nyhetsbrev baserat på dina genomförda projekt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
