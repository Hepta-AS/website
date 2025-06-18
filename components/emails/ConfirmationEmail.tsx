import * as React from 'react';

interface ConfirmationEmailProps {
  name: string;
}

export const ConfirmationEmail: React.FC<Readonly<ConfirmationEmailProps>> = ({
  name,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h1 style={{ color: '#000' }}>Takk for din henvendelse, {name}!</h1>
    <p>
      Vi har mottatt meldingen din og vil ta kontakt med deg så snart som mulig.
    </p>
    <p>
      Dersom du har ytterligere spørsmål i mellomtiden, er det bare å svare på denne e-posten.
    </p>
    <br />
    <p>Med vennlig hilsen,</p>
    <p><strong>Hepta-teamet</strong></p>
    <hr style={{ borderColor: '#eee', marginTop: '30px' }} />
    <p style={{ fontSize: '12px', color: '#999' }}>
      <a href="https://www.hepta.biz" style={{ color: '#999' }}>Hepta.biz</a>
    </p>
  </div>
); 