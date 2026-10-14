import { useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  company: string;
  companyType: string;
  regions: string[];
  categories: string[];
  maxBudget: string;
  experience: string;
  certifications: string[];
}

interface Props {
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export default function GoogleAuth({ user, onLogin, onLogout }: Props) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loginStep, setLoginStep] = useState<'email' | 'profile'>('email');
  
  // Form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxBudget, setMaxBudget] = useState('');
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);

  const companyTypes = ['Bygg & Anläggning', 'IT & Teknik', 'Vård & Omsorg', 'Transport & Logistik', 'Livsmedel & Restaurang', 'Konsulttjänster', 'Energi & Miljö', 'Kultur & Evenemang', 'Annat'];
  const allRegions = ['Stockholms län', 'Västra Götaland', 'Skåne län', 'Uppsala län', 'Östergötland', 'Kronobergs län', 'Västerbottens län', 'Jämtlands län', 'Örebro län'];
  const allCategories = ['Bygg & Renovering', 'IT & Teknik', 'Vård & Omsorg', 'Mark & Anläggning', 'Livsmedel & Måltider', 'Konsulttjänster', 'Energi & Miljö', 'Transport & Logistik', 'Kultur & Fritid'];
  const budgetOptions = ['Under 1 MSEK', '1-5 MSEK', '5-20 MSEK', '20-50 MSEK', '50-100 MSEK', 'Över 100 MSEK'];
  const experienceOptions = ['0-2 år', '3-5 år', '5-10 år', '10+ år'];
  const certOptions = ['ISO 9001', 'ISO 14001', 'ISO 27001', 'HACCP', 'Miljöbyggnad', 'Kvalitetsregister', 'Branschcertifiering'];

  const handleGoogleLogin = () => {
    setShowLoginModal(true);
    setLoginStep('email');
  };

  const handleEmailSubmit = () => {
    if (email) {
      setLoginStep('profile');
    }
  };

  const handleProfileComplete = () => {
    const newUser: UserProfile = {
      name: name || email.split('@')[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=8b5cf6&color=fff&size=128`,
      company,
      companyType,
      regions: selectedRegions,
      categories: selectedCategories,
      maxBudget,
      experience,
      certifications,
    };
    onLogin(newUser);
    setShowLoginModal(false);
    setShowProfileSetup(false);
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  if (user) {
    return (
      <>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfileSetup(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all"
          >
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" />
            <span className="text-sm text-white hidden sm:inline">{user.name.split(' ')[0]}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            title="Logga ut"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Profile Setup Modal */}
        {showProfileSetup && (
          <ProfileSetupModal
            user={user}
            companyTypes={companyTypes}
            allRegions={allRegions}
            allCategories={allCategories}
            budgetOptions={budgetOptions}
            experienceOptions={experienceOptions}
            certOptions={certOptions}
            selectedRegions={selectedRegions.length > 0 ? selectedRegions : user.regions}
            selectedCategories={selectedCategories.length > 0 ? selectedCategories : user.categories}
            setSelectedRegions={setSelectedRegions}
            setSelectedCategories={setSelectedCategories}
            maxBudget={maxBudget || user.maxBudget}
            setMaxBudget={setMaxBudget}
            experience={experience || user.experience}
            setExperience={setExperience}
            certifications={certifications.length > 0 ? certifications : user.certifications}
            setCertifications={setCertifications}
            toggleArrayItem={toggleArrayItem}
            onSave={handleProfileComplete}
            onClose={() => setShowProfileSetup(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg text-sm font-medium transition-all shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Logga in med Google
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="bg-[#1a1035] border border-purple-500/20 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {loginStep === 'email' ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Logga in på Kommunradar</h3>
                  <p className="text-sm text-gray-400 mt-1">Få personliga kontraktsrekommendationer</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">E-postadress</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="din@email.se"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
                    />
                  </div>
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!email}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
                  >
                    Fortsätt
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Genom att logga in godkänner du våra villkor
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">Skapa din profil</h3>
                  <p className="text-sm text-gray-400 mt-1">Berätta om ditt företag för bättre matchningar</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Företagsnamn</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Ditt Företag AB"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Ditt namn</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Förnamn Efternamn"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Bransch</label>
                    <select
                      value={companyType}
                      onChange={e => setCompanyType(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400/50 text-sm"
                    >
                      <option value="" className="bg-gray-900">Välj bransch...</option>
                      {companyTypes.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleProfileComplete}
                    disabled={!company || !name}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
                  >
                    Skapa profil & börja
                  </button>
                  <button
                    onClick={() => { setLoginStep('email'); }}
                    className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ← Tillbaka
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Profile Setup Modal for existing users
interface ProfileSetupProps {
  user: UserProfile;
  companyTypes: string[];
  allRegions: string[];
  allCategories: string[];
  budgetOptions: string[];
  experienceOptions: string[];
  certOptions: string[];
  selectedRegions: string[];
  selectedCategories: string[];
  setSelectedRegions: (v: string[]) => void;
  setSelectedCategories: (v: string[]) => void;
  maxBudget: string;
  setMaxBudget: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  certifications: string[];
  setCertifications: (v: string[]) => void;
  toggleArrayItem: (arr: string[], item: string, setter: (v: string[]) => void) => void;
  onSave: () => void;
  onClose: () => void;
}

function ProfileSetupModal({
  user, companyTypes, allRegions, allCategories, budgetOptions,
  experienceOptions, certOptions, selectedRegions, selectedCategories,
  setSelectedRegions, setSelectedCategories, maxBudget, setMaxBudget,
  experience, setExperience, certifications, setCertifications,
  toggleArrayItem, onSave, onClose
}: ProfileSetupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1035] border border-purple-500/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-purple-400/50" />
            <div>
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.company || user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Regions */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block">🗺️ Regioner du är intresserad av</label>
            <div className="flex flex-wrap gap-2">
              {allRegions.map(region => (
                <button
                  key={region}
                  onClick={() => toggleArrayItem(selectedRegions, region, setSelectedRegions)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedRegions.includes(region)
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-400/30'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block">📂 Kategorier</label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleArrayItem(selectedCategories, cat, setSelectedCategories)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategories.includes(cat)
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-blue-400/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-purple-300 mb-2 block">💰 Max budget</label>
              <select
                value={maxBudget}
                onChange={e => setMaxBudget(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400/50"
              >
                <option value="" className="bg-gray-900">Välj...</option>
                {budgetOptions.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 mb-2 block">⏱️ Erfarenhet</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400/50"
              >
                <option value="" className="bg-gray-900">Välj...</option>
                {experienceOptions.map(e => <option key={e} value={e} className="bg-gray-900">{e}</option>)}
              </select>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block">🏅 Certifieringar</label>
            <div className="flex flex-wrap gap-2">
              {certOptions.map(cert => (
                <button
                  key={cert}
                  onClick={() => toggleArrayItem(certifications, cert, setCertifications)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    certifications.includes(cert)
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-emerald-400/30'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white font-medium transition-all"
          >
            Spara profil
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
