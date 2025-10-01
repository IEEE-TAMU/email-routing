interface Route {
  destination: string;
  recipients: string[];
}

const DefaultRecipient = 'chnorton@tamu.edu';

const BlackholeRecipient = 'blackhole';

const AuditRecipient = DefaultRecipient;

const Routes: readonly Route[] = [
  // Executive Board
  {
    destination: 'president@ieeetamu.org',
    recipients: ['oliver.jansen@tamu.edu'],
  },
  {
    destination: 'vicepresident@ieeetamu.org',
    recipients: ['smayhue@tamu.edu'],
  },
  {
    destination: 'treasurer@ieeetamu.org',
    recipients: ['ieeetamu.cfo@gmail.com'],
  }, //"nafibaksh@ tamu.edu"] },
  { destination: 'secretary@ieeetamu.org', recipients: ['akafle@tamu.edu'] },

  // Undersecretaries
  { destination: 'webmaster@ieeetamu.org', recipients: ['chnorton@tamu.edu'] },
  { destination: 'historian@ieeetamu.org', recipients: ['gjohny@tamu.edu'] },

  // Chairs
  {
    destination: 'events@ieeetamu.org',
    recipients: [
      'alanjaf@tamu.edu',
      'jadonlee@tamu.edu',
      'tanbuyyana04@tamu.edu',
      'pallavigok@tamu.edu',
    ],
  },
  { destination: 'tec@ieeetamu.org', recipients: ['jyotiverma607@tamu.edu'] },
  {
    destination: 'publicrelations@ieeetamu.org',
    recipients: ['liannie@tamu.edu'],
  },
  {
    destination: 'corporate@ieeetamu.org',
    recipients: ['ieeetamu.corporate@gmail.com'],
  },
  {
    destination: 'activities@ieeetamu.org',
    recipients: ['andyluu05@tamu.edu', 'jr338567@tamu.edu'],
  },

  // Special use
  { destination: 'summit@ieeetamu.org', recipients: ['alanjaf@tamu.edu'] },

  // No-reply and blackhole addresses
  { destination: 'donotreply@ieeetamu.org', recipients: [BlackholeRecipient] },
  { destination: 'noreply@ieeetamu.org', recipients: [BlackholeRecipient] },

  // recovery email - should be set as the recovery email for any accounts
  { destination: 'recovery@ieeetamu.org', recipients: ['chnorton@tamu.edu'] },
];

export { Routes, DefaultRecipient, BlackholeRecipient, AuditRecipient };
export type { Route };
