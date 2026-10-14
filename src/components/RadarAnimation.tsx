interface Props {
  isScanning: boolean;
}

export default function RadarAnimation({ isScanning }: Props) {
  return (
    <div className="relative flex justify-center items-center py-8 mb-8">
      <div className={`relative w-52 h-52 transition-all duration-500 ${isScanning ? 'scale-110' : 'scale-100'}`}>
        {/* Outer nebula glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 blur-xl"></div>
        
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border border-purple-400/20"></div>
        <div className="absolute inset-4 rounded-full border border-purple-400/15"></div>
        <div className="absolute inset-8 rounded-full border border-blue-400/10"></div>
        <div className="absolute inset-12 rounded-full border border-pink-400/10"></div>
        <div className="absolute inset-16 rounded-full border border-purple-400/5"></div>
        
        {/* Cross lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 shadow-lg shadow-purple-400/50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-purple-400/30 animate-pulse"></div>
        
        {/* Scanning sweep */}
        {isScanning && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(139, 92, 246, 0.4) 30deg, transparent 60deg)',
                animation: 'spin 2s linear infinite',
              }}
            />
          </div>
        )}
        
        {/* Blips */}
        {isScanning && (
          <>
            <div className="absolute top-8 right-12 w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
            <div className="absolute bottom-16 left-10 w-2 h-2 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-20 left-8 w-2 h-2 rounded-full bg-pink-400 animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 right-16 w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-12 left-20 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute bottom-20 right-8 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '1.2s' }}></div>
          </>
        )}
        
        {/* Status text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className={`text-xs font-mono ${isScanning ? 'text-purple-400' : 'text-gray-500'}`}>
            {isScanning ? '◆ SKANNAR 290 KOMMUNER...' : '◇ REDO ATT SKANNA'}
          </span>
        </div>
      </div>
    </div>
  );
}
