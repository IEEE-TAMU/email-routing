import Cloudflare from 'cloudflare';
import dotenv from 'dotenv';

dotenv.config();

const client = new Cloudflare({
  apiEmail: process.env['CLOUDFLARE_EMAIL'],
  apiKey: process.env['CLOUDFLARE_API_KEY'],
});

// fixme: update to use actual account id
async function listEmailAddresses() {
  try {
    for await (const address of client.emailRouting.addresses.list({
      account_id: '023e105f4ecef8ad9ca31a8372d0c353',
    })) {
      console.log(address.id);
    }
  } catch (error) {
    console.error('Error fetching email addresses:', error);
  }
}

// listEmailAddresses();
