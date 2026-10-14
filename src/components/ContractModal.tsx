import { Contract } from '../data/contracts';

interface Props {
  contract: Contract;
  onClose: () => void;
}

export default function ContractModal({ contract, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs border ${
                contract.status === 'öppen' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                contract.status === 'stängd' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                {contract.status === 'öppen' ? '🟢 Öppen' : contract.status === 'stängd' ? '🔴 Stängd' : '🟡 Pågående'}
              </span>
              <span className="text-xs text-gray-500 font-mono">ID: {contract.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{contract.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{contract.municipality} • {contract.region}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-emerald-400 font-bold text-lg">{contract.value}</div>
              <div className="text-xs text-gray-500">Värde</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-white font-bold text-lg">{contract.deadline}</div>
              <div className="text-xs text-gray-500">Deadline</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-white font-bold text-lg">{contract.estimatedDuration}</div>
              <div className="text-xs text-gray-500">Varaktighet</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-white font-bold text-lg">{contract.category}</div>
              <div className="text-xs text-gray-500">Kategori</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">Beskrivning</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{contract.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">📋 Krav</h3>
            <ul className="space-y-1.5">
              {contract.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Rights */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">⚖️ Rättigheter</h3>
            <ul className="space-y-1.5">
              {contract.rights.map((right, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-blue-400 mt-0.5">◆</span>
                  {right}
                </li>
              ))}
            </ul>
          </div>

          {/* Conditions */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">📜 Villkor</h3>
            <ul className="space-y-1.5">
              {contract.conditions.map((condition, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-0.5">●</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* Eligible Applicants */}
          <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">👤 Vem kan söka?</h3>
            <ul className="space-y-1.5">
              {contract.eligibleApplicants.map((applicant, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  {applicant}
                </li>
              ))}
            </ul>
          </div>

          {/* Application Process */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3">📝 Ansökningsprocess</h3>
            <div className="space-y-3">
              {contract.applicationProcess.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-emerald-400">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">📞 Kontakt</h3>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div>
                <span className="text-gray-500">Kontaktperson: </span>
                <span className="text-white">{contract.contactPerson}</span>
              </div>
              <div>
                <span className="text-gray-500">E-post: </span>
                <span className="text-emerald-400">{contract.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
