import { Contract } from '../data/contracts';

interface Props {
  contract: Contract;
  onClick: () => void;
}

export default function ContractCard({ contract, onClick }: Props) {
  const statusColors = {
    'öppen': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'stängd': 'bg-red-500/20 text-red-400 border-red-500/30',
    'pågående': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const statusLabels = {
    'öppen': '🟢 Öppen',
    'stängd': '🔴 Stängd',
    'pågående': '🟡 Pågående',
  };

  const daysLeft = Math.ceil(
    (new Date(contract.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      onClick={onClick}
      className="group bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/40 hover:bg-gray-900/80 transition-all cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[contract.status]}`}>
              {statusLabels[contract.status]}
            </span>
            <span className="text-xs text-gray-500 font-mono">{contract.id}</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
            {contract.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {contract.municipality}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {contract.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{contract.description}</p>
        </div>
        
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0">
          <div className="text-right">
            <div className="text-emerald-400 font-bold text-lg">{contract.value}</div>
            <div className="text-xs text-gray-500">Kontraktsvärde</div>
          </div>
          {contract.status !== 'stängd' && (
            <div className="text-right">
              <div className={`text-sm font-medium ${daysLeft < 14 ? 'text-red-400' : daysLeft < 30 ? 'text-yellow-400' : 'text-gray-300'}`}>
                {daysLeft > 0 ? `${daysLeft} dagar kvar` : 'Förfallet'}
              </div>
              <div className="text-xs text-gray-500">Deadline: {contract.deadline}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Eligible applicants preview */}
      <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Behöriga:</span>
        {contract.eligibleApplicants.slice(0, 2).map((applicant, idx) => (
          <span key={idx} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
            {applicant.split(' ').slice(0, 3).join(' ')}...
          </span>
        ))}
        <span className="text-xs text-emerald-500 ml-auto group-hover:translate-x-1 transition-transform">
          Visa detaljer →
        </span>
      </div>
    </div>
  );
}
