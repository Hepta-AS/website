"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Star, Users, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const services = {
  Videoproduksjon: {
    title: "Videoproduksjon",
    description: "Profesjonell videoproduksjon som engasjerer, inspirerer og konverterer ditt publikum.",
    content: `Vi skaper innhold som fanger oppmerksomhet og skaper inntrykk. Vårt erfarne team kombinerer kreativ historiefortelling med teknisk ekspertise for å produsere videoer som gir resultater.

Våre videoproduksjonstjenester omfatter hele prosessen fra konseptutvikling til ferdig produksjon. Vi forstår at hver video må være skreddersydd for å nå dine spesifikke mål, enten det er å øke merkekjennskap, drive salg eller bygge kunderelasjoner.

• Konseptutvikling og storyboarding
• Profesjonell filming med moderne utstyr
• Avansert post-produksjon og redigering
• Motion graphics og animasjon
• Teksting og oversettelse
• Optimalisering for ulike plattformer

Fra korte sosiale medier-videoer til omfattende bedriftsdokumentarer - vi tilpasser produksjonen etter dine behov og budsjett. Vårt mål er å skape innhold som ikke bare ser profesjonelt ut, men som også driver handlinger og resultater.`,
    image: "/creation_compressed.jpg",
    features: ["4K-kvalitet", "Drone-filming", "Live streaming", "360° video"],
    benefits: ["Økt engasjement", "Bedre konvertering", "Sterkere merkevare", "Målrettet innhold"]
  },
  Utvikling: {
    title: "Webutvikling & App-utvikling",
    description: "Skreddersydde digitale løsninger som vokser med din virksomhet.",
    content: `Vi utvikler moderne, brukervennlige og skalerbare digitale løsninger som møter dine forretningsbehov. Vårt team av erfarne utviklere bruker de nyeste teknologiene for å skape applikasjoner som engasjerer brukerne og driver forretningsvekst.

Våre utviklingstjenester dekker hele spekteret fra enkle nettsider til komplekse forretningsapplikasjoner. Vi følger beste praksis for sikkerhet, ytelse og brukeropplevelse for å sikre at løsningen ikke bare fungerer i dag, men også er klar for fremtidens behov.

• Responsiv webutvikling med moderne rammeverk
• Native iOS og Android-applikasjoner
• Progressive Web Apps (PWA)
• E-handelspløsninger og betalingsintegrasjon
• API-utvikling og systemintegrasjon
• Cloud-deployment og DevOps

Vi bruker agile utviklingsmetoder for å sikre transparent kommunikasjon og rask levering. Gjennom tett samarbeid med våre kunder skaper vi løsninger som ikke bare oppfyller tekniske krav, men som også bidrar til forretningssuksess.`,
    image: "/technology_compressed.jpg",
    features: ["React/Next.js", "React Native", "Node.js", "Cloud hosting"],
    benefits: ["Rask time-to-market", "Skalerbar arkitektur", "Moderne UX/UI", "24/7 support"]
  },
  AI: {
    title: "AI og Automasjon",
    description: "Kunstig intelligens som optimaliserer arbeidsflyt og skaper nye muligheter.",
    content: `Kunstig intelligens revolusjonerer måten vi arbeider på. Vi hjelper bedrifter med å implementere AI-løsninger som automatiserer rutineoppgaver, gir verdifull innsikt og skaper nye forretningsmuligheter.

Våre AI-tjenester spenner fra enkle chatbots til avanserte maskinlæringsmodeller. Vi fokuserer på å finne de riktige AI-løsningene for dine spesifikke utfordringer, ikke bare de som er mest teknologisk avanserte.

• Intelligente chatbots og kundeservice-automatisering
• Prediktiv analyse og business intelligence
• Bildegjenkjenning og computer vision
• Naturlig språkprosessering (NLP)
• Prosessautomatisering og workflow-optimalisering
• Custom AI-modeller og maskinlæring

Vi starter alltid med å forstå dine forretningsprosesser før vi foreslår AI-løsninger. Målet er å skape teknologi som utfyller og forbedrer menneskelig ekspertise, ikke erstatter den. Våre AI-implementeringer er designet for å være intuitive og enkle å bruke.`,
    image: "/ai_compressed.jpg",
    features: ["Machine Learning", "Computer Vision", "NLP", "Automation"],
    benefits: ["Økt effektivitet", "Reduserte kostnader", "Bedre beslutninger", "Konkurransefortrinn"]
  },
  "innsikt-og-analyse": {
    title: "Innsikt og Analyse",
    description: "Databaserte beslutninger som driver forretningsvekst og innovasjon.",
    content: `I dagens datadrevne verden er evnen til å samle, analysere og tolke data avgjørende for suksess. Vi hjelper bedrifter med å transformere rådata til verdifull innsikt som driver smarte beslutninger og forretningsvekst.

Våre analysetjenester går langt utover tradisjonell rapportering. Vi skaper interaktive dashboards, prediktive modeller og automatiserte innsiktsrapporter som gir deg et konkurransefortrinn.

• Avansert dataanalyse og visualisering
• Business Intelligence og KPI-dashboards
• Markedsanalyse og competitor intelligence
• Kundeanalyse og segmentering
• Prediktiv modellering og forecasting
• Real-time overvåking og alerting

Vi arbeider med moderne analyseplatformer og verktøy for å sikre at dataene dine er tilgjengelige, nøyaktige og handlingsrettede. Vårt mål er å gjøre kompleks data forståelig og brukbar for beslutningstakere på alle nivåer i organisasjonen.`,
    image: "/technology_compressed.jpg",
    features: ["Power BI", "Google Analytics", "Tableau", "Custom dashboards"],
    benefits: ["Bedre innsikt", "Raskere beslutninger", "Økt ROI", "Risikominimering"]
  },
  "kommunikasjon-og-pr": {
    title: "Kommunikasjon og PR",
    description: "Strategisk kommunikasjon som bygger relasjoner og styrker din merkevare.",
    content: `Effektiv kommunikasjon er grunnlaget for alle vellykkede forretningsrelasjoner. Vi hjelper bedrifter med å utvikle og gjennomføre kommunikasjonsstrategier som bygger tillit, engasjerer målgrupper og styrker omdømmet.

Vårt kommunikasjonsteam kombinerer strategisk tenkning med kreativ utførelse for å skape kommunikasjon som når frem og skaper resultater. Vi forstår at hver organisasjon har sin unike stemme og sine spesifikke utfordringer.

• Strategisk kommunikasjonsplanlegging
• Medierelasjon og pressearbeid
• Krisekommunikasjon og omdømmehåndtering
• Intern kommunikasjon og change management
• Digital PR og influencer-samarbeid
• Content marketing og storytelling

Vi arbeider tett med våre kunder for å forstå deres verdier, mål og målgrupper. Gjennom databaserte innsikter og kreativ utførelse skaper vi kommunikasjon som ikke bare informerer, men som også inspirerer og motiverer til handling.`,
    image: "/samarbeid_compressed.jpg",
    features: ["PR-strategi", "Medieovervåking", "Content creation", "Crisis management"],
    benefits: ["Styrket omdømme", "Økt synlighet", "Bedre relasjoner", "Kriseberedskap"]
  },
  Digitalmarkedsforing: {
    title: "Digital Markedsføring",
    description: "Målrettet digital markedsføring som konverterer og skaper varig verdi.",
    content: `Digital markedsføring handler om å nå de rette personene med det rette budskapet på det rette tidspunktet. Vi skaper datadrevne kampanjer som ikke bare genererer trafikk, men som konverterer besøkende til lojale kunder.

Vårt team av digitale markedsføringseksperter holder seg oppdatert på de nyeste trendene og algoritmene for å sikre at kampanjene dine leverer optimal ROI. Vi tror på transparent rapportering og kontinuerlig optimalisering.

• Google Ads og søkemotormarkedsføring (SEM)
• Meta (Facebook/Instagram) annonsering
• LinkedIn og B2B-markedsføring
• YouTube og video-annonsering
• TikTok og emerging platforms
• E-postmarkedsføring og automation
• Søkemotoroptimalisering (SEO)
• Content marketing og blogging

Vi starter hver kampanje med grundig målgruppeforskning og konkurrentanalyse. Gjennom A/B-testing og kontinuerlig optimalisering sikrer vi at hver krone du investerer gir maksimal avkastning.`,
    image: "/digmark_compressed.jpg",
    features: ["Multi-platform", "A/B testing", "Automation", "ROI tracking"],
    benefits: ["Økt trafikk", "Bedre konvertering", "Lavere CPA", "Høyere ROI"]
  },
  design: {
    title: "Design og Grafisk Profil",
    description: "Visuell identitet som skiller deg ut og skaper varig inntrykk.",
    content: `God design handler om mer enn å se pen ut - det handler om å kommunisere effektivt og skape følelsesmessige forbindelser med målgruppen din. Vi skaper visuell identitet som reflekterer dine verdier og skiller deg ut i markedet.

Vårt designteam kombinerer estetisk forståelse med strategisk tenkning for å skape design som ikke bare ser bra ut, men som også fungerer på tvers av alle touchpoints. Vi forstår viktigheten av konsistent merkevareopplevelse.

• Merkevareidentitet og logodesign
• Grafisk profil og designmanualer
• Webdesign og brukergrensesnitt (UI)
• Brukeropplevelse (UX) design
• Trykkdesign og markedsmateriell
• Sosiale medier-design og templates
• Emballasjedesign og produktpresentasjon

Vi starter hver designprosess med å forstå din merkevare, målgruppe og forretningsmål. Gjennom iterativ design og brukertesting sikrer vi at det endelige resultatet ikke bare er visuelt tiltalende, men også effektivt i å nå dine mål.`,
    image: "/creativity_compressed.jpg",
    features: ["Brand identity", "UI/UX", "Print design", "Digital assets"],
    benefits: ["Sterkere merkevare", "Bedre gjenkjennelse", "Økt tillit", "Profesjonelt uttrykk"]
  },
  Radgivning: {
    title: "Strategisk Rådgivning",
    description: "Ekspertråd som hjelper deg å navigere den digitale transformasjonen.",
    content: `Vil du ta kontroll over den digitale transformasjonen selv, men trenger ekspertråd underveis? Våre erfarne konsulenter deler sin kunnskap og hjelper deg med å utvikle strategier som gir resultater.

Vi forstår at hver organisasjon har unike behov og begrensninger. Vår rådgivning er skreddersydd for å passe din situasjon, ressurser og mål. Vi fokuserer på praktiske løsninger som kan implementeres med dine eksisterende ressurser.

• Digital strategi og transformasjonsplanlegging
• Sosiale medier-strategi og taktikk
• Kampanjeutvikling og optimalisering
• Målgruppeanalyse og persona-utvikling
• Konkurranseanalyse og markedsposisjonering
• ROI-måling og KPI-definisjon
• Change management og organisasjonsutvikling

Våre rådgivningstjenester er fleksible og kan tilpasses dine behov - fra engangskonsultasjoner til langsiktige strategiske partnerskap. Vi tror på å dele kunnskap og bygge intern kompetanse i organisasjonen din.`,
    image: "/consulting_compressed.jpg",
    features: ["Strategic planning", "Workshop facilitation", "Training programs", "Ongoing support"],
    benefits: ["Økt kompetanse", "Bedre strategi", "Raskere implementering", "Langsiktig suksess"]
  },
  "film-og-animasjon": {
    title: "Film og Animasjon",
    description: "Kreativ filmskaping og animasjon som forteller din historie på engasjerende måter.",
    content: `Vi kombinerer kreativ historiefortelling med teknisk ekspertise for å skape film- og animasjonsinnhold som fanger oppmerksomhet og skaper varig inntrykk. Fra konsept til ferdig produksjon holder vi høyeste kvalitet.

Vårt team består av erfarne filmskaper, animatorer og kreative som forstår kraften i visuell kommunikasjon. Vi skaper innhold som ikke bare ser bra ut, men som også kommuniserer budskapet ditt effektivt.

• Reklameproduksjon og markedsføringsfilmer
• Bedriftspresentasjoner og opplæringsvideoer
• Dokumentarproduksjon og case studies
• 2D og 3D-animasjon
• Motion graphics og visuell identitet
• Live-action og stop-motion
• Post-produksjon og lyddesign

Vi arbeider tett med våre kunder gjennom hele produksjonsprosessen for å sikre at det endelige produktet overgår forventningene. Vårt mål er å skape innhold som ikke bare ser profesjonelt ut, men som også driver ønskede handlinger.`,
    image: "/creation_compressed.jpg",
    features: ["4K production", "3D animation", "Motion graphics", "Sound design"],
    benefits: ["Økt engasjement", "Bedre storytelling", "Profesjonell kvalitet", "Memorable content"]
  },
  "faglig-pafyll": {
    title: "Faglig Påfyll og Opplæring",
    description: "Kompetanseheving som holder deg i forkant av digital utvikling.",
    content: `I en verden som endrer seg raskt er kontinuerlig læring avgjørende for suksess. Vi tilbyr skreddersydde opplæringsprogrammer og workshops som holder deg og teamet ditt oppdatert på de nyeste trendene og teknologiene.

Våre opplæringsprogrammer er praktisk orienterte og basert på virkelige casestudier. Vi fokuserer på å gi deltakerne verktøy og kunnskap de kan anvende umiddelbart i sin daglige arbeidssituasjon.

• Digitale markedsføringskurs og certificering
• Teknologiopplæring og verktøyintegrasjon
• Kreative workshops og idéutvikling
• Ledelseskurs for digital transformasjon
• Skreddersydde bedriftskurs
• Online læringsprogrammer
• Mentoring og coaching

Vi tilpasser alle våre opplæringsprogrammer til målgruppens kunnskapsnivå og spesifikke behov. Målet er ikke bare å formidle kunnskap, men å skape varig kompetanseheving som gir målbare resultater.`,
    image: "/team_compressed.jpg",
    features: ["Custom training", "Online courses", "Certification", "Ongoing support"],
    benefits: ["Økt kompetanse", "Bedre resultater", "Raskere adoptasjon", "Competitive advantage"]
  },
}

interface ServicePageContentProps {
  slug: string;
}

export default function ServicePageContent({ slug }: ServicePageContentProps) {
  const service = services[slug as keyof typeof services]

  if (!service) return null

  return (
    <div className="container mx-auto px-4 py-24">
      <Link href="/tjenester" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tilbake til tjenester
      </Link>

      {/* Mobile-first layout - Title and description first */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
        <p className="text-xl text-gray-400 leading-relaxed">{service.description}</p>
      </div>

      {/* Image - full width on mobile, positioned after title */}
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8 lg:hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Desktop layout - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {service.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line mb-6 text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Features and Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-500" />
                Nøkkelfunksjoner
              </h3>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Star className="mr-2 h-5 w-5 text-blue-500" />
                Fordeler
              </h3>
              <ul className="space-y-2">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium">Klar til å komme i gang?</span>
            </div>
            <p className="text-gray-400 mb-6">
              Kontakt oss for en uforpliktende samtale om hvordan vi kan hjelpe deg med {service.title.toLowerCase()}.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Link href="/contact">Kontakt oss i dag</Link>
            </Button>
          </div>
        </div>

        {/* Desktop Image - only visible on large screens */}
        <div className="hidden lg:block">
          <div className="relative h-[600px] rounded-lg overflow-hidden sticky top-24">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
} 