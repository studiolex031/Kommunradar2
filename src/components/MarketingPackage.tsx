import { useState } from 'react';
import { Contract } from '../data/contracts';

interface Props {
  contracts: Contract[];
}

type PackageType = 'case-study' | 'social-media' | 'press-release' | 'presentation' | 'linkedin' | 'newsletter';

export default function MarketingPackage({ contracts }: Props) {
  const completedContracts = contracts.filter(c => c.status === 'pågående' || c.status === 'stängd');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(completedContracts[0] || null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('case-study');
  const [companyName, setCompanyName] = useState('Ditt Företag AB');
  const [copied, setCopied] = useState(false);

  const packages: { id: PackageType; label: string; icon: string; desc: string }[] = [
    { id: 'case-study', label: 'Case Study', icon: '📄', desc: 'Detaljerad projektbeskrivning' },
    { id: 'social-media', label: 'Social Media', icon: '📱', desc: 'Inlägg för alla plattformar' },
    { id: 'press-release', label: 'Pressmeddelande', icon: '📰', desc: 'Professionellt pressmeddelande' },
    { id: 'presentation', label: 'One-Pager', icon: '📊', desc: 'Snabböversikt för kunder' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', desc: 'Professionellt inlägg' },
    { id: 'newsletter', label: 'Nyhetsbrev', icon: '📧', desc: 'Kundutskick' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateContent = (): string => {
    if (!selectedContract) return '';

    switch (selectedPackage) {
      case 'case-study':
        return generateCaseStudy(selectedContract);
      case 'social-media':
        return generateSocialMedia(selectedContract);
      case 'press-release':
        return generatePressRelease(selectedContract);
      case 'presentation':
        return generatePresentation(selectedContract);
      case 'linkedin':
        return generateLinkedIn(selectedContract);
      case 'newsletter':
        return generateNewsletter(selectedContract);
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border-purple-500/20">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
          Marknadsföringspaket
        </h2>
        <p className="text-gray-400 text-sm">
          Skapa professionellt marknadsföringsmaterial för dina genomförda kommunala projekt. 
          Använd detta för att vinna nya kontrakt och bygga ditt varumärke.
        </p>
      </div>

      {/* Completed Projects */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3">
          📋 Välj genomfört projekt
        </h3>
        {completedContracts.length > 0 ? (
          <div className="grid gap-2">
            {completedContracts.map(contract => (
              <button
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedContract?.id === contract.id
                    ? 'bg-purple-500/20 border-purple-400/50 text-white'
                    : 'bg-white/3 border-white/5 text-gray-400 hover:border-purple-400/30 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contract.title}</p>
                    <p className="text-xs text-gray-500">{contract.municipality} • {contract.value}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ml-2 ${
                    contract.status === 'pågående' 
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {contract.status === 'pågående' ? '🟡 Pågående' : '🔴 Stängd'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Inga genomförda projekt ännu. När kontrakt avslutas kommer de att visas här.
          </p>
        )}
      </div>

      {selectedContract && (
        <>
          {/* Company Name */}
          <div className="glass-card rounded-xl p-5">
            <label className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2 block">
              🏢 Ditt företagsnamn
            </label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
              placeholder="Ange ditt företagsnamn"
            />
          </div>

          {/* Package Selection */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3">
              📦 Välj marknadsföringspaket
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedPackage === pkg.id
                      ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400/50'
                      : 'bg-white/3 border-white/5 hover:border-purple-400/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{pkg.icon}</div>
                  <div className="text-sm font-medium text-white">{pkg.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{pkg.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generated Content */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide">
                {packages.find(p => p.id === selectedPackage)?.icon} Genererat innehåll
              </h3>
              <button
                onClick={() => handleCopy(generateContent())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30'
                }`}
              >
                {copied ? '✓ Kopierat!' : '📋 Kopiera'}
              </button>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {generateContent()}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([generateContent()], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedPackage}-${selectedContract.municipality}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-medium transition-all"
              >
                💾 Ladda ner
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all"
              >
                🖨️ Skriv ut
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function generateCaseStudy(contract: Contract): string {
  return `CASE STUDY: ${contract.title}
${'='.repeat(60)}

KUND: ${contract.municipality}
PROJEKT: ${contract.title}
VÄRDE: ${contract.value}
VARAKTIGHET: ${contract.estimatedDuration}
REGION: ${contract.region}

SAMMANFATTNING
${'-'.repeat(60)}
${contract.description}

UTMANING
${'-'.repeat(60)}
${contract.municipality} stod inför utmaningen att hitta en pålitlig leverantör som kunde uppfylla deras höga krav inom ${contract.category.toLowerCase()}. Projektet krävde specialistkompetens och erfarenhet av liknande uppdrag i offentlig sektor.

LÖSNING
${'-'.repeat(60)}
Vi levererade en skräddarsydd lösning som uppfyllde alla kravspecifikationer:

${contract.requirements.map((req, idx) => `${idx + 1}. ${req}`).join('\n')}

RESULTAT
${'-'.repeat(60)}
• Projektet genomfördes inom utsatt tid
• Alla kvalitetskrav uppfylldes
• Kunden uttryckte hög nöjdhet
• Inga avvikelser eller förseningar
• Framgångsrikt samarbete med kommunen

NYCKELKOMPETENSER
${'-'.repeat(60)}
${contract.requirements.slice(0, 3).map(req => `• ${req}`).join('\n')}

KONTAKT
${'-'.repeat(60)}
Vill du veta mer om hur vi kan hjälpa din kommun?
Kontakta oss för en kostnadsfri konsultation.

Referens: ${contract.contactPerson}, ${contract.contactEmail}
`;
}

function generateSocialMedia(contract: Contract): string {
  return `SOCIAL MEDIA-INNEHÅLL FÖR: ${contract.title}
${'='.repeat(60)}

INSTAGRAM/FACEBOOK
${'-'.repeat(60)}
🎉 NYTT PROJEKT KLART! 🎉

Vi är stolta över att ha genomfört ${contract.title} för ${contract.municipality}!

📊 Projektvärde: ${contract.value}
⏱️ Varaktighet: ${contract.estimatedDuration}
📍 Plats: ${contract.region}

Tack för förtroendet ${contract.municipality}! Vi ser fram emot fler spännande samarbeten inom offentlig sektor.

#OffentligUpphandling #KommunaltSamarbete #${contract.category.replace(/\s&\s/g, '').replace(/\s/g, '')} #Referensprojekt #Sverige

---

TWITTER/X
${'-'.repeat(60)}
🚀 Klart! Vi har framgångsrikt genomfört ${contract.title} (${contract.value}) för ${contract.municipality}. Ett viktigt steg i vår satsning på offentlig sektor! #LOU #Upphandling

---

TIKTOK/REELS SCRIPT
${'-'.repeat(60)}
[Öppning - 3 sek]
"Visste du att vi just genomfört ett projekt värt ${contract.value}?"

[Visa bilder från projektet - 10 sek]
"Vi samarbetade med ${contract.municipality} för att..."

[Visa resultat - 5 sek]
"...och resultatet blev fantastiskt!"

[Avslutning - 2 sek]
"Följ oss för mer!"

---

STORY/STATUS
${'-'.repeat(60)}
📍 ${contract.municipality}
✅ Projekt klart!
💰 ${contract.value}
🎯 100% nöjd kund

[SWIPE UP för mer info]
`;
}

function generatePressRelease(contract: Contract): string {
  return `PRESSMEDDELANDE
${'='.repeat(60)}

FÖR OMEDELBAR PUBLICERING

[KONTAKT]
Namn: [Din kontaktperson]
Titel: [Titel]
Telefon: [Telefonnummer]
E-post: [E-postadress]

${'='.repeat(60)}

[FÖRETAGSNAMN] GENOMFÖR FRAMGÅNGSRIKT PROJEKT VÄRT ${contract.value.toUpperCase()} FÖR ${contract.municipality.toUpperCase()}

STAD/KOMMUN, DATUM – [Företagsnamn] kan idag meddela att man framgångsrikt genomfört ${contract.title} för ${contract.municipality}. Projektet, som hade ett totalvärde på ${contract.value}, har genomförts inom ramen för kommunens upphandling enligt LOU.

PROJEKTET I KORTHET
Projektet omfattade ${contract.description.toLowerCase()} Arbetet genomfördes under en period av ${contract.estimatedDuration} och inkluderade alla de krav och specifikationer som ställdes i upphandlingen.

CITAT
"[Här kan du lägga till ett citat från din VD eller projektledare om projektets genomförande och betydelse för företaget]", säger [Namn], [Titel] på [Företagsnamn].

NYCKELKOMPONENTER
Projektet krävde specialistkompetens inom flera områden:
${contract.requirements.slice(0, 4).map(req => `• ${req}`).join('\n')}

OM [FÖRETAGSNAMN]
[Kort beskrivning av ditt företag, verksamhet och expertis. Inkludera omsättning, antal anställda och geografisk täckning.]

FÖR MER INFORMATION
Kontakta [Kontaktperson] på [E-post] eller [Telefonnummer].

###

BILAGOR
• Bilder från projektet (om tillgängliga)
• Faktablad om företaget
• Ytterligare referenser
`;
}

function generatePresentation(contract: Contract): string {
  return `ONE-PAGER: ${contract.title}
${'='.repeat(60)}

┌─────────────────────────────────────────────────────────┐
│  [DITT FÖRETAGS LOGOTYP]                                │
│                                                          │
│  REFERENSPROJEKT                                        │
│  ${contract.title}                                      │
└─────────────────────────────────────────────────────────┘

┌─ KUNDFakta ─────────────────────────────────────────────┐
│  Kund:        ${contract.municipality}                  │
│  Region:      ${contract.region}                        │
│  Kategori:    ${contract.category}                      │
│  Värde:       ${contract.value}                         │
│  Varaktighet: ${contract.estimatedDuration}             │
└─────────────────────────────────────────────────────────┘

┌─ Projektbeskrivning ────────────────────────────────────┐
│  ${contract.description}                                │
└─────────────────────────────────────────────────────────┘

┌─ Våra leveranser ───────────────────────────────────────┐
  ${contract.requirements.slice(0, 5).map((req, idx) => `  ${idx + 1}. ${req}`).join('\n')}
└─────────────────────────────────────────────────────────┘

┌─ Resultat & Kvalitet ───────────────────────────────────┐
  ✓ Levererat inom utsatt tid                             │
  ✓ Alla kvalitetskrav uppfyllda                          │
  ✓ Nöjd kund                                             │
  ✓ Inga avvikelser                                       │
  ✓ Fullständig dokumentation                             │
└─────────────────────────────────────────────────────────┘

┌─ Varför välja oss? ─────────────────────────────────────┐
  • Erfarenhet av offentlig sektor                        │
  • Specialistkompetens inom ${contract.category.toLowerCase()} │
  • Bevisad track record                                  │
  • Kvalitetsfokus och pålitlighet                        │
└─────────────────────────────────────────────────────────┘

┌─ Kontakt ───────────────────────────────────────────────┐
  [Ditt Företag AB]                                       │
  [Adress]                                                │
  [Telefon] | [E-post]                                    │
  [Webbplats]                                             │
└─────────────────────────────────────────────────────────┘
`;
}

function generateLinkedIn(contract: Contract): string {
  return `LINKEDIN-INLÄGG FÖR: ${contract.title}
${'='.repeat(60)}

🎯 NYTT REFERENSPROJEKT: ${contract.title}

Jag är stolt över att dela att vi på [Ditt Företag] framgångsrikt genomfört ett spännande uppdrag för ${contract.municipality}.

📊 PROJEKTFAKTA:
• Kontraktsvärde: ${contract.value}
• Varaktighet: ${contract.estimatedDuration}
• Kategori: ${contract.category}
• Plats: ${contract.region}

💡 VAD VI LEVERERADE:
${contract.requirements.slice(0, 4).map(req => `  ✓ ${req}`).join('\n')}

🏆 VARFÖR DETTA ÄR BETYDELFULLT:
Detta projekt visar vår förmåga att leverera komplexa lösningar inom offentlig sektor. Vi förstår de unika krav som ställs i kommunala upphandlingar - från LOU-compliance till kvalitetskrav och hållbarhetsmål.

🤝 SAMARBETE MED OFFENTLIG SEKTOR:
Att arbeta med kommuner och regioner kräver:
  • Transparens och öppenhet
  • Kvalitetsfokus
  • Flexibilitet
  • Långsiktigt tänkande

Vi är tacksamma för förtroendet från ${contract.municipality} och ser fram emot att fortsätta bidra till samhällsnytta genom våra tjänster.

📬 VILL DU VETA MER?
Har din kommun liknande behov? Hör av dig - vi tar gärna en diskussion om hur vi kan hjälpa er.

#OffentligUpphandling #LOU #Kommun #Referensprojekt #B2G #Government #Sverige #${contract.category.replace(/\s&\s/g, '').replace(/\s/g, '')}

---

ALTERNATIV VERSION (KORTARE):

🚀 Klart projekt! ${contract.title} för ${contract.municipality} (${contract.value}).

Ett fantastiskt samarbete som visar vår styrka inom ${contract.category.toLowerCase()}. Tack för förtroendet!

#Upphandling #Kommun #Referens #Sverige

---

KOMMENTARER ATT FÖRHANDSGENERERA:

1. "Grattis till ett väl genomfört projekt! Ser fram emot att se mer."
2. "Imponerande arbete. Vi har också goda erfarenheter av samarbete med er."
3. "Spännande! Vi letar efter leverantörer inom detta område."
`;
}

function generateNewsletter(contract: Contract): string {
  return `NYHETSBREV: NYTT PROJEKT GENOMFÖRT
${'='.repeat(60)}

ÄMNE: 🎉 Vi har genomfört ${contract.title} för ${contract.municipality}!

PREHEADER: Läs om vårt senaste framgångsrika projekt inom ${contract.category.toLowerCase()}

${'='.repeat(60)}

HEJ [KUNDENS NAMN],

Vi är glada att kunna dela med oss av ett spännande projekt vi nyligen genomfört!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PROJEKTHÖJDPUNKTER

Kund: ${contract.municipality}
Projekt: ${contract.title}
Värde: ${contract.value}
Varaktighet: ${contract.estimatedDuration}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 VAD GICK PROJEKTET UT PÅ?

${contract.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ VÅRA LEVERANSER

${contract.requirements.map((req, idx) => `${idx + 1}. ${req}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 VARFÖR DETTA ÄR RELEVANT FÖR ER?

Om din kommun/organisation har liknande behov inom ${contract.category.toLowerCase()}, har vi nu bevisad erfarenhet och kompetens att leverera högkvalitativa lösningar.

Vi erbjuder:
• Specialistkompetens inom ${contract.category.toLowerCase()}
• Erfarenhet av offentlig sektor
• Kvalitetsgarantier
• Flexibla lösningar anpassade efter era behov

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 KONTAKTA OSS

Vill du veta mer om hur vi kan hjälpa er? Boka en kostnadsfri konsultation:

[KNAPP: Boka konsultation]

Eller kontakta oss direkt:
📧 [E-post]
📱 [Telefon]
🌐 [Webbplats]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tack för att du är prenumerant!

Vänliga hälsningar,
[Ditt Namn]
[Din Titel]
[Ditt Företag]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

P.S. Vi har flera spännande projekt på gång. Håll utkik efter nästa nyhetsbrev!

---

AVREGISTRERING:
Du får detta mejl eftersom du prenumererar på nyheter från [Ditt Företag].
[Avregistrera dig] | [Uppdatera preferenser]
`;
}
