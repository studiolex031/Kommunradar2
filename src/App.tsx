import { useState } from 'react';
import { contracts, categories, regions, Contract } from './data/contracts';
import RadarAnimation from './components/RadarAnimation';
import ContractCard from './components/ContractCard';
import ContractModal from './components/ContractModal';
import GuideSection from './components/GuideSection';
import StatsPanel from './components/StatsPanel';
import FilterBar from './components/FilterBar';

function App() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alla kategorier');
  const [selectedRegion, setSelectedRegion] = useState('Alla regioner');
  const [activeTab, setActiveTab] = useState<'contracts' | 'guide'>('contracts');
  const [isScanning, setIsScanning] = useState(false);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alla kategorier' || contract.category === selectedCategory;
    const matchesRegion = selectedRegion === 'Alla regioner' || contract.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const openContracts = contracts.filter(c => c.status === 'öppen').length;
  const ongoingContracts = contracts.filter(c => c.status === 'pågående').length;
  const totalValue = '180,5 MSEK';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-900/30 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50"></div>
              <div className="absolute inset-2 rounded-full border border-emerald-400/30"></div>
              <div className="absolute inset-4 rounded-full bg-emerald-400/20"></div>
              <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-400 tracking-wide">KOMMUNRADAR</h1>
              <p className="text-xs text-gray-500">Kommunala kontrakt & upphandlingar</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              System aktivt
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
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
                  Skanna nu
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <StatsPanel
          openContracts={openContracts}
          ongoingContracts={ongoingContracts}
          totalValue={totalValue}
          totalContracts={contracts.length}
        />

        {/* Radar Animation */}
        <RadarAnimation isScanning={isScanning} />

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 max-w-md">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'contracts'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Kontrakt
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-lg'
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
              categories={categories}
              regions={regions}
            />

            {/* Contract List */}
            <div className="grid gap-4 mt-6">
              {filteredContracts.length > 0 ? (
                filteredContracts.map(contract => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    onClick={() => setSelectedContract(contract)}
                  />
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg">Inga kontrakt matchar din sökning</p>
                  <p className="text-sm mt-2">Prova att ändra dina filter</p>
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
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>Kommunradar © 2026 — Skannar kommunala kontrakt och upphandlingar</p>
        <p className="mt-1">Data baserad på LOU (Lag om offentlig upphandling)</p>
      </footer>
    </div>
  );
}

export default App;
