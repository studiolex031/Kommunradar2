import { UserProfile } from './GoogleAuth';
import { Contract } from '../data/contracts';

interface Props {
  user: UserProfile;
  contracts: Contract[];
  onContractClick: (contract: Contract) => void;
}

export default function UserProfilePanel({ user, contracts, onContractClick }: Props) {
  // Calculate match scores
  const scoredContracts = contracts.map(contract => {
    let score = 0;
    let maxScore = 0;

    // Region match (30%)
    maxScore += 30;
    if (user.regions.length === 0 || user.regions.includes(contract.region)) {
      score += 30;
    }

    // Category match (30%)
    maxScore += 30;
    if (user.categories.length === 0 || user.categories.includes(contract.category)) {
      score += 30;
    }

    // Budget match (20%)
    maxScore += 20;
    if (!user.maxBudget) {
      score += 20;
    } else {
      const budgetMap: Record<string, number> = {
        'Under 1 MSEK': 1000000,
        '1-5 MSEK': 5000000,
        '5-20 MSEK': 20000000,
        '20-50 MSEK': 50000000,
        '50-100 MSEK': 100000000,
        'Över 100 MSEK': Infinity,
      };
      const maxBudgetValue = budgetMap[user.maxBudget] || Infinity;
      if (contract.valueNumeric <= maxBudgetValue) {
        score += 20;
      }
    }

    // Certification match (20%)
    maxScore += 20;
    if (user.certifications.length === 0) {
      score += 20;
    } else {
      const matchingCerts = user.certifications.filter(cert =>
        contract.requirements.some(req => req.toLowerCase().includes(cert.toLowerCase()))
      );
      score += (matchingCerts.length / Math.max(user.certifications.length, 1)) * 20;
    }

    const matchPercentage = Math.round((score / maxScore) * 100);
    return { ...contract, matchScore: matchPercentage };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const topMatches = scoredContracts.filter(c => (c.matchScore || 0) >= 50 && c.status === 'öppen').slice(0, 5);

  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-4">
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-purple-400/50 shadow-lg shadow-purple-500/20" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.company} {user.companyType && `• ${user.companyType}`}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {user.experience && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                {user.experience} erfarenhet
              </span>
            )}
            {user.maxBudget && (
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                {user.maxBudget}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tags */}
      <div className="space-y-3 mb-4">
        {user.regions.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Regioner</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {user.regions.map(r => (
                <span key={r} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded">{r}</span>
              ))}
            </div>
          </div>
        )}
        {user.categories.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Kategorier</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {user.categories.map(c => (
                <span key={c} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded">{c}</span>
              ))}
            </div>
          </div>
        )}
        {user.certifications.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Certifieringar</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {user.certifications.map(cert => (
                <span key={cert} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">🏅 {cert}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Matches */}
      {topMatches.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Topmatchningar för dig
          </h4>
          <div className="space-y-2">
            {topMatches.map(contract => (
              <button
                key={contract.id}
                onClick={() => onContractClick(contract)}
                className="w-full text-left p-3 rounded-lg bg-white/3 hover:bg-white/5 border border-white/5 hover:border-purple-400/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                      {contract.title}
                    </p>
                    <p className="text-xs text-gray-500">{contract.municipality} • {contract.value}</p>
                  </div>
                  <div className={`ml-3 px-2 py-1 rounded-full text-xs font-bold ${
                    (contract.matchScore || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                    (contract.matchScore || 0) >= 60 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {contract.matchScore}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {topMatches.length === 0 && (
        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-sm text-gray-500">
            Inga starka matchningar just nu. Uppdatera din profil för bättre resultat.
          </p>
        </div>
      )}
    </div>
  );
}
