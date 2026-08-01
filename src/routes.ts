interface Route {
  destination: string;
  recipients: string[];
}

const DefaultRecipient = 'chnorton@tamu.edu';

const BlackholeRecipient = 'blackhole';

const AuditRecipient = 'ieee@tamu.edu';

const Routes: readonly Route[] = [
  // Executive Board
  {
    destination: 'president@ieeetamu.org',
    recipients: ['alanjaf@tamu.edu'],
  },
  {
    destination: 'vicepresident@ieeetamu.org',
    recipients: ['jr338567@tamu.edu'],
  },
  {
    destination: 'treasurer@ieeetamu.org',
    recipients: ['andyluu05@tamu.edu'],
  },
  {
    destination: 'secretary@ieeetamu.org',
    recipients: ['oliver.jansen@tamu.edu'],
  },

  // Undersecretaries
  {
    destination: 'webmaster@ieeetamu.org',
    recipients: ['chnorton@tamu.edu', 'jadonlee@tamu.edu'],
  },

  // Chairs
  {
    destination: 'technical@ieeetamu.org',
    recipients: ['caden.mac2005@tamu.edu'],
  },
  {
    destination: 'tec@ieeetamu.org',
    recipients: ['caden.mac2005@tamu.edu'],
  },
  {
    destination: 'publicrelations@ieeetamu.org',
    recipients: ['akafle@tamu.edu '],
  },
  {
    destination: 'corporate@ieeetamu.org',
    recipients: ['faizane10@tamu.edu'],
  },
  {
    destination: 'activities@ieeetamu.org',
    recipients: [
      'tonydoan@tamu.edu',
      'branden@tamu.edu',
      'clarkemic@tamu.edu',
      'joaquinwelch@tamu.edu',
    ],
  },

  // Special use
  {
    destination: 'summit@ieeetamu.org',
    recipients: ['alanjaf@tamu.edu'],
  },
  {
    destination: 'sponsorship@ieeetamu.org',
    recipients: ['faizane10@tamu.edu'],
  },

  // No-reply and blackhole addresses
  {
    destination: 'donotreply@ieeetamu.org',
    recipients: [BlackholeRecipient],
  },
  {
    destination: 'noreply@ieeetamu.org',
    recipients: [BlackholeRecipient],
  },

  // recovery email - should be set as the recovery email for any accounts
  {
    destination: 'recovery@ieeetamu.org',
    recipients: ['ieee@tamu.edu'],
  },
];

export { Routes, DefaultRecipient, BlackholeRecipient, AuditRecipient };
export type { Route };
