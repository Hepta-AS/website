// app/om-oss/page.tsx
import { Metadata } from 'next';
import OmOssContent from './OmOssContent';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Om Hepta - Digital Transformasjon og Kreative Løsninger | Hepta',
  description: 'Hepta er et innovativt konsulentselskap som spesialiserer seg på digital transformasjon, teknologiutvikling, kreativ kommunikasjon og strategisk rådgivning. Vi hjelper bedrifter med å navigere i den digitale fremtiden.',
  keywords: 'digital transformasjon, teknologikonsulenter, kreative løsninger, webUtvikling, app-utvikling, AI og automasjon, digital markedsføring, Hepta',
  openGraph: {
    title: 'Om Hepta - Din Partner for Digital Transformasjon',
    description: 'Hepta kombinerer teknologisk ekspertise med kreativ innovasjon for å skape løsninger som driver din virksomhet fremover.',
    images: ['/team_compressed.jpg'],
  }
};

export default function OmOss() {
  return <OmOssContent />;
}