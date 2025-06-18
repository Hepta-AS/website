import * as React from 'react';

interface NotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  message: string;
  firstName?: string;
  lastName?: string;
}

export const NotificationEmail: React.FC<Readonly<NotificationEmailProps>> = ({
  name,
  email,
  phone,
  company,
  website,
  message,
  firstName,
  lastName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Ny henvendelse fra kontaktskjema</h2>
    <p>
      Du har mottatt en ny henvendelse fra <strong>{name}</strong>.
    </p>
    <h3>Detaljer:</h3>
    <ul>
      <li><strong>Fullt Navn:</strong> {name} ({firstName} {lastName})</li>
      <li><strong>E-post:</strong> {email}</li>
      <li><strong>Telefon:</strong> {phone || 'Ikke oppgitt'}</li>
      <li><strong>Selskap:</strong> {company || 'Ikke oppgitt'}</li>
      <li><strong>Nettside:</strong> {website || 'Ikke oppgitt'}</li>
    </ul>
    <hr style={{ borderColor: '#eee' }} />
    <h3>Melding:</h3>
    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
      <p style={{ margin: 0 }}>{message.replace(/\n/g, '<br />')}</p>
    </div>
    <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
      Denne e-posten ble sendt fra kontaktskjemaet på hepta.biz.
    </p>
  </div>
); 