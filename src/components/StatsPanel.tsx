interface Props {
  openContracts: number;
  ongoingContracts: number;
  totalValue: string;
  totalContracts: number;
}

export default function StatsPanel({ openContracts, ongoingContracts, totalValue, totalContracts }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-card glow-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-purple-400 text-lg">📋</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-white">{totalContracts}</div>
        <div className="text-xs text-gray-500">Totalt kontrakt</div>
      </div>
      
      <div className="glass-card glow-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 text-lg">🟢</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-400">{openContracts}</div>
        <div className="text-xs text-gray-500">Öppna kontrakt</div>
      </div>
      
      <div className="glass-card glow-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <span className="text-yellow-400 text-lg">🔄</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-yellow-400">{ongoingContracts}</div>
        <div className="text-xs text-gray-500">Pågående</div>
      </div>
      
      <div className="glass-card glow-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 text-lg">💰</span>
          </div>
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{totalValue}</div>
        <div className="text-xs text-gray-500">Totalt värde</div>
      </div>
    </div>
  );
}
