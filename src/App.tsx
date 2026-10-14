import { useState, useEffect } from 'react';
import { contracts, valueRanges, timeRanges, Contract } from './data/contracts';
import RadarAnimation from './components/RadarAnimation';
import ContractCard from './components/ContractCard';
import ContractModal from './components/ContractModal';
import GuideSection from './components/GuideSection';
import StatsPanel from './components/StatsPanel';
import FilterBar from './components/FilterBar';
import GoogleAuth, { UserProfile } from './components/GoogleAuth';
import UserProfilePanel from './components/UserProfilePanel';

function App() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla kategorier');
  const [selectedRegion, setSelectedRegion] = useState('Hela Sverige');
  const [selectedStatus, setSelectedStatus] = useState('Alla statusar');
  const [selectedValueRange, setSelectedValueRange] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'contracts' | 'guide'>('contracts');
  const [isScanning, setIsScanning] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stars, setStars] = useState<{ x: number; y: number; duration: number; delay: number }[]>([]);

  // Generate stars for nebula background
  useEffect(() => {
    const newStars = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  const filteredContracts = contracts.filter(contract => {
    // Text search
    const matchesSearch = !searchQuery || 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'Alla kategorier' || contract.category === selectedCategory;
    
    // Region filter
    const matchesRegion = selectedRegion === 'Hela Sverige' || contract.region === selectedRegion;
    
    // Status filter
    const matchesStatus = selectedStatus === 'Alla statusar' || contract.status === selectedStatus;
    
    // Value range filter
    const valueRange = valueRanges[selectedValueRange];
    const matchesValue = contract.valueNumeric >= valueRange.min && contract.valueNumeric < valueRange.max;
    
    // Time range filter
    const timeRange = timeRanges[selectedTimeRange];
    const daysUntilDeadline = Math.ceil(
      (new Date(contract.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const matchesTime = daysUntilDeadline <= timeRange.days;
    
    return matchesSearch && matchesCategory && matchesRegion && matchesStatus && matchesValue && matchesTime;
  });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const openContracts = contracts.filter(c => c.status === 'öppen').length;
  const ongoingContracts = contracts.filter(c => c.status === 'pågående').length;
  const totalValue = '438,7 MSEK';

  return (
    <div className="nebula-bg min-h-screen text-white relative overflow-hidden">
      {/* Stars */}
      {stars.map((star, idx) => (
        <div
          key={idx}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Header */}
      <header className="relative border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/50"></div>
              <div className="absolute inset-2 rounded-full border border-purple-400/30"></div>
              <div className="absolute inset-4 rounded-full bg-purple-400/20"></div>
              <div className="absolute inset-0 rounded-full bg-purple-400/10 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent tracking-wide">
                KOMMUNRADAR
              </h1>
              <p className="text-xs text-gray-500">Skannar kommunala kontrakt i hela Sverige</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>290 kommuner aktiva</span>
            </div>
            <GoogleAuth
              user={user}
              onLogin={setUser}
              onLogout={() => setUser(null)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Stats */}
        <StatsPanel
          openContracts={openContracts}
          ongoingContracts={ongoingContracts}
          totalValue={totalValue}
          totalContracts={contracts.length}
        />

        {/* Radar Animation */}
        <RadarAnimation isScanning={isScanning} />

        {/* User Profile Panel */}
        {user && (
          <UserProfilePanel
            user={user}
            contracts={filteredContracts}
            onContractClick={setSelectedContract}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-1 max-w-md border border-white/5">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'contracts'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Kontrakt
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📖 Guide
          </button>
        </div>

        {activeTab === 'contracts' ? (
          <>
            {/* Filters */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedValueRange={selectedValueRange}
              setSelectedValueRange={setSelectedValueRange}
              selectedTimeRange={selectedTimeRange}
              setSelectedTimeRange={setSelectedTimeRange}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
            />

            {/* Results count */}
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-sm text-gray-400">
                Visar <span className="text-white font-medium">{filteredContracts.length}</span> av {contracts.length} kontrakt
              </p>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {isScanning ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Skannar...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Uppdatera
                  </>
                )}
              </button>
            </div>

            {/* Contract List */}
            <div className="grid gap-4 mt-4">
              {filteredContracts.length > 0 ? (
                filteredContracts.map(contract => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    onClick={() => setSelectedContract(contract)}
                    userMatchScore={user ? contract.matchScore : undefined}
                  />
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg">Inga kontrakt matchar din sökning</p>
                  <p className="text-sm mt-2">Prova att ändra dina filter eller söka i hela Sverige</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <GuideSection />
        )}
      </main>

      {/* Modal */}
      {selectedContract && (
        <ContractModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center text-gray-500 text-sm relative z-10">
        <p>Kommunradar © 2026 — Skannar kommunala kontrakt i hela Sverige</p>
        <p className="mt-1">Data baserad på LOU (Lag om offentlig upphandling)</p>
      </footer>
    </div>
  );
}

export default App;
