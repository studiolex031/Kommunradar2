import { useState } from 'react';

type GuideTab = 'overview' | 'rights' | 'conditions' | 'eligible' | 'process';

export default function GuideSection() {
  const [activeGuideTab, setActiveGuideTab] = useState<GuideTab>('overview');

  const guideTabs: { id: GuideTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Översikt', icon: '📊' },
    { id: 'rights', label: 'Rättigheter', icon: '⚖️' },
    { id: 'conditions', label: 'Villkor', icon: '📜' },
    { id: 'eligible', label: 'Vem kan söka', icon: '👤' },
    { id: 'process', label: 'Hur man gör', icon: '📝' },
  ];

  return (
    <div className="space-y-6">
      {/* Guide Header */}
      <div className="bg-gradient-to-r from-emerald-950/50 to-gray-900/50 border border-emerald-800/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Guide till kommunala kontrakt</h2>
        <p className="text-gray-400 text-sm">
          Allt du behöver veta om rättigheter, villkor, behörighet och ansökningsprocesser för kommunala upphandlingar i Sverige.
        </p>
      </div>

      {/* Guide Tabs */}
      <div className="flex flex-wrap gap-2">
        {guideTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveGuideTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeGuideTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guide Content */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
        {activeGuideTab === 'overview' && <OverviewContent />}
        {activeGuideTab === 'rights' && <RightsContent />}
        {activeGuideTab === 'conditions' && <ConditionsContent />}
        {activeGuideTab === 'eligible' && <EligibleContent />}
        {activeGuideTab === 'process' && <ProcessContent />}
      </div>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Vad är kommunala kontrakt?</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-2">🏛️ Offentlig upphandling</h4>
          <p className="text-sm text-gray-300">
            Kommuner, landsting och statliga myndigheter måste upphandla varor, tjänster och byggentreprenader 
            enligt LOU (Lag om offentlig upphandling). Detta säkerställer transparens och likabehandling.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-2">💰 Kontraktsvärden</h4>
          <p className="text-sm text-gray-300">
            Kommunala kontrakt i Sverige uppgår till över 800 miljarder SEK årligen. 
            Allt från byggprojekt och IT-tjänster till vård, skola och omsorg upphandlas öppet.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-2">📊 Upphandlingsmetoder</h4>
          <p className="text-sm text-gray-300">
            <strong>Öppet förfarande:</strong> Alla intresserade kan lämna anbud.<br/>
            <strong>Selektivt förfarande:</strong> Endast utvalda leverantörer bjuds in.<br/>
            <strong>Direktupphandling:</strong> Under tröskelvärdet (ca 700 000 SEK).
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-2">🔍 Var hittar man kontrakt?</h4>
          <p className="text-sm text-gray-300">
            <strong>TED</strong> (Tenders Electronic Daily) — EU:s upphandlingsportal<br/>
            <strong>Doffy</strong> — Svenskt upphandlingsverktyg<br/>
            <strong>Mercell</strong> — Upphandlingsplattform<br/>
            <strong>Visma TendSign</strong> — Digital upphandling
          </p>
        </div>
      </div>
      
      <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4">
        <h4 className="text-emerald-400 font-medium mb-2">💡 Tips från Kommunradar</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Övervakar kontinuerligt nya upphandlingar från 290 kommuner</li>
          <li>• Matchar kontrakt mot din profil och behörighet</li>
          <li>• Ger detaljerad information om krav, rättigheter och villkor</li>
          <li>• Steg-för-steg guide för ansökningsprocessen</li>
        </ul>
      </div>
    </div>
  );
}

function RightsContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Dina rättigheter som leverantör</h3>
      <p className="text-sm text-gray-400">
        Enligt LOU och EU:s upphandlingsdirektiv har du som leverantör flera viktiga rättigheter:
      </p>
      
      <div className="space-y-4">
        <div className="border-l-4 border-emerald-500 pl-4">
          <h4 className="text-white font-medium">Rätt till likabehandling</h4>
          <p className="text-sm text-gray-300 mt-1">
            Alla leverantörer ska behandlas lika utan diskriminering. Upphandlingen ska vara transparent 
            och proportionell.
          </p>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="text-white font-medium">Rätt till insyn</h4>
          <p className="text-sm text-gray-300 mt-1">
            Du har rätt att ta del av utvärderingsunderlag, tilldelningsbeslut och motiveringar. 
            Offentlighetsprincipen ger tillgång till allmänna handlingar.
          </p>
        </div>
        
        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="text-white font-medium">Rätt till betalning</h4>
          <p className="text-sm text-gray-300 mt-1">
            Enligt LOU ska betalning ske inom 30 dagar. Faktureringsrutiner och betalningsvillkor 
            ska framgå av kontraktet.
          </p>
        </div>
        
        <div className="border-l-4 border-yellow-500 pl-4">
          <h4 className="text-white font-medium">Rätt att överpröva</h4>
          <p className="text-sm text-gray-300 mt-1">
            Om du anser att upphandlingen gått felaktigt till kan du ansöka om överprövning hos 
            förvaltningsrätten inom 10 dagar från tilldelningsbeslutet.
          </p>
        </div>
        
        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="text-white font-medium">Rätt till skadestånd</h4>
          <p className="text-sm text-gray-300 mt-1">
            Vid överträdelser av upphandlingsreglerna kan du ha rätt till skadestånd (upphandlingsskadeavgift). 
            Ansökan görs hos allmän förvaltningsdomstol.
          </p>
        </div>
        
        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="text-white font-medium">Rätt till omförhandling</h4>
          <p className="text-sm text-gray-300 mt-1">
            Vid väsentliga förändringar (t.ex. prisökningar, force majeure) har du rätt att begära 
            omförhandling av kontraktet.
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-4 mt-6">
        <h4 className="text-yellow-400 font-medium mb-2">⚠️ Viktigt att känna till</h4>
        <p className="text-sm text-gray-300">
          Tidsfristerna för överprövning är strikta. Tilldelningsbeslut måste överklagas inom 
          <strong> 10 dagar</strong> (frivillig avtalsspärr) eller <strong> 30 dagar</strong> (utan avtalsspärr). 
          Kontakta alltid juridisk rådgivning vid tveksamhet.
        </p>
      </div>
    </div>
  );
}

function ConditionsContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Villkor som gäller för kommunala kontrakt</h3>
      <p className="text-sm text-gray-400">
        Kommunala kontrakt har specifika villkor som leverantören måste uppfylla:
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">💼 Arbetsrättsliga villkor</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Kollektivavtal krävs ofta</li>
            <li>• Lön enligt branschstandard</li>
            <li>• Arbetsmiljökrav enligt AML</li>
            <li>• Försäkringar för personal</li>
            <li>• Lärlingsplatser kan krävas</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">🌱 Miljökrav</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Miljöledningssystem (ISO 14001)</li>
            <li>• Klimatdeklaration för bygg</li>
            <li>• Hållbara materialval</li>
            <li>• Avfallsplanering</li>
            <li>• Energieffektivisering</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">📊 Ekonomiska villkor</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Godkänd ekonomisk ställning</li>
            <li>• Minimiomsättning kan krävas</li>
            <li>• Garantier och borgen</li>
            <li>• Ansvarsförsäkring</li>
            <li>• Skuldfri hos Kronofogden</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">🔒 Sekretess & GDPR</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Dataskyddsförordningen (GDPR)</li>
            <li>• Tystnadsplikt</li>
            <li>• Personuppgiftsbiträdesavtal</li>
            <li>• Informationssäkerhet (ISO 27001)</li>
            <li>• Bakgrundskontroller</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">📋 Rapportering & Uppföljning</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Periodiska statusrapporter</li>
            <li>• KPI-uppföljning</li>
            <li>• Kvalitetsrevisioner</li>
            <li>• Ekonomisk redovisning</li>
            <li>• Avvikelserapportering</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2">⏰ Tidsvillkor</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Leveranstider och milstolpar</li>
            <li>• Vite vid försening</li>
            <li>• Garantitider</li>
            <li>• Avtalstid och optioner</li>
            <li>• Uppsägningstider</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function EligibleContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Vem har rätt att söka?</h3>
      <p className="text-sm text-gray-400">
        Enligt LOU ska alla leverantörer ges möjlighet att delta, men vissa grundkrav måste uppfyllas:
      </p>
      
      <div className="space-y-4">
        <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-3">✅ Grundläggande behörighetskrav</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Registrerat företag:</strong> Måste vara registrerat i Sverige, EU/EES eller WTO-land</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Ekonomisk stabilitet:</strong> Ingen konkurs, rekonstruktion eller väsentliga skulder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Skatter och avgifter:</strong> Skuldfri hos Skatteverket och avgiftsfri</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Inga domar:</strong> Inte dömd för korruption, bedrägeri, penningtvätt etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Fackliga skyldigheter:</strong> Uppfylla svenska kollektivavtalsliknande villkor</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-3">🏢 Olika typer av sökande</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-800/30 rounded-lg p-3">
              <h5 className="text-white text-sm font-medium">Stora företag</h5>
              <p className="text-xs text-gray-400 mt-1">Omsättningskrav, referensprojekt, certifieringar. Kan delta i alla upphandlingar.</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <h5 className="text-white text-sm font-medium">Små och medelstora företag</h5>
              <p className="text-xs text-gray-400 mt-1">Uppmuntras att delta. Delade kontrakt och lägre krav kan underlätta.</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <h5 className="text-white text-sm font-medium">Ideella organisationer</h5>
              <p className="text-xs text-gray-400 mt-1">Kan delta inom vård, omsorg och sociala tjänster. Särskilda regler för idéburna aktörer.</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3">
              <h5 className="text-white text-sm font-medium">Utländska företag</h5>
              <p className="text-xs text-gray-400 mt-1">EU-företag har samma rättigheter. Krav på svensk momsregistrering och F-skatt.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-3">❌ Uteslutningsgrunder</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Dömd för korruption, mutbrott, bedrägeri eller terrorism</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Konkurs, likvidation eller ackord</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Obetalda skatter eller sociala avgifter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Allvarliga fel i yrkesutövningen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Tidigare misskött offentligt kontrakt</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProcessContent() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Hur man ansöker om kommunala kontrakt</h3>
      <p className="text-sm text-gray-400">
        Steg-för-steg guide för att delta i kommunal upphandling:
      </p>
      
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">1</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Registrera dig på upphandlingsportaler</h4>
            <p className="text-sm text-gray-300 mt-1">
              Skapa konton på de viktigaste portalerna: Doffy, Mercell, Visma TendSign och TED. 
              Ställ in bevakningar för din bransch och geografiska område.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Doffy.se</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Mercell.com</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">TendSign.com</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">TED.europa.eu</span>
            </div>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">2</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Ladda ner förfrågningsunderlag</h4>
            <p className="text-sm text-gray-300 mt-1">
              När du hittar ett relevant kontrakt, ladda ner hela förfrågningsunderlaget. 
              Läs igenom kravspecifikationen, utvärderingsmodellen och avtalsvillkoren noggrant.
            </p>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">3</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Ställ frågor (om tillåtet)</h4>
            <p className="text-sm text-gray-300 mt-1">
              Du har rätt att ställa frågor om förfrågningsunderlaget. Frågorna och svaren publiceras 
              anonymt och delas med alla anbudsgivare. Sista dag för frågor anges i underlaget.
            </p>
          </div>
        </div>
        
        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">4</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Sammanställ ditt anbud</h4>
            <p className="text-sm text-gray-300 mt-1">
              Förbered ett komplett anbud som svarar på alla krav. Inkludera:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Administrativa uppgifter (företagsinformation, underskrifter)</li>
              <li>• Teknisk beskrivning av lösning/tjänst</li>
              <li>• Prisanbud (enligt angivet format)</li>
              <li>• Referenser och meritförteckning</li>
              <li>• Intyg och certifieringar</li>
            </ul>
          </div>
        </div>
        
        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">5</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Lämna in anbudet i tid</h4>
            <p className="text-sm text-gray-300 mt-1">
              Lämna in anbudet via angiven metod (digitalt eller fysiskt) <strong>innan deadline</strong>. 
              Sena anbud avvisas automatiskt. Spara kvittens på inlämning.
            </p>
          </div>
        </div>
        
        {/* Step 6 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">6</div>
            <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <h4 className="text-white font-medium">Vänta på utvärdering och beslut</h4>
            <p className="text-sm text-gray-300 mt-1">
              Kommunen utvärderar alla anbud enligt angiven modell (lägsta pris eller MEPRIN - 
              mest ekonomiskt fördelaktigt). Du kan bli ombedd att förtydliga ditt anbud.
            </p>
          </div>
        </div>
        
        {/* Step 7 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">7</div>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">Tilldelning och avtal</h4>
            <p className="text-sm text-gray-300 mt-1">
              Vid tilldelning meddelas alla anbudsgivare. Efter avtalsspärr (10 dagar) tecknas kontraktet. 
              Om du inte vann kan du begära överprövning eller avbegära utvärderingsunderlaget för att lära dig.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4 mt-6">
        <h4 className="text-emerald-400 font-medium mb-2">💡 Proffstips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Börja i god tid - räkna med minst 2-3 veckor för ett komplett anbud</li>
          <li>• Läs utvärderingsmodellen noga - anpassa ditt anbud efter vad som värderas högst</li>
          <li>• Använd kommunens egna formulär och mallar exakt som angivet</li>
          <li>• Be en kollega granska anbudet innan inlämning</li>
          <li>• Spara alla versioner och dokumentation</li>
          <li>• Vid förlust - begär always utvärderingsprotokollet för lärande</li>
        </ul>
      </div>
    </div>
  );
}
