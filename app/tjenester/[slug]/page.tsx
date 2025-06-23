import { Metadata } from 'next'
import ServicePageContent from './ServicePageContent'

const services = {
  Videoproduksjon: {
    title: "Videoproduksjon",
    description: "Profesjonell videoproduksjon som engasjerer, inspirerer og konverterer ditt publikum.",
    features: ["4K-kvalitet", "Drone-filming", "Live streaming", "360° video"],
  },
  Utvikling: {
    title: "Webutvikling & App-utvikling",
    description: "Skreddersydde digitale løsninger som vokser med din virksomhet.",
    features: ["React/Next.js", "React Native", "Node.js", "Cloud hosting"],
  },
  AI: {
    title: "AI og Automasjon",
    description: "Kunstig intelligens som optimaliserer arbeidsflyt og skaper nye muligheter.",
    features: ["Machine Learning", "Computer Vision", "NLP", "Automation"],
  },
  "innsikt-og-analyse": {
    title: "Innsikt og Analyse",
    description: "Databaserte beslutninger som driver forretningsvekst og innovasjon.",
    features: ["Power BI", "Google Analytics", "Tableau", "Custom dashboards"],
  },
  "kommunikasjon-og-pr": {
    title: "Kommunikasjon og PR",
    description: "Strategisk kommunikasjon som bygger relasjoner og styrker din merkevare.",
    features: ["PR-strategi", "Medieovervåking", "Content creation", "Crisis management"],
  },
  Digitalmarkedsforing: {
    title: "Digital Markedsføring",
    description: "Målrettet digital markedsføring som konverterer og skaper varig verdi.",
    features: ["Multi-platform", "A/B testing", "Automation", "ROI tracking"],
  },
  design: {
    title: "Design og Grafisk Profil",
    description: "Visuell identitet som skiller deg ut og skaper varig inntrykk.",
    features: ["Brand identity", "UI/UX", "Print design", "Digital assets"],
  },
  Radgivning: {
    title: "Strategisk Rådgivning",
    description: "Ekspertråd som hjelper deg å navigere den digitale transformasjonen.",
    features: ["Strategic planning", "Workshop facilitation", "Training programs", "Ongoing support"],
  },
  "film-og-animasjon": {
    title: "Film og Animasjon",
    description: "Kreativ filmskaping og animasjon som forteller din historie på engasjerende måter.",
    features: ["4K production", "3D animation", "Motion graphics", "Sound design"],
  },
  "faglig-pafyll": {
    title: "Faglig Påfyll og Opplæring",
    description: "Kompetanseheving som holder deg i forkant av digital utvikling.",
    features: ["Custom training", "Online courses", "Certification", "Ongoing support"],
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = services[params.slug as keyof typeof services];
  
  if (!service) {
    return {
      title: 'Tjeneste ikke funnet | Hepta',
      description: 'Den forespurte tjenesten ble ikke funnet.'
    };
  }

  return {
    title: `${service.title} | Hepta - Profesjonelle Digitale Tjenester`,
    description: service.description,
    keywords: `${service.title}, digital transformasjon, ${service.features.join(', ')}, Hepta`,
    openGraph: {
      title: `${service.title} | Hepta`,
      description: service.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | Hepta`,
      description: service.description,
    }
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  return <ServicePageContent slug={params.slug} />;
}

