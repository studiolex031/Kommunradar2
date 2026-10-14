import { categories, regions, statusOptions, valueRanges, timeRanges } from '../data/contracts';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedValueRange: number;
  setSelectedValueRange: (range: number) => void;
  selectedTimeRange: number;
  setSelectedTimeRange: (range: number) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

export default function FilterBar({
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory,
  selectedRegion, setSelectedRegion,
  selectedStatus, setSelectedStatus,
  selectedValueRange, setSelectedValueRange,
  selectedTimeRange, setSelectedTimeRange,
  showAdvanced, setShowAdvanced,
}: Props) {
  const hasActiveFilters = searchQuery || selectedCategory !== 'Alla kategorier' || 
    selectedRegion !== 'Hela Sverige' || selectedStatus !== 'Alla statusar' ||
    selectedValueRange !== 0 || selectedTimeRange !== 0;

  return (
    <div className="glass-card rounded-xl p-4">
      {/* Main search row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Sök kontrakt, kommun, kategori, nyckelord..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 transition-all"
          />
        </div>
        
        {/* Quick filters */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400/50 transition-all cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
          ))}
        </select>
        
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400/50 transition-all cursor-pointer"
        >
          {regions.map(region => (
            <option key={region} value={region} className="bg-gray-900">{region}</option>
          ))}
        </select>
        
        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            showAdvanced 
              ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300' 
              : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-400/30'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Avancerat
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400/50"
            >
              {statusOptions.map(s => (
                <option key={s} value={s} className="bg-gray-900">{s === 'öppen' ? '🟢 Öppen' : s === 'pågående' ? '🟡 Pågående' : s === 'stängd' ? '🔴 Stängd' : s}</option>
              ))}
            </select>
          </div>

          {/* Value range */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kontraktsvärde</label>
            <select
              value={selectedValueRange}
              onChange={e => setSelectedValueRange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400/50"
            >
              {valueRanges.map((range, idx) => (
                <option key={idx} value={idx} className="bg-gray-900">{range.label}</option>
              ))}
            </select>
          </div>

          {/* Time range */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tidsperiod (deadline)</label>
            <select
              value={selectedTimeRange}
              onChange={e => setSelectedTimeRange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-400/50"
            >
              {timeRanges.map((range, idx) => (
                <option key={idx} value={idx} className="bg-gray-900">{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <span className="text-xs text-gray-500">Aktiva filter:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-400/20 rounded text-xs text-purple-300">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedCategory !== 'Alla kategorier' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-300">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('Alla kategorier')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedRegion !== 'Hela Sverige' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-500/10 border border-pink-400/20 rounded text-xs text-pink-300">
              {selectedRegion}
              <button onClick={() => setSelectedRegion('Hela Sverige')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedStatus !== 'Alla statusar' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-400/20 rounded text-xs text-emerald-300">
              {selectedStatus}
              <button onClick={() => setSelectedStatus('Alla statusar')} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedValueRange !== 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-400/20 rounded text-xs text-yellow-300">
              {valueRanges[selectedValueRange].label}
              <button onClick={() => setSelectedValueRange(0)} className="hover:text-white ml-1">×</button>
            </span>
          )}
          {selectedTimeRange !== 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-400/20 rounded text-xs text-orange-300">
              {timeRanges[selectedTimeRange].label}
              <button onClick={() => setSelectedTimeRange(0)} className="hover:text-white ml-1">×</button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Alla kategorier');
              setSelectedRegion('Hela Sverige');
              setSelectedStatus('Alla statusar');
              setSelectedValueRange(0);
              setSelectedTimeRange(0);
            }}
            className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Rensa alla
          </button>
        </div>
      )}
    </div>
  );
}
