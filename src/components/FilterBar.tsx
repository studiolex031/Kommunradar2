interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  categories: string[];
  regions: string[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  categories,
  regions,
}: Props) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Sök kontrakt, kommun, kategori..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        
        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        {/* Region filter */}
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
      
      {/* Active filters */}
      {(searchQuery || selectedCategory !== 'Alla kategorier' || selectedRegion !== 'Alla regioner') && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-500">Aktiva filter:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-white">×</button>
            </span>
          )}
          {selectedCategory !== 'Alla kategorier' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('Alla kategorier')} className="hover:text-white">×</button>
            </span>
          )}
          {selectedRegion !== 'Alla regioner' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">
              {selectedRegion}
              <button onClick={() => setSelectedRegion('Alla regioner')} className="hover:text-white">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
