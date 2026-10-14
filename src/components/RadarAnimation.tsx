interface Props {
  isScanning: boolean;
}

export default function RadarAnimation({ isScanning }: Props) {
  return (
    <div className="relative flex justify-center items-center py-8 mb-8">
      <div className={`relative w-48 h-48 transition-all duration-500 ${isScanning ? 'scale-110' : 'scale-100'}`}>
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20"></div>
        <div className="absolute inset-4 rounded-full border border-emerald-500/15"></div>
        <div className="absolute inset-8 rounded-full border border-emerald-500/10"></div>
        <div className="absolute inset-12 rounded-full border border-emerald-500/10"></div>
        
        {/* Cross lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/10"></div>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-emerald-500/10"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
        
        {/* Scanning sweep */}
        {isScanning && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(16, 185, 129, 0.3) 30deg, transparent 60deg)',
                animation: 'spin 2s linear infinite',
              }}
            />
          </div>
        )}
        
        {/* Blips */}
        {isScanning && (
          <>
            <div className="absolute top-8 right-12 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="absolute bottom-16 left-10 w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-20 left-8 w-2 h-2 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-10 right-16 w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </>
        )}
        
        {/* Status text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className={`text-xs font-mono ${isScanning ? 'text-emerald-400' : 'text-gray-500'}`}>
            {isScanning ? 'SKANNAR KONTRAKT...' : 'REDO ATT SKANNA'}
          </span>
        </div>
      </div>
    </div>
  );
}
